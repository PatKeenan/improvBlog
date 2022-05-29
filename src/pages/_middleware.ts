import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/users'];
const users = '^/users'
const containsProtectedRoute = new RegExp(users)

export default function middleware(req: NextRequest){
    const path =  req.nextUrl.pathname
    const newUrl = req.nextUrl.clone()
    newUrl.pathname = '/signin'
    const tokenName = process.env.JWT_TOKEN_NAME as string 
    const token = req.cookies[tokenName]
    if(containsProtectedRoute.test(path)){
        if(!token){
           return NextResponse.redirect(newUrl)
        }
    }
}