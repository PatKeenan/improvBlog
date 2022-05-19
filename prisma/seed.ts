import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import {faker} from "@faker-js/faker"

const prisma = new PrismaClient



function generateUsers(){
   let users: Prisma.UserCreateInput[] = [] ;
   let currentCount = 20;
   while (currentCount > 0){
       const name = faker.name.firstName()
       const lastName = faker.name.lastName()
    users.push({
        email:faker.internet.email() ,
        username: name,
        password: '123456789',
        slug: `${name}-${lastName}`
      });
      currentCount--;
   }
   return users
   
}

const run = async () => {
    const salt = bcrypt.genSaltSync();
    await Promise.all(generateUsers().map(async(data) => {
        const {username, password, email, slug,role} = data
        return prisma.user.upsert({
            where: { email: data.email },
            update: {},
            create: {username:  username,role: role,password: bcrypt.hashSync(password, salt),email: email, slug: slug}
        })
    })
 
    )}

run()
.catch((e) => {
    console.error(e)
    process.exit(1)
})
.finally(async () => {
    await prisma.$disconnect()
})