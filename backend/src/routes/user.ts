import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, jwt, sign, verify } from 'hono/jwt'
import { signinInput, signupInput } from "@aditimishra537/medium-common";

export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string 
	},Variables : {
		userId: string
	}
}>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);
    if(!success) {
        c.status(411);
        return c.json({
            message: "Inputs invalid"
        })
    }
    try {
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name
            }
        });
    
        return c.json({statusCode: 201, message: "user is signed up"})
    } catch(e) {
    console.error(e)
        return c.status(403);
    }
})
  
userRouter.post('/signin', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const {success} = signinInput.safeParse(body);
    if(!success) {
        console.log('here')
        c.status(411);
        return c.json({
            message: "Inputs invalid"
        })
    }
    try {
      // const hashedPassword = await bcrypt.hash(body.password, 10);
      
      const user = await prisma.user.findUnique({
        where: {
          email: body.email
        }
      });
      if(!user) {
        return c.json({statusCode: 404, message: 'user not registered! please sign up first'})
  
      }
      const secret = c.env.JWT_SECRET;
      const token = await sign({id: user.id}, secret)
      return c.json({statusCode: 201, jwt: token, message: 'sign in successful'});
    
    } catch(e) {
      return c.status(403);
    }
})