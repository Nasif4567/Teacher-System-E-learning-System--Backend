const express = require("express");
const router = express.Router();
const connection = require("../utils/db");
const { verifyToken } = require("../utils/webToken");
const { uid } = require("uid");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `./content/${req.params.courseID}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload/:courseID", upload.single("file"), (req, res) => {
  //get the id from param

  const token = req.cookies.token;
  if (!token) {
    return res.status(400).send("Token not provided");
  }
  const payload = verifyToken(token);
  console.log(payload);
  const { username } = payload;

  connection.query(
    "SELECT teacherID FROM teachers WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        console.error("Error executing SQL query:", error);
        res.status(500).send("Error in creating content");
        return;
      }

      if (results.length === 0) {
        return res.status(400).send("Teacher not found");
      }
    }
  );

  const { courseID } = req.params;
  const { file } = req;
  const { title, description, type } = req.body;

  if (!title || !description ) {
    return res.status(400).send("Please fill in all fields");
  }

  if (!file) {
    return res.status(400).send("Please upload a file");
  }
  const port = process.env.PORT || 3002;
  const contentID = uid(16);
  const contentURL = `http://localhost:${port}/content/${courseID}/${file.originalname}`;
  const fileType = file.mimetype;

  connection.query(
    "INSERT INTO courseContent SET ?",
    {
      contentID,
      courseID,
      contentTitle: title,
      contentDescription: description,
      contentURL,
      fileType: fileType.toString(),
    },

    (error, results) => {
      if (error) {
        console.error("Error executing SQL query:", error);
        res.status(500).send("Error in creating content");
        return;
      }

      res.status(200).send({
        message: "Content created successfully",
        contentID,
        fileType,
        contentURL,
      });
    }
  );
});

router.get("/:courseID", (req, res) => {
  const { courseID } = req.params;
  console.log(courseID);
  //get the course content sorted by created_at
  connection.query(
    "SELECT * FROM courseContent WHERE courseID = ? ORDER BY created_at ASC",
    [courseID],
    (error, results) => {
      if (error) {
        console.error("Error executing SQL query:", error);
        res.status(500).send("Error in fetching content");
        return;
      }

      //get the course details 
      connection.query(
        "SELECT * FROM courses WHERE courseID = ?",
        [courseID],
        (error, course) => {
          if (error) {
            console.error("Error executing SQL query:", error);
            res.status(500).send("Error in fetching content");
            return;
          }

          console.log(course);

          res.status(200).send({
            course: course[0],
            content: results,
          });
        }
      );

      
    }
  );
});

router.put("/:courseID", upload.single("file"), (req, res) => {
  const { courseID } = req.params;
  const { file } = req;
  const { title, description,contentID ,deleteExistingFile} = req.body;

  if (!title || !description) {
    return res.status(400).send("Please fill in all fields");
  }

  if (!file) {
    if(deleteExistingFile){
      connection.query(
        "UPDATE courseContent SET contentTitle = ?, contentDescription = ?, contentURL = ?, fileType = ? WHERE contentID = ?",
        [title, description, null, null, contentID],
        (error, results) => {
          if (error) {
            console.error("Error executing SQL query:", error);
            res.status(500).send("Error in updating content");
            return;
          }
    
          res.status(200).send("Content updated successfully");
          return;
        }
      );

    }


    connection.query(
      "UPDATE courseContent SET contentTitle = ?, contentDescription = ? WHERE contentID = ?",
      [title, description, contentID],
      (error, results) => {
        if (error) {
          console.error("Error executing SQL query:", error);
          res.status(500).send("Error in updating content");
          return;
        }

        res.status(200).send("Content updated successfully");
      }
    );
  } else {

    
    const port = process.env.PORT || 3002;
    const contentURL = `http://localhost:${port}/content/${courseID}/${file.originalname}`;
    const fileType = file.mimetype;
    

    connection.query(
      "UPDATE courseContent SET contentTitle = ?, contentDescription = ?, contentURL = ?, fileType = ? WHERE contentID = ?",
      [title, description, contentURL, fileType, contentID],
      (error, results) => {
        if (error) {
          console.error("Error executing SQL query:", error);
          res.status(500).send("Error in updating content");
          return;
        }

        res.status(200).send(
          {
            message: "Content updated successfully",
            fileType,
            contentURL,
           contentTitle: title,
            contentDescription: description,
            

          }
        );
      }
    );
  }
});


module.exports = router;
