const cache = require("./../../includes/cache/main");
const Joi = require("joi");

const schema = Joi.object({
  registration_key: Joi.string().min(8).max(64).required(),
});

const exportFunction = (req, res, next) => {
  const { body } = req;
  const result = schema.validate(body);
  const { value, error } = result;
  const valid = error == null;
  if (!valid) {
    res.status(200).json({
      status: "failed",
      message: "missing registration key",
    });
  } else {
    if (cache.initialized) {
      if (cache.registerKey == body.registration_key) {
        res.status(200).json({
          status: "success",
          message: "server is running",
        });
      } else {
        res.status(200).json({
          status: "failed",
          message: "invalid registration key",
        });
      }
    } else {
      res.status(200).json({
        status: "failed",
        message: "server is still starting up",
      });
    }
  }
};

module.exports = exportFunction;
