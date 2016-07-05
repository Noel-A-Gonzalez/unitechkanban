    var pg = require('pg');
    connection = require ('./postgres.json');
    var connectionString = "postgres://"+connection.postgres.user+":"+connection.postgres.password+"@"+connection.postgres.host+"/"+connection.postgres.db;
    var client = new pg.Client(connectionString);
    client.connect(function(err){
      if(err){
        console.log('Hubo un error al intentar conectar con la base de datos.. ' + err);
        return;
      }
      console.log('Conexión con la Base de datos establecida..');
    });

module.exports = client;