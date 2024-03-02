import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { decode, verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@aditimishra537/medium-common";

export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string 
	},Variables : {
		userId: string
	}
}>();

blogRouter.use("/*", async (c, next)=> {
    try {
        const authHeader = c.req.header('authorization') || '';
        const user = await verify(authHeader, c.env.JWT_SECRET);
        if(user) {
            c.set("userId", user.id);
            await next();
        } else {
            c.status(403)
            return c.json({
                message: "you are not logged in"
            })
        }
    } catch (error) {
        c.status(403);
        return c.json({message: "you are not logged in"})
    }
})

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const userId = c.get("userId");
    const {success} = createBlogInput.safeParse(body);
    if(!success) {
        c.status(411);
        return c.json({
            message: "Inputs invalid"
        })
    }
    try {
        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: Number(userId)
            }
        })
    
        return c.json({blogId: blog.id})  
    } catch (error) {
        c.status(411);
        c.json({message: "error while creating a blog post"})
    }

})
  
blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);
    if(!success) {
        c.status(411);
        return c.json({
            message: "Inputs invalid"
        })
    }
    try {
        const blog = await prisma.post.update({
            where: {id: body.id},
            data: {
                title: body.title,
                content: body.content,
            }
        })
    
        return c.json({blogId: blog.id})   
    } catch (error) {
        c.status(411);
        c.json({message: "error while updating the blog post"})
    }

})

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const blog = await prisma.post.findMany({
            // where: {authorId: '1'}
        })
    
        return c.json({blog: blog})  
    } catch (error) {
        c.status(411);
        c.json({message: "error while fetching all the blog posts"})
    }
    
})

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const id = c.req.param("id");
    try {
        const blog = await prisma.post.findFirst({
            where: {id: Number(id)}
        })
    
        return c.json({blog: blog})
    } catch (error) {
        c.status(411);
        c.json({message: "error while fetching the blog post"})
    }
    
})

