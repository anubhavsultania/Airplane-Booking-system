const CrudRepository = require("./crud-repository");
const { Sequelize } = require("sequelize");
const { Flight, Airplane, Airport, City } = require("../models");
const db = require("../models");
const { addRowLockOnFlights } = require("./queries");

class FlightRepository extends CrudRepository {
  constructor() {
    super(Flight);
  }

  async getAllFlights(filter, sort) {
    const response = await Flight.findAll({
      where: filter,
      order: sort,
      include: [
        {
          model: Airplane,
          required: true,
          as: "airplaneDetail",
        },
        {
          model: Airport,
          required: true,
          as: "departureAirport",
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.departureAirportId"),
              "=",
              Sequelize.col("departureAirport.Code"),
            ),
          },
          include: {
            model: City,
            required: true,
          },
        },
        {
          model: Airport,
          required: true,
          as: "arrivalAirport",
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.arrivalAirportId"),
              "=",
              Sequelize.col("arrivalAirport.Code"),
            ),
          },
        },
      ],
    });
    return response;
  }

  async updateRemainingSeats(flightId, seats, dec = true) {
    const transaction = await db.sequelize.transaction();
    try {
      db.sequelize.query(addRowLockOnFlights(flightId));
      const flight = await Flight.findByPk(flightId);
      if (+dec) {
        // if parseInt had been used then parseInt(true) = NaN
        // so use + opreator
        await flight.decrement(
          "totalSeats",
          { by: seats },
          { transaction: transaction },
        );
      } else {
        await flight.increment(
          "totalSeats",
          { by: seats },
          { transaction: transaction },
        );
      }
      await transaction.commit();
      return flight;
    } catch (error) {
      throw error;
      await transaction.rollback();
    }
  }
}

module.exports = FlightRepository;
