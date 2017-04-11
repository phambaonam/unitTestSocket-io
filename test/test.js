/**
 * Created by Doremon on 4/5/17.
 */
// TODO: + User connect,+ User join a room,+ User sends a message to chat room , + User sends a private message to another user

const chai = require('chai');
const io = require('socket.io-client');
const server = require('../app');
const options = {
    transports: ['websocket']
    , forceNew: true
};
const socketURL = 'http://localhost:3000';
let Client = io.connect(socketURL, options);
let Client1 = io.connect(socketURL, options);


chai.should();

let userAfter = [{id: 1, username: 'Nam', pwd: 123}];

let userBefore;
describe('Test Chat socket io team node.js', function () {

    it('User connecting', function (done) {
        // send clientId when an user login success
        Client.emit('send clientId', userAfter[0].id);
        Client.on('user connect', function (connectClient, roomList, user) {
            connectClient.should.be.a('Object');
            connectClient.should.deep.equals({
                id: 1,
                username: "Nam",
                pwd: 123,
                friend: {},
                room: [],
                socketId: "EEbgFg_YSW8w_HTqAAAA"
            });
            connectClient.username.should.equal(userAfter[0].username);
            roomList.should.be.a('Object');
            roomList.should.deep.equals({});
            user.should.be.a('Array');
            user.should.deep.equals([{
                id: 1, username: 'Nam', pwd: 123, friend: {}, room: [], socketId: "EEbgFg_YSW8w_HTqAAAA"
            }, {id: 2, username: 'Mon', pwd: 'abc', friend: {}, room: [], socketId: "irgiergrergeruhgi"}]);
            let User = user.find(ele => ele.id === 1);
            User.socketId.should.equal('EEbgFg_YSW8w_HTqAAAA');
            userBefore = user;
            done();
        })
    });

    it('User reconnect',function (done) {
        Client.on('reconnect',function (connectClient,roomList) {
            connectClient.should.be.a('Object');
            connectClient.should.deep.equals({id: 1, username: "Nam", pwd: 123, friend: "", rooms: "",socketId:"sMS8KRFHLZO3P0xUAAAA"});
            roomList.should.a.be('Object');
            roomList.should.deep.equals({});
            done()
        });
    });

    // it('User disconnect',function (done) {
    //     Client.emit('disconnect',userAfter.username);
    //     Client.on('user disconnect',function (username) {
    //         username.should.equal('Nam' );
    //         done();
    //     });
    //     // Client.disconnect();
    // });

    it('User create rooms', function (done) {
        Client.emit('create room', 1, 'Node.js');
        Client.on('new room', function (newRoom) {
            newRoom.should.deep.equals({clientName: 'Nam', newRoomId: 'ryif81rpl', newRoomName: 'Node.js'});
            done()
        });
        Client.on('update room', function (roomList) {
            roomList.should.equal('Node.js');
            done()
        });
        let err = true;
        if (err) {
            Client.on('create room error', function (data) {
                data.should.equal(userAfter.username + ' can not create room');
            });
        }
    });

    it('User join room', function (done) {
        Client1.emit('Join room', 1, 'ryif81rpl');
        let userInRoom = true;
        if (!userInRoom) {
            Client1.on('join room', function (newRoom) {
                newRoom.should.deep.equals(1);
                done()
            });
        } else {
            Client1.on('join room error', function (msg) {
                msg.should.equal("You are already in the room!");
                done()
            });
        }
    });

    it('User leave room', function (done) {
        Client1.emit('leave room', 1, 'ryif81rpl');
        let userLeftRoom = true;
        if (userLeftRoom) {
            Client1.on('leave room', function (data) {
                data.should.be.a('Object');
                data.should.deep.equals({roomId: 'ryif81rpl', roomName: 'Node.js'});
                done();
            });
        } else {
            Client1.on('leave room', function (msg) {
                msg.should.equal('"You are not in the room!"');
                done()
            });
        }
    });

    it('User delete room', function (done) {
        Client1.emit('user delete room', 1, 'ryif81rpl');
        Client1.on('delete room', function (roomId, roomName, roomList) {
            roomId.should.equal('ryif81rpl');
            roomName.should.equal('Node.js');
            roomList.should.deep.equals({});
            done()
        });
    });

    it('User send private', function (done) {
        Client1.emit('send private', 1, 2);
        let friend = false;
        if (friend) {
            Client1.on('create private chat', function (newRoomId, newRoomName, senderUsername, receiverUsername) {
                newRoomId.should.equal('1--2');
                newRoomName.should.equal('Nam - Mon');
                senderUsername.should.equal('Nam');
                receiverUsername.should.equal('Mon');
                done();
            });
        }
        else {
            Client1.on('create private chat', function (newRoomId, newRoomName, senderUsername, receiverUsername) {
                newRoomId.should.equal('1--2');
                newRoomName.should.equal('Nam - Mon');
                senderUsername.should.equal('Nam');
                receiverUsername.should.equal('Mon');
                done();
            });
        }
    });
    // TODO:  bug /* :( */
    it('User private message', function (done) {
        let data = {roomId: "1--2", message: "Hello"};
        Client1.emit('Private message', data);
        Client1.on('private message', function (data) {
            data.should.deep.equals({
                message: "Hello",
                roomId: "1--2",
                roomName: "Nam - Mon",
                username: "Mon"
            });
            done();
        });
    });

    it('User send message to another', function (done) {
        let data = {roomId: "1--2", message: "Hello"};
        Client.emit('chat message', data);
        Client1.on('chat message', function (data) {
            data.should.deep.equals({
                message: "Hello",
                roomId: "1--2",
                username: "Nam"
            });
            done();
        });
    });

});

