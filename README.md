# Assignment Five
## Purpose

The purpose of this assignment is to create a React Single Page App over your developed API.  The interface will allow the users to search for movies, display information about the movie, see stored ratings, and allow the user to enter a rating.

## Pre-Requirements
- Assignment 3 deployed REACT app that supports SignUp and Logon
- Assignment 4 that supports reviews

## Requirements
- Update your API to support storing an image (or image URL) for the movies you have stored.  You will use the image URL in your React application to show the image of movies
    - New Attribute on the movie collection
- For this assignment all your endpoints should be protected by JWT authentication
- Implement the following interfaces
    - User SignUp and User Logon
        - Leverage your User mongoDB collection to store new users of the application
    - Main screen should show the top rated movies (show at least 5)
        - Your GET /movies endpoint should sort by rating (server side)
            - Update your /movies (with reviews=true) endpoint to sort by average rating descending
    - Movie Detail screen, shows the Movie, Image, Actors that were in the movie, aggregated rating for the movie and grid that shows the reviews (username, rating, review)
    - Extra Credit: (7 points) - chapter 25 of (https://www.amazon.com/dp/B0979MGJ5J?_encoding=UTF8&psc=1&ref_=cm_sw_r_cp_ud_dp_M9YGPJNZWB3BK0P59QX3) Movie Search – show results in a grid, accordion or other list control
        - Add Search API (HTTP POST) to the API that can take partial movie names or partial actor names

## Submissions
- User is able to Sign-up (name, username, password)
- User is able to Logon to the application (username, password)
- User is able to see list of movies and select a movie to see the detail screen (top rated movies displayed)
- User is able to enter a review on the detail page (enter a rating and comment) – the logged in user’s username will be associated with the review (as captured from the JSON Web Token)

## Rubic
- -3 Not able to add comments
- -2 Not aggregating rating (average rating)
- -3 if not pointed to correct end point (e.g Hw4 endpoint)
- -5 if you don’t have a react web site deployed 

## Resources
- https://github.com/facebook/create-react-app
- https://github.com/mars/create-react-app-buildpack#user-content-requires

## Installation and usage instructions
- Run and Fork Postman
- Send the following requests in order: 
- 1) SignUp a User (accept) - creates a user
- 2) SignUp a User 2 (accept) - creates a second user
- 3) SignIn a User (accept) - signs in the first user created
- 4) Save movie 1 (accept) - saves a movie into the database
- 5) Save movie 2 (accept) - saves a movie into the database
- 6) Save movie 3 (accept) - saves a movie into the database
- 7) Save movie 4 (accept) - saves a movie into the database
- 8) Save movie 5 (accept) - saves a movie into the database
- 9) Save movie 6 (accept) - saves a movie into the database
- 10) Save movie 7 (accept) - saves a movie into the database
- 11) GET movies to get the IDs (accept) - gets the list of movies so you can use the movie id for other requests
- 12) Save review 1 (accept - using movie 7 Gladiator) - saves a review to the movie Gladiator using the movie id
- 13) Save review 2 (accept - using movie 7 Gladiator) - saves a review to the movie Gladiator using the movie id
- 14) Save review 1 (Error - No matching ID/movie missing from DB) - tries to save a review but the movie id is not existing
- 15) Save review 1 (Error -  Missing a required review field) - tries to save a review but the movie id is blank
- 16) GET movies without the review query parameter (Error -  movie not in the database) - tries to pull a movie but the movie id is not in the database 
- 17) GET movies without the review query parameter (Accept - one movie only) - pulls a movie successfully but without the reviews
- 18) GET movies with the review query parameter (accept) - pulls all of the movies and the reviews 
- 19) GET reviews to get the review ID (accept) - pulls only the reviews to get the review id to delete it in a different request
- 20) Delete review (accept) - deletes a review using the review id 


## Postman Link
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/32601991-ed8012b7-068b-4c3d-bfb3-6283b8fda31e?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D32601991-ed8012b7-068b-4c3d-bfb3-6283b8fda31e%26entityType%3Dcollection%26workspaceId%3Df70b2cfd-36ab-4105-adba-720513baa397#?env%5BTristenPerez-HW5%5D=W3sia2V5IjoiSldUIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiYW55Iiwic2Vzc2lvblZhbHVlIjoiSldULi4uIiwic2Vzc2lvbkluZGV4IjowfV0=)


## REACT Link
https://csc3916-react-pereztri-hw5.onrender.com


## The environment settings
- Postman collection name: CSCI3916_HW5
- Postman environment name: TristenPerez-HW5