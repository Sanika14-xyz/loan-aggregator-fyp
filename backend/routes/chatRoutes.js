const express = require("express");
const router = express.Router();
const { handleChatQuery } = require("../controllers/chatController");

// This route does not need 'protect' middleware because anyone on the landing page can chat!
router.post("/", handleChatQuery);

module.exports = router;