import { DataTypes, Sequelize } from "sequelize";

export const MovieModel = (sequelize: Sequelize) => {
    return sequelize.define('movie', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        date: DataTypes.DATE,
        director: DataTypes.STRING
    });
}