var {
    app,
    BrowserWindow
} = require('electron');

app.on('ready', event => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });
    win.setMenu(null);
    win.webContents.openDevTools()

    win.loadURL(`file://${__dirname}/html/index.html`);
});