'use strict';
module.exports = (sequelize, DataTypes) => {
    const ProductComment = sequelize.define('ProductComment', {
        comment_id: {
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
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'product_comments',
        timestamps: false
    });

    return ProductComment;
};
