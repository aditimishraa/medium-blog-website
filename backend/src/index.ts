import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, jwt, sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors'
// import * as bcrypt from 'node:bcrypt';

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string 
	},Variables : {
		userId: string
	}
}>();
app.use('/api/*', cors())
app.use(
  '/api2/*',
  cors({
    origin: 'http://example.com',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter)


export default app
