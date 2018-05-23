var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
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
    password:'jOnlxk8YzKpirE3GgPNVklgKL578Ri+CubNeOlQ1SDKX5WgI5O1kAyulifGi02q9vW+JCJDpMeLzBDwaBjpiTbcsxTbR5wdqCrmpfySS8uku8Op/OWADntsChyaxaOa7WEqLG9pyMMGPBiT8/gDLvue1vEjdhSZkMGdC919rEpk=',
    salt:'uDl+8np+qELK758EAY/ySO1WXuFYHwCYkupf+/AgX5FMP4rAp0H0Dt9ezAx4gpoepNfrnxnz1ObUEI+B72DryQ==',
    displayname:'JayJoowon'
  }
  ];

app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      username:req.body.username,
      password:hash,
      salt:salt,
      displayname:req.body.displayname
    };
    users.push(user);
    req.session.displayname = req.body.displayname;
    req.session.save(function(){
    res.redirect('/welcome');
    })
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
    if (uname === user.username) {
      return hasher({password:pwd, salt:user.salt}, function(err,pass,salt,hash){
        if (hash === user.password) {
          req.session.displayname = user.displayname;
          req.session.save(function(){
            res.redirect('/welcome');
          })
        }else {
          res.send('Who are you? <a href="/auth/login">login</a>')

        }
      });
    }
    // if (uname === user.username && sha256(pwd+user.salt) === user.password) {
    //   req.session.displayname = user.displayname;
    //   return req.session.save(function(){
    //   res.redirect('/welcome');
    //   })
    // }
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
