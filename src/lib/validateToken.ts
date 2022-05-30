import jwt from 'jsonwebtoken'

export const validateToken = (token: any) => {
    const user = jwt.verify(token,  process.env.JWT_SECRET as unknown as string)
    return user
}