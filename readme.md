# empty-cms
CMS for empty

## Installation:

### Install libpng-dev for pngquant (need for webpack):
```bash
$ [sudo] apt-get install --no-install-recommends gcc make libpng-dev
```

### Install other npm modules:
```bash
$ npm i
```

### Build app:
```bash
$ npm run build
```

### Other

### weinre - WEb INspector REmote.

Install
```bash
$ [sudo] npm i [-g] weinre
```

To run
```bash
$ weinre --boundHost 172.21.1.215 --httpPort 8080
```

To bound ip
> --boundHost 172.21.1.215

To bound port
> --httpPort 8080

Add in your index.html
```HTML
<script src="http://172.21.1.215:8080/target/target-script-min.js#anonymous"></script>
```

### Fix IDEA file watching

1. Add the following line to either /etc/sysctl.conf file or a new *.conf file (e.g. idea.conf) under /etc/sysctl.d/ directory:
```
fs.inotify.max_user_watches = 524288
```

2. Then run this command to apply the change:
```bash
$ sudo sysctl -p --system
```

And don't forget to restart your IDE.

Note: the watches limit is per-account setting. If there are other programs running under the same account which also uses Inotify the limit should be raised high enough to suit needs of all of them.


### NPM packages

You can use npm-check-updates
```bash
$ [sudo] npm i -g npm-check-updates
$ ncu [-u]
```

## Setup environment for Ubuntu
At first install nodejs (if needed).

### webpack
```bash
$ sudo apt-get clean
$ sudo apt-get update
$ sudo apt-get install nasm
$ sudo apt-get install build-essential
$ sudo apt-get install gcc
$ sudo apt-get install --no-install-recommends -y gcc make libpng-dev
```

### html-pdf
```bash
$ sudo apt-get install libfontconfig
```

## Favicon generator for PWA
https://www.favicon-generator.org

## Static server

### Install
```bash
$ sudo npm i static-server
```

### Run
```bash
$ cd dist
$ static-server --port 8888 --not-found ./index.html
```
