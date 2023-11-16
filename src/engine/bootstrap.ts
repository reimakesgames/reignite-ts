import { SETTINGS } from "./Settings"

import * as app from "./modules/App"
import {
	canvasContainer,
	ctx,
	createCanvas,
	enableFill,
} from "./modules/CanvasViewport"
import { splashScreen } from "./modules/SplashScreen"
import { Preloader } from "./modules/Preloader"

import { Logger } from "./debug/Logger"

export function main() {
	// standard engine font
	document.fonts.add(new FontFace("Ubuntu", "url(assets/Ubuntu.ttf)"))

	const log = new Logger("Bootstrap")

	Preloader.preloadAssets([
		"assets/normal.png",
		"assets/texture.png",
		"assets/explosion.png",
	])

	createCanvas()
	document.body.appendChild(canvasContainer)
	enableFill(false)

	function closure() {
		log.log("User has interacted with the window.")
		app.main(ctx)
	}

	if (SETTINGS.ENABLE_SPLASH_SCREEN) {
		log.log("Awaiting user interaction...")
		splashScreen(ctx, closure)
	} else {
		closure()
	}
}
