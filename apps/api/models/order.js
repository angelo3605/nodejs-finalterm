'use strict';

const generateId = require("../utils/generateId");

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        order_id: {
            type: DataTypes.STRING(6),
            primaryKey: true,
            defaultValue: () => generateId()
        },
        user_id: {
            type: DataTypes.STRING(6),
            allowNull: false
        },
        order_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        total_amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
            allowNull: false
        },
        payment_method: {
            type: DataTypes.ENUM('cash_on_delivery', 'credit_card', 'paypal'),
            allowNull: false
        },
        shipping_address_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        shipping_status: {
            type: DataTypes.ENUM('not_shipped', 'shipped', 'delivered'),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        discount_code_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        loyalty_points_used: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
    }, {
        tableName: 'orders',
        timestamps: false
    });

    return Order;
};
