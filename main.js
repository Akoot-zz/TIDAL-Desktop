/* Electron imports */
const electron = require('electron')
const {app, BrowserWindow, Menu, globalShortcut} = electron;

const path = require('path')

var mainWindow

/* Toggle development mode */
process.env.NODE_ENV = 'development'

/* Load flash player */
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, '/plugins/libpepflashplayer.so'))

/* Class names of controlls to click() on */
const play_btn = 'play-controls__play js-play'
const pause_btn = 'play-controls__pause js-pause'
const next_btn = 'play-controls__next js-next'
const previous_btn = 'play-controls__previous js-previous'
const add_to_favorites_btn = 'js-item-action js-favorite js-add-favorite'
const remove_from_favorites_btn = 'js-item-action js-favorite js-remove-favorite'
const repeat_btn = 'play-controls__repeat js-repeat'
const repeat_active_btn = 'play-controls__repeat js-repeat active'
const mute_btn = 'js-volume-status volume-control__volume-status'

/* Create the window */
function createWindow () {

    /* Register Shortcuts */
    globalShortcut.register('MediaPlayPause', playPause)
    globalShortcut.register('MediaNextTrack', nextTrack)
    globalShortcut.register('MediaPreviousTrack', prevTrack)
    globalShortcut.register('CmdOrCtrl+Shift+F', addToFavorites)
    globalShortcut.register('CmdOrCtrl+Alt+F', removeFromFavorites)
    globalShortcut.register('CmdOrCtrl+Shift+R', cycleRepeat)

    /* Create the window */
    mainWindow = new BrowserWindow({width: 1350, height: 800, center: true, icon: './assets/icons/512x512', webPreferences: {plugins: true}})
    mainWindow.on('closed', function () {
        mainWindow = null
    })

    /* Load the TIDAL home page */
    mainWindow.loadURL('https://listen.tidal.com')

    /* Add a custom menu bar */
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
}

/* Create the menu bar */
const menuTemplate = [
{
    label: 'File',
    submenu: [
    {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click() {forceQuit()}
    }
    ]
},
{
    label: 'Playback',
    submenu: [
    {
        label: 'Pause/Play',
        accelerator: 'MediaPlayPause',
        click() {playPause()}
    },
    {
        label: 'Next Track',
        accelerator: 'MediaNextTrack',
        click() {nextTrack()}
    },
    {
        label: 'Previous Track',
        accelerator: 'MediaPreviousTrack',
        click() {prevTrack()}
    },
    {
        label: 'Mute',
        accelerator: 'CmdOrCtrl+M',
        click() {toggleMute()}
    }
    ]
},
{
    label: 'Track',
    submenu: [
    {
        label: 'Add to Favorites',
        accelerator: 'CmdOrCtrl+Shift+F',
        click() {addToFavorites()}
    },
    {
        label: 'Remove from favorites',
        accelerator: 'CmdOrCtrl+Alt+F',
        click() {removeFromFavorites()}
    },
    {
        label: 'Cycle Repeat mode',
        accelerator: 'CmdOrCtrl+Shift+R',
        click() {cycleRepeat()}
    }
    ]
}
];

/* Add developer tools if in development mode*/
if(process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Dev',
        submenu: [
        {
            label:'Toggle Developer Tools',
            accelerator: 'CmdOrCtrl+I',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools()
            }
        },
        {
            role: 'reload'
        }
        ]
    });
}

/* Playback Controls */
function nextTrack() {
    mainWindow.webContents.executeJavaScript(`var n=document.getElementsByClassName("${next_btn}")[0];null!=p&&p.click();`)
}
function prevTrack() {
    mainWindow.webContents.executeJavaScript(`var p=document.getElementsByClassName("${previous_btn}")[0];null!=p&&p.click();`)
}
function playPause() {
    mainWindow.webContents.executeJavaScript(`var a=document.getElementsByClassName("${play_btn}")[0],b=document.getElementsByClassName("${pause_btn}")[0];a&&null!==a.offsetParent?a.click():b&&null!==b.offsetParent&&b.click();`)
}
function addToFavorites() {
    mainWindow.webContents.executeJavaScript(`var p=document.getElementsByClassName("${add_to_favorites_btn}")[0];null!=p&&p.click();`)
}
function removeFromFavorites() {
    mainWindow.webContents.executeJavaScript(`var p=document.getElementsByClassName("${remove_from_favorites_btn}")[0];null!=p&&p.click();`)
}
function cycleRepeat() {
    mainWindow.webContents.executeJavaScript(`var a=document.getElementsByClassName("${repeat_btn}")[0],b=document.getElementsByClassName("${repeat_active_btn}")[0];a&&null!==a.offsetParent?a.click():b&&null!==b.offsetParent&&b.click();`)
}
function toggleMute() {
    mainWindow.webContents.executeJavaScript(`var p=document.getElementsByClassName("${mute_btn}")[0];null!=p&&p.click();`)
}

/* Create the window when ready */
app.on('ready', createWindow)

/* Safely quit on exit */
app.on('window-all-closed', function () {
    forceQuit()
})

/* Quit safely */
function forceQuit() {
    console.log('Quitting safely.')
    globalShortcut.unregisterAll()
    app.quit()
}
