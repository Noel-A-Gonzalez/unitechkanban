var express = require('express');
  rstatus = express.Router();
    json = require('express-json');
    json = require('express-json');
    client = require('./config/pg.js');

rstatus.post("/getItemJSON", function(req, res) {
  var jsonStringify,data;
  var user = req.body.user
  client.query('SELECT * FROM app_kanban1.sp_getAllJSON($1)',[user], function(err, result) {
    if (err) {
        console.log(err);
        return;
      }else{
        jsonStringify = JSON.stringify(result.rows);
        data = JSON.parse(jsonStringify)
        res.jsonp(data);
      }
  });
});

rstatus.get("/getMaxWIP", function(req, res) {
  var jsonStringify,data;
  client.query('SELECT status_id, st_wip as wip FROM app_kanban1.status ORDER BY st_order ASC', function(err, result){
    if (err) {
      console.log(err);
    }else{
      jsonStringify = JSON.stringify(result.rows);
      data = JSON.parse(jsonStringify)
      res.jsonp(data);
    }
  });
});

rstatus.get("/getNextID", function(req, res) {
  var jsonStringify,data;
  client.query("SELECT nextval('app_kanban1.status_id_seq'::regclass) as nextid", function(err, result) {
    if (err) {
        console.log(err);
        return;
      }else{
        jsonStringify = JSON.stringify(result.rows);
        data = JSON.parse(jsonStringify)
        res.jsonp(data);
      }
  });
});

rstatus.post("/insertList", function(req, res) {
  var idlist = req.body.idlist;
  client.query("INSERT INTO app_kanban1.status (status_id, board_id) VALUES($1, $2)", [idlist, 1], function(err, result) {
    if (err) {
        console.log(err);
        res.status(500);
        return;
      }else{
        res.end("success");
      }
  });
});

rstatus.post("/updateList", function(req, res) {
  var idlist = req.body.idlist;
  var titlist = req.body.titlist;
  client.query("UPDATE app_kanban1.status SET st_name=($1) WHERE status_id=($2)", [titlist, idlist], function(err, result) {
    if (err) {
        console.log(err);
        res.status(500);
        return;
      }else{
        res.end("success");
      }
  });
});

rstatus.post("/deleteList", function(req, res) {
  var idlist = req.body.idlist;
  client.query("DELETE FROM app_kanban1.status WHERE status_id=($1)", [idlist], function(err, result) {
    if (err) {
        console.log(err);
        res.status(500);
        return;
      }else{
        res.end("success");
      }
  });
});

rstatus.post("/editWIP", function(req, res) {
  var idlist = req.body.idlist;
  var wip = req.body.wip;
  client.query("UPDATE app_kanban1.status SET st_wip=($1) WHERE status_id=($2)", [wip, idlist], function(err, result) {
    if (err) {
        console.log(err);
        res.status(500);
        return;
      }else{
        res.end("success");
      }
  });
});

rstatus.post("/editColor", function(req, res) {
  var idlist = req.body.idlist;
  var color = req.body.color;
  client.query("UPDATE app_kanban1.status SET st_style=($1) WHERE status_id=($2)", [color, idlist], function(err, result) {
    if (err) {
        console.log(err);
        res.status(500);
        return;
      }else{
        res.end("success");
      }
  });
});

rstatus.post("/updateOrder", function(req, res) {
  var idlist = req.body.list;
  var order = req.body.order;
  console.log("Orden: " + order + " Columna: " + idlist);
  client.query("UPDATE app_kanban1.status SET st_order=($1) WHERE status_id=($2)", [order, idlist], function(err, result) {
    if (err) {
        console.log(err);
        res.status(500);
        return;
      }else{
        res.end("success");
      }
  });
});

module.exports = rstatus;
