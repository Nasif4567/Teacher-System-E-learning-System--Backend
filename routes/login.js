const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const connection = require("../utils/db");
const { uid } = require("uid");
const { checkIfExists } = require("../utils/helper");
const { generateToken } = require("../utils/webToken");

router.post("/", async (req, res) => {
  const {  password, username } = req.body;

  try {
    const usernameExists = await checkIfExists("username", username);
    
    if (!usernameExists ) {
      return res.status(400).send("User does not exist");
    }

    /* 

    {
        
        "email": "johndoe@demo.com",
        "password": "password",
        "username": "johndoe"

    }

    */

    //get the user from the database
    connection.query(
      "SELECT * FROM teachers WHERE username = ?",
      [username],
      (error, userResults) => {
        if (error) {
          console.error("Error executing SQL query:", error);
          res.status(400).send("Error in logging user");
          return;
        }

        const user = userResults[0];
        if (!user) {
          return res.status(400).send("User does not exist");
        }

        //check if the password is correct
        bcrypt.compare(password, user.password, (error, isPasswordCorrect) => {
          if (error) {
            console.error("Error comparing passwords:", error);
            res.status(400).send("Error in logging user");
            return;
          }

          if (!isPasswordCorrect) {
            return res.status(400).send("Password is incorrect");
          }
          const tokenExpiresIn = 60 * 60 * 24; // 24 hours

           const token = generateToken({ 
            username: user.username,
            teacherID: user.teacherID,
            },
            tokenExpiresIn
            );
            res.cookie('token', token, { httpOnly: true, sameSite: 'none'});
           

            
          return res.status(200).send(
            {
              user:{
                username: user.username,
                email: user.email,
                name: user.name
              },
              message : "User logged in successfully",
              token : token
            }
          );
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).send("Error in logging user");
  }
});

module.exports = router;
