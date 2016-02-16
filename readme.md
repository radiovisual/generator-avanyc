# generator-avanyc [![Build Status](https://travis-ci.org/radiovisual/generator-avanyc.svg?branch=master)](https://travis-ci.org/radiovisual/generator-avanyc)

> [Yeoman](http://yeoman.io/) generator that quickly adds [nyc](https://github.com/bcoe/nyc) test coverage to your [AVA](https://github.com/sindresorhus/ava) projects


## Install

```
$ npm install --global generator-avanyc
```


## Usage

From within your AVA project's root directory, run:

```
$ yo avanyc
```

## Process

This generator updates your existing `.gitignore` and `package.json` files, and it automatically installs the nyc
dependency for you. If your project does not have a `.gitignore` or `package.json` file, no files will be updated.
This module won't overwrite existing entries, and it won't delete anything from your existing files.
See below for process details.

##### .gitignore

The following entries are added to your `.gitignore` file:

```
.nyc_output
coverage
```

##### package.json

The necessary entries are added to your `package.json` file:

```
scripts: {
    "test" : "nyc ava"
    ...
},

"dependencies" : {
    "nyc": "*"
    ...
}
```

##### dependencies

[nyc](https://github.com/bcoe/nyc) is automatically installed for you via:

```
npm install
```

### Related

- [generator-nm](https://github.com/sindresorhus/generator-nm) Scaffold out a node module with the [AVA](https://github.com/sindresorhus/ava) test runner

## License

MIT © [Michael Wuergler](http://numetriclabs.com)
