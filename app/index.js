'use strict';
const validFile = require('valid-file');
const yeoman = require('yeoman-generator');
const messages = require('./messages');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

module.exports = yeoman.Base.extend({
	init() {
		this.message = '';
	},
	gitignore() {
		const gitignore = path.join(this.destinationRoot(), '.gitignore');

		if (validFile.sync(gitignore)) {
			const gitignoreContents = fs.readFileSync(gitignore, 'utf8');

			if (gitignoreContents) {
				let newContents = gitignoreContents;

				const addnycoutput = !/\.nyc_output/.test(gitignoreContents);
				const addcoverage = !/coverage/.test(gitignoreContents);

				let nyMsg = messages.exists;
				if (addnycoutput) {
					newContents += '\n.nyc_output';
					nyMsg = messages.added;
				}

				let cvMsg = messages.exists;
				if (addcoverage) {
					newContents += '\ncoverage';
					cvMsg = messages.added;
				}

				this.message += nyMsg(`${chalk.gray('.gitignore >>')} .nyc_output`);
				this.message += cvMsg(`${chalk.gray('.gitignore >>')} coverage`);

				if (newContents !== gitignoreContents) {
					fs.writeFileSync(gitignore, newContents);
				}
			}
		} else {
			this.message += messages.errorMsg('.gitignore not found. Cannot add nyc context.');
		}
	},
	packageJSON() {
		const packagejson = path.join(this.destinationRoot(), 'package.json');

		if (validFile.sync(packagejson)) {
			const packagejsonContents = fs.readFileSync(packagejson, 'utf8');

			let pkgmsg = messages.exists;
			if (packagejsonContents) {
				const json = JSON.parse(packagejsonContents);

				if (json.scripts.test) {
					if (/nyc ava/.test(json.scripts.test) === false) {
						json.scripts.test = json.scripts.test.replace('ava', 'nyc ava');
						pkgmsg = messages.added;
					}
				} else {
					json.scripts.test = 'nyc ava';
					pkgmsg = messages.added;
				}

				this.message += pkgmsg(`${chalk.gray('package.json >>')} ${json.scripts.test}`);

				let depmsg = messages.exists;
				if (json.dependencies) {
					if (!json.dependencies.hasOwnProperty('nyc')) {
						json.dependencies.nyc = '*';
						depmsg = messages.added;
					}
				} else {
					json.dependencies = {nyc: '*'};
					depmsg = messages.added;
				}
				this.message += depmsg(`${chalk.gray('package.json dependencies >>')} nyc: ${json.dependencies.nyc}`);

				fs.writeFileSync(packagejson, JSON.stringify(json, null, 2));
			}
		} else {
			this.message += messages.error('package.json not found. Cannot add nyc context.');
		}
	},
	end() {
		this.message += messages.install('nyc');
		this.log(this.message);
		this.npmInstall();
	}
});
