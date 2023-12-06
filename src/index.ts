import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Sequelize, DataTypes} from "sequelize";
import { authRouter } from "./router/auth";

import { OfficialGameModel } from "./model/OfficialGame";
import { FreeGameModel } from "./model/FreeGame";
import { UserModel} from "./model/User";
import { officialGameRouter } from "./router/officialGame";
import { freeGameRouter } from "./router/freeGame";
import { userRouter } from "./router/users";

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite'
});

export const OfficialGame = OfficialGameModel(sequelize);
export const FreeGame = FreeGameModel(sequelize);
export const User = UserModel(sequelize);

sequelize.sync();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/official-games', officialGameRouter );
apiRouter.use('/free-games', freeGameRouter);
apiRouter.use('/users', userRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
