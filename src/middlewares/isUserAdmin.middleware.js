import { userModel } from "../models/user.model.js"
import { verifyToken } from "../utils/jwt.functions.js"

export async function isUserAdmin(req, res, next){
    try{
        if(req.cookies.currentUser){
            let isAdmin = false
            const token = req.cookies.currentUser
            const decoded = verifyToken(token)
            const userInDB = await userModel.findOne({ email: decoded.email })
            if(userInDB){
                user = {
                    first_name: userInDB.first_name,
                    last_name: userInDB.last_name,
                    email: userInDB.email,
                    role: userInDB.role
                }
            }
        
            if((user.role === 'admin')){
                isAdmin = true
            }

            return {user , isAdmin}

        }

    }catch(error){
        console.log("error en isUserAdmin.js")
    }
}
