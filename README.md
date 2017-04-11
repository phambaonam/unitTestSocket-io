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


## Viết Unit test socket-io
* git clone https://github.com/Phambaonam/unitTestSocket-io.git
* cd demoTestSocket-io
* yarn install
* npm test

## module được sử dụng:
* [socket.io-client](https://github.com/socketio/socket.io-client) : dùng để gửi các message từ client đến server trong file test
* [socket.io](https://socket.io/)
* [chai](http://chaijs.com/) , [mocha](https://mochajs.org/)

##  Các Test case chính:
* User connection.
* User create rooms.
* User join room.
* User leave room.
* User delete room.
* User send message to another.

## Các test case phụ:
* User reconnect.
* User send private.
* User private message

## Cấu hình ban đầu:
file test.js, đọc tại [socket.io-client](https://socket.io/docs/client-api/)

```javascript
    const options = {
        transports: ['websocket']
        , forceNew: true
    };
    const socketURL = 'http://localhost:3000';
    let Client = io.connect(socketURL, options);
    let Client1 = io.connect(socketURL, options);
```

## Thêm dữ liệu đầu vào:
* file test.js
```javascript
    let userAfter = [{id: 1, username: 'Nam', pwd: 123}];
```

* file app.js
```javascript
    let allRoomObj = {};
    let roomList = {};
    let user = [{id: 1, username: 'Nam', pwd: 123, friend: {}, room: []},{id: 2, username: 'Mon', pwd: 'abc', friend: {}, room: [],socketId: "irgiergrergeruhgi"}]; // user when login success
    let allPrivateRoom = {"1--2":{id:"1--2",name:"Nam - Mon",client:1,quantity:1,limit:2}};
```

## Fix cứng một số thông số để tiện cho viết unit test (do giá trị sinh ra là random và unique, khó kiểm soát, khó test)
* function create
```javascript
    //let roomId = shortid.generate();
    let roomId = "ryif81rpl";
```

* app.js

```javascript
    socket.on('send clientId', (id) => {
        // connectClient.socketId = socket.id;
           connectClient.socketId = "EEbgFg_YSW8w_HTqAAAA";
    });
```
```javascript
    socket.on('Private message', (data) => {
        // let sender = user.find(ele => ele.socketId === socket.id);
        let sender = user.find(ele => ele.socketId === 'irgiergrergeruhgi');
    });
```
```javascript
    socket.on('disconnect', () => {
        // let disconnectClient = user.find(ele => ele.socketId === socket.id);
        let disconnectClient = user.find(ele => ele.socketId === "sMS8KRFHLZO3P0xUAAAA"); // socket.id = "sMS8KRFHLZO3P0xUAAAA"
    });
```

### Một số test case chưa tìm ra được cách test:
* User reconnect.
* User private message.

### Giải thích sử dụng biến global Client, Client1:
* Ta dùng biến global Client bởi vì khi client gửi message lên server và ngược lại thì chúng đều mang data mà cả server và client cần, ví dụ:

 * client gửi data:
    ```javascript
        let user = [{id: 1, username: 'Nam', pwd: 123}];
    ```
 * server nhận và gửi lại data lên client:
    ```javascript
        id: 1, username: 'Nam', pwd: 123, friend: {}, room: [], socketId: "EEbgFg_YSW8w_HTqAAAA"
    ```
 * Khi client send message mới lên server
    ```javascript
        Client.emit('create room', 1, 'Node.js');
    ```
  * Lúc này server trả về
    ```javascript
        socket.emit('new room', {
              clientName: socket.username, // Nam
              newRoomId: newRoomId,
              newRoomName: roomList[newRoomId]
         });
    ```
     * value của clientName  là data đã được gửi lên từ trước đó

### Một số chức năng trong socket khó viết unit test

* socket.id là 1 string ngẫu nhiên do socket sinh ra và duy nhất, mỗi khi chạy lại server thì sẽ id sẽ thay đổi, để test được, ta sẽ phải fix cứng giá trị của nó , ví dụ trong file app.js:

```javascript
  socket.on('send clientId', (id) => {
        // connectClient.socketId = socket.id;
           connectClient.socketId = "EEbgFg_YSW8w_HTqAAAA";
     });
```
* Tuy nhiên, tới 1 số hàm xử lí trong socket ta không thể áp dụng điều này được:

```javascript
    socket.broadcast.to(socket.id).emit()
```

* Trong bài test này có 2 test case gặp phải trường hợp như vây:
  * User reconnect.
    ```javascript
        io.to(socket.id).emit('reconnect', connectClient, roomList);
    ```
  * User private message.
     ```javascript
         socket.broadcast.to(receiverSocketId).emit('private message');
     ```
