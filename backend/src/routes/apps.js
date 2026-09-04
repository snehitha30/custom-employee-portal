const express = require("express");
const db = require("../database/database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

const applications = {
    VIEW_PEOPLE: {
        name: "Zoho People",
        description: "HR Management",
        url: "https://www.zoho.com/people/"
    },
    VIEW_CRM: {
        name: "Zoho CRM",
        description: "Customer Relationship Management",
        url: "https://www.zoho.com/crm/"
    },
    VIEW_DESK: {
        name: "Zoho Desk",
        description: "Customer Support",
        url: "https://www.zoho.com/desk/"
    },
    VIEW_BOOKS: {
        name: "Zoho Books",
        description: "Accounting & Finance",
        url: "https://www.zoho.com/books/"
    }
};

router.get("/", authenticateToken, (req, res) => {
    const permissions = db.prepare(`
        SELECT p.name
        FROM Permissions p
        JOIN RolePermissions rp ON p.id = rp.permission_id
        JOIN Roles r ON r.id = rp.role_id
        JOIN UserRoles ur ON r.id = ur.role_id
        WHERE ur.user_id = ?
    `).all(req.user.id);

    const authorizedApps = permissions
        .map(permission => applications[permission.name])
        .filter(Boolean);

    db.prepare(`
        INSERT INTO AuditLogs (user_id, action, details)
        VALUES (?, ?, ?)
    `).run(
        req.user.id,
        "VIEW_APPS",
        `Viewed authorized applications for ${req.user.role} role`
    );

    res.json({
        role: req.user.role,
        applications: authorizedApps
    });
});
const { zohoRequest } = require("../services/zohoService");

router.get("/zoho/people", authenticateToken, async (req, res) => {
    if (req.user.role !== "HR" && req.user.role !== "Admin") {
        return res.status(403).json({
            message: "Zoho People access denied"
        });
    }

    try {
        const data = await zohoRequest(
            "https://people.zoho.in/api/forms/P_EmployeeView/records?viewName=P_EmployeeView"
        );

        db.prepare(`
            INSERT INTO AuditLogs (user_id, action, details)
            VALUES (?, ?, ?)
        `).run(
            req.user.id,
            "ZOHO_PEOPLE_ACCESS",
            "Accessed Zoho People API"
        );

        res.json(data);
    } catch (error) {
        console.error("Zoho People API error:", error.response?.data || error.message);

        res.status(500).json({
            message: "Unable to access Zoho People API",
            error: error.response?.data || error.message
        });
    }
});
module.exports = router;