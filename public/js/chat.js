const socket = io()


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// URL Params
const username = urlParams.get('username').split(' ').join('_').toLowerCase()
const room = urlParams.get('room')

// DOM Elements
var $roomTitle = document.querySelector(".room-title")
var $userListTitle = document.querySelector(".list-title")
var $userList = document.querySelector(".users")
var $messages = document.querySelector('#messages')

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

// Icons
const leaveIcon = '<i class="fa fa-sign-out"></i>'

socket.emit('join', { username, room }, (error) => {

    if(error){
        alert(error)
        location.href = '/'
    }
})

$messages.scrollTop = $messages.scrollHeight;
$messageFormInput.focus()

socket.on('roomData', ({ room, users, currentUser }) => {

    $roomTitle.innerHTML = room
    $userListTitle.innerHTML = `Users`

    $userList.innerHTML = users.map(function (user) {
        if(user.username == username) return `<li>${user.username}<a href="/?username=${user.username}">${leaveIcon}</a></li>`

        return `<li>${user.username}</li>`;
    }).join(' ');
})

socket.on('message', (message) => {
    console.log(`client chatroom message received from server: ${message.username} - ${message.message} - ${moment(message.createdAt).format('h:mm a')}`)

        // Render message on UI
        const newMessage = 
        `<div class="message">
            <p>
                <span class="message__name">${message.username}</span>
                <span class="message__meta">${moment(message.createdAt).format('h:mm a')}</span>
            </p>
            <p>${message.message}</p>
        </div>`

        $messages.innerHTML += newMessage
        $messages.scrollTop = $messages.scrollHeight;
})

$messageForm.addEventListener('submit', (e) => {
    // Prevent full page refresh
    e.preventDefault()

    // Disable form button once the form is submitted
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('message', message, (data) => {
        // Runs when event is acknowledged by client

        // Enable form button once message has been sent
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(data){
            return console.log(data)
        }
    })
})
