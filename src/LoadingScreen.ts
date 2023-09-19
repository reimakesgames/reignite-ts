import Settings from "./Settings.js"

function LoadingScreen(context: CanvasRenderingContext2D) {
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
}

export default LoadingScreen
