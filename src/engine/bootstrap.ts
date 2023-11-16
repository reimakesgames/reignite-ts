import App from "./modules/App"
import { SETTINGS } from "./Settings"
import "./"
import {
	canvasContainer,
	ctx,
	createCanvas,
	enableFill,
} from "./modules/CanvasViewport"
import Logger from "./debug/Logger"

import SplashScreen from "./modules/SplashScreen"
import Preloader from "./modules/Preloader"

export function main() {
	// standard engine font
	document.fonts.add(new FontFace("Ubuntu", "url(assets/Ubuntu.ttf)"))

	const Log = new Logger("Bootstrap")

	Preloader.PreloadAssets([
		"assets/normal.png",
		"assets/texture.png",
		"assets/explosion.png",
	])

	createCanvas()
	document.body.appendChild(canvasContainer)
	enableFill(false)

	function Post() {
		Log.log("User has interacted with the window.")
		App(ctx)
	}

	Log.log("Awaiting user interaction...")
	if (SETTINGS.ENABLE_SPLASH_SCREEN) {
		SplashScreen(ctx, Post)
	} else {
		Post()
	}
}
