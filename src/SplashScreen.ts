import Settings from "./Settings.js"

const UserActivation: any = (navigator as any).userActivation
const Duration = 300
const FadeDuration = 700
let Timer: number

function SplashScreen(context: CanvasRenderingContext2D) {
	if (Timer) {
		if (performance.now() - Timer > Duration) {
			context.globalAlpha =
				1 - (performance.now() - Timer - Duration) / FadeDuration
		}
	}

	context.clearRect(0, 0, Settings.SCREEN_SIZE_X, Settings.SCREEN_SIZE_Y)

	context.fillStyle = "#17171F"
	context.fillRect(0, 0, Settings.SCREEN_SIZE_X, Settings.SCREEN_SIZE_Y)

	context.fillStyle = "#FFFFFF"
	context.font = "100 36px Ubuntu"
	context.textAlign = "center"
	context.textBaseline = "bottom"
	context.fillText(
		"REIGNITE",
		Settings.SCREEN_SIZE_X / 2,
		Settings.SCREEN_SIZE_Y / 2
	)

	context.font = "200 12px Ubuntu"
	context.textBaseline = "top"
	context.fillText(
		"A TypeScript Game Engine by Rei",
		Settings.SCREEN_SIZE_X / 2,
		Settings.SCREEN_SIZE_Y / 2 + 4
	)

	if (!UserActivation.hasBeenActive) {
		context.font = "200 16px Ubuntu"
		context.textBaseline = "bottom"
		context.fillText(
			"Interact with the window to continue",
			Settings.SCREEN_SIZE_X / 2,
			Settings.SCREEN_SIZE_Y - 4
		)
	}

	context.strokeStyle = "#FFFFFF"
	context.beginPath()
	context.moveTo(
		Settings.SCREEN_SIZE_X / 2 - 120,
		Settings.SCREEN_SIZE_Y / 2 - 0.5
	)
	context.lineTo(
		Settings.SCREEN_SIZE_X / 2 + 120,
		Settings.SCREEN_SIZE_Y / 2 - 0.5
	)
	context.stroke()

	// continually request animation frames for the splash screen
	if (Settings.ENABLE_SPLASH_SCREEN) {
		// cancel after all timers have been cleared
		if (!Timer && UserActivation.hasBeenActive) {
			Timer = performance.now()
		}
		if (performance.now() - Timer > Duration + FadeDuration) {
			return // exit the loop
		}
		requestAnimationFrame(() => SplashScreen(context))
	}
}

export default SplashScreen
