var express = require('express');
    router = express.Router();
    passport = require('passport');
    google = require('googleapis');
    googleAuth = require('google-auth-library');
    configAuth = require('../public/config-social/auth');
    json = require('express-json');
var eventSummary, eventDescription, eventFecha, linkEvent, positId, fechaNormal; //globals variables for params /auth/calendar

/* GET home page. */
router.get('/', estaLogeado, function(req, res, next) {
  	res.render('index.html');
});

/* Panel de administracion/dashboard */
router.get('/admin', estaLogeado, function(req, res, next) {
    res.render('admin/index.html');
});

/* Editar Perfil */
router.get('/admin/perfil', estaLogeado, function(req, res, next) {
    res.render('admin/perfil.html');
});

/*Administracion de Usuarios*/
router.get('/admin/usuarios', estaLogeado, function(req, res, next) {
  	res.render('admin/usuarios.html');
});

/*Calendario de Usuario*/
router.get('/admin/calendario', estaLogeado, function(req, res, next) {
    res.render('admin/calendario.html');
});

/*Header de paginas*/
router.get('/admin/header', estaLogeado, function(req, res, next) {
    res.render('admin/header.html');
});

router.get('/login', function(req, res, next) {
  	res.render('login.html');
});


/*============================================================================
-------------------- AUTH WITH GOOGLE ----------------------------------------
==============================================================================*/
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// callback que se ejecuta despues de que passport conecte con google y se 
// haya autenticado
router.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/',
                    failureRedirect : '/login'
            }));

/*Finaliza la session y redireciona al sitio raiz (index.html)*/
router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
});


//middleware para detectar si el usuario esta logueado
function estaLogeado(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}


/*=========================================================================
------------------------ GOOGLE CALENDAR ----------------------------------
===========================================================================*/
calendar = google.calendar('v3');
oAuthClient = new google.auth.OAuth2(configAuth.calendarAuth.clientID, configAuth.calendarAuth.clientSecret, configAuth.calendarAuth.redirectURL),
authed = false;


router.get("/auth/calendar", function(req, res){
  console.log("entroo");
    if (!authed) {
      eventSummary = req.param("titleEvent");
      eventDescription = req.param("descriptEvent");
      eventFecha = req.param('fecha');
      console.log("La fecha es: " + eventFecha);
      positId = req.param("positId");
    // Genera una URL OAuth y redirige
    var url = oAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/calendar'
    });
    console.log(url);
      res.end(url);
    }else{
        var event = {
          'summary': eventSummary,
          'location': 'CONICET - Cct - Nordeste - Tucumán, Corrientes, Argentina',
          'description': eventDescription,
          'start': {
            'date': eventFecha,
            'timeZone': 'America/Argentina/Buenos_Aires',
          },
          'end': {
            'date': eventFecha,
            'timeZone': 'America/Argentina/Buenos_Aires',
          },
    };

        calendar.events.insert({
          auth: oAuthClient,
          calendarId: 'primary',
          resource: event,
        }, function(err, event) {
          if (err) {
            console.log('Ocurrio un error al intentar conectarse con el servicio de Google Calendar: ' + err);
            return;
          }
          console.log('Evento creado: %s', event.htmlLink);
          linkEvent = event.htmlLink;
          authed = false;
          res.redirect("/");

        });
    }
});


router.get('/auth/calendar/callback', function(req, res) {
    var code = req.param('code');
    console.log("fsdfsdfsd " + code);
    if(code) {
      oAuthClient.getToken(code, function(err, tokens) {
        if (err) {
          console.log('Error autenticación')
          console.log(err);

        } else {
          console.log('Autenticación Exitosa');
          console.log(tokens);
          oAuthClient.setCredentials(tokens);

          authed = true;
          res.redirect('/auth/calendar');
        }
      });
    }else{
      res.redirect("/");
    }
});

router.get('/confirmCalendar', function(req, res){
  if (linkEvent) {
    datos = ({
      "link": linkEvent,
      "id": positId,
      "fecha": eventFecha
    });
    res.contentType('application/json');
    res.end(JSON.stringify(datos));
  }else{
    res.end(null);
  }
  
  linkEvent = null;
});


module.exports = router;
