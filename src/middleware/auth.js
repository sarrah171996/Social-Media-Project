import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.js";
import  Dotenv from "dotenv";
Dotenv.config()

export const roles ={
    admin : process.env.admin,
    user : process.env.user
}


export const auth = (accessRoles=[]) =>{
    return  async (req, res, next) => {
        try {
            // const { authorization } = req.headers;
            // if (!authorization?.startsWith(process.env.BEARER_KEY)) {
                //     return res.json({ message: "In-valid bearer key" })
            // }
            // const token = authorization.split(process.env.BEARER_KEY)[1]
            
            const { token } = req.headers;
            
            if (!token) {
                return res.json({ message: "In-valid token" })
            }
    
            const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
            if (!decoded?.id) {
                return res.json({ message: "In-valid token payload" })
            }
            const authUser = await userModel.findById(decoded.id).select('userName email role')
            if (!authUser) {
                return res.json({ message: "Not register account" })
            }
            if(!accessRoles.includes(authUser.role)){
                return res.json({ message: "Not authorized account" })

            }
            req.user = authUser;
            return next()
        } catch (error) {
            return res.json({ message: "Catch error" , err:error?.message })
        }
    }
}

