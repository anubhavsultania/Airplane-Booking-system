const { StatusCodes } = require("http-status-codes");
const { AirplaneService } = require("../services");
const { response } = require("express");

async function createAirplane(req, res) {
  try {
    console.log(req.body);
    const airplane = await AirplaneService.createAirplane({
      modelNumber: req.body.modelNumber,
      capacity: req.body.capacity,
    });
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfuly create an airplane",
      data: airplane,
      error: {},
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while creating airplane",
      data: {},
      error: error,
    });
  }
}

module.exports = { createAirplane };
