const { pool } = require("../config/database");
const transporter = require("../config/email");

// CREATE MESSAGE
const createMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                message: "Name, email and message are required"
            });
        }

        // Clean input
        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanMessage = message.trim();

        // Empty fields
        if (!cleanName || !cleanEmail || !cleanMessage) {
            return res.status(400).json({
                message: "Fields cannot be empty"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        // Name validation
        if (cleanName.length < 2 || cleanName.length > 100) {
            return res.status(400).json({
                message: "Name must be between 2 and 100 characters"
            });
        }

        // Message validation
        if (cleanMessage.length < 5 || cleanMessage.length > 2000) {
            return res.status(400).json({
                message: "Message must be between 5 and 2000 characters"
            });
        }

        // Save message to MySQL
        const sql = `
            INSERT INTO messages (name, email, message)
            VALUES (?, ?, ?)
        `;

        const [result] = await pool.execute(sql, [
            cleanName,
            cleanEmail,
            cleanMessage
        ]);

        console.log("Message saved to database");

        // ==========================================
        // SEND EMAIL NOTIFICATION
        // ==========================================

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,

                subject: "New Portfolio Contact Message",

                text: `
You received a new message from your portfolio.

Name: ${cleanName}

Email: ${cleanEmail}

Message:
${cleanMessage}
                `,

                html: `
                    <h2>New Portfolio Contact Message</h2>

                    <p>
                        <strong>Name:</strong> ${cleanName}
                    </p>

                    <p>
                        <strong>Email:</strong> ${cleanEmail}
                    </p>

                    <p>
                        <strong>Message:</strong>
                    </p>

                    <p>${cleanMessage}</p>

                    <hr>

                    <p>
                        This message was sent from your portfolio website.
                    </p>
                `
            });

            console.log("Email notification sent successfully");

        } catch (emailError) {
            console.error("Email notification failed:");
            console.error(emailError.message);
        }

        // ==========================================
        // SEND SUCCESS RESPONSE
        // ==========================================

        res.status(201).json({
            message: "Message sent successfully",
            id: result.insertId
        });

    } catch (error) {
        console.error("Error saving message:");
        console.error(error);

        res.status(500).json({
            message: "Failed to save message"
        });
    }
};


// GET ALL MESSAGES
const getMessages = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM messages ORDER BY created_at DESC"
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error("Error fetching messages:");
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch messages"
        });
    }
};

// GET UNREAD MESSAGE COUNT
const getUnreadCount = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT COUNT(*) AS unreadCount FROM messages WHERE is_read = FALSE"
        );

        res.status(200).json({
            unreadCount: rows[0].unreadCount
        });

    } catch (error) {
        console.error("Error getting unread message count:");
        console.error(error);

        res.status(500).json({
            message: "Failed to get unread message count"
        });
    }
};


// MARK MESSAGE AS READ
const markMessageAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            "UPDATE messages SET is_read = TRUE WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        res.status(200).json({
            message: "Message marked as read"
        });

    } catch (error) {
        console.error("Error marking message as read:");
        console.error(error);

        res.status(500).json({
            message: "Failed to mark message as read"
        });
    }
};

// DELETE MESSAGE
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            "DELETE FROM messages WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        res.status(200).json({
            message: "Message deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting message:");
        console.error(error);

        res.status(500).json({
            message: "Failed to delete message"
        });
    }
};


module.exports = {
    createMessage,
    getMessages,
    getUnreadCount,
    markMessageAsRead,
    deleteMessage
};