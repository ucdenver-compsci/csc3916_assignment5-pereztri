var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.DB);

// Movie schema
// var ReviewSchema = new Schema({

// });


//Reviews Collection Schema to hold reviews about movies:
//Each review should contain the following fields:
// movieId: from the Movies collection
// username: name of the reviewer
// review: the actual review text
// rating: rating out of five stars given by the reviewer
const ReviewSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    username: String,
    review: String,
    rating: { type: Number, min: 0, max: 5 }
  });


// return the model
module.exports = mongoose.model('Review', ReviewSchema);