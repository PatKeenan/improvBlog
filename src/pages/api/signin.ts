import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "@lib/prisma";
import { env } from "process";
import { User } from "@prisma/client";
import { MakeOptional } from "@lib/ts-utilities";

type ReturnedUser = Omit<User, "password"|"createdAt">

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401);
    res.json({ error: "wrong credentials" });
  }
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        email: email
      },
    });
  } catch (error) {
    res.status(401);
    return res.status(400).json({ error: "wrong credentials" });
  }
  
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        time: Date.now(),
      },
      process.env.JWT_SECRET as unknown as string,
      {
        expiresIn: "8h",
      }
    );
    res.setHeader(
      "Set-Cookie",
      cookie.serialize(env.JWT_TOKEN_NAME as unknown as string, token, {
        httpOnly: true,
        maxAge: 8 * 60 * 60,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    );
    const userToReturn: MakeOptional<User, "password"> = {...user};
    delete userToReturn["password"]
  }else{
    return res.status(401).json({error: true})
  }
  
}
