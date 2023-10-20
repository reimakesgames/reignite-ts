import App from "./App"
import {
	CanvasContainer,
	Context,
	CreateCanvas,
	EnableFill,
} from "./CanvasViewport"
import Logger from "../debug/Logger"
import Settings from "../../game/Settings"
import SplashScreen from "./SplashScreen"
import Preloader from "./Preloader"

// standard engine font
document.fonts.add(new FontFace("Ubuntu", "url(assets/Ubuntu-Regular.ttf)"))

const Log = new Logger("Bootstrap")

CreateCanvas()
document.body.appendChild(CanvasContainer)
EnableFill(false)

Preloader.PreloadAssets([
	"assets/texture.png",
	"assets/explosion.png",
	"assets/normal.png",
])

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
