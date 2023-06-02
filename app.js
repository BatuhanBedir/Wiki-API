//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4 
};

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({

  extended: true
}));

app.use(express.static("public"));

const url = 'mongodb://localhost:27017/wikiDB';
mongoose.connect(url, options);

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article",articleSchema); 


app.route("/articles")
.get(async function(req, res) {
  try {
    const foundArticles = await Article.find();
    res.send(foundArticles);
  } catch (err) {
    console.error(err);
  }
})
.post(async function(req, res) {
  try {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    await newArticle.save();
    res.send("Successfully added a new article");
  } catch (err) {
    res.send(err);
  }
})
.delete(async function(req,res){
  try{
    await Article.deleteMany();
    res.send("Successfully deleted all articles");
  }catch(err){
    res.send(err);
  }
});

app.route("/articles/:articleTitle")
.get(async function(req, res) {
  try {
    const foundArticle =await Article.findOne({title: req.params.articleTitle})
    if(foundArticle){
      res.send(foundArticle)
    }else{
      res.send("No articles matching that title was found");
    }
  } catch (err) {
    res.send(err);
  }
})
.put(async function(req, res) {
  try {
    const updatedArticle = await Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { override: true }
    );
    if (updatedArticle) {
      res.send("Successfully updated article");
    } else {
      res.send("No articles matching that title was found");
    }
  } catch (err) {
    res.send(err);
  }
})
.patch(async function(req, res) {
  try {
    const updatedArticle = await Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body},
    );
    if (updatedArticle) {
      res.send("Successfully updated article.");
    } else {
      res.send("No articles matching that title was found");
    }
  } catch (err) {
    res.send(err);
  }
})
.delete('/articles/:articleTitle',async function(req, res) {
  try {
    var a =await Article.deleteOne({ title: req.params.articleTitle });
    if(a){
      res.send("Successfully deleted the article");
    }else {
      res.send("No articles matching that title was found");
    }
  } catch (err) {
    res.send(err);
  }
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});