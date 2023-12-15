import { Settings } from "../Settings"
import { Preloader } from "./Preloader"

const UserActivation: any = (navigator as any).userActivation

const INPUT_DELAY = 0
const FADEOUT_DURATION = 500

// TODO: replace callback with an event instead of a function, so that many things can listen to it if needed
// maybe not because having multiple things happen at once in a random order is not good

export function splashScreen(
	context: CanvasRenderingContext2D,
	newCallback?: Function
) {
	let callback = newCallback

	let startTime = performance.now()
	let currentTime = 0

	let fadeOutTimer: number
	let fadeOutPercentage = 0

	function render() {
		currentTime = performance.now()

		if (fadeOutTimer) {
			if (currentTime - fadeOutTimer > INPUT_DELAY) {
				fadeOutPercentage =
					(currentTime - fadeOutTimer - INPUT_DELAY) /
					FADEOUT_DURATION
			}
		}

		context.clearRect(0, 0, context.canvas.width, context.canvas.height)
		context.fillStyle = "#09090f"
		context.fillRect(0, 0, context.canvas.width, context.canvas.height)

		context.save()

		const scale =
			1 + ((1 / (1 + Math.exp(-currentTime / 200))) * -1 + 1) * 2
		// translate while scaling to keep the center of the screen in the same place
		context.translate(
			Settings.screenSizeX / 2 - (Settings.screenSizeX / 2) * scale,
			Settings.screenSizeY / 2 - (Settings.screenSizeY / 2) * scale
		)
		context.scale(scale, scale)

		// TODO: make the spinner dissapear AFTER the initialization step is done
		// instead of just after the assets are loaded
		if (!Preloader.active) {
			context.save()
			const rotation = (currentTime / 1000) * Math.PI * 2
			const x = Math.cos(rotation) * 20
			const y = Math.sin(rotation) * 20
			context.transform(
				Math.cos(rotation),
				Math.sin(rotation),
				-Math.sin(rotation),
				Math.cos(rotation),
				x + Settings.screenSizeX / 2,
				y + Settings.screenSizeY - 60
			)
			context.fillStyle = "#ffffff"
			context.beginPath()
			context.arc(0, 0, 8, 0, Math.PI * 2)
			context.closePath()
			context.fill()
			context.restore()
		}

		let message = "Placeholder"
		if (Preloader.total == 0) {
			message = "Starting..."
		} else if (Preloader.active) {
			message = "Press any key to continue"
		} else {
			message = `Loading assets... ${Math.round(
				(Preloader.progress / Preloader.total) * 100
			)}%`
		}

		context.font = "24px Ubuntu"
		context.fillStyle = "#ffffff"
		context.textAlign = "center"
		context.textBaseline = "middle"
		context.fillText(
			message,
			Settings.screenSizeX / 2,
			Settings.screenSizeY - 120
		)

		context.font = "40px Ubuntu"
		context.textBaseline = "bottom"
		context.fillText(
			Settings.gameName,
			Settings.screenSizeX / 2,
			Settings.screenSizeY / 2
		)
		context.font = "16px Ubuntu"
		context.textBaseline = "top"
		context.fillText(
			"Powered by ReigniteTS",
			Settings.screenSizeX / 2,
			Settings.screenSizeY / 2
		)

		const fadeInProgress = 1 - (performance.now() - startTime) / 1000
		context.fillStyle = `#000000${Math.round(
			Math.min(1, Math.max(0, fadeInProgress)) * 255
		)
			.toString(16)
			.padStart(2, "0")}`
		context.fillRect(0, 0, Settings.screenSizeX, Settings.screenSizeY)

		context.fillStyle = `#000000${Math.round(
			Math.min(1, Math.max(0, fadeOutPercentage)) * 255
		)
			.toString(16)
			.padStart(2, "0")}`
		context.fillRect(0, 0, Settings.screenSizeX, Settings.screenSizeY)
		context.restore()

		if (Settings.enableSplashScreen) {
			// cancel after timer has expired, assets have loaded, and user has interacted with the window
			if (
				!fadeOutTimer &&
				UserActivation.hasBeenActive &&
				Preloader.active
			) {
				fadeOutTimer = performance.now()
			}

			if (
				performance.now() - fadeOutTimer >
				INPUT_DELAY + FADEOUT_DURATION
			) {
				callback?.()
				return
			}
			requestAnimationFrame(() => render())
		}
	}
	render()
}
