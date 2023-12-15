const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("cross", {
	setWindowTitle: (title) => ipcRenderer.send("setWindowTitle", title),
})
