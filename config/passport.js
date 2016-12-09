/*
File has Passport strategies for creating users and login.
*/
var LocalStrategy =  require('passport-local').Strategy;
var User = require('../models/users.js');

module.exports = function(passport){
	
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});
	
	/*Create User*/
	passport.use('signup', new LocalStrategy({
		usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
	},
	function(req, email, password, done) {
		process.nextTick(function(){
			User.findOne({'local.email':email}, function(err, user){
				if(err){
					return done(err);
				}
				if(user){
					return done(null, false, req.flash('signupMessage', 'Email is already in use.'));
				}
				else{
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.local.name = req.body.name;
					
					
					newUser.save(function(err){
						if(err){
							throw err;
						}
						return done(null, newUser);
					});
				}
			});
		});
	}));
	
	/*Login*/
	passport.use('login', new LocalStrategy({
		usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
	},
	function(req, email, password, done) {
		User.findOne({'local.email':email}, function(err, user){
			if(err){
				return done(err);
			}
			if(!user){
				return done(null, false, req.flash('loginMessage', 'Email and password do not match.'));
			}
			if(!user.validPassword(password)){
				return done(null, false, req.flash('loginMessage', 'Email and password do not match.'));
			}
			return done(null, user);
		});
	}));
};			