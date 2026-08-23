const express = require("express");
const { CityController } = require("../../controllers");
const { CityMiddleware } = require("../../middlewares");
const router = express.Router();

router.post(
  "/",
  CityMiddleware.validateCreateRequest,
  CityController.createCity,
);
router.delete("/:id", CityController.destroyCity);
module.exports = router;
