# Mô tả các properties và methods của chat rooms

## Properties của mỗi room. Mỗi room sẽ là 1 object chứa các cặp key-value lưu properties

1. room id : một unique id đc gán cho mỗi room khi room đó được khởi tạo
2. room name: tên do client đặt 
3. room creator: tên của client tạo ra room này (hiện tại mặc định là client name là unique)
4. quantity: số lượng clients trong 1 room
5. clients: array chứa clients trong 1 room (có thể lưu client unique token)

```js
    const room1 = {
        id : 'uuid code',
        name: 'client set room name',
        creator: 'client name',
        quantity: integer,
        clients: array [client1, client2,...]
    }
    // hoặc lưu tất cả các room vào object 
    const allRooms = {
        room1 : {...},
        room2 : {...},
        ......
    }
    //allRooms[room1] = room1; 
```
## Methods của mỗi room

1. Create: clients có thể tạo room mới và đặt tên. Room name có thể là unique hoặc không vì room id sẽ là unique
2. Delete: cho phép creator của mỗi room xóa room đó đi. Chỉ creator mới được phép xóa room
3. Join: clients tham gia room khi click vào room đó -> quantity và clients của phòng sẽ đc cập nhật
4. Leave: rời phòng -> tương tự cập nhật quantity và clients của room đó

### Create room event: 1 room object mới được tạo ra

* Room ID được tạo 
* Room name lưu thông tin client truyền vào
* Room creator là tên client
* Quantity: 1
* Clients: array chứa 1 phần tử là creator 
#### Socket.on('create_room',....)

* nhận creatorID và room name đc emit từ client -> tạo uuid cho room -> let newRoom = new Room(uuid, name, creatorID)
* push room mới này vào allRooms - array chứa tất cả rooms
* room.addClient(creatorID)
* cập nhật thông tin bên user/client -> client.createRoom = newRoom; 

### Delete room event: xóa room object này khỏi object tổng chứa tất cả các room objects

* Xóa room object
* Báo clients trong room là room này đã bị xóa -> cập nhật danh sách room
* Cập nhật danh sách rooms của mỗi clients

### Join hoặc Leave room event: 1 client tham gia hoặc rời 1 room
* cập nhật quantity và clients của room
* cập nhật danh sách room của client đó


