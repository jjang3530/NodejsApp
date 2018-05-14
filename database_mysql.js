var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'o2'
});
connection.connect();

var sql = 'SELECT * FROM topic';
connection.query(sql, function(err, rows, fields){
  if (err) {
    console.log(err);
  }else {
    console.log('rows', rows);
    console.log('fiedls', fields);
  }
})

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
//
connection.end();
