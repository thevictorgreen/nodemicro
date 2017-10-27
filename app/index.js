var restify  = require('restify');
var mysql    = require('mysql');
var pool     =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'mydb',
    user     : 'police',
    password : 'g0th@m',
    database : 'crimesdc',
    debug    :  false
});

var server = restify.createServer();
server.get('/shift/:value', shiftFunction);
server.get('/ward/:value', wardFunction);

function shiftFunction(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  pool.getConnection(function(err,con) {
     if (err) {
         res.json({"code" : 100, "status" : "Error in connection database"});
         return;
     }
     else {
         console.log('connected as id ' + con.threadId);
         con.query("select * from incidents where f4 = '" + req.params.value  + "'",function(err,rows){
            con.release();
            if(!err) {
               res.json(rows);
            }
        });
     }
  });
  next();
}

function wardFunction(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  pool.getConnection(function(err,con) {
     if (err) {
         res.json({"code" : 100, "status" : "Error in connection database"});
         return;
     }
     else {
         console.log('connected as id ' + con.threadId);
         console.log( req.params.value );
         con.query("select * from incidents where f8 = '" + req.params.value  + "'",function(err,rows){
            con.release();
            if(!err) {
               res.json(rows);
            }
        });
     }
  });
  next();
}


server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});

