const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/database");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "employee_portal_secret";

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const user = db.prepare(`
        SELECT 
            u.id,
            u.name,
            u.email,
            u.password,
            r.name AS role
        FROM Users u
        JOIN UserRoles ur ON u.id = ur.user_id
        JOIN Roles r ON ur.role_id = r.id
        WHERE u.email = ?
    `).get(email);

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: "2h" }
    );

    // Audit login
    db.prepare(`
        INSERT INTO AuditLogs (user_id, action, details)
        VALUES (?, ?, ?)
    `).run(user.id, "LOGIN", "User logged into employee portal");

    res.json({
        message: "Login successful",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

module.exports = router;