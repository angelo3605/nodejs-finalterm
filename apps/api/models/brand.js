'use strict';
module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('Brand', {
        brand_slug: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true
        },
        brand_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'brands',
        timestamps: false
    });

    return Brand;
};
