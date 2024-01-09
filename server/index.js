const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ["GET","POST"]
    }
});
const PORT = 3000;

/**
 * Establish MySQL DB Connection
 */
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'random_chat_app_db'
});

db.connect(( err ) => {
    if ( err ) console.error(`Error connecting to MySQL DB: ${err}`);
    console.log(`Connected to MySQL database`);
});

/**
 * Establish Socket Connection
 */
io.on('connection', (socket) => {
    console.log(socket.id);

    // handle incoming messages
    socket.on('chat message', (message) => {
        let insertQuery = 'INSERT INTO messages (content) VALUES (?)';
        db.query(insertQuery, [message], (err, result) => {
            if ( err ) throw err;
        });

    io.emit('chat message', message);
    // handle user disconnection
        console.log(`User ${socket.id} disconnected`);
    });
});

/**
 * Run Http Server
 */
server.listen(PORT, (err) => {
    if ( err ) console.log(`Error trying to run server on PORT: ${PORT}`);
    console.log(`Server listening on PORT: ${PORT}`);
});