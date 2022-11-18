const AppError = require("../utils/appError");
const { Estate, Photo, Booking, User } = require("../models");
const db = require("../models");
const { Op } = require("sequelize");

exports.mylist = async (req, res, next) => {
  try {
    const { id } = req.user;
    const myEstate = await Estate.findAll({
      where: { ownerId: id },
      include: [
        {
          model: db.Photo,
        },
        {
          model: db.Booking,
        },
      ],
    });

    if (!myEstate) {
      throw new AppError("there is no estate", 400);
    }
    res.status(201).json({ myEstate });
  } catch (err) {
    next(err);
  }
};
exports.allBookingList = async (req, res, next) => {
  try {
    const { id } = req.user;
    const myBooking = await Booking.findAll({
      where: { [Op.or]: [{ ownerId: id }, { renterId: id }] },
      include: [
        { model: User, as: "Owner" },
        { model: User, as: "Renter" },
        { model: Estate, as: "Estate", include: { model: Photo } },
      ],
    });

    if (!myBooking) {
      throw new AppError("there is no booking", 400);
    }
    res.status(201).json({ myBooking });
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const selectedBooking = await Booking.findOne({ where: { id } });

    // const allEstate = await Booking.findAll({
    //   where: { estateId: selectedBooking.estateId },
    // });
    await selectedBooking.destroy();
    res.status(201).json({ message: "delete  order successfully" });
  } catch (err) {
    next(err);
  }
};
