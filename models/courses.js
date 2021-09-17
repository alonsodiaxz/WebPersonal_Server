const moongose = require("mongoose");
const Schema = moongose.Schema;

const CourseSchema = Schema({
  idCourse: {
    type: Number,
    unique: true,
  },
  link: String,
  coupon: String,
  price: Number,
  order: Number,
});

module.exports = moongose.model("Course", CourseSchema);
