import { Router } from "express";
import { userModel } from "../models/user.model.js";

const router = Router()

//traer usuarios
router.get("/", async (req, res)=>{
    try{
        const users = await userModel.find()
        res.status(200).json(users)

    }catch{
        console.log("Error en user.router en la ruta GET '/'.")
        console.log(error)
    }
})

//traer usuario por id
router.get("/:id", async (req, res)=>{
    const { id } = req.params
    const user = await userModel.findById(id)

    if(!user){
        return res.status(401).json({
            error: "no hay usuario con ese id"
        })
    }

    try{
        res.status(200).json(user)

    }catch{
        console.log("Error en user.router en la ruta GET -> /:id")
        console.log(error)
    }
})

// Actualizar un usuario con id carrito
router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { cart } = req.body

    try {
        const updatedUser = await userModel.findByIdAndUpdate(id, { cart }, { new: true })
        console.log(cart)
        res.status(200).json(updatedUser)
    } catch (error) {
        onsole.log("Error en user.router en la ruta PUT -> /:id")
        console.log(error)
    }
});


export default router