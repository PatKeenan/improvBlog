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
    const token = req.cookies["next-auth.session-token"]
    if(protectedRoutes.find(p => p === req.page.name)){
        if(!token){
           return NextResponse.redirect(newUrl)
        }
    }
}