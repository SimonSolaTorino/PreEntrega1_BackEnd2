import { Router } from "express";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { totalCarrito } from "../utils/carts.functions.js";

const router = Router()

//crear carrito
router.post('/', async (req, res)=>{
    try{
        const carrito_nuevo = await cartModel.create({ products: [] })
        res.status(201).json(carrito_nuevo)

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router cart: POST -> crear carrito ' })
    }
})

//traer carrito por id
router.get('/:cid', async (req, res)=>{
    const id_carrito = req.params.cid

    try{    
        const carrito = await cartModel.findById(id_carrito).populate("products.product")

        if(!carrito){
            return res.status(401).json({ msg: `No se encontró carrito con ID ${id_carrito}` })
        }
        
        res.status(200).json(carrito)    
        
    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router cart: GET -> traer carrito por id ' })
    }
})

//vaciar carrito
router.delete('/:cid', async (req, res)=>{
    const id_carrito = req.params.cid
    
    try{
        const carrito = await cartModel.findByIdAndUpdate(id_carrito, { products: [] })
        
        if (!carrito) {
            return res.status(400).json({ msg: `Carrito con id ${id_carrito} no encontrado.` })
        }

        res.status(200).json({ msg: 'Carrito vaciado correctamente.', carrito })
        
    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router cart: DELETE -> vaciar carrito' })

    }
})

//agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res)=>{
    const id_carrito = req.params.cid
    const id_producto = req.params.pid
    const quantity = parseInt(req.body.quantity)
    
    try{
        const producto = await productModel.findById(id_producto)
        const carrito = await cartModel.findById(id_carrito)
        
        if (!carrito) {
            return res.status(400).json({ msg: `Carrito con id ${id_carrito} no encontrado.` })
        }
        
        if (!producto) {
            return res.status(400).json({ msg: `Producto con id ${id_producto} no encontrado.` })
        }

        let stock_actual = producto.stock

        if(stock_actual <= 0){
            return res.status(412).json({ msg : `El producto ${producto.title} no cuenta con stock.`})
        }

        let producto_en_carrito = carrito.products.find(item => item.product.toString() === id_producto)

        if(producto_en_carrito){
            producto_en_carrito.quantity += quantity
        
        }else{
            carrito.products.push({
                product: id_producto,
                quantity: quantity
            })
        }

        producto.stock = stock_actual - quantity;
        await producto.save()
        const carrito_actualizado = await carrito.save()
        res.status(200).json({ msg: 'Producto agregado al carrito!', carrito_actualizado })
    
    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router cart: POST -> agregar un producto al carrito' })
    }
})

//actualizar la cantidad de un producto del carrito
router.put('/:cid/product/:pid', async (req, res)=>{
    const id_carrito = req.params.cid
    const id_producto = req.params.pid
    const quantity = parseInt(req.body.quantity)
    
    try{
        const producto = await productModel.findById(id_producto)
        const carrito = await cartModel.findById(id_carrito)

        if(!carrito){
            return res.status(400).json({ msg: `Carrito con id ${id_carrito} no encontrado.` })
        }
        
        if(!producto){
            return res.status(400).json({ msg: `Producto con id ${id_producto} no encontrado.` })
        }
                
        let producto_en_carrito = carrito.products.find(item => item.product.toString() === id_producto)
                
        if(producto_en_carrito){
            producto_en_carrito.quantity = quantity

        }else{
            carrito.products.push(
                {
                product: id_producto,
                quantity: quantity
                }
            )
        }
            
        const carrito_actualizado = await carrito.save()
        res.status(200).json({ msg: 'Producto agregado al carrito!', carrito_actualizado })

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router cart: PUT -> actualizar la cantidad de un producto del carrito' })
    }
})

// Eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    const id_carrito = req.params.cid
    const id_producto = req.params.pid
    
    try {
        const carrito = await cartModel.findById(id_carrito)
        const producto_existe = await productModel.findById(id_producto)

        if(!carrito){
            return res.status(400).json({ msg: `Carrito con id ${id_carrito} no encontrado.`})
        }

        if(!producto_existe){
            return res.status(400).json({ msg: `Producto con id ${id_producto} no encontrado.`})
        }


        carrito.products = carrito.products.filter(item => item.product.toString() !== id_producto)
        await carrito.save()
        
        const nuevo_carrito = await cartModel.findById(id_carrito).populate('products.product').lean()
        const total_price = totalCarrito(nuevo_carrito.products)
        res.status(200).json({ msg: 'Producto eliminado del carrito', carrito, total_price })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error en Router cart: DELETE -> eliminar un producto del carrito' })
    }
})

export default router