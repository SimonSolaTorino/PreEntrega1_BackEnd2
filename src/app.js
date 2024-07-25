import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import path from "path";
import __dirname from "./dirname.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewRouter from "./routes/views.router.js";
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
import sessionRouter from "./routes/session.router.js";
import { initializePassport } from "./config/passport.config.js";

//INICIALIZAMOS APP
const app = express()
const PORT = 8080

//EXPRESS CONFIG
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(`${__dirname}/public`))
app.use(cookieParser())

//PASSPORT CONFIG
initializePassport()
app.use(passport.initialize())

//HANDLEBARS CONFIG
app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "main"
}))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"))

//MONGOOSE CONFIG
mongoose.connect('mongodb+srv://simonsolat:simonsolat@cluster0.cjjajx4.mongodb.net/', {dbName: 'PreEntrega1'}).then(()=>{console.log("conectado a mongo")}).catch((error)=>{console.log(`Error al conectar a mongo: ${error}`)})

//ROUTES CONFIG
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewRouter)
app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/sessions", sessionRouter)

//START SERVER
app.listen(PORT, ()=>{
    console.log(`Server corriendo en http://localhost:${PORT}`)
})