class ChatEngine{
    constructor(chatBoxId, userEmail){
        // Use document.getElementById to select the chat box element
        this.chatBox = document.getElementById(chatBoxId);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail){
            this.connectionHandler();
        }

    }


    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'linkify'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })


        });

        // Use document.getElementById and addEventListener to handle the click event
        let sendButton = document.getElementById('send-message');
        sendButton.addEventListener('click', function(){
            // Use document.getElementById and value to get the input value
            let msg = document.getElementById('chat-message-input').value;

            if (msg != ''){
                console.log(msg);
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'linkify'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);

            // Use document.createElement to create a new list item
            let newMessage = document.createElement('li');

            // Use classList.add to add classes to the element
            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.classList.add(messageType);

            // Use innerHTML to set the content of the element
            newMessage.innerHTML = `<span>${data.message}</span><sub>${data.user_email}</sub>`;

            // Use document.getElementById and appendChild to add the element to the list
            let messageList = document.getElementById('chat-messages-list');
            messageList.appendChild(newMessage);
        })
    }
}
