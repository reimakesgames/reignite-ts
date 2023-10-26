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
document.fonts.add(new FontFace("Ubuntu", "url(assets/Ubuntu.ttf)"))

const Log = new Logger("Bootstrap")

Preloader.PreloadAssets([
	"assets/normal.png",
	"assets/texture.png",
	"assets/explosion.png",
])

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
