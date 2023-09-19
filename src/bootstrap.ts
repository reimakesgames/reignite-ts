import {
	CanvasContainer,
	Context,
	CreateCanvas,
	EnableFill,
} from "./CanvasViewport.js"
import Logger from "./Logger.js"
import SplashScreen from "./SplashScreen.js"

const Log = new Logger("Bootstrap")

CreateCanvas()
document.body.appendChild(CanvasContainer)
EnableFill(false)

function Post() {
	Log.log("User has interacted with the window.")
}

Log.log("Awaiting user interaction...")
SplashScreen(Context, Post)
