import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

class CartDAO {
    async crearCarrito (){
        try{
            return await cartModel.create({ products: [] })
        }catch(error){
            console.log("Error en crearCarrito de cart.dao.js ")
            console.log(error)
        }
    }

    async traerCarritoPorId(id){
        try{
            const carrito = await cartModel.findById(id).populate("products.product")
            
            if(!carrito){
                throw new Error("Carrito no encontrado") 
            }
            
            return carrito

        }catch(error){
            console.log("Error en traerCarritoPorId de cart.dao.js ")
            console.log(error)
        }
    }

    async vaciarCarrito(id){
        try{
            const carrito = await cartModel.findById(id).populate("products.product")
            
            if(!carrito){
                throw new Error("Carrito no encontrado") 
            }
            
            return await cartModel.findByIdAndUpdate(id, { products: [] })
        
        }catch(error){
            console.log("Error en vaciarCarrito de cart.dao.js ")
            console.log(error)
        }
    }

    async agregarProductoAlCarrito(id_prod, id_cart, cant){
        try{
            const producto = await productModel.findById(id_prod)
            const carrito = await cartModel.findById(id_cart)
            let stock_actual = producto.stock
            let producto_en_carrito = carrito.products.find(item => item.product.toString() === id_cart)
        
            if(!carrito){
                throw new Error("Carrito no encontrado") 
            }

            if(!producto){
                throw new Error("Producto no encontrado") 
            }

            if(stock_actual <= 0 && stock_actual < cant){
                throw new Error("Producto sin stock") 
            }

            if(producto_en_carrito){
                producto_en_carrito.quantity += cant
            }else{
                carrito.products.push({
                    product: id_prod,
                    quantity: cant
                })
            }
            
            producto.stock = stock_actual - cant
            await producto.save()
            await carrito.save()
            return carrito


        }catch(error){
            console.log("Error en agregarProductoAlCarrito de cart.dao.js ")
            console.log(error)
        }



    }

    async actualizarCantidadProductoDelCarrito(id_cart, id_prod, cant){
        try{
            const producto = await productModel.findById(id_prod)
            const carrito = await cartModel.findById(id_cart)
            let stock_actual = producto.stock
            let producto_en_carrito = carrito.products.find(item => item.product.toString() === id_prod)

            if(!carrito){
                throw new Error("Carrito no encontrado") 
            }

            if(!producto){
                throw new Error("Producto no encontrado") 
            }

            if(stock_actual <= 0 && stock_actual < cant){
                throw new Error("Producto sin stock") 
            }

            if(producto_en_carrito){
                producto_en_carrito.quantity = cant
            }else{
                carrito.products.push({
                    product: id_prod,
                    quantity: cant
                })
            }

            producto.stock = stock_actual - cant
            await producto.save()
            await carrito.save()
            return carrito

        }catch(error){
            console.log("Error en actualizarCantidadProductoDelCarrito de cart.dao.js ")
            console.log(error)
        }
    }

    async eliminarProductoDelCarrito(id_cart, id_prod){
        try{
            const carrito = await cartModel.findById(id_cart)
            const producto = await productModel.findById(id_prod)

            if(!carrito){
                throw new Error("Carrito no encontrado") 
            }

            if(!producto){
                throw new Error("Producto no encontrado") 
            }

            carrito.products = carrito.products.filter(item => item.product.toString() !== id_producto)
            await carrito.save()

            return carrito

        }catch(error){
            console.log("Error en eliminarProductoDelCarrito de cart.dao.js ")
            console.log(error)
        }

    }

    async validarStock(prods_en_carrito){
        try{
            const productos_sin_stock = []

            for (const producto of prods_en_carrito) {
                const producto_en_DB = await productModel.findById(producto._id)

                if(!producto_en_DB && producto_en_DB.stock < producto.quantity){
                    productos_sin_stock.push(producto._id)
                }
            }

            return productos_sin_stock
        
        }catch(error){
            console.log("Error en validarStock de cart.dao.js")
            console.log(error)
        }
    }
}

export const cartDAO = new CartDAO()