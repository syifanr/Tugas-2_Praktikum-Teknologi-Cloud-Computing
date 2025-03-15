import { Sequelize } from "sequelize";

const db = new Sequelize("notes", "root", "", {
    host: "35.239.47.213",
    dialect: "mysql"
})

export default db;
