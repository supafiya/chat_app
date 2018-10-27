const validation = {
	identities : function (str) {
		let strArr = str.split('');
		let newStr = str.trim().replace(/_SPACE_/gi, " ");
		let newStr2 = newStr.toLowerCase()
		function isChar(element, index, array) {
  		return element.match(/[\w ]/);
		}
		if (strArr.every(isChar)) {
			if (newStr.length === 0 || newStr.length < 4 || newStr.length > 16 ) {
				return false;
			} else if (newStr2.includes("admin")) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		};
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