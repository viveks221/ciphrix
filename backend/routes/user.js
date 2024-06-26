// src/routes/userRoutes.js
const express = require("express");
const { getNearbyFriends } = require("../controllers/userMatching");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/nearby-friends", auth, getNearbyFriends);

module.exports = router;
