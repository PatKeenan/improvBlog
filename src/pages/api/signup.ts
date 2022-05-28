import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib-server/prisma";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookie from 'cookie';
import { env } from "process";
import { User } from "@prisma/client";

type ReturnedUser = Omit<User, "password"|"createdAt">
export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const salt = bcrypt.genSaltSync();
    const {email, password, username} = req.body;

    let user;

    try {
        user = await prisma.user.create({
            data: {
                email, 
                password: bcrypt.hashSync(password, salt),
                username
            }
        });
        
    } catch (error) {
        res.status(401).json({error});
        return
    }
    const token = jwt.sign({
        email: user.email,
        id: user.id,
        username: username,
        time: Date.now()
    }, env.JWT_SECRET as unknown as string, 
    {expiresIn: '8h'});

    res.setHeader(
        'Set-Cookie',
        cookie.serialize(env.IMPROV_APP_ACCESS_TOKEN as unknown as string, token, {
            httpOnly: true,
            maxAge: 8 * 60 * 60,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === "production" 
        })
    );
    const userToReturn: ReturnedUser = {email: user.email, id: user.id, role: user.role, user_uuid: user.user_uuid, username: user.username};
    res.json(userToReturn);
}