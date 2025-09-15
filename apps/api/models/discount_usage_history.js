'use strict';
module.exports = (sequelize, DataTypes) => {
    const DiscountUsageHistory = sequelize.define('DiscountUsageHistory', {
        usage_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        discount_code_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.STRING(6),
            allowNull: false
        },
        order_id: {
            type: DataTypes.STRING(6),
            allowNull: false
        },
        used_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'discount_usage_history',
        timestamps: false
    });

    return DiscountUsageHistory;
};
