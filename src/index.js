const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

const {addUser, getUser, getUsersInRoom, getActiveRooms, removeUser} = require('./utils/users')
const {generateMessage} = require('./utils/messages')

app.use(express.static(publicPath))

server.listen(port, () => {
    console.log(`server listening on port ${port}`)
})

io.on('connection', (socket) => {

    // update active users in rooms list for index.html
    io.emit('activerooms', getActiveRooms())

    // will be called when a user attempts to join a room
    socket.on('join', (options, callback) => {
        console.log('test')
        // try catch mostly to stop server crashing from rogue client side console code
        try {

            // add user to users array
            const {error, user} = addUser({id: socket.id, ...options})

            // if user form validation fails take them back to index.html through and provide a valid error message through callback
            if(error) {     
                return callback(error)
            }
            // no errors so user is exposed here

            // subscribe user to room
            socket.join(user.room)

            socket.emit('message', generateMessage('Admin', `Welcome ${user.username}!`))
            // Will send this event to everyone except this particular socket
            socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

            // update active users in rooms list for index.html
            io.emit('activerooms', getActiveRooms())

            // update list of users in room user joined
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room),
                currentUser: getUser(socket.id)
            })

        } catch {
            // could not add user to users array.  handled gracefully
            console.log('error processing new user')
        }

        socket.on('message', (message, callback) => {
            const user = getUser(socket.id)

            io.to(user.room).emit('message', generateMessage(user.username, message))

            //goes to client that sent the message
            callback('server: message received and sent to all users in room')
        })
    })

    socket.on('disconnect', () => {


        // remove user from users array
        const {error, user} = removeUser(socket.id)

        // user did not join a room before disconnecting
        if(error) return console.log(error)

        io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left.`))

        // update list of users in room user left
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        // update active users in rooms list for index.html
        io.emit('activerooms', getActiveRooms())
    })
})

