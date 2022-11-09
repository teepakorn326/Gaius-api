const AppError = require("../utils/appError");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY || "private key", {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });

exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      confirmPassword,
      profileImage,
    } = req.body;

    if (!firstName && !lastName) {
      throw new AppError("first name or last name is required", 400);
    }
    if (!password) {
      throw new AppError("password is required", 400);
    }
    if (password !== confirmPassword) {
      throw new AppError("password and confirm password is not match", 400);
    }
    const isEmail = validator.isEmail(email + "");
    const isMobile = validator.isMobilePhone(mobile + "");

    if (!isEmail && !isMobile) {
      throw new AppError(
        "email address or mobile is fucking invalid format",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(User);
    const user = await User.create({
      firstName,
      lastName,
      email: isEmail ? email : null,
      mobile: isMobile ? mobile : null,
      password: hashedPassword,
      profileImage,
    });

    const token = genToken({
      id: user.id,
    });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      throw new AppError("email address or mobile or password is invalid", 400);
    }

    const user = await User.findOne({ where: { email: email } });
    console.log(user);
    if (!user) {
      throw new AppError("email address or password is invalid", 400);
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      throw new AppError("email address or password is invalid", 400);
    }
    const token = genToken({
      id: user.id,
    });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getme = (req, res) => {
  res.status(200).json({ user: req.user });
};
