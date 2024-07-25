import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { comparePassword } from "../utils/hash.functions.js";
import { createToken, verifyToken} from "../utils/jwt.functions.js";
 
const router = Router()

//iniciar sesion con cookies
router.post("/login", async (req, res)=>{
    const { email, password } = req.body

    if(!email || !password){
        return res.status(401).json({
            error: "falta mail o contra"
        })
    }

    try{
        const user = await userModel.findOne({ email })
        const isPasswordCorrect = comparePassword(password, user.password)

        if(!user){
            return res.status(401).json({
                error: "no existe usuario con ese mail"
            })
        }

        if(!isPasswordCorrect){
            return res.status(401).json({
                error: "mal contra"
            })
        }

        const token  = createToken({email: user.email, role: user.role})
        res.cookie("currentUser", token, {maxAge: 1000000})
        res.status(200).json({
            msg: "sesion iniciadda"
        })

    }catch(error){
        console.log("Error en session.router en la ruta POST '/login'.")
        console.log(error)
    }
})

//usuario actual
router.get("/current", async (req, res)=>{
    const token = req.cookies.currentUser
    console.log(token)
    
    if(!token){
        return res.status(401).json({
            error: "no se encontro el usuario dentro de la cookie current de la sesion"
        })
    }

    try{
        const user = verifyToken(token)
        const userInDB = await userModel.findOne({email: user.email})

        if(!userInDB){
            return res.status(401).json({
                error: "no hay usuario con ese mail"
            })
        }



        res.status(200).json(userInDB)

    }catch(error){
        console.log("Error en session.router en la ruta GET '/current'.")
        console.log(error)
    }
})

//cerrar sesion con cookies
router.get("/logout", (req, res)=>{
    res.clearCookie("currentUser")
    res.status(200).json({
        msg: "sesion cerrada."
    })
})

export default router