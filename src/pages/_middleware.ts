/**
 * 
 * _middleware protects the private routes from visitors without a valid jwt token. 
 * If a visitor navigates to one of the protected routes and no token is found or it is invalid, visitors will be rerouted to signin.
 * 
 **/

import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
    '/posts/create', 
    '/api/posts/create', 
    '/posts/edit/[id]',
    '/api/posts/edit/[id]',
    '/users/[id]', 
    '/api/users/[id]'
];
export default function middleware(req: NextRequest){
    const newUrl = req.nextUrl.clone()
    newUrl.pathname = '/signin'
    const tokenName = process.env.JWT_TOKEN_NAME as string 
    const token = req.cookies[tokenName]
    if(protectedRoutes.find(p => p === req.page.name)){
        if(!token){
           return NextResponse.redirect(newUrl)
        }
    }
}