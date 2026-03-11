const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const { getRenewals } = require("../controllers/renewalController");

router.get("/", authMiddleware, getRenewals);

module.exports = router;