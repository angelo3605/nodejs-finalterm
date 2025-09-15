'use strict';

const generateId = require("../utils/generateId");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: STRING(6),
            primaryKey: true,
            defaultValue: () => generateId()
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('admin', 'customer'),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        loyalty_points: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'users',
        timestamps: false
    });

    return User;
};
