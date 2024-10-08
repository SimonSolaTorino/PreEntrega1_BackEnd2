import { Router } from "express";
import { totalCarrito } from "../utils/carts.functions.js";
import { authenticateUser, authorizeUser } from "../middlewares/auth.middleware.js"
import { verifyToken } from "../utils/jwt.functions.js";
import { cartDAO } from "../DAO/cart.dao.js";
import { productDAO } from "../DAO/product.dao.js";
import { userDAO } from "../DAO/user.dao.js";

const router = Router()

// vista para renderizar el home
router.get('/', authenticateUser, async (req, res)=>{
    try {
        let user = null
        let isAdmin = false
        const products = await productDAO.traerProductos().lean().exec()

        if (req.cookies.currentUser) {
            const token = req.cookies.currentUser
            const decoded = verifyToken(token)
            const userInDB = await userDAO.traerUsuarioPorEmail(decoded.email)
            if(userInDB){
                user = {
                    first_name: userInDB.first_name,
                    last_name: userInDB.last_name,
                    email: userInDB.email,
                    role: userInDB.role
                }
            }

            if((user.role === 'admin')){
                isAdmin = true
            }
        }
        res.render('home', { user, products, isAdmin })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error en Router views: get -> home ' })
        res.render('home', { user: null, products })
    }
})

// vista para renderizar /products
router.get('/products', authenticateUser, async (req, res)=>{
    const { page = 1, limit = 4, sort, query } = req.query
    
    try{
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null
        }

        const filtro = query ? { 'category': query } : {} //o status si es por disponibilidad
        //const products = await product_model.find().lean().exec()
        const response = await productDAO.traerProductos(filtro, options.page, options.limit, options.sort)
        const { docs , totalPages, prevPage, nextPage, hasNextPage, hasPrevPage } = response
        const products = docs.map(doc => doc.toObject({ virtuals: true })) //sin esto no renderiza los productos...
        let prevLink = `/products?page=${prevPage}&limit=${limit}`
        let nextLink = `/products?page=${nextPage}&limit=${limit}`

        if(query){
            prevLink += `&query=${query}`
            nextLink += `&query=${query}`
        }

        if(sort){
            prevLink += `&sort=${sort}`
            nextLink += `&sort=${sort}`
        }
        const user = req.user
        console.log(user)
        res.render('products', {
            products,
            totalPages,
            prevPage,
            nextPage,
            hasNextPage,
            hasPrevPage,
            prevLink: hasPrevPage ? prevLink : null,
            nextLink: hasNextPage ? nextLink : null,
            currentPage: page,
            user,
            isAdmin: user.role,
            cartId: user.cart
        })

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router views: GET / -> renderizar /products' })
    }
})

// vista para renderizar /cart
router.get('/cart', authenticateUser, async (req, res)=>{
    const id_carrito = req.params.cid || req.user.cart
    try{
        const carrito = await cartDAO.traerCarritoPorId(id_carrito).lean()

        if(!carrito){
            return res.status(400).json({ msg: `No se encontró carrito con ID ${id_carrito}`})
        }

        const products = carrito.products
        const total_price = totalCarrito(products)
        res.render('cart', {products, total_price, carrito})

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error en Router views: GET / -> renderizar /cart' })
    }
})

//vista para agregar un carrito
router.get("/addProduct", authenticateUser, authorizeUser, (req, res)=>{
    res.render("addProduct")
})

//vista register
router.get('/register', (req, res) => {
    res.render('register')
})

//vista login
router.get('/login', (req, res) => {
    res.render('login')
})

//vista current
router.get("/current", authenticateUser, async (req, res)=>{
    try{
        const token = req.cookies.currentUser
        const decoded = verifyToken(token)
        const userInDB = await userDAO.traerUsuarioPorEmail(decoded.email)

        if (!userInDB) {
            return res.status(401).json({ error: "No hay usuario con ese email" })
        }

        res.render('current', { user: userInDB })

    }catch(error){
        console.log("Error en session.router en la ruta GET '/current'.")
        console.log(error)
    }
})

export default router