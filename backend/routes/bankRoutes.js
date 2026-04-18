const express = require("express");
const router = express.Router();
const {
    getBanks,
    createBank,
    updateBank,
    deleteBank,
} = require("../controllers/bankController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getBanks);
router.post("/", protect, adminOnly, createBank);
router.put("/:id", protect, adminOnly, updateBank);
router.delete("/:id", protect, adminOnly, deleteBank);

module.exports = router;
