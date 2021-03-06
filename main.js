/**
 * Created by nuintun on 2015/11/5.
 */

'use strict';

// node module
var path = require('path');
// module to control application life
var electron = require('electron');
var app = electron.app;
var Menu = electron.Menu;
var Tray = electron.Tray;
// module to create native browser window
var BrowserWindow = electron.BrowserWindow;
// custom module
var windowControl = require('./bin/window-control');
var openDirectory = require('./bin/open-directory');
var AppConfigure = require('./bin/app-configure');
var thread = require('./bin/thread');

// keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed
var mainTray = null;
var mainWindow = null;
// const var
const APPNAME = '命令管理器';
const ICON = path.join(__dirname, './app.ico');
const INDEX = 'file:///' + path.join(__dirname, 'index.html');

// quit when all windows are closed
app.on('window-all-closed', function (){
  app.quit();
});

// this method will be called when atom-shell has done everything
// initialization and ready for creating browser windows
app.on('ready', function (){
  // create the tray window
  mainTray = new Tray(ICON);

  mainTray.setToolTip(APPNAME);
  mainTray.setContextMenu(Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: function (){
        mainWindow.show();
      }
    },
    {
      label: '退出程序',
      click: function (){
        app.quit();
      }
    }
  ]));

  // create the browser window
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: ICON,
    'min-width': 1024,
    'min-height': 768,
    title: APPNAME,
    frame: false,
    center: true,
    'use-content-size': true
  });

  // and load the index.html of the app
  mainWindow.loadURL(INDEX);
  // emitted when the window is closed
  mainWindow.on('closed', function (){
    // dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element
    mainTray.destroy();

    mainTray = null;
    mainWindow = null;
  });

  // window control
  windowControl(ICON, mainWindow, mainTray);

  // open directory
  openDirectory(mainWindow);

  // app configure
  new AppConfigure(mainWindow, mainTray);

  // emulator start
  thread.start();
});
