'use strict';

const generateId = require("../utils/generateId");

module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        payment_id: {
            type: DataTypes.STRING(6),
            primaryKey: true,
            defaultValue: () => generateId()
        },
        order_id: {
            type: DataTypes.STRING(6),
            allowNull: false
        },
        payment_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        amount_paid: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        payment_status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed'),
            allowNull: false
        },
        payment_method: {
            type: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer'),
            allowNull: false
        }
    }, {
        tableName: 'payments',
        timestamps: false
    });

    return Payment;
};
