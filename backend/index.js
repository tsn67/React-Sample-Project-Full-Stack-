import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http'

const app = express();
const port = process.env.port || 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const clients = [];
var messages = [];

io.on('connection', (socket) => {
    console.log("New client connected: "+socket.id);
    clients.push(socket);

    io.emit("new-count", {
        count: clients.length,
        msgArr: messages  
    });

    socket.on('new-msg', (data) => {
        messages.push(data.message);
        //console.log(data.message);
        io.emit('msg-change', {
            msgArr: messages 
        })
    });

    socket.on('disconnect', ()=> {
        let index = clients.findIndex((client) => client.id == socket.id);
        clients.splice(index, 1);

        io.emit('new-count', {
            count: clients.length
        })
    });

}); 


server.listen(port, () => {
    console.log("Server started at "+port);
});

app.get("/", (req, res) => {
    res.json("Working Okay");
});