import passport from "passport";
import local from "passport-local";
import jwtStrategy from "passport-jwt";
import { userModel } from "../models/user.model.js";
import { comparePassword } from "../utils/hash.functions.js";

const LocalStrategy = local.Strategy
const JWTStrategy = jwtStrategy.Strategy
const ExtractJWT = jwtStrategy.ExtractJwt

const initializePassport = ()=>{
    //ESTRATEGIA PARA LOGIN
    passport.use( 
        "login", 
        new LocalStrategy({usernameField: "email", passReqToCallback: true},
        async (req, email, password, done)=>{
            try{
                const user = await userModel.findOne({email})

                if(!user){
                    return done(null, false, {error: "no hay usuario con ese mail"})
                }

                if(!(await comparePassword(password, user.password))){
                    return done(null, false, {error: "contraseña incorrecta"})
                }

                return done(null, user)

            }catch(error){
                console.log("error en estrategia passport login")
            }
        }) 
    )

    //SERIALIZAR USUARIO
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    //DESSERIALIZAR USUARIO
    passport.deserializeUser(async (id, done)=>{
        try{
            const user = await userModel.findById(id)
            done(null, user)

        }catch(error){
            console.log("error al deserializar el usuario en passport.config.js")
        }
    })

    //CURRENT COOKIE EXTRACTOR
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: "SECRET1"
            },
            async (payload, done)=>{
                try{
                    return done(null, payload)

                }catch(error){
                    return done(error)
                }
            }
        )

    )

    function cookieExtractor(req){
        let token = null
        if(req && req.cookies){
            token = req.cookies["token"]
        }
        return token
    }
}

export { initializePassport }