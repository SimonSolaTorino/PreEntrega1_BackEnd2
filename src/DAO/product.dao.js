import { productModel } from "../models/product.model.js";
import { validarCampos } from "../utils/products.functions.js";

class ProductDAO {
    async traerProductos(filtro, page, limit, sort, type_sort){
        try{
            return await productModel.paginate(filtro, {page, limit, sort: type_sort})
        }catch(error){
            console.log("ERROR en traerProductos de product.dao.js")
            console.log(error)
        }
    }

    async traerProductoPorId(id){
        try{
            const producto = await productModel.findById(id)

            if(!producto){
                throw new Error("Producto no encontrado") 
            }

            return producto

        }catch(error){
            console.log("ERROR en traerProductoPorId de product.dao.js")
            console.log(error)
        }
    }

    async agregarProducto(title, description, code, price, stock, category, thumbnail, status){
        try{
            if (!title || !description || !code || !price || !stock || !category) {
                throw new Error("Faltan campos")
            }

            const producto_nuevo = await productModel.create({
                title,
                description,
                code,
                price: parseInt(price),
                stock: parseInt(stock),
                category,
                status: status !== undefined ? status : true,
                thumbnail: thumbnail ? [thumbnail] : []
            })

            return producto_nuevo
            
        }catch(error){
            console.log("ERROR en agregarProducto de product.dao.js")
            console.log(error)
        }
    }

    async modificarProducto(id, campos_nuevos){
        try{
            const existe_producto = await productModel.findById(id)
            
            if(!validarCampos(Object.keys(campos_nuevos))){
                throw new Error("Campos invalidos")
            }

            if(!existe_producto){
                throw new Error("Producto no encontrado")
            }

            const producto_nuevo = await productModel.findByIdAndUpdate(id, campos_nuevos)
            
            return producto_nuevo
            
        }catch(error){
            console.log("ERROR en modificarProducto de product.dao.js")
            console.log(error)
        }
    }

    async eliminarProducto(id){
        try{
            const existe_producto = await productModel.findById(id)

            if(!existe_producto){
                throw new Error("Producto no encontrado")
            }

            const producto_eliminado = await productModel.findByIdAndDelete(id)
            
            return producto_eliminado
            
        }catch(error){
            console.log("ERROR en eliminarProducto de product.dao.js")
            console.log(error)
        }
    }
}

export const productDAO = new ProductDAO()