'use strict';
const chalk = require('chalk');

module.exports.added = function (str) {
	return `\n   ${chalk.green('added  ')} ${str}`;
};

module.exports.exists = function (str) {
	return `\n   ${chalk.cyan('exists ')} ${str}`;
};

module.exports.error = function (str) {
	return `\n   ${chalk.red('error ')} ${str}`;
};

module.exports.install = function (str) {
	return `\n   ${chalk.yellow('install')} ${str} \n`;
};

