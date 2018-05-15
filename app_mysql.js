var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: _storage })

// var upload = multer({dest: 'uploads/'}); //destination

var fs =require('fs'); //fille system

//mysql connection
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'o2'
});
connection.connect();

var app = express();
app.use('/kyrie', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.locals.pretty = true;

app.set('views', './views_mysql');
app.set('view engine', 'jade');
app.get('/upload', function(req, res){
  res.render('upload');
})
app.get('/topic/add', function(req, res){
  var sql =' SELECT id,title FROM topic';
  connection.query(sql, function(err, topics, fields){
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  res.render('add', {topics:topics});
  });
})

app.post('/topic/add', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO topic (title, description, author) VALUE(?,?,?)';
  connection.query(sql, [title, description, author], function(err, result, fields){
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else {
      res.redirect('/topic/'+result.insertId);
    }
  })
})
  // fs.writeFile('data/'+title,description, function(err){
//     if (err) {
//         console.log(err);
//         res.status(500).send('Internal Server Error');
//     }
//   res.redirect('/topic/'+ title);
//   });
// })


app.post('/upload', upload.single('userfile'), function(req, res){
  console.log(req.file);
  res.send('Uploaded: ' + req.file.filename);
})

app.get(['/topic', '/topic/:id'] , function(req, res){
  var sql =' SELECT id,title FROM topic';
  connection.query(sql, function(err, topics, fields){
    var id = req.params.id;
    if (id) {
      var sql ='SELECT * FROM topic WHERE id=?';
      connection.query(sql, [id], function(err, topic, fields){
        if (err) {
          console.log(err);
          res.status(500).send('Internal server error');
        }else {
          res.render('view', {topics:topics, topic:topic[0]})
        }
      })
    }else {
      res.render('view', {topics:topics});
    }
  });

  /*
  fs.readdir('data', function(err, files){
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    var id = req.params.id;
    if (id) {
      fs.readFile('data/'+id, 'utf8', function(err, data){
        if (err) {
          console.log(err);
          res.status(500).send('Internal server error');
        }
        res.render('view', {topics:files, title:id, description:data});
      })

    }else {
    res.render('view', {topics:files, title:'Welcome', description:'JavaScript for server'});
    }

  })
  */
});


// app.get('/topic/:id', function(req, res){
//   var id = req.params.id;
//   fs.readdir('data', function(err, files){
//     if (err) {
//       console.log(err);
//       res.status(500).send('Internal Server Error');
//     }
//     fs.readFile('data/'+id, 'utf8', function(err, data){
//       if (err) {
//         console.log(err);
//         res.status(500).send('Internal server error');
//       }
//       res.render('view', {topics:files, title:id, description:data});
//     })
//   })
// })

app.post('/topic', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title,description, function(err){
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
  res.redirect('/topic/'+ title);
  });
})

app.listen(3000, function(){
  console.log('Connected, 3000 port!');
})
