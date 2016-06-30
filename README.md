# medApp using Ionic Framework and Firebase (...under development...)
Drug Adherence Monitoring and Reminder

* Project's Home: https://github.com/achatzit/med-app

### Last additions
- running app on Pebble and sending msgs (30/6/2016)
- pushing notifications to Pebble (28/6/2016) (Notification Center for Pebble needed)
- connection with Pebble (27/6/2016)
- clear & cancel Notifications (21/6/2016)
- show notifications (All, Scheduled, Triggered) (19/6/2016)
- keep notifications after restart (17/6/2016)
- cancel Notifications (17/6/2016)
- schedule Repeated Notifications (17/6/2016)
- schedule Single Notifications (16/6/2016)

## Dependecies, Run and Build

### Install NodeJS dependencies

Run `npm install` to install all needed dependencies.

### Install Ionic Framework

Run `npm install -g ionic cordova` to install ionic framework.

### Install Plugins and Javascript dependencies

Windows users should run `install.bat`

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

### Run the app on phone
iOS:

```bash
$ ionic run ios
```

Android:

```bash
$ ionic run android
```
