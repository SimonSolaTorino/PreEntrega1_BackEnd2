import { ticketModel } from "../models/ticket.model.js";

class TicketDAO {
    async crearTicket(total_price, user_mail){
        try{
            const ticket = await ticketModel.create({
                amount: total_price,
                purchaser: user_mail
            })

            return ticket

        }catch(error){
            console.log("Error en crearTicket de ticket.dao.js ")
            console.log(error)
        }
    }

}

export const ticketDAO = new TicketDAO()