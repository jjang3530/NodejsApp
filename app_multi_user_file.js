var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var sha256 = require('sha256');
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

app.get('/count', function(req, res){
  if (req.session.count) {
    req.session.count++;
  }else {
    req.session.count = 1;
  }
  res.send('Count : ' +req.session.count);
});
app.get('/auth/logout', function(req, res){
  delete req.session.displayname;
  return req.session.save(function(){
  res.redirect('/welcome');
  })
});

var users = [
  {
    username:'jay',
    password:'7f12d41002688ff29d6b97f18e8a63cd818ae4700a6c6ccf9ca76acd6d86a780',
    salt:'@#$WDSFSFRS',
    displayname:'JayJoowon'
  },
  {
    username:'jinah',
    password:'be36ac5e134181a04f92d08ec5bf99525d781df73f2d4744de0c5573a0b322d7',
    salt: '$#%#!dfgsd',
    displayname:'Jinah'
  }
  ];

app.post('/auth/register', function(req, res){
  var user = {
    username:req.body.username,
    password:req.body.password,
    displayname:req.body.displayname
  };
  users.push(user);
  req.session.displayname = req.body.displayname;
  req.session.save(function(){
  res.redirect('/welcome');
  })
})

app.get('/auth/register', function(req, res){
  var output=`
  <h1>Register</h1>
  <form action="/auth/register" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="text" name="displayname" placeholder="displayname">
    </p>
    <p>
      <input type='submit'>
  </form>
  `;
  res.send(output);

})


app.get('/welcome', function(req, res){
  if (req.session.displayname) {
    res.send(`
      <h1>Hello, ${req.session.displayname}</h1>
      <a href="/auth/logout">logout</a>
      `);
  }else {
    res.send(`
    <h1>Welcome</h1>
    <ul>
      <li><a href="/auth/login">Login</a></li>
      <li><a href="/auth/register">Register</a></li>
    </ul>
    `
  )}
})

app.post('/auth/login', function(req, res){

  var uname = req.body.username;
  var pwd = req.body.password;
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    if (uname === user.username && sha256(pwd+user.salt) === user.password) {
      req.session.displayname = user.displayname;
      return req.session.save(function(){
      res.redirect('/welcome');
      })
    }
  }
    res.send('Who are you? <a href="/auth/login">login</a>');
})

app.get('/auth/login', function(req, res){
  var output = `
  <h1>Login</h1>
  <form action="/auth/login" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type='submit'>
  </form>
  `;
  res.send(output);
})


app.listen(3003, function(){
  console.log('Connected 3003 port!!!');
});
