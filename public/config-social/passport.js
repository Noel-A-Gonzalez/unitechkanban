var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    gcal = require('google-calendar');

var configAuth = require('./auth');
var client = require("../../routes/config/pg.js");

module.exports = function(passport) {

    // Serializa al usuario para almacenarlo en la sesión
    passport.serializeUser(function(user, done) {
        done(null, user.u_email);
    });

    /* Deserializa el usuario almacenado en la sesión para
     poder utilizarlo*/
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('Calendar', new TwitterStrategy))

    passport.use(new GoogleStrategy({
        clientID: configAuth.calendarAuth.clientID,
        clientSecret: configAuth.calendarAuth.clientSecret,
        callbackURL: '/auth/calendar/callback',
        scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar'] 
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("probando");
        profile.accessToken = accessToken;
        return done(null, profile);
    }));


    // =========================================================================
    // GOOGLE CONFIGURACION ====================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {
        client.query("SELECT * FROM app_kanban1.users WHERE u_email = ($1)",[profile.emails[0].value], function(err, result) {
                if (err)
                    return done(err);
                if (result.rows.length) {
                    return done(null, result.rows[0]);
                } else {
                    // si el usuario existe lo devuelve
                    // si no, lo crea y guarda en la base de datos
                    var newUserMysql = {
                        users_email: profile.emails[0].value,
                        users_username: profile.name.givenName,
                        users_surname: profile.name.familyName,
                        users_photo: profile.photos[0].value
                    };
                
                    var insertQuery = "INSERT INTO app_kanban1.users (u_email, u_username, u_surname, u_photo ) VALUES ($1,$2,$3,$4)";

                    client.query(insertQuery,[newUserMysql.users_email , newUserMysql.users_username, newUserMysql.users_surname, newUserMysql.users_photo],function(err, result) {
                         if (err) {
                            console.log(err);
                          }else{
                            return done(null, newUserMysql);
                          }

                    });
                }
            });        
    }));

};
