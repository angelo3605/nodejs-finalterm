'use strict';
module.exports = (sequelize, DataTypes) => {
    const LoyaltyPointsHistory = sequelize.define('LoyaltyPointsHistory', {
        history_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.STRING(6),
            allowNull: false
        },
        order_id: {
            type: DataTypes.STRING(6),
            allowNull: false
        },
        earned_points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        spent_points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        remaining_points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'loyalty_points_history',
        timestamps: false
    });

    return LoyaltyPointsHistory;
};
