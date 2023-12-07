import { Router } from "express";
import { TokenBlackList, User } from "..";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { DecodeToken, checkToken } from "../middlewares/checkToken";

export const authRouter = Router();

authRouter.post("/local/register", async (req, res) => {
    const { username, password, email } = req.body;
    const userWithEmail = await User.findOne({ where: { email } });
    if (userWithEmail) {
        res.status(400).send("Email already exists");
    }
    else {
        console.log('salt', process.env.SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS!));
        const newUser = await User.create({ username, password: hashedPassword, email });
        delete newUser.dataValues.password;
        res.send(newUser);
    }
});

authRouter.post("/local", async (req, res) => {
    const { identifier, password } = req.body;
    const userWithEmail = await User.findOne({ where: { email: identifier } });
    if (!userWithEmail) {
        res.status(400).send("Email does not exist");
    }
    else {
        const isPasswordCorrect = await bcrypt.compare(password, userWithEmail.dataValues.password);
        if (isPasswordCorrect) {
            delete userWithEmail.dataValues.password;
            const token = jwt.sign(userWithEmail.dataValues, process.env.JWT_SECRET!);
            res.send({
                token,
                ...userWithEmail.dataValues
            });
        }
        else {
            res.status(400).send("Password is incorrect");
        }
    }
})

authRouter.post("/change-password", checkToken, async (req, res) => {
    const { currentPassword, passwordConfirmation, password } = req.body;
    if (passwordConfirmation !== password) {
        res.status(400).send("New passwords do not match");
    }
    else if(passwordConfirmation.length < 8){
        res.status(400).send("New password must be at least 8 characters long")
    }
    else {
        const decoded = jwt.decode(req.token!) as DecodeToken
        const user = await User.findOne({ where: { id: decoded.id } });
        if (user) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.dataValues.password);
            if (isPasswordCorrect) {
                const hashedPassword = await bcrypt.hash(passwordConfirmation, parseInt(process.env.SALT_ROUNDS!));
                await User.update({ password: hashedPassword }, { where: { id: decoded.id } });
                res.send("Password changed");
            }
            else {
                res.status(400).send("Current password is incorrect");
            }
        }
        else {
            res.status(404).send("User not found");
        }
    }
})

authRouter.post("/logout", checkToken, async (req, res) => {
    const decoded = jwt.decode(req.token!) as DecodeToken
    const user = await User.findOne({ where: { id: decoded.id } });
    if (user) {
        await TokenBlackList.create({ token: req.token });
        res.send("Logged out");
    }
    else {
        res.status(404).send("User not found");
    }
})