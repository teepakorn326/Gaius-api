const AppError = require("../utils/appError");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const { Estate, Photo, Booking, User } = require("../models");
const { Op } = require("sequelize");

exports.appointment = async (req, res, next) => {
  try {
    const { appointmentDate, startDate, endDate, ownerId } = req.body;
    const { estateId } = req.params;
    const newAppointment = await Booking.create({
      appointmentDate,
      startDate,
      endDate,
      renterId: req.user.id,
      ownerId,
      estateId,
    });

    const { id } = req.user;
    const newMyBooking = await Booking.findOne({
      where: {
        [Op.or]: [
          { ownerId: newAppointment.ownerId },
          { renterId: newAppointment.renterId },
        ],
      },
      include: [
        { model: User, as: "Owner" },
        { model: User, as: "Renter" },
        { model: Estate, as: "Estate", include: { model: Photo } },
      ],
    });

    if (!newMyBooking) {
      throw new AppError("there is no booking", 400);
    }

    res.status(201).json({ newMyBooking });
  } catch (err) {
    console.log("error", err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const {
      projectName,
      rentalPrice,
      depositPrice,
      advancePayment,
      type,
      size,
      unitType,
      floor,
      building,
      province,
      district,
      subDistrict,
      postCode,
      mapUrl,
      plusCode,

      description,
    } = req.body;

    if (!projectName) {
      throw new AppError("Project name is required", 400);
    }
    if (!rentalPrice && !depositPrice && !advancePayment) {
      throw new AppError("price detail is not complete", 400);
    }
    if (!type && !size && !unitType) {
      throw new AppError("Room detail is not complete", 400);
    }
    if (
      !province &&
      !district &&
      !subDistrict &&
      !postCode &&
      !mapUrl &&
      !plusCode
    ) {
      throw new AppError("Address detail is not complete", 400);
    }

    if (!req.files) {
      throw new AppError("input estate photo", 400);
    }

    if (!description) {
      throw new AppError("Description is  require", 400);
    }

    const newEstate = await Estate.create({
      projectName,
      rentalPrice,
      depositPrice,
      advancePayment,
      type,
      size,
      unitType,
      floor,
      building,
      province,
      district,
      subDistrict,
      postCode,
      mapUrl,
      plusCode,
      ownerId: req.user.id,
      description,
    });
    // LOOP for every Picture
    if (!req.files.estatePhoto.length) {
      throw new AppError("input photo is  require", 400);
    }

    for (let i = 0; i < req.files.estatePhoto.length; i++) {
      estatePhoto = await cloudinary.upload(req.files.estatePhoto[i].path);
      await Photo.create({ photoUrl: estatePhoto, estateId: newEstate.id });
      console.log("****************************");
      console.log(estatePhoto);
    }
    // END
    res.status(201).json({ message: "create  room successfully" });
  } catch (err) {
    next(err);
  } finally {
    if (req.files) {
      console.log(req.files);
      for (let i = 0; i < req.files.estatePhoto.length; i++) {
        fs.unlinkSync(req.files.estatePhoto[i].path);
      }
    }
  }
};
exports.updateRoom = async (req, res, next) => {
  try {
    const {
      projectName,
      rentalPrice,
      depositPrice,
      advancePayment,
      type,
      size,
      unitType,
      floor,
      building,
      province,
      district,
      subDistrict,
      postCode,
      mapUrl,
      plusCode,
      renterId,
      status,
      description,
    } = req.body;
    const { id } = req.params;
    console.log(req.body);
    console.log(req.params);

    const editedRoom = {};

    if (projectName) {
      editedRoom.projectName = projectName;
    }
    if (rentalPrice) {
      editedRoom.rentalPrice = rentalPrice;
    }
    if (depositPrice) {
      editedRoom.depositPrice = depositPrice;
    }
    if (advancePayment) {
      editedRoom.advancePayment = advancePayment;
    }
    if (type) {
      editedRoom.type = type;
    }
    if (size) {
      editedRoom.size = size;
    }
    if (unitType) {
      editedRoom.unitType = unitType;
    }
    if (floor) {
      editedRoom.floor = floor;
    }
    if (building) {
      editedRoom.building = building;
    }
    if (province) {
      editedRoom.province = province;
    }
    if (district) {
      editedRoom.district = district;
    }
    if (subDistrict) {
      editedRoom.subDistrict = subDistrict;
    }
    if (postCode) {
      editedRoom.postCode = postCode;
    }
    if (mapUrl) {
      editedRoom.mapUrl = mapUrl;
    }
    if (plusCode) {
      editedRoom.plusCode = plusCode;
    }
    if (description) {
      editedRoom.description = description;
    }
    const newEstate = await Estate.update(
      {
        projectName,
        rentalPrice,
        depositPrice,
        advancePayment,
        type,
        size,
        unitType,
        floor,
        renterId,
        status,
        building,
        province,
        district,
        subDistrict,
        postCode,
        mapUrl,
        plusCode,
        ownerId: req.user.id,
        description,
      },
      { where: { id: id } }
    );
    if (req.files && req.files.estatePhoto) {
      for (let i = 0; i < req.files.estatePhoto.length; i++) {
        estatePhoto = await cloudinary.upload(req.files.estatePhoto[i].path);
        await Photo.create({ photoUrl: estatePhoto, estateId: id });
        console.log("****************************");
        console.log(estatePhoto);
      }
    }
    res.status(201).json({ message: "update  room successfully" });
  } catch (err) {
    next(err);
  } finally {
    if (req.files && req.files.estatePhoto) {
      for (let i = 0; i < req.files.estatePhoto.length; i++) {
        fs.unlinkSync(req.files.estatePhoto[i].path);
      }
    }
  }
};
exports.deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const estate = await Estate.findOne({ where: { id } });
    if (!estate) {
      throw new AppError("estate data is undefined", 400);
    }
    // const allPhoto = await Photo.findAll({ where: { id: { estateId: id } } });
    // if (!allPhoto) {
    //   throw new AppError("photo is  undefined", 400);
    // }
    // await allPhoto.destroy();
    await estate.destroy();
    res.status(201).json({ message: "delete  room successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;

    const selectedPhoto = await Photo.findOne({ where: { id } });
    console.log("selectedPhoto", selectedPhoto);
    // const allEstate = await Photo.findAll({
    //   where: { estateId: selectedPhoto.estateId },
    // });
    await selectedPhoto.destroy();
    res.status(201).json({ message: "delete  photo successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Estate.findOne({
      where: { id },
      include: [
        { model: User, as: "Owner" },
        { model: User, as: "Renter" },
        { model: Photo },
        { model: Booking },
      ],
    });
    console.log(room);
    res.status(201).json({ message: "get room successfully", room });
  } catch (err) {
    next(err);
  }
};
exports.getAllRoom = async (req, res, next) => {
  try {
    const query = req.query;

    const searchQuery = {};
    if (query) {
      const value = query?.price && query.price?.toString().split("-");
      if (query.price) {
        searchQuery.rentalPrice = {
          [Op.and]: { [Op.gte]: +value[0], [Op.lte]: +value[1] },
        };
      }
    }

    const room = await Estate.findAll({
      where: {
        ownerId: { [Op.ne]: req.user.id },
        ...searchQuery,
      },
      include: [{ model: Photo }, { model: Booking }],
    });
    res.status(201).json({ message: "get all room successfully", room });
  } catch (err) {
    next(err);
  }
};
exports.getAllOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Estate.findOne({
      where: { id },
      include: [
        { model: User, as: "Owner" },
        { model: User, as: "Renter" },
        { model: Photo },
        { model: Booking },
      ],
    });
    console.log(room);
    res.status(201).json({ message: "get room successfully", room });
  } catch (err) {
    next(err);
  }
};
