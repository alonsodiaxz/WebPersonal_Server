const Course = require("../models/courses");

function addCourse(req, res) {
  const body = req.body;
  const course = new Course(body);
  course.order = 1000;
  console.log(course);
  course.save((err, courseStored) => {
    if (err) {
      res.status(400).send({ code: 400, message: "Curso ya registrado." });
    } else {
      if (!courseStored) {
        res
          .status(404)
          .send({ code: 404, message: "No se ha podido registrar el curso." });
      } else {
        res
          .status(200)
          .send({ code: 200, message: "Curso registrado correctamente." });
      }
    }
  });
}

function getCourses(req, res) {
  Course.find()
    .sort({ order: "asc" })
    .exec((err, coursesStored) => {
      if (err) {
        res.status(500).send({ code: 500, message: "Error del servidor." });
      } else {
        if (!coursesStored) {
          res
            .status(404)
            .send({ code: 404, message: "No se ha encontrado ningún curso." });
        } else {
          res.status(200).send({ code: 200, courses: coursesStored });
        }
      }
    });
}

function deleteCourse(req, res) {
  const { id } = req.params;

  Course.findByIdAndDelete(id, (err, courseDeleted) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error de servidor." });
    } else {
      if (!courseDeleted) {
        res.status(404).send({ code: 404, message: "Curso no existente." });
      } else {
        res
          .status(200)
          .send({ code: 200, message: "Curso eliminado correctamente." });
      }
    }
  });
}

function updateCourse(req, res) {
  const body = req.body;
  const { id } = req.params;

  Course.findByIdAndUpdate(id, body, (err, updateCourse) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!updateCourse) {
        res
          .status(404)
          .send({ code: 404, message: "No se ha podido actualizar el curso." });
      } else {
        res
          .status(200)
          .send({ code: 200, message: "Curso alcutalizado correctamente." });
      }
    }
  });
}

module.exports = {
  addCourse,
  getCourses,
  deleteCourse,
  updateCourse,
};
