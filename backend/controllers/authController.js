const { pool } = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Check if admin already exists
        const [existingAdmin] = await pool.execute(
            "SELECT id FROM admins WHERE email = ?",
            [email]
        );

        if (existingAdmin.length > 0) {
            return res.status(409).json({
                message: "Admin already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save admin
        const [result] = await pool.execute(
            `INSERT INTO admins (name, email, password)
             VALUES (?, ?, ?)`,
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: "Admin registered successfully",
            adminId: result.insertId
        });

    } catch (error) {
        console.error("Admin registration error:", error);

        res.status(500).json({
            message: "Failed to register admin"
        });
    }
};


const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find admin
        const [admins] = await pool.execute(
            "SELECT * FROM admins WHERE email = ?",
            [email]
        );

        if (admins.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const admin = admins[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error("Admin login error:", error);

        res.status(500).json({
            message: "Login failed"
        });
    }
};


module.exports = {
    registerAdmin,
    loginAdmin
};