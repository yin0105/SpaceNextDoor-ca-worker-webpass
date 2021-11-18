const cache = require("./../../includes/cache/main");
const Joi = require("joi");
const checkDoorStatus = require("../../includes/functions/status-door");

const schema = Joi.object({
  provider_id: Joi.string().min(3).max(32).required(),
  door_id: Joi.string().min(1).max(32).required(),
  registrationKey: Joi.string(),
});

const exportFunction = (req, res, next) => {
  const { body } = req;
  const result = schema.validate(body);
  const { value, error } = result;
  const valid = error == null;
  if (!valid) {
    res.status(200).json({
      status: "failed",
      message: "missing provider_id or door_id",
    });
  } else {
    if (cache.initialized) {
      if (cache.registerKey == body.registrationKey) {
        checkDoorStatus(body.provider_id, body.door_id)
          .then((status) => {
            res.status(200).json({
              status: "success",
              message: "request completed succesfully",
              door_status: status,
            });
          })
          .catch((error) => {
            res.status(200).json({
              status: "failed",
              message: "failed to execute door opening",
            });
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
