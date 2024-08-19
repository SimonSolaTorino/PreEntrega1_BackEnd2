import { userModel } from "../models/user.model.js";

class UserDAO {
    async traerUsuarios(){
        try{
            const users = await userModel.find()
            
            return users

        }catch(error){
            console.log("ERROR en traerUsuarios de user.dao.js")
            console.log(error)
        }
    }

    async traerUsuarioPorId(id){
        try{
            const user = await userModel.findById(id)

            if(!user){
                throw new Error("Usuario no encontrado")
            }
            
            return user

        }catch(error){
            console.log("ERROR en traerUsuarioPorId de user.dao.js")
            console.log(error)
        }
    }

    async traerUsuarioPorEmail(email){
        try{
            const user = await userModel.findOne({email})

            if(!user){
                throw new Error("Usuario no encontrado")
            }
            
            return user

        }catch(error){
            console.log("ERROR en traerUsuarioPorEmail de user.dao.js")
            console.log(error)
        }
    }

    async actualizarUsuario(id, carrito){
        try{
            const user_exist = await userModel.findById(id)

            if(!user_exist){
                throw new Error("Usuario no encontrado")
            }
            
            const user_update = await userModel.findByIdAndUpdate(id, {carrito}, {new: true})
            
            return user_update

        }catch(error){
            console.log("ERROR en traerUsuarioPorId de user.dao.js")
            console.log(error)
        }
    }

    async crearUsuario(first_name, last_name, email, hashPassword, age, role, cartId){
        try{
            const user = await userModel.create({
                first_name,
                last_name,
                age,
                role,
                email,
                password: hashPassword,
            cart: null // Esto se actualizara después
            })
            
            return user

        }catch(error){
            console.log("ERROR en crearUsuario de user.dao.js")
            console.log(error)
        }
    }

    async actualizarUsuario(id, carrito) {
        try {
            const user_exist = await userModel.findById(id);

            if (!user_exist) {
                throw new Error("Usuario no encontrado");
            }

            const user_update = await userModel.findByIdAndUpdate(id, { carrito }, { new: true });
            return user_update;
        } catch (error) {
            console.log("ERROR en actualizarUsuario de user.dao.js");
            console.log(error);
        }
    }
}

export const userDAO = new UserDAO()