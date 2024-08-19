import { Router } from "express";
import { cartDAO } from "../DAO/cart.dao.js";
import { productDAO } from "../DAO/product.dao.js";
import { ticketDAO } from "../DAO/ticket.dao.js";
import { totalCarrito } from "../utils/carts.functions.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router()

//crear carrito
router.post('/', authenticateUser, async (req, res)=>{
    try{
        const carrito_nuevo = await cartDAO.crearCarrito()
        res.status(201).json(carrito_nuevo)

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router cart: POST -> crear carrito ' })
    }
})

//traer carrito por id
router.get('/:cid', authenticateUser, async (req, res)=>{
    const id_carrito = req.params.cid

    try{    
        const carrito = await cartDAO.traerCarritoPorId(id_carrito)
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
router.delete('/:cid', authenticateUser, async (req, res)=>{
    const id_carrito = req.params.cid
    
    try{
        const carrito = await cartDAO.vaciarCarrito(id_carrito)
        
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
router.post('/:cid/product/:pid', authenticateUser, async (req, res)=>{
    const id_carrito = req.params.cid
    const id_producto = req.params.pid
    const quantity = parseInt(req.body.quantity)
    
    try{
        const producto = await productDAO.traerProductoPorId(id_producto)
        const carrito = await cartDAO.traerCarritoPorId(id_carrito)
        let stock_actual = producto.stock
        
        if (!carrito) {
            return res.status(400).json({ msg: `Carrito con id ${id_carrito} no encontrado.` })
        }
        
        if (!producto) {
            return res.status(400).json({ msg: `Producto con id ${id_producto} no encontrado.` })
        }


        if(stock_actual <= 0 && stock_actual < quantity){
            return res.status(412).json({ msg : `El producto ${producto.title} no cuenta con stock.`})
        }

        const carrito_actualizado = await cartDAO.agregarProductoAlCarrito(id_producto, id_carrito, quantity)
        
        res.status(200).json({ msg: 'Producto agregado al carrito!', carrito_actualizado })
    
    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router cart: POST -> agregar un producto al carrito' })
    }
})

//actualizar la cantidad de un producto del carrito
router.put('/:cid/product/:pid', authenticateUser, async (req, res)=>{
    const id_carrito = req.params.cid
    const id_producto = req.params.pid
    const quantity = parseInt(req.body.quantity)
    
    try{
        const producto = await productDAO.traerProductoPorId(id_producto)
        const carrito = await cartDAO.traerCarritoPorId(id_carrito)
        let stock_actual = producto.stock

        if(!carrito){
            return res.status(400).json({ msg: `Carrito con id ${id_carrito} no encontrado.` })
        }
        
        if(!producto){
            return res.status(400).json({ msg: `Producto con id ${id_producto} no encontrado.` })
        }
        
        if(stock_actual <= 0 && stock_actual < cant){
            return res.status(400).json({ msg: `Producto sin stock.` }) 
        }
        
        const carrito_actualizado = await cartDAO.actualizarCantidadProductoDelCarrito(id_carrito, id_producto, quantity)
        
        res.status(200).json({ msg: 'Producto agregado al carrito!', carrito_actualizado })

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router cart: PUT -> actualizar la cantidad de un producto del carrito' })
    }
})

// Eliminar un producto del carrito
router.delete('/:cid/product/:pid', authenticateUser, async (req, res) => {
    const id_carrito = req.params.cid
    const id_producto = req.params.pid
    
    try {
        const carrito = await cartDAO.traerCarritoPorId(id_carrito)
        const producto_existe = await productDAO.traerProductoPorId(id_producto)

        if(!carrito){
            return res.status(400).json({ msg: `Carrito con id ${id_carrito} no encontrado.`})
        }

        if(!producto_existe){
            return res.status(400).json({ msg: `Producto con id ${id_producto} no encontrado.`})
        }

        const carrito_actualizado = await cartDAO.eliminarProductoDelCarrito(id_carrito, id_producto)
        
        const nuevo_carrito = await cartDAO.traerCarritoPorId(id_carrito).lean()
        const total_price = totalCarrito(nuevo_carrito.products)
        res.status(200).json({ msg: 'Producto eliminado del carrito', carrito_actualizado, total_price })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error en Router cart: DELETE -> eliminar un producto del carrito' })
    }
})
//crear ticket
router.get("/:cid/purchase", authenticateUser, async (req, res)=>{
    try{
        const id_carrito = req.params.cid
        const carrito = await cartDAO.traerCarritoPorId(id_carrito ).lean()
        const precio_total = totalCarrito(carrito.products)

        if (!carrito) {
            return res.status(400).json({ msg: `Carrito con id ${id_carrito} no encontrado.` });
        }

        const new_ticket = await ticketDAO.crearTicket(precio_total, req.user.email)
        const sin_stock = await cartDAO.validarStock(carrito.products)
        await cartDAO.vaciarCarrito(id_carrito)

        if(sin_stock.length > 0 ){
            await cartDAO.agregarProductoAlCarrito(id_carrito, sin_stock.map(p => ({ _id: p, quantity: 1 })))
        }

        res.status(200).json({
            msg: 'Compra completada con éxito!',
            new_ticket,
            sin_stock
        })

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router cart: GET -> crear ticket' })
    }
})

export default router