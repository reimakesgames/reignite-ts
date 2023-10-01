import App from "./App.js"
import {
	CanvasContainer,
	Context,
	CreateCanvas,
	EnableFill,
} from "./CanvasViewport.js"
import Logger from "./Logger.js"
import Settings from "./Settings.js"
import SplashScreen from "./SplashScreen.js"

const Log = new Logger("Bootstrap")

CreateCanvas()
document.body.appendChild(CanvasContainer)
EnableFill(false)

function Post() {
	Log.log("User has interacted with the window.")
	App(Context)
}

Log.log("Awaiting user interaction...")
if (Settings.ENABLE_SPLASH_SCREEN) {
	SplashScreen(Context, Post)
} else {
	Post()
}
