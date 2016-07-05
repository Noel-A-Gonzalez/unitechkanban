var express = require('express');
	  datos = express.Router();
    json = require('express-json');
    Buffer = require('buffer').Buffer;
    client = require('./config/pg.js');

datos.post("/crearNodo", function(req, res) {
  var id = req.body.id;
  var parents = req.body.parents;
  var text = req.body.text;
  client.query("INSERT INTO app.nodos(parents, name_nodo) VALUES ('"+parents+"', '"+text+"')", function(err, rows) {
    if (err) {
        res.send(err);
        return;
      }else{
        res.end("success");
      }
  });
});

datos.post("/editarName", function(req, res) {
  var texto = req.body.text;
  var id = req.body.id;
  console.log(texto);
  client.query("UPDATE app.nodos SET name_nodo = '"+texto+"' WHERE id_nodo = '"+id+"'", function(err, result) {
    if (err) {
        res.send(err);
        console.log(err);
        return;
      }else{
        res.end("success");
      }
  });
});

datos.post("/deleteNode", function(req, res) {
  var id = req.body.id;
  client.query("DELETE FROM app.nodos WHERE id_nodo = '"+id+"'", function(err, result) {
    if (err) {
      res.send("404");
      }else{
        res.end("success");
      }
  });
});


datos.post("/getTextBlob", function(req, res) {
  var id = req.body.id;
  var jsonStringify, data;
  if (id) {
    client.query("SELECT text_nodo::varchar as campo, titulo_nodo as titulo, descr_nodo as descr FROM app.nodos WHERE id_nodo =  '"+id+"'", function(err, result) {
      if (err) throw err;
      jsonStringify = JSON.stringify(result.rows);
      data = JSON.parse(jsonStringify)
      res.jsonp(data);
    });
  };
});

datos.get("/selectNoel", function(req, res) {
  var jsonStringify, data;
  client.query("SELECT text_nodo::varchar as campo FROM app.nodos WHERE id_nodo =  2", function(err, result){ 
    if (err) throw err;
    jsonStringify = JSON.stringify(result.rows);
    data = JSON.parse(jsonStringify)
    res.jsonp(data);
  });
});

datos.get("/getNodos", function(req, res) {
  var jsonStringify, data;
  client.query("SELECT id_nodo as id, parents as parent, name_nodo as text, icon FROM app.nodos WHERE id_nodo NOT IN ('0', '#') ORDER BY id_nodo ASC", function(err, result) {
      jsonStringify = JSON.stringify(result.rows);
      data = JSON.parse(jsonStringify)
      res.jsonp(data);
    });

datos.post("/insertarTexto", function(req, res) {
  var id = req.body.id;
  var texto = req.body.texto;
  client.query("UPDATE app.nodos SET text_nodo = '"+texto+"' WHERE id_nodo =  '"+id+"'", function(err, result) {
    if (err) {
        console.log(err);
        return;
      }else{
        res.end("success");
      }
  });
});

datos.post("/updateOrder", function(req, res) {
  var datos = req.body.treeData;
  console.log(datos);
});

datos.get("/getNewId", function(req, res) {
  var jsonStringify, data;
    client.query("select nextval('app.nodos_id_nodo_seq'::text::regclass)::character varying", function(err, result) {
      if (err) {
        console.log(err);
      }else{
        jsonStringify = JSON.stringify(result.rows);
        data = JSON.parse(jsonStringify)
        res.jsonp(data);
      }
    });
});

datos.post("/updateTit", function(req, res){
  var id = req.body.id;
  var titulo = req.body.titulo;
  var descr = req.body.descripcion;

  client.query("UPDATE app.nodos SET titulo_nodo = '"+titulo+"', descr_nodo ='"+descr+"' WHERE id_nodo = '"+id+"'", function(err, result){
    if (err) {
        console.log(err);
        return;
      }else{
        res.end("success");
      }
  });
});

});

module.exports = datos;