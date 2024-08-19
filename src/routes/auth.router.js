import { Router } from "express";
import passport from "passport";
import { userModel } from "../models/user.model.js";
import { userDAO } from "../DAO/user.dao.js";
import { createHash } from "../utils/hash.functions.js";
import { createToken} from "../utils/jwt.functions.js";

const router = Router()

//registrar usuario
router.post("/register", async (req, res)=>{
    const { first_name, last_name, email, password, age, role, cartId  } = req.body
    
    if(!first_name || !last_name || !email || !password || !age ){
        return res.status(401).json({
            error: "faltan campos"
        })
    }

    try{
        const hashPassword = createHash(password)
        const existUser = await userDAO.traerUsuarioPorEmail(email)

        if(existUser){
            return res.status(401).json({
                error: "mail ya registrado"
            })
        }

        const newUser = await userDAO.crearUsuario(first_name, last_name, email, hashPassword, age, role, cartId)

        res.status(200).json(newUser)

    }catch(error){
        console.log("Error en auth.router en la ruta GET '/register'.")
        console.log(error)
    }
})

//login
router.post("/login", passport.authenticate("login", {session: false, failureRedirect: "/api/auth/login-error"}), async (req, res)=>{
    if(!req.user){
        return res.status(401).json({
            error: "no autorizado."
        })
    }

    const payload = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role,
    }

    const token = createToken(payload)
    res.cookie("currentUser", token, {
        maxAge: 100000,
        httpOnly: true
    })

    res.status(200).json({
        msg: "login exitoso",
        token
    })
})

//login fallido
router.get("/login-error", (req, res)=>{
    res.status(400).json({
        error: "no autorizado! le erraste a la contra!"
    })
})

//current
router.get("/current", passport.authenticate("jwt", {session: false}), (req, res)=>{
    res.status(200).json({
        msg: "bienvenido!",
        user: req.user
    })
})

//logout
router.get("/logout", (req, res)=>{
    res.clearCookie("currentUser")
    res.status(200).json({
      message: "Sesión cerrada",
    })
})

export default router