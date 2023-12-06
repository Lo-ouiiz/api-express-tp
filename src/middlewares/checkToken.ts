import "dotenv/config";
import jwt from "jsonwebtoken";
import {Request, Response, NextFunction } from 'express';

export interface DecodeToken {
    id: number;
    username: string;
    email: string;
    iat: number;
    exp: number;
}

export function checkToken(req: Request, res: Response, next: NextFunction) {
    const fullToken = req.headers.authorization;
    if (!fullToken) {
        res.status(401).send("No token provided");
    }
    else {
        const token = fullToken.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        console.log(decoded);
        if (decoded) {
            req.token = token;
            next();
        }
        else {
            res.status(401).send("Invalid token");
        }
    }
}