import { userModel } from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.functions.js";

//middlewares para autenticar usuarios.
export async function authenticateUser(req, res, next){
    const token = req.cookies.currentUser

    if(!token){
        req.user = null;
        return next()
    }

    try{
        const decoded_token = verifyToken(token)
        const user = await userModel.findOne({email: decoded_token.email})

        if(!user){
            return res.status(401).json({
                error: "no hay usuario con ese mail."
            })
        }

        req.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: decoded_token.email,
            role: decoded_token.role,
            cart: user.cart ? user.cart.toString() : null
        }
        next()

    }catch(error){
        console.log("Error en authenticateUser() de auth.middleware.js")
        console.log(error)
    }
}

export async function authorizeUser(req, res, next){
    const { role } = req.user

    try{
        if(role === "admin"){
            next()
        }else{
            return res.status(401).json({
                error: "no autorizado."
            })
        }
    }catch(error){
        console.log("Error en authorizeUser() de auth.middleware.js")
        console.log(error)
    }
}