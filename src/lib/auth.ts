import { User } from "@prisma/client";
import fetcher from "./fetcher";

interface AuthBaseType {
    password: User["password"]
}

interface SignUpType extends AuthBaseType {
    username: User['username']
    email: User['email']
}

interface WithEmailTypeSignin extends AuthBaseType {
    email: User['email']
}

interface WithUserNameSignin extends AuthBaseType {
    username: User['username']
}


const auth = (mode: 'signin' | 'signup' , body: SignUpType | WithEmailTypeSignin | WithUserNameSignin) => {
        return fetcher(`/${mode}`, body)
}
