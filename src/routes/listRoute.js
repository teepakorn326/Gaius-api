const express = require("express");
const authenticate = require("../middleware/authenticate");
const mylistController = require("../controllers/mylistController");

const router = express.Router();

router.get("/", authenticate, mylistController.mylist);
router.get("/notification", authenticate, mylistController.allBookingList);
router.delete(
  "/notification/:id",
  authenticate,
  mylistController.deleteBooking
);

module.exports = router;
