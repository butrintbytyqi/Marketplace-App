const Joi = require("joi");

module.exports = (schema) => (req, res, next) => {
  if (!schema) {
    console.error('No schema provided to validation middleware');
    return res.status(500).send({ error: "Server configuration error" });
  }

  try {
    // Convert schema object to Joi schema
    const joiSchema = Joi.object(schema);
    const { error } = joiSchema.validate(req.body);

    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).send({ error: error.details[0].message });
    }

    next();
  } catch (err) {
    console.error('Validation middleware error:', err);
    res.status(500).send({ error: "An unexpected error occurred" });
  }
};
