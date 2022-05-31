import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import {faker} from "@faker-js/faker"

const prisma = new PrismaClient

const roundOne: Prisma.UserCreateInput[] = [{email:'patkeenan@gmail.com' ,
username: 'Patrick',
password: '123456789',
role: 'SUPER_USER'
},{email:'aFox8895@gmail.com' ,
username: 'Alex',
password: '123456789',
role: 'SUPER_USER'
} ,{email:'ford.dave7@gmail.com' ,
username: 'Dave',
password: '123456789',
role: 'SUPER_USER'
}]

function generateUsers(){
   let users: Prisma.UserCreateInput[] = [...roundOne] ;
   let currentCount = 20;
   while (currentCount > 0){
       const name = faker.name.firstName()
       const lastName = faker.name.lastName()
    users.push({
        email:faker.internet.email() ,
        username: name,
        password: '123456789',
      });
      currentCount--;
   }
   return users
   
}

const run = async () => {
    const salt = bcrypt.genSaltSync();
    await Promise.all(generateUsers().map(async(data) => {
        const {username, password, email,role} = data
        return prisma.user.upsert({
            where: { email: data.email },
            update: {},
            create: {username:  username,role: role,password: bcrypt.hashSync(password, salt),email: email, 
             profile: {create: {
                profilePic: faker.image.avatar()
            }}},    
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