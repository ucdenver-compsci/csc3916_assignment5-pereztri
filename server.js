/*
CSC3916 HW4
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');
var Review = require('./Reviews');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'Error: A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

//POST route for movies
router.post('/movies', authJwtController.isAuthenticated, function(req, res)
{
    if (!req.body.title || !req.body.releaseDate || !req.body.genre || !req.body.actors || req.body.actors.length === 0)
    {
        res.status(400).send({success: false, message: 'Error: The movie does not contain the required information. It is missing a title, release date, genre, actors, or character name.'});
    } 
    else 
    {
        var movie = new Movie(req.body);
        movie.save(function(err)
        {
            if (err)
            {
                res.send(err);
            }
            else
            {
                res.json({success: true, message: 'The movie was successfully saved.'});
            }
        });
    }
});

//GET route for movies
// router.get('/movies', authJwtController.isAuthenticated, function(req, res)
// {
//     Movie.find({}, function(err, movies)
//     {
//         if (err)
//         {
//             res.send(err);
//         }
//         else
//         {
//             res.json(movies);
//         }
//     });
// });

//GET route for all movies
router.get('/movies', authJwtController.isAuthenticated, function(req, res)
{
    if (req.query.reviews === 'true')
    {
        Movie.aggregate([
            {
                $lookup: {
                from: "reviews", // name of the foreign collection
                localField: "_id", // field in the orders collection
                foreignField: "movieId", // field in the items collection
                as: "MOVIE REVIEWS" // output array where the joined items will be placed
                }
            }
        ]).exec(function(err, movies) 
        {
            if (err) 
            {
                // handle error
                res.send(err);
            } else 
            {
                // console.log(movies);
                res.json(movies);
            }
        });
    }
    else 
    {
        Movie.find({}, function(err, movies)
        {
            if (err)
            {
                res.send(err);
            }
            else
            {
                res.json(movies);
            }
        });
    }     
});

//GET route for one movie
router.get('/movies/:id', authJwtController.isAuthenticated, function(req, res)
{
    const movieId = req.params.id;
    if (req.query.reviews === 'true')
    {
        Movie.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(movieId)} // replace orderId with the actual order id
            },
            {
                $lookup: {
                from: "reviews", // name of the foreign collection
                localField: "_id", // field in the orders collection
                foreignField: "movieId", // field in the items collection
                as: "MOVIE REVIEWS" // output array where the joined items will be placed
                }
            }
        ]).exec(function(err, result) 
        {
            if (err) 
            {
                // handle error
                res.send(err);
            } else 
            {
                // console.log(result);
                res.json(result);
            }
        });
    }
    else 
    {
        Movie.findById(movieId).exec(function(err, movie)
        {
            if (err)
            {
                res.send(err);
            }
            else if (!movie)
            {
                res.status(404).send({success: false, message: 'The movie record was not found.'});
            }
            else
            {
                res.json(movie);
            }
        });
    }     
});

//PUT route using the ID
// router.put('/movies', authJwtController.isAuthenticated, function(req, res)
// {
//     const { id, ...updateData} = req.body; 

//     if (!id) 
//     {
//         res.status(400).send({success: false, message: 'ID is required in the request body.'});
//     }
//     Movie.findByIdAndUpdate(id, updateData, {new: true}, function(err, movie)
//     {
//         if (err)
//         {
//             res.send(err);
//         }
//         else if (!movie)
//         {
//             res.status(404).send({success: false, message: 'Movie not found.'});
//         }
//         else
//         {
//             res.json({success: true, message: 'Movie updated! Here is the update:', movie});
//         }
//     });
// });

//PUT route using the Title for movies
router.put('/movies', authJwtController.isAuthenticated, function(req, res)
{
    const {title, ...updateData} = req.body; 

    if (!title) 
    {
        res.status(400).send({success: false, message: 'The title is required to complete the request.'});
    }
    Movie.findOneAndUpdate({title: title}, updateData, {new: true}, function(err, movie)
    {
        if (err)
        {
            res.send(err);
        }
        else if (!movie)
        {
            res.status(404).send({success: false, message: 'The movie record was not found.'});
        }
        else
        {
            res.json({success: true, message: 'The movie was successfully updated.', movie});
        }
    });
});

//DELETE route using the ID
// router.delete('/movies', authJwtController.isAuthenticated, function(req, res)
// {
//     const {id} = req.body; 

//     if (!id) 
//     {
//         res.status(400).send({success: false, message: 'ID is required in the request body.'});
//     }
//     Movie.findByIdAndRemove(id, function(err, movie)
//     {
//         if (err)
//         {
//             res.send(err);
//         }
//         else if (!movie)
//         {
//             res.status(404).send({success: false, message: 'Movie not found.'})
//         }
//         else
//         {
//             res.json({success: true, message: 'Movie deleted!'});
//         }
//     });
// });

//DELETE route using the Title for movies
router.delete('/movies', authJwtController.isAuthenticated, function(req, res)
{
    const {title} = req.body; 

    if (!title) 
    {
        res.status(400).send({success: false, message: 'The title is required to complete the request.'});
    }
    Movie.findOneAndDelete({title: title}, function(err, movie)
    {
        if (err)
        {
            res.send(err);
        }
        else if (!movie)
        {
            res.status(404).send({success: false, message: 'The movie record was not found.'})
        }
        else
        {
            res.json({success: true, message: 'The movie was successfully deleted.'});
        }
    });
});

//POST route for reviews
router.post('/reviews', authJwtController.isAuthenticated, function(req, res)
{
    if (!req.body.movieId || !req.body.username || req.body.review == null || req.body.rating == null)
    {
        res.status(400).send({success: false, message: 'Error: The review does not contain the required information. It is missing a movie ID, user name, review, and rating.'});
    } 
    else 
    {
        var review = new Review(req.body);
        // var review = new Review(
        //     {
        //         movieId: req.body.movieId, 
        //         username: req.body.username, 
        //         review: req.body.review,
        //         rating: req.body.rating
        //     }
        // );
        review.save(function(err)
        {
            if (err)
            {
                res.send(err);
            }
            else
            {
                res.json({success: true, message: 'Review created!'});
            }
        });
    }
});

//GET route for reviews
router.get('/reviews', authJwtController.isAuthenticated, function(req, res)
{
    Review.find({}, function(err, reviews)
    {
        if (err)
        {
            res.send(err);
        }
        else
        {
            res.json(reviews);
        }
    });
});

//DELETE route using the review id for reviews
router.delete('/reviews', authJwtController.isAuthenticated, function(req, res)
{
    //Get the id
    const { id } = req.body; 

    if (!id) 
    {
        res.status(400).send({success: false, message: 'The review ID is required to complete the request.'});
    }
    Review.findByIdAndRemove(id, function(err, review)
    {
        if (err)
        {
            res.send(err);
        }
        else if (!review)
        {
            res.status(404).send({success: false, message: 'The review record was not found.'});
        }
        else
        {
            res.json({success: true, message: 'The review was successfully deleted.'});
        }
    });
});

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only