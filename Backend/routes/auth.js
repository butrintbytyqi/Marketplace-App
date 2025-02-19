const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const usersStore = require("../store/users");
const validateWith = require("../middleware/validation");

const schema = {
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(5).required().messages({
    'string.min': 'Password must be at least 5 characters long',
    'any.required': 'Password is required'
  })
};

router.post("/", validateWith(schema), (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password: "***" });
    
    const user = usersStore.getUserByEmail(email);
    console.log("Found user:", user ? "Yes" : "No");
    
    if (!user || user.password !== password) {
      console.log("Auth failed:", !user ? "User not found" : "Password mismatch");
      return res.status(400).send({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, email },
      "jwtPrivateKey"
    );
    
    console.log("Auth successful, token generated");
    res.send(token);
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).send({ error: "Internal server error." });
  }
});

module.exports = router;
