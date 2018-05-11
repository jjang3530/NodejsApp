var fs = require('fs');

//Sync
console.log(1);
var data = fs.readFileSync('data.txt', {encoding: 'utf8'});
console.log(data);

 //Async
 console.log(2);
 var data = fs.readFile('data.txt', {encoding: 'utf8'}, function(err, data){console.log(data);
 });
