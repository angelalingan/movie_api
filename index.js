const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan');
  uuid = require('uuid');

//Serving Static Files: instructing express to serve every file under the public directory
app.use(express.static('public'));

//Returns middleware that only parses JSON
app.use(bodyParser.json());

//Logging with morgan
app.use(morgan('common'));

let users = [
  {
    id: 1,
    name: 'Angela',
    favoriteMovies: [],
  },
  {
    id: 2,
    name: 'Michael',
    favoriteMovies: ['Titanic'],
  },
];

let movies = [
  {
    Title: 'Titanic',
    Description: 'A 1997 American epic romance and disaster film, based on accounts of the sinking of the RMS Titanic',
    Genre: {
      Name: 'Drama',
      Description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
    },
    Director: {
      Name: 'James Cameron',
      Bio: 'A Canadian filmmaker. Best known for making science fiction and epic films',
      Birth: 'August 16, 1954',
    },
  },

  {
		Title: 'Avatar',
		Description: 'A 2009 American epic science fiction film set in the mid-22nd century when humans are colonizing Pandora, a lush habitable moon of a gas giant in the Alpha Centauri star system, in order to mine the valuable mineral unobtanium.',
		Genre: {
			Name: 'Science fiction',
      Description: 'A genre of speculative fiction which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, extraterrestrial life, sentient artificial intelligence, cybernetics, certain forms of immortality (like mind uploading), and the singularity.'
		},
		Director: {
			Name: 'James Cameron',
			Bio: 'A Canadian filmmaker. Best known for making science fiction and epic films',
      Birth: 'August 16, 1954',
		},
	},

	{
		Title: 'The Batman',
		Description: 'A 2022 American superhero film based on the DC Comics character Batman',
		Genre: {
			Name: 'Action',
      Description: 'A film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats. The genre tends to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero.'
		},
		Director: {
			Name: 'Matt Reeves',
			Bio: 'An American film director, producer and screenwriter.',
      Birth: 'April 27, 1966',
		},
	},

	{
		Title: "Harry Potter and the Sorcerer's Stone",
		Description: "A 2001 fantasy film that follows a boy named Harry's first year at Hogwarts School of Witchcraft and Wizardry, as he discovers that he is a famous wizard and begins his formal wizarding education.",
		Genre: {
			Name: 'Fantasy',
      Description: 'The fantasy genre has fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
		},
		Director: {
			Name: 'Chris Columbus',
			Bio: 'An American filmmaker',
      Birth: 'September 10, 1958',
		},
	},

	{
		Title: 'Us',
		Description: "A 2019 American horror film written and directed by Jordan Peele, starring Lupita Nyong'o, Winston Duke, Elisabeth Moss, and Tim Heidecker. The film follows Adelaide Wilson (Nyong'o) and her family, who are attacked by a group of menacing doppelgängers.",
		Genre: {
			Name: 'Horror',
      Description: 'A film genre that seeks to elicit fear or disgust in its audience for entertainment purposes.',
		},
		Director: {
			Name: 'Jordan Peele',
			Bio: 'February 21, 1979',
		},
	},
];

//CREATE: Allow new users to register
app.post('/users', (req, res) => {
  const newUser= req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.staus(400).send('Users need names')
  }
});

//UPDATE: Allow users to update their user info (username)
app.put('/users/:id/', (req, res) => {
  const { id } = req.params;
  const updatedUser= req.body;

  let user = users.find( user => user.id == id);

  if (user) {
    user.name =updatedUser.name;
    res.status(200).json(user);
  } else (
    res.status(404).send('This user is not in the database')
  )
});

//CREATE: Allow users to add a movie to their list of favorites
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else (
    res.status(404).send('This user is not in the database')
  )
});

//DELETE: Allow users to remove a movie from their list of favorites
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from the user ${id}'s array`);
  } else (
    res.status(404).send('This user is not in the database')
  )
});

//DELETE: Allow users to deregister
app.delete('/users/:id/', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id);

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user${id} has been removed from the database`);
  } else (
    res.status(404).send('This user is not in the database')
  )
});

//READ
app.get('/', (req, res) => {
  res.send('Welcome to the movie API!');
});

//READ: Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

//READ: Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send('This movie is not in the database')
  }
});

//READ: Return data about a genre by name/title
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('This genre is not in the database')
  }
});

//READ: Return data about a director (bio, birth year) by name
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('This director is not in the database')
  }
});

//Error handling
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('There has been an error');
});

//Listening for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
