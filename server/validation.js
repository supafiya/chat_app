const validation = {
	identities : function (str) {
		let newStr = str.trim();
		let newStr2 = newStr.toLowerCase();
		if (newStr.length === 0 || newStr.length < 4 || newStr.length > 16 ) {
			return false;
		} else if (newStr2.includes("/")) {
			return false;
		} else if (newStr2.includes("admin")) {
			return false;
		} else {
			return true;
		}
	},
	messageInput : function (msg) {
		let newMsg = msg.trim();
		if (newMsg.length === 0) {
			return 'Cannot send an empty message!';
		} else if (1 === 2) {
			//placeholder
			return true
		}
		else {
			return true;
		}
	}
}; // end of valication object

module.exports = validation;