## Viết Unit test socket-io
* git clone
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

* test.js

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
* User leave room.
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



