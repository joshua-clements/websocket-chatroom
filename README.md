# websocket-chatroom
A simple chat application using node.js and socket.io that allows for the creation of multiple rooms.

A simple chat project with user creatable rooms using socket.io

## How to use

```
$ cd websocket-chatroom
$ npm install
$ npm start
```

And point your browser to http://localhost:3000. Optionally, specify a port by supplying the PORT env variable.

## Features

- Multiple users can join a chat room by each entering a unique username.
- Users can join an existing chat room or create their own by entering a unique chat room name.
- Dynamic list of all currently populated rooms and their user count.
- Dynamic list of all users in the current chat room. 
- Users can type chat messages to the chat room they are currently in.
- A notification is sent to all users in a chat room when a user joins or leaves.
