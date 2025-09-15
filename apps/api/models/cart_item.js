'use strict';
module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
        cart_id: {
            type: DataTypes.INTEGER,
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
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'cart_items',
        timestamps: false
    });

    return CartItem;
};
