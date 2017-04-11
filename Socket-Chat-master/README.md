# CHAT APPLICATION WITH SOCKET.IO

#### Collaborate with Nguyen and Dat
* Nguyen: register, authentication, login and private chat
* Dat: public room and fix bugs
* Linh: public room, private chat and set up socket.io events 

#### Clone the git folder and run command: 
```js
    npm i
    npm start
    // Go to localhost:3000
```

 Register an account -> Login with the account -> Enter chat room 

## STORE DATA IN SERVER VIA ARRAYS AND OBJECTS:
* allRoomObj = {} : stores all public room objects
```js
    allRoomObj = {
        publicRoomId: {/*room obj instance of class ROOM */},
        publicRoomId1: {...},
        ...
    }
```

* roomList = {} : each key-value pair is roomId: roomName -> used for updating room list in front end
```js
    roomList = {
        publicRoomId: publicRoomName,
        publicRoomId1: publicRoomName1,
        ...
    }
```

* allPrivateRoom = {}: stores all private room objects
```js
    allPrivateRoom = {
        privateRoomId: {/*room object instance of class PrivateRoom */},
        privateRoomId1: {...},
        ...
    }
```
* user = []: each element in the array is user object instance of class User

* token = []: each element in the array is user object instance of class Token

## REGISTER/ LOGIN: new users can register username and password. After logging in successful 
* Register

* Authenticate: all functions and socket.io events relating to authentications are written in **auth.js** and then imported in **app.js**

* Login success -> Redirect to chat room by window.location.href -> connect to index.html -> send clientId to server

## PUBLIC ROOM CHAT: Each public room is an instance of class ROOM in **room.js**

```js
    // e.g: in app.js
    const ROOM = require('./room.js');
    const newPublicRoom = new ROOM(roomId, roomName, clientId);
```

* Each room has inherited methods of adding, removing clients to the room.
* In **app.js**, there are 4 public room functions: createRoom, deleteRoom, joinRoom, leaveRoom. In each function, check if there are any error (e.g. params are correctly passed in, rooms exit, clients are already in room or not)

## PRIVATE ROOM CHAT ONLY BETWEEN 2 CLIENTS: Each private room is an instance of class PrivateRoom in **private_room.js**

```js
    // e.g: in app.js
    const PrivateRoom = require('./private_room.js');
    const newPrivateRoom = new ROOM(senderId, receiverId, senderName, receiverName);
```

* Each room has inherited method of adding clients
* In **app.js**, the private room function is createPrivateRoom

## SOCKET.IO EVENTS:
* A client connects to index.html -> emit clientId to server ('send clientId' event) -> server send back room and user list for clients to update in client-side ('user connect' event)
* If a client reloads the page, their existing rooms are kept (no database so no chat history, only room box)
* Clients can create new public chat room (by submit room form) -> emit 'create room' event to server -> server creates new public room instance -> emit back new room data to client ('new room' event) to create new chat box and update room list in client-side, if error ('create room error' event). Similarly, join, leave, delete room events follow the same logic.
 
* PRIVATE CHAT
1. Send private messages to another client by click on 'chat' button in user list
2. Emit to server the senderId and receiverId ('send private' event) 
3. Server checks if private room between these two clients exists -> if exits -> send back that room data to sender ('create private chat' event)-> create private chat box in client-side of the sender
4. If no room exists -> create a private room -> update sender and receiver's friend property -> send back that room data to sender ('create private chat' event)-> create private chat box in client-side
5. When the sender submits a msg -> emit 'private message' event to server-> server identifies senderId, receiverId and gets the current socketId of receiver -> only emit 'private message' to the receiver 
6. Receiver receives 'private message' event -> if a chat box is not yet created in client-side -> create private chat box in client-side of the receiver -> display the message in the chat box

## IDEAS TO IMPROVE THE APP:
* Better CSS: improve responsiveness, overflow of long message
* Hide and Show room chat in client-side: e.g. Each chat box has a close buttton -> clicking on it will hides the chat box. Clicking on the public room name will show the box again 
* Spam detection and prevention 
* Disconnection events: users logs out
