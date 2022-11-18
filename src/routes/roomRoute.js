const express = require("express");
const authenticate = require("../middleware/authenticate");

const upload = require("../middleware/upload");
const roomController = require("../controllers/roomController");

const router = express.Router();

router.post(
  "/addroom",
  authenticate,
  upload.fields([{ name: "estatePhoto", maxCount: 10 }]),
  roomController.createRoom
);
router.post(
  "/appointment/:estateId",
  authenticate,

  roomController.appointment
);

router.patch(
  "/updateroom/:id",
  authenticate,
  upload.fields([{ name: "estatePhoto", maxCount: 10 }]),
  roomController.updateRoom
);

router.delete("/deleteroom/:id", authenticate, roomController.deleteRoom);
router.delete("/deletephoto/:id", authenticate, roomController.deletePhoto);
router.get("/getroom/:id", authenticate, roomController.getRoom);
router.get("/getallroom", authenticate, roomController.getAllRoom);

module.exports = router;
