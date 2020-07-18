require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const routes = require("./routes");
const socketio = require('socket.io'); 
const cors = require('cors');
const path = require('path');
const http = require('http');

const app = express();
const server = http.Server(app);
const io = socketio(server);

const connectedUsers = {};

io.on('connection', socket =>{
    const {user_id} = socket.handshake.query;
    connectedUsers[user_id] = socket.id;

    console.log(user_id);

})
mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.vwan4.mongodb.net/omnistack9?retryWrites=true&w=majority`,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

app.use((req, res, next) =>{
    req.io = io;
    req.connectedUsers = connectedUsers;
    next();
})

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/files', express.static(path.resolve(__dirname, '..' , 'uploads')));

server.listen(3333);