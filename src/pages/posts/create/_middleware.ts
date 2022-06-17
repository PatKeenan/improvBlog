import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest){
    const newUrl = req.nextUrl.clone()
    newUrl.pathname = '/signin'
    const token = req.cookies["next-auth.session-token"]
    if(!token){
        return NextResponse.redirect(newUrl)
    }
}