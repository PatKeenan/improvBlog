import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest){
    const token = req.cookies['next-auth.session-token']
    const {pathname} = req.nextUrl 
    if(token && pathname == '/signin' || token && pathname == '/'){
        const url = req.nextUrl.clone()
        url.pathname = '/posts'
        return NextResponse.redirect(url)
    }
    return NextResponse.next()
}