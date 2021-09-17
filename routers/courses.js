const express = require("express");
const CourseController = require("../controllers/courses");
const md_auth = require("../middlewares/authenticated");
const { update } = require("../models/courses");
const { addCourse, getCourses, deleteCourse, updateCourse } = CourseController;
const api = express.Router();

api.post("/add-courses", [md_auth.ensureAuth], addCourse);
api.get("/get-courses", [md_auth.ensureAuth], getCourses);
api.delete("/delete-courses/:id", [md_auth.ensureAuth], deleteCourse);
api.put("/update-courses/:id", [md_auth.ensureAuth], updateCourse);

module.exports = api;
