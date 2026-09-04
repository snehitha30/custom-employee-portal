const db = require("./database");

const permissions = [
    {
        name: "VIEW_PEOPLE",
        description: "Access Zoho People"
    },
    {
        name: "VIEW_CRM",
        description: "Access Zoho CRM"
    },
    {
        name: "VIEW_DESK",
        description: "Access Zoho Desk"
    },
    {
        name: "VIEW_BOOKS",
        description: "Access Zoho Books"
    }
];

const insertPermission = db.prepare(`
    INSERT OR IGNORE INTO Permissions (name, description)
    VALUES (?, ?)
`);

for (const permission of permissions) {
    insertPermission.run(
        permission.name,
        permission.description
    );
}

const rolePermissions = {
    Admin: [
        "VIEW_PEOPLE",
        "VIEW_CRM",
        "VIEW_DESK",
        "VIEW_BOOKS"
    ],
    HR: [
        "VIEW_PEOPLE"
    ],
    Sales: [
        "VIEW_CRM"
    ],
    Support: [
        "VIEW_DESK"
    ],
    Finance: [
        "VIEW_BOOKS"
    ]
};

for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
    const role = db
        .prepare("SELECT id FROM Roles WHERE name = ?")
        .get(roleName);

    if (!role) continue;

    for (const permissionName of permissionNames) {
        const permission = db
            .prepare("SELECT id FROM Permissions WHERE name = ?")
            .get(permissionName);

        if (permission) {
            db.prepare(`
                INSERT OR IGNORE INTO RolePermissions
                (role_id, permission_id)
                VALUES (?, ?)
            `).run(role.id, permission.id);
        }
    }
}

console.log("Permissions and role permissions created successfully.");

db.close();