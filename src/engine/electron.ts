import { app, BrowserWindow } from "electron"
import { SETTINGS } from "./Settings"

const FRAME_ENABLED = true
const TITLEBAR_ENABLED = true
const RESCALABLE = false

const WINDOW_MARGIN = FRAME_ENABLED ? 6 : 0
const TITLEBAR_HEIGHT = RESCALABLE ? 29 : 23
const WINDOWS_TITLE_BAR_HEIGHT = TITLEBAR_ENABLED ? TITLEBAR_HEIGHT : 0

const createWindow = () => {
	const win = new BrowserWindow({
		width: SETTINGS.SCREEN_SIZE_X + WINDOW_MARGIN,
		height:
			SETTINGS.SCREEN_SIZE_Y + WINDOW_MARGIN + WINDOWS_TITLE_BAR_HEIGHT,
		minWidth: SETTINGS.SCREEN_SIZE_X + WINDOW_MARGIN,
		minHeight:
			SETTINGS.SCREEN_SIZE_Y + WINDOW_MARGIN + WINDOWS_TITLE_BAR_HEIGHT,
		webPreferences: {
			nodeIntegration: true,
		},
		titleBarStyle: TITLEBAR_ENABLED ? "hiddenInset" : "hidden",
		frame: FRAME_ENABLED,
		title: "Game",
	})
	win.setMenuBarVisibility(false)
	win.setResizable(RESCALABLE)

	win.loadFile("game.html")
}

app.whenReady().then(() => {
	createWindow()

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit()
})
