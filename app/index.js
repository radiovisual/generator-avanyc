'use strict';
var validFile = require('valid-file');
var yeoman = require('yeoman-generator');
var messages = require('./messages');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');

module.exports = yeoman.Base.extend({
	init: function () {
		this.message = '';
	},
	gitignore: function () {
		var gitignore = path.join(this.destinationRoot(), '.gitignore');

		if (validFile.sync(gitignore)) {
			var gitignoreContents = fs.readFileSync(gitignore, 'utf8');

			if (gitignoreContents) {
				var newContents = gitignoreContents;

				var addnycoutput = !/\.nyc_output/.test(gitignoreContents);
				var addcoverage = !/coverage/.test(gitignoreContents);

				var nyMsg = messages.exists;
				if (addnycoutput) {
					newContents += '\n.nyc_output';
					nyMsg = messages.added;
				}

				var cvMsg = messages.exists;
				if (addcoverage) {
					newContents += '\ncoverage';
					cvMsg = messages.added;
				}

				this.message += nyMsg(chalk.gray('.gitignore >> ') + '.nyc_output');
				this.message += cvMsg(chalk.gray('.gitignore >> ') + 'coverage');

				if (newContents !== gitignoreContents) {
					fs.writeFileSync(gitignore, newContents);
				}
			}
		} else {
			this.message += messages.errorMsg('.gitignore not found. Cannot add nyc context.');
		}
	},
	packageJSON: function () {
		var packagejson = path.join(this.destinationRoot(), 'package.json');

		if (validFile.sync(packagejson)) {
			var packagejsonContents = fs.readFileSync(packagejson, 'utf8');

			var pkgmsg = messages.exists;
			if (packagejsonContents) {
				var json = JSON.parse(packagejsonContents);

				if (json.scripts.test) {
					if (/nyc ava/.test(json.scripts.test) === false) {
						json.scripts.test = json.scripts.test.replace('ava', 'nyc ava');
						pkgmsg = messages.added;
					}
				} else {
					json.scripts.test = 'nyc ava';
					pkgmsg = messages.added;
				}

				this.message += pkgmsg(chalk.gray('package.json >> ') + json.scripts.test);

				var depmsg = messages.exists;
				if (json.dependencies) {
					if (!json.dependencies.hasOwnProperty('nyc')) {
						json.dependencies.nyc = '*';
						depmsg = messages.added;
					}
				} else {
					json.dependencies = {nyc: '*'};
					depmsg = messages.added;
				}
				this.message += depmsg(chalk.gray('package.json dependencies >> ') + 'nyc: ' + json.dependencies.nyc);

				fs.writeFileSync(packagejson, JSON.stringify(json, null, 2));
			}
		} else {
			this.message += messages.error('package.json not found. Cannot add nyc context.');
		}
	},
	end: function () {
		this.message += messages.install('nyc');
		this.log(this.message);
		this.npmInstall();
	}
});
