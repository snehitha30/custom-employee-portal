const bcrypt = require("bcryptjs");
const db = require("./database");

const users = [
    {
        name: "Admin User",
        email: "admin@company.com",
        password: "Admin@123",
        role: "Admin"
    },
    {
        name: "HR User",
        email: "hr@company.com",
        password: "HR@123",
        role: "HR"
    },
    {
        name: "Sales User",
        email: "sales@company.com",
        password: "Sales@123",
        role: "Sales"
    },
    {
        name: "Support User",
        email: "support@company.com",
        password: "Support@123",
        role: "Support"
    },
    {
        name: "Finance User",
        email: "finance@company.com",
        password: "Finance@123",
        role: "Finance"
    }
];

const insertUser = db.prepare(`
    INSERT OR IGNORE INTO Users (name, email, password)
    VALUES (?, ?, ?)
`);

const getRole = db.prepare(`
    SELECT id FROM Roles WHERE name = ?
`);

const assignRole = db.prepare(`
    INSERT OR IGNORE INTO UserRoles (user_id, role_id)
    VALUES (?, ?)
`);

for (const user of users) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);

    insertUser.run(
        user.name,
        user.email,
        hashedPassword
    );

    const savedUser = db.prepare(
        "SELECT id FROM Users WHERE email = ?"
    ).get(user.email);

    const role = getRole.get(user.role);

    if (savedUser && role) {
        assignRole.run(savedUser.id, role.id);
    }
}

console.log("Demo users created successfully.");

db.close();