var mysql = require('mysql');

//Module create connection mysql
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'unitech',
  });

connection.connect(function(err){
  if(err){
    console.log('Hubo un error al intentar conectar con la base de datos..');
    return;
  }
  console.log('Conexión con la Base de datos establecida..');
});

//module.exports = connection;