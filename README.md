# med-app using Ionic Framework and Firebase(under construction yet...)
Drug Adherence Monitoring and Reminder

* Project's Home: https://github.com/achatzit/med-app

## Dependecies, Run and Build 

### Install NodeJS dependencies

Run `npm install` to install all needed dependencies.

### Install Ionic Framework

Run `npm install -g ionic cordova` to install ionic framework.


### Run the app
Use `ionic serve –l` to run the app in browser and watch for changes in code

or

use `ionic serve` to just run the app for a browser preview

or

use `ionic serve --lab` to run the app in a browser on two platforms at the same time.

### Add a platform

#### Install Bower Package Manager

Run `npm install –g bower` to install bower package manager.

```bash
$ ionic platform add android
```

Supported Cordova platforms:

```bash
$ ionic platform add android
$ ionic platform add ios
```

### Build the app

```bash
$ ionic build android
$ ionic build ios
```

### Εmulate the app on simulator
iOS:

```bash
$ ionic emulate ios 
```

Android:

```bash
$ ionic emulate android 
```
