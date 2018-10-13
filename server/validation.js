exports.isRealString = function (str) {
  newStr = str.trim();
	if (newStr.length === 0 || newStr.length < 4 || newStr.length > 16 ) {
		return false;
	} else {
		return true;
	}
};