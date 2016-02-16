import path from 'path';
import test from 'ava';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import pify from 'pify';
import fullPkg from './test/_package_full.json';
import noDepsPkg from './test/_package_nodeps.json';
import withDepsPkg from './test/_package_withdeps.json';
import fs from 'fs';

let generator;
const tempPath = path.join(__dirname, 'temp');

test.beforeEach(async () => {
	await pify(helpers.testDirectory)(tempPath);
	generator = helpers.createGenerator('../app', ['../app'], null, {skipInstall: true});
});

test.serial('writes to files', async () => {
	await pify(fs.writeFile)(path.join(tempPath, '.gitignore'), 'node_modules');
	await pify(fs.writeFile)(path.join(tempPath, 'package.json'), JSON.stringify(fullPkg, null, 2));

	await pify(generator.run.bind(generator))();

	assert.file([
		'.gitignore',
		'package.json'
	]);

	assert.fileContent('.gitignore', /\.nyc_output/);
	assert.fileContent('.gitignore', /coverage/);
	assert.fileContent('package.json', /"xo && nyc ava"/);
	assert.fileContent('package.json', /"nyc":/);
});

test.serial('adds dependencies if empty', async () => {
	await pify(fs.writeFile)(path.join(tempPath, '.gitignore'), 'node_modules');
	await pify(fs.writeFile)(path.join(tempPath, 'package.json'), JSON.stringify(noDepsPkg, null, 2));

	await pify(generator.run.bind(generator))();

	assert.fileContent('package.json', /"dependencies":/);
	assert.fileContent('package.json', /"nyc":/);
});

test.serial('ignore pre-existing nyc dependency', async () => {
	await pify(fs.writeFile)(path.join(tempPath, '.gitignore'), 'node_modules');
	await pify(fs.writeFile)(path.join(tempPath, 'package.json'), JSON.stringify(withDepsPkg, null, 2));

	await pify(generator.run.bind(generator))();

	assert.fileContent('package.json', '"nyc": "^10.10.10"');
});

test.serial('ignore pre-existing gitignore values', async () => {
	await pify(fs.writeFile)(path.join(tempPath, '.gitignore'), '.nyc_output coverage');
	await pify(fs.writeFile)(path.join(tempPath, 'package.json'), JSON.stringify(withDepsPkg, null, 2));

	await pify(generator.run.bind(generator))();

	assert.fileContent('.gitignore', '.nyc_output coverage');
	assert.noFileContent('.gitignore', /\\n\\r/g);
});