import { validateRoute } from "@lib/validateRoute";
import cookie from "cookie";


export default validateRoute((req, res, user) => {
  if(req.method === "POST" && req.cookies[process.env["JWT_TOKEN_NAME"] as string]){
    res.setHeader(
      "Set-Cookie",
      cookie.serialize(process.env.JWT_TOKEN_NAME as unknown as string, '', {
        httpOnly: true,
        maxAge: 8 * 60 * 60,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    );
  }
   
    res.status(401).json({message: "You were never logged in..."})
})