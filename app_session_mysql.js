var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'o2'
  })
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
  req.session.save(function(){ //callback function after save session
    res.redirect('/welcome');
  })

})

app.get('/welcome', function(req, res){
  if (req.session.displayname) {
    res.send(`
      <h1>Hello, ${req.session.displayname}</h1>
      <a href="/auth/logout">logout</a>
      `);
  }else {
    res.send(`
    <h1>Welcome</h1><a href="/auth/login">Login</a>`)
  }
})

app.post('/auth/login', function(req, res){
  var user = {
    username:'jay',
    password:'111',
    displayname: 'JayJoowon'
  };
  var uname = req.body.username;
  var pwd = req.body.password;
  if (uname === user.username && pwd === user.password) {
    req.session.displayname = user.displayname;
    req.session.save(function(){ //callback function after save session
      res.redirect('/welcome');
    })
  }else {
    res.send('Who are you? <a href="/auth/login">login</a>');
  }
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
