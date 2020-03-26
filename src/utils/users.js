const users = []

const addUser = ({id, username, room}) => {
console.log(username + ' ' + room)
console.log('test')
    // validate and sanitize username and room

    if(!username || !room) return { error: 'All feilds are required.' }

    username = username.trim().toLowerCase().split(' ').join('_')
    room = room.trim().toLowerCase().split(' ').join('_')

    const validCharacters =  (string) => {
        return /^[0-9a-zA-Z_.-]+$/.test(username);
    }
console.log(room)
    if (!validCharacters(username)) return { error: 'Invalid characters.'}
    if (!validCharacters(room)) return { error: 'Invalid room name.'}

    if(username.length >  15 || username.length < 1) return { error: 'Username must be between 1 and 20 characters.' }
    if(room.length >  15 || room.length < 1) return { error: 'Room must be between 1 and 20 characters.' }
    
    const userExists = users.find((user) => {
        return room === user.room && username === user.username
    })

    if(userExists) {
        return { error: 'Username taken.' }
    }  

    // username and room passed validation checks
    const user = {id, username, room}
    users.push(user)

    return { user }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getAllUsers = () => {
    return users
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

const getActiveRooms = () => {

        let roomList = []
        users.forEach(user => {
            // returns true if room is already in roomsList
            const room = roomList.find(name => name.room === user.room)
            // if room is true just increase the count, else add the room to roomList
            room ? room.count++ : roomList.push({room: user.room, count: 1})
        });
          // sort roomList by highest number of users
          roomList.sort((a, b) => b.count-a.count);
      
          return roomList 
}

const removeUser = (id) => {
    // index = -1 for no match
    const index = users.findIndex((user) => {
        // return true if user.id = user we are looking for
        return user.id === id 
    })

    // remove user from users array and return the user removed
    if(index !== -1){
        return { user: users.splice(index, 1)[0] }
    }

    return { error: 'user was not in a room.' }
}
      
module.exports = {
    addUser,
    getUser,
    getAllUsers,
    getUsersInRoom,
    getActiveRooms,
    removeUser
}