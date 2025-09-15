'use strict';
module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        order_id: {
            type: DataTypes.STRING(6),
            primaryKey: true
        },
        variant_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unit_price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        total_price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        }
    }, {
        tableName: 'order_items',
        timestamps: false
    });

    return OrderItem;
};
