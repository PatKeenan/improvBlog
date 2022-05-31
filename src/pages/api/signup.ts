import type { NextApiRequest, NextApiResponse } from "next";
import type { MakeOptional } from "@lib/ts-utilities";
import type { User } from "@prisma/client";
import prisma from "@lib/prisma";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookie from 'cookie';

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
    } catch (error: any) {
         res.status(401).json({error: {
             field: error.meta.target[0] ?? null,
             message: error.meta.target[0] ? `${error.meta.target[0]} is already being used.` : 'Something went wrong'
        }});
        return
    }
    const token = jwt.sign({
        email: user.email,
        id: user.id,
        username: username,
        time: Date.now()
    }, process.env.JWT_SECRET as unknown as string, 
    {expiresIn: '8h'});

    res.setHeader(
        'Set-Cookie',
        cookie.serialize(process.env.JWT_TOKEN_NAME as unknown as string, token, {
            httpOnly: true,
            maxAge: 10 * 60 * 60,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === "production" 
        })
    );
    
    const userToReturn: MakeOptional<User, "password"> = {...user};
    delete userToReturn["password"]
    res.json(userToReturn);
}

