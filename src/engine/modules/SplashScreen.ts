import { SETTINGS } from "../Settings"
import { Preloader } from "./Preloader"

const UserActivation: any = (navigator as any).userActivation

const INPUT_DELAY = 300
const FADEOUT_DURATION = 400

let timer: number
let callback: Function

// TODO: replace callback with an event instead of a function, so that many things can listen to it if needed

export function splashScreen(
	context: CanvasRenderingContext2D,
	newCallback?: Function
) {
	if (timer) {
		if (performance.now() - timer > INPUT_DELAY) {
			context.globalAlpha =
				1 - (performance.now() - timer - INPUT_DELAY) / FADEOUT_DURATION
		}
	}

	if (newCallback) {
		callback = newCallback
	}

	context.clearRect(0, 0, SETTINGS.screenSizeX, SETTINGS.screenSizeY)

	context.fillStyle = "#17171F"
	context.fillRect(0, 0, SETTINGS.screenSizeX, SETTINGS.screenSizeY)

	context.fillStyle = "#FFFFFF"
	context.font = "100 36px Ubuntu"
	context.textAlign = "center"
	context.textBaseline = "bottom"
	context.fillText(
		"REIGNITE",
		SETTINGS.screenSizeX / 2,
		SETTINGS.screenSizeY / 2
	)

	context.font = "200 12px Ubuntu"
	context.textBaseline = "top"
	context.fillText(
		"A TypeScript Game Engine by Rei",
		SETTINGS.screenSizeX / 2,
		SETTINGS.screenSizeY / 2 + 4
	)

	if (!UserActivation.hasBeenActive) {
		context.font = "200 16px Ubuntu"
		context.textBaseline = "bottom"
		context.fillText(
			"Interact with the window to continue",
			SETTINGS.screenSizeX / 2,
			SETTINGS.screenSizeY - 4
		)
	}

	context.strokeStyle = "#FFFFFF"
	context.beginPath()
	context.moveTo(
		SETTINGS.screenSizeX / 2 - 120,
		SETTINGS.screenSizeY / 2 - 0.5
	)
	context.lineTo(
		SETTINGS.screenSizeX / 2 + 120,
		SETTINGS.screenSizeY / 2 - 0.5
	)
	context.stroke()

	// draw pi chart of preloader progress
	context.fillStyle = "#FFFFFF"
	context.beginPath()
	context.arc(
		SETTINGS.screenSizeX - 24,
		SETTINGS.screenSizeY - 24,
		16,
		-90 * (Math.PI / 180),
		(-90 + (Preloader.progress / Preloader.total) * 360) * (Math.PI / 180)
	)
	context.lineTo(SETTINGS.screenSizeX - 24, SETTINGS.screenSizeY - 24)
	context.closePath()
	context.fill()

	// continually request animation frames for the splash screen
	if (SETTINGS.enableSplashScreen) {
		// cancel after timer has expired, assets have loaded, and user has interacted with the window
		if (!timer && UserActivation.hasBeenActive && Preloader.active) {
			timer = performance.now()
		}
		// then run the callback and exit
		if (performance.now() - timer > INPUT_DELAY + FADEOUT_DURATION) {
			callback?.()
			return
		}
		requestAnimationFrame(() => splashScreen(context))
	}
}
