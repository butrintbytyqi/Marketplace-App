const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const usersStore = require("../store/users");
const validateWith = require("../middleware/validation");

const schema = {
  name: Joi.string().required().min(2).messages({
    'string.min': 'Name must be at least 2 characters long',
    'any.required': 'Name is required'
  }),
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
    const { name, email, password } = req.body;
    console.log("Registration attempt:", { name, email, password: "***" });

    if (usersStore.getUserByEmail(email)) {
      console.log("Registration failed: Email already exists");
      return res
        .status(400)
        .send({ error: "A user with the given email already exists." });
    }

    const user = { name, email, password };
    usersStore.addUser(user);
    console.log("User registered successfully:", { id: user.id, name, email });

    const token = jwt.sign(
      { userId: user.id, name: user.name, email },
      "jwtPrivateKey"
    );
    
    console.log("Registration successful, token generated");
    res.status(201).send(token);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ error: "Could not register the user." });
  }
});

router.get("/", (req, res) => {
  const users = usersStore.getUsers().map(user => ({
    id: user.id,
    name: user.name,
    email: user.email
  }));
  res.send(users);
});

module.exports = router;
