
class Users {
	constructor() {
		this.users = [];
	}
	addUser (id, name, room) {
		let user = {id, name, room};
		this.users.push(user);
	}
	removeUser (id) {
		let user = this.getUser(id);
		if (user) {
			this.users = this.users.filter((user) => user.id !== id);
		}
		return user;
	}
	getUser (id) {
		return this.users.filter((user) => user.id === id)[0];
	}
	getUserFromName (name) {
		return this.users.filter((user) => user.name === name)[0];
	}
	getUserList (room) {
		let usersArr = this.users;
		let arr = [];
		for(let i = 0, length1 = usersArr.length; i < length1; i++){
			let currentUser = usersArr[i].room;

			for(let p = 0, length1 = currentUser.length; p < length1; p++){
				if (currentUser[p] === room) {
				arr.push(usersArr[i].name)
				}
			}
		};
		return arr;
	}
	getRoomList() {
		let usersArr = this.users;

		let roomArr = [];
		for(let i = 0, length1 = usersArr.length; i < length1; i++){
			let usersRooms = usersArr[i].room;
			for(let k = 0, length3 = usersRooms.length; k < length3; k++){
				let currentRoom = usersRooms[k]
				if (!roomArr.includes(usersRooms[k])) {
					roomArr.push(usersRooms[k])
				}
			}
		}
		return roomArr;

  }
	getRoomOccupantNumber() {
		let unique = this.getRoomList();
		let arr = [];
		if (unique) {
			for(let i = 0, length1 = unique.length; i < length1; i++) {
				let currentRoomNumber = this.getUserList(unique[i]).length;
				arr.push({i_room: unique[i], i_num: currentRoomNumber});
			}
		}
		return arr;
	}
};

module.exports = Users;
