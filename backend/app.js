const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb+srv://hnaidu1:hnaidu1@hnaidu0-3bzlh.mongodb.net/test?retryWrites=true', {useNewUrlParser: true})
  .then(()=>{
    console.log('Connected to the MongoDB database');
  })
  .catch(()=>{
    console.log('Error connecting to database');
  });

app.use(bodyparser.json());
//app.use(bodyparser.urlencoded({extended: false}));

app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post('/api/posts', (req, res, next)=>{
  //const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  //console.log(post);
  post.save().then(createdpost => {
    //console.log(result);
    return res.status(201).json({
      message: 'Post added successfully',
      postid: createdpost._id
    });
  });
});

app.get('/api/posts', (req, res, next)=>{
  /*const posts = [
    {_id: '1245fad', title: 'First Server post', content: 'This is the first post from the server side'},
    {_id: '1245fae', title: 'Second Server post', content: 'This is the second post from the server side'}
  ];*/
  Post.find()
    .then(documents=>{
      //console.log(documents);
      return res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents
      });
    });

});

app.delete('/api/posts/:_id', (req, res, next)=>{
  //console.log(req.params._id);
  Post.deleteOne({_id: req.params._id}).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Post deleted successfully'
    });
  })
});

app.use((req, res, next)=>{
  res.send('Get to front-end');
});



module.exports = app;
