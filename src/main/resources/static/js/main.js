var joinForm = document.querySelector("#joinForm");
var leaveForm = document.querySelector("#leaveForm");

var messageForm = document.querySelector("#messageForm");
var messageInput = document.querySelector("#messageInput");

var chatMessages = document.querySelector("#chatMessages");
var membersList = document.querySelector("#members-list");

var username = null;

var stompClient = null;

var colours = {};

function connect(event) {
    event.preventDefault();

    username = document.querySelector("#userNameInput").value.trim();
    if (username)  {

        stompClient = new StompJs.Client({
            brokerURL: "ws://localhost:8080/chatroom",
        });

        stompClient.onConnect = onConnect;
        
        stompClient.onDisconnect = onDisconnect;

        stompClient.onWebSocketError = (error) => {
            console.error('Error with websocket', error);
        };

        stompClient.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };
        
        
        stompClient.activate();
        
        
    }


}

function disconnect() {
	stompClient.deactivate();
}

function onError(error) {
    console.log(error)
}

function onConnect(frame) {
    // subsribe to topic
    console.log("Connected" + frame);
    stompClient.subscribe("/topic/public", onMessage);

    document.querySelector("#userNameInput").disabled = true;
    messageInput.disabled = false;
    joinForm.classList.add("d-none");
    leaveForm.classList.remove("d-none");

    stompClient.publish({ 
		destination: "/app/chat.add", 
		body: JSON.stringify({ sender: username, type: "JOIN" }),
		headers: {'content-type': 'application/json'}
	});
}

function onDisconnect(frame) {
	console.log("Disconnect" + frame);
	
	document.querySelector("#userNameInput").disabled = false;
	messageInput.disabled = true;
    leaveForm.classList.add("d-none");
    joinForm.classList.remove("d-none");
}

function onMessage(payload) {
    var message = JSON.parse(payload.body)
    console.log(message);
    
    if(message.type == 'JOIN') {
		colours[username] = getRandomColor();
		
		var item = document.createElement('li');
		item.classList.add('chat-msg-box');
		item.classList.add('chat-msg-box--notice');
		
		item.innerText = "You Have Enter the Chat Room";
		
		if(message.sender != username) {
			item.innerText = message.sender + " just entered the room";
		}
		
		chatMessages.appendChild(item);
	}
	if(message.type == 'LEAVE') {
		
		var item = document.createElement('li');
		item.classList.add('chat-msg-box');
		item.classList.add('chat-msg-box--notice');
		
		item.innerText = "You Have Left the Chat";
		
		if(message.sender != username) {
			item.innerText = message.sender + " just left the room";
		}
		
		chatMessages.appendChild(item);
	}
    if(message.type == 'CHAT'){
		var item = document.createElement('li');
		item.classList.add('chat-msg-box');
		
		if(message.sender != username) {
			item.classList.add('chat-msg-box--others');
			item.style.backgroundColor = colours[username];
		}
		
		item.innerText = message.content;
		
		chatMessages.appendChild(item);
	}

}

joinForm.addEventListener("click", connect, true);
leaveForm.addEventListener("click", disconnect, true);

function sendMessage(event) {

    event.preventDefault();

    var content = messageInput.value.trim();

    if (content && stompClient) {
        var message = {
            sender: username,
            content: content,
            type: "CHAT"
        }

        stompClient.publish({destination: "/app/chat.send", body: JSON.stringify(message)});
    }
    
    messageInput.value = '';
    
}

messageForm.addEventListener("submit", sendMessage, true);

function getRandomColor() {
    var letters = 'BCDEF'.split('');
    var colour = '#';
    for (var i = 0; i < 6; i++ ) {
        colour += letters[Math.floor(Math.random() * letters.length)];
    }
    return colour;
}