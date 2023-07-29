import authRouter from './modules/Auth/auth.router.js'
import userRouter from './modules/User/user.router.js'
import postRouter from './modules/post/post.router.js'
import connectDB from '../DB/connection.js'
import { globalErrHandling } from './utils/errorHandling.js'
import cors from 'cors'
// import path from 'path'
// import { fileURLToPath } from 'url'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))

const initApp = (app, express) => {

    //Convert Buffer Data
    app.use(express.json({}))
    app.use(cors()) 
    
    //read static files
    // app.use("/uploads", express.static("uploads"))
    // app.use("/uploads", express.static(path.join(__dirname,'./uploads')))

    //APP routing


    app.get('/', (req, res) => res.status(200).send('welcome to our social media website...'))
    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use("/post", postRouter)
    app.use("/uploads", express.static('uploads'))


    app.all("*", (req, res, next) => {
        return res.status(200).json({ message: "In-valid method or URL or Both please check your routing" })
    })

    app.use(globalErrHandling)
    // DB connection
    connectDB()

}

export default initApp