import { DataTypes, Sequelize } from "sequelize";

export const ActorModel = (sequelize: Sequelize) => {
    return sequelize.define('actor', {
        name: DataTypes.STRING
    });
}