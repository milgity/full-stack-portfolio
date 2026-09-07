const express = require("express");

const {
    createMessage,
    getMessages,
    getUnreadCount,
    markMessageAsRead,
    deleteMessage
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public route
router.post("/", createMessage);

// Protected routes
router.get("/", protect, getMessages);

router.get("/unread-count", protect, getUnreadCount);

router.patch("/:id/read", protect, markMessageAsRead);

router.delete("/:id", protect, deleteMessage);

module.exports = router;