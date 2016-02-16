'use strict';
const fs = require('fs');

module.exports = function fileExists(path) {
	try {
		fs.statSync(path);
		return true;
	} catch (err) {
		return !(err && err.code === 'ENOENT');
	}
};
