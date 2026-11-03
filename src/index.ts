import express, { type Express, type Request, type Response , type NextFunction} from 'express';
import { type Ticket, type TicketStatus, type TicketPriority} from "./types"
import { v4 as uuidv4 } from 'uuid';
import { time } from 'node:console';

type TicketBody = Pick<Ticket, "title" | "description"> & {
    priority?: TicketPriority
}


const app: Express = express();

const myLogger = function (req: Request, res: Response, next: NextFunction) {
  console.log( req.method, req.path);
  next();
};

app.use(myLogger);

app.get('/health', (req: Request, res: Response) => {
  res.send('Hello World! App working');
});

const tickets : Ticket[] = []

let nexId : number = 1;

app.use(express.json() )

app.post('/tickets', (req: Request, res: Response) => {
  const bodyReq : TicketBody = req.body
   if(typeof bodyReq.description != "string" || typeof bodyReq.title != "string" || bodyReq.title.trim() == "" || bodyReq.description.trim() == ""){
    return res.status(400).json({
        error: "title y description deben ser strings no vacíos"
    });
    }

    const ticket : Ticket = {
        id: nexId++,
        title: bodyReq.title,
        description: bodyReq.description,
        status: "open",
        priority: bodyReq.priority ?? "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
  }
      
    tickets.push(ticket)
    return res.status(201).json(ticket);

})

app.get('/tickets', (req: Request, res: Response) => {
    res.send(tickets)
})

app.listen(3000);