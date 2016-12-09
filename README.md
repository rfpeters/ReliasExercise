Lookup Movies With OMDb
Author: Ryan Peters

Introduction:
	The application is used to search for movies using OMDb.  The application is running on an Amazon EC2 instance.
	It is built using Node.js with the Express framework and using the Handlebars template system.  The website 
	can be accessed at http://52.10.11.248:4000.  All the files needed to run the application on a machine that 
	has Node.js installed are included in the zip file.  The Node.js modules used by the application can be installed
	by running the command [npm install] in the same directory as package.json.  The application is started with the 
	command [node app.js].  The Passport module is used creating uses and logging in to the website.  The database 
	used to store user information is MongoDB and is accessed using the Mongoose module.  I used "Easy Node Authentication:
	Setup and Local" by Chris Sevilleja to implement authentication (https://scotch.io/tutorials/easy-node-authentication-setup-and-local).
	
	There are eight pages for the website.  The landing page says what the website does and users can choose to continue 
	as a guest, login, or create and account.  Using the site as a guest will take users to the home page which 
	describes the two types of searches that can be performed.  Choosing to login will take users to the login page.  
	Users will login with an email address and password.  A successful login takes users to the home page.  Choosing to 
	create an account will take users to the page for creating an account.  Users will need to provide a name, email address,
	and password.  Successfully creating an account will take users to the home page.  From the home page users can choose 
	to search for an individual title or multiple titles.  Searching for an individual title will take users to a page where 
	a title and year are entered for the search.  A title is required but the year is optional.  If a year is not provided 
	the result will the most recent movie the title entered.  If a year is provided a search for the title will be 
	done for movies in that year.  If an exact match is not found, a keyword search is done.  If a movie is found it will be 
	displayed with the poster, title, year,	rating, and a one sentence synopsis.  If users choose to search for multiple movies, 
	the page will only ask for a title.  The title entered is used for a keyword search.  At most ten movies will be return.  
	The movies will be displayed with a poster, title, and year.  The movies are ordered for most recent to oldest.  There are 
	pages for Page Not Found and Server Errors.
<pre>	
File Structure:
	/ (Directory of Choice)
	|
	|- config
	|    |
	|    |- database.js (contains url for accessing database)
	|    |- passport.js (contains strategies for creating a user and login)
	|
	|- models
	|    |
	|    |- users.js (contains schema and methods hashing password and validating password)
	|
	|- node_modules (created and modules added by [npm install])
	|
	|- public (static files used by app)
	|	  |
	|	  |- css
	|		  |
	|		  |- style.css 
	|
	|- views (handlebars templates)
	|	 |
	|	 |- layouts (base template)
	|    |     |
	|    |     |- base.handlebars
	|    |
	|    |- 404.handlebars (page not found)
	|    |- error.handlebars (internal error)
	|    |- landing.handlebars (landing page)
	|    |- login.handlebars (login page)
	|    |- home.handlebars (home page)
	|    |- search.handlebars (search for multiple movies)
	|    |- signup.handlebars (signup page)
	|    |- title.handlebars (search for individual movie)
	|
	|- app.js
	|
	|- package.json
	|
	|- README.md
</pre>
