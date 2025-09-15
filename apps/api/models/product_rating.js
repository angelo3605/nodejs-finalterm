'use strict';
module.exports = (sequelize, DataTypes) => {
    const ProductRating = sequelize.define('ProductRating', {
        rating_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.STRING(6),
            allowNull: false
        },
        user_id: {
            type: DataTypes.STRING(6),
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max: 5 }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'product_ratings',
        timestamps: false
    });

    return ProductRating;
};
