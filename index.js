const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  path = require('path'),
  morgan = require('morgan');

//Serving Static Files
app.use('/documentation.html', express.static('public'));

//logging with morgan
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log.txt'), {flags: 'a'});
app.use(morgan('common'));

let movies = [
  {
    Title: 'Titanic',
    Description: 'A 1997 American epic romance and disaster film, based on accounts of the sinking of the RMS Titanic',
    Genre: {
      Name: 'Romance/Drama',
    },
    Director: {
      Name: 'James Cameron',
      Bio: 'A Canadian filmmaker. Best known for making science fiction and epic films'
    },
  },

  {
		Title: 'Title 2',
		Description: 'Description 2',
		Genre: {
			Name: 'Action',
		},
		Director: {
			Name: 'Director 2',
			Bio: 'Bio Director 2',
		},
	},

	{
		Title: 'Title 3',
		Description: 'Description 3',
		Genre: {
			Name: 'Drama',
		},
		Director: {
			Name: 'Director 3',
			Bio: 'Bio Director 3',
		},
	},

	{
		Title: 'Title 4',
		Description: 'Description 4',
		Genre: {
			Name: 'Drama',
		},
		Director: {
			Name: 'Director 4',
			Bio: 'Bio Director 4',
		},
	},

	{
		Title: 'Title 5',
		Description: 'Description 5',
		Genre: {
			Name: 'Drama',
		},
		Director: {
			Name: 'Director 5',
			Bio: 'Bio Director 5',
		},
	},
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to the movie API!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

//error handling
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('There has been an error');
});

// listening for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
