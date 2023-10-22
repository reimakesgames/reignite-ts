import App from "./modules/App"
import {
	CanvasContainer,
	Context,
	CreateCanvas,
	EnableFill,
} from "./modules/CanvasViewport"
import Logger from "./debug/Logger"
import Settings from "./Settings"
import SplashScreen from "./modules/SplashScreen"
import Preloader from "./modules/Preloader"

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
