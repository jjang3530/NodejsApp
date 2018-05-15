var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'o2'
});
connection.connect();

// var sql = 'SELECT * FROM topic';
// connection.query(sql, function(err, rows, fields){
//   if (err) {
//     console.log(err);
//   }else {
//     for (var i = 0; i < rows.length; i++) {
//       console.log(rows[i].author);
//     }
//   }
// })

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
//

// var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
// var params = ['Supervisor', 'Watcher', 'graphy'];
// connection.query(sql, params, function(err, rows, fields){
//   if (err) {
//     console.log(err);
//   }else {
//     console.log(rows.insertId);
//   }
// })

// var sql = 'UPDATE topic SET title=?, description=? WHERE id=?';
// var params = ['NPM', 'jinah', 1];
// connection.query(sql, params, function(err, rows, fields){
//   if (err) {
//     console.log(err);
//   }else {
//     console.log(rows);
//   }
// })

var sql = 'DELETE FROM topic WHERE id=?';
var params = [1];
connection.query(sql, params, function(err, rows, fields){
  if (err) {
    console.log(err);
  }else {
    console.log(rows);
  }
})

connection.end();
