import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "@lib/prisma";
import { env } from "process";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, username } = req.body;
 
  if (!email || !password) {
    res.status(401);
    res.json({ error: "wrong credentials" });
  }
  let user;
  if(!email){
     user = await prisma.user.findUnique({
      where: {
        email: email
      },
    });
  }else{
    user = await prisma.user.findUnique({
      where: {
        username: username
      },
    });
  }
  
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        time: Date.now(),
      },
      "test",
      {
        expiresIn: "8h",
      }
    );
    res.setHeader(
      "Set-Cookie",
      cookie.serialize(env.IMPROV_APP_ACCESS_TOKEN as unknown as string, token, {
        httpOnly: true,
        maxAge: 8 * 60 * 60,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    );
    res.json(user);
  } else {
    res.status(401);
    res.json({ error: "wrong credentials" });
  }
}
