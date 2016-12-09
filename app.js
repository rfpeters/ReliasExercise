/*
Author: Ryan Peters
Date: 12/06/16
Description: Homepage has links to pages for looking up movies using OMDb.  One page 
looks for a movie using the title and year.  The title is required.  If a year is not
provided, the result will be the most recent movie with that title.  The other page 
searched for all movies that match the title provided.
*/
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'base'});

var configDB = require('./config/database.js');

mongoose.Promise = global.Promise;
mongoose.connect(configDB.url);

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());

require('./config/passport')(passport);

app.use(session({secret: 'supersecret', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/*Route used for landing page*/
app.get('/', function(req,res,next){
	var context = {};
	context.site_title='Lookup Movies With OMDb';	
    res.render('landing',context);
});

/*Route used for home page - display user name and link to logout if logged-in*/
app.get('/home', function(req,res,next){
	var context = {};
	if(req.user){
		context.user = req.user.local.name;
		context.logout = true;
	}
	else{
		context.user = 'Guest';
		context.logout = false;
	}
	context.site_title='Lookup Movies With OMDb';	
    res.render('home',context);
});

/*Route used for displaying login page*/
app.get('/login', function(req,res,next){
	var context = {};
	context.site_title='Lookup Movies With OMDb';
	context.err_message = req.flash('loginMessage');	
    res.render('login',context);
});

/*Route used for trying to login*/
 app.post('/login', passport.authenticate('login', {
    successRedirect : '/home', 
    failureRedirect : '/login', 
    failureFlash : true 
}));

/*Route used for displaying signup page*/
app.get('/signup', function(req,res,next){
	var context = {};
	context.site_title='Lookup Movies With OMDb';
	context.err_message = req.flash('signupMessage');
    res.render('signup',context);
});

/*Route used for trying to signup*/
app.post('/signup', passport.authenticate('signup', {
    successRedirect : '/home', 
    failureRedirect : '/signup', 
    failureFlash : true 
}));

/*Route used for logout*/
app.get('/logout', function(req,res,next){
	req.logout();
	res.redirect('/');
});
	
/*Route used to display page for search for a movie*/
app.get('/movie', function(req,res,next){
	var context = {};
	context.site_title='Lookup Movies With OMDb';
	context.no_title = true;
	res.render('title',context);
});

/*Route used for searching for a movie*/
app.post('/movie', function(req,res,next){
	var context = {};
	context.site_title='Lookup Movies With OMDb';
	request({url:'http://www.omdbapi.com/?t=' + req.body.title + '&y='
			+ req.body.year + '&type=movie&plot=short&r=json', json:true}, function(err, response, body) {
		if(!err && res.statusCode < 400){
			if(body.Response == 'False'){
				noTitle(context);
			}
			else{
				context.no_title = false;
				context.title = body.Title;
				context.rating = body.Rated;
				context.desc = body.Plot;
				context.img_src = body.Poster;
				context.year = body.Year;
			}
			res.render('title', context);
		} else {
			if(response){
				console.log(response.statusCode);
			}
			next(err);
		}
	});
});

/*Route used to display page for search for multiple movies*/
app.get('/search', function(req,res,next){
	var context = {};
	context.site_title='Lookup Movies With OMDb';
	context.noTitle = true;
	res.render('search',context);
});

/*Route used for searching for multiple movies*/
app.post('/search', function(req,res,next){
	var context = {};
	context.site_title='Lookup Movies With OMDb';
	request({url:'http://www.omdbapi.com/?s=' + req.body.title + '&type=movie', json:true}, function(err, response, body) {
		if(!err && res.statusCode < 400){
		
			if(body.Response == 'False'){
				noTitle(context);
			}
			else{
				var movieInfo = [];
				for(var i in body.Search){
					movieInfo.push({title:body.Search[i].Title, year:body.Search[i].Year, img_src:body.Search[i].Poster})
				}
				//Sort the list of movies
				movieInfo.sort(function(a, b){
					if(a.year < b.year){
						return 1;
					}
					if(a.year > b.year){
						return -1;
					}
					return 0;
				});
				context.no_title = false;
				context.movies = movieInfo;				
			}
			res.render('search', context);
		} else {
			if(response){
				console.log(response.statusCode);
			}
			next(err);
		}
	});
});

/*Routed used for page not found*/
app.get('*', function(req, res, next){
	var context = {};
	context.site_title='Lookup Movies With OMDb';	
	res.status(404);
	res.render('404', context);
});

/*Routed used for internal errors*/
app.use(function(err, req, res, next){
	var context = {};
	context.site_title='Lookup Movies With OMDb';
	console.error(err.stack);
	res.status(500);
	res.render('error', context);
})

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

/*Response for if a movie is not found*/
function noTitle(context){
	context.no_title = true;
	context.message = "Sorry, unable to find a movie.";
}