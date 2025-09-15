'use strict';
module.exports = (sequelize, DataTypes) => {
    const DiscountCode = sequelize.define('DiscountCode', {
        discount_code_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: DataTypes.STRING(5),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        discount_type: {
            type: DataTypes.ENUM('percentage', 'fixed'),
            allowNull: false
        },
        discount_value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        usage_limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10
        },
        times_used: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false
        }
    }, {
        tableName: 'discount_codes',
        timestamps: false
    });

    return DiscountCode;
};
