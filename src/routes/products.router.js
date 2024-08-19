import { Router } from "express";
import { productDAO } from "../DAO/product.dao.js";
import { validarCampos } from "../utils/products.functions.js";
import { authenticateUser, authorizeUser } from "../middlewares/auth.middleware.js";

const router = Router()

//traer productos PUBLICA
router.get('/', async (req, res)=>{
    const { limit = 10, page = 1, sort, query } = req.query

    try{
        let ordenamiento = {}
        const filtro = query ? { 'category': query } : {} //'category' para categorias (me gusta mas) o 'status' para disponibilidad
        
        if(sort){
            ordenamiento.price = sort === 'asc' ? 1 : sort === 'desc' ? -1 : null  
        }

        const response = await productDAO.traerProductos(filtro, page, limit, sort, ordenamiento)
        const nextLink = response.hasNextPage ? `http://localhost:8080/products?page=${response.nextPage}` : null
        const prevLink = response.hasPrevPage ? `http://localhost:8080/products?page=${response.prevPage}` : null

        res.status(200).json({
            status: 'success',
            payload: response.docs,
            totalPages: response.totalDocs,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page,
            hasNextPage: response.hasNextPage,
            hasPrevPage: response.hasPrevPage,
            prevLink,
            nextLink
        })

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router products: GET -> traer todos los productos ' })
    }
})

//traer producto por id PUBLICA
router.get('/:pid', async (req, res)=>{
    const id_producto = req.params.pid
    
    try{    
        const producto_buscado = await productDAO.traerProductoPorId(id_producto)

        if(!producto_buscado){
            res.status(400).json({msg: `no hay producto con el id ${id_producto}`})
        }
        
        res.status(200).json(producto_buscado)

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router products: GET -> traer producto por id '})
    }
})

//agregar un producto PRIVADA
router.post('/', authenticateUser, authorizeUser, async (req, res)=>{
    const { title, description, code, price, stock, category, thumbnail, status } = req.body
    
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ msg: 'Error! Uno de los campos es incorrecto o no a sido ingresado.' })
    }

    try{
        const info_producto = {
            title,
            description,
            code,
            price: parseInt(price),
            stock: parseInt(stock),
            category,
            status: status !== undefined ? status : true,
            thumbnail: thumbnail ? [thumbnail] : []
        }

        const producto_nuevo = await productDAO.agregarProducto( title, description, code, price, stock, category, thumbnail, status)

        res.status(201).json(info_producto)

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router products: POST -> agregar un producto '})
    }
})

//modificar un producto PRIVADA
router.put('/:pid', authenticateUser, authorizeUser, async (req, res)=>{
    const id_producto = req.params.pid
    const campos_nuevos = req.body

    if(!validarCampos(Object.keys(campos_nuevos))){
        return res.status(400).json({ msg: 'Campos invalidos.' })

    }

    try{
        const producto_modificado = await productDAO.modificarProducto(id_producto, campos_nuevos)
        res.status(201).json(producto_modificado)

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router products: PUT -> modificar un producto ' })
    }
})

//eliminar un producto PRIVADA
router.delete('/:pid', authenticateUser, authorizeUser, async (req, res)=>{
    const id_producto = req.params.pid
    
    try{
        const producto_existe = await productDAO.traerProductoPorId(id_producto)

        if (!producto_existe) {
            return res.status(400).json({ msg: 'Producto no encontrado.' })

        }

        const producto_eliminado = await productDAO.eliminarProducto(id_producto)
    
        res.status(200).json({ msg: 'Producto eliminado correctamente.', producto: producto_eliminado })
        
    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router products: DELETE -> eliminar un producto ' })
    }
})

export default router