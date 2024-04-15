var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.DB);

// Movie schema
// var MovieSchema = new Schema({

// });


//Movie Collection Schema to store movie information:
// const MovieSchema = new mongoose.Schema({
//     title: { type: String, required: true, index: true },
//     releaseDate: Date,
//     genre: {
//       type: String,
//       enum: [
//         'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'
//       ],
//     },
//     actors: [{
//       actorName: String,
//       characterName: String,
//     }],
//   });


//Movie Collection Schema to store movie information:
  const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    releaseDate: { type: Number, min: [1900, 'Must be greater than 1899'], max: [2100, 'Must be less than 2100']},
    genre: { type: String, enum: genres },
    actors: [ActorSchema],
    imageUrl: String,
    // rest of your fields
  });
  

// return the model
module.exports = mongoose.model('Movie', MovieSchema);