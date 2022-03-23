require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const port = 3000
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

console.log(process.env.SECRET);
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.route("/login")

  .get((req, res) => {
    res.render("login");
  })

  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password ) {
            res.render("secrets")
          }
        }
      }
    });
  });


app.route("/register")

  .get((req, res) => {
    res.render("register");
  })

  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });





app.listen(port, () => {
  console.log("Server has started successfully.");
})
