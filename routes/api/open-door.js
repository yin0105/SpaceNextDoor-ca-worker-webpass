const cache = require("./../../includes/cache/main");
const Joi = require("joi");
const openDoor = require("../../includes/functions/open-door");

const schema = Joi.object({
  provider_id: Joi.string().min(3).max(64).required(),
  door_id: Joi.string().min(1).max(64).required(),
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
      message: "missing provider_id, registrationKey or door_id",
    });
  } else {
    if (cache.initialized) {
      if (cache.registerKey == body.registrationKey) {
        openDoor(body.provider_id, body.door_id)
          .then((doorState) => {
            if (doorState) {
              res.status(200).json({
                status: "success",
                message: "request completed succesfully",
              });
            } else {
              res.status(200).json({
                status: "failed",
                message: "failed to open the door",
              });
            }
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
