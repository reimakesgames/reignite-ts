import { Settings } from "../Settings"

let previousFrameTimes: number[] = []
let previousDeltaTimes: number[] = []

function quad(x: number): number {
	return -1 * x * x + 2 * x
}

function pieGraph(
	context: CanvasRenderingContext2D,
	frameTimeUsage: number,
	color: number
) {
	context.save()
	context.translate(80, Settings.screenSizeY - 48 - 64)
	context.transform(0, -0.5, 1, 0, 0, 0)
	context.fillStyle = "#0000007f"
	context.beginPath()
	context.moveTo(0, 0)
	context.arc(0, 0, 64, 0, Math.PI * 2)
	context.closePath()
	context.fill()

	context.fillStyle = `rgb(255, ${color + 127}, ${color + 127})`
	context.beginPath()
	context.moveTo(0, 0)
	context.arc(0, 0, 64, 0, Math.PI * 2 * frameTimeUsage)
	context.closePath()
	context.fill()
	context.restore()
}

function fpsGraph(context: CanvasRenderingContext2D) {
	context.fillStyle = "#0000007f"
	context.fillRect(16, Settings.screenSizeY - 72, 240, 56)

	context.save()
	context.beginPath()
	context.rect(16, Settings.screenSizeY - 72, 240, 56)
	context.clip()

	context.beginPath()
	context.strokeStyle = "#ffffff"
	context.lineWidth = 1
	context.moveTo(0, Settings.screenSizeY - 72 + 56)
	for (let i = 0; i < previousFrameTimes.length; i++) {
		context.lineTo(
			16 + (i / previousFrameTimes.length) * 244,
			Settings.screenSizeY - 72 + 56 - previousFrameTimes[i]!
		)
	}
	context.stroke()
	context.closePath()
	// graph the delta times
	context.beginPath()
	context.strokeStyle = "#0000ff"
	context.lineWidth = 2
	context.moveTo(0, Settings.screenSizeY - 72 + 56)
	for (let i = 0; i < previousDeltaTimes.length; i++) {
		context.lineTo(
			16 + (i / previousDeltaTimes.length) * 244,
			Settings.screenSizeY - 72 + 56 - previousDeltaTimes[i]!
		)
	}
	context.stroke()
	context.closePath()
	context.restore()
}

function details(
	context: CanvasRenderingContext2D,
	averageFrameTime: number,
	averageDeltaTime: number
) {
	context.font = "12px Arial"
	context.fillStyle = "#ffffff"
	context.textAlign = "left"
	context.textBaseline = "bottom"
	context.fillText(
		`Avg Process: ${averageFrameTime.toFixed(2)}ms`,
		160,
		Settings.screenSizeY - 8 - 64 - 12 * 5
	)
	context.fillText(
		`Avg Delta: ${averageDeltaTime.toFixed(2)}ms`,
		160,
		Settings.screenSizeY - 8 - 64 - 12 * 4
	)
	context.fillText(
		`Avg FPS: ${(1000 / averageDeltaTime).toFixed(2)}`,
		160,
		Settings.screenSizeY - 8 - 64 - 12 * 3
	)
	context.fillText(
		`Avg Usage: ${((averageFrameTime / averageDeltaTime) * 100).toFixed(
			0
		)}%`,
		160,
		Settings.screenSizeY - 8 - 64 - 12 * 2
	)
}

export function performanceMetrics(
	context: CanvasRenderingContext2D,
	dt: number,
	ft: number
) {
	previousDeltaTimes.push(dt)
	previousFrameTimes.push(ft)

	if (previousDeltaTimes.length > 60) previousDeltaTimes.shift()
	if (previousFrameTimes.length > 60) previousFrameTimes.shift()

	const averageDeltaTime =
		previousDeltaTimes.reduce((a, b) => a + b, 0) /
		previousDeltaTimes.length
	const averageFrameTime =
		previousFrameTimes.reduce((a, b) => a + b, 0) /
		previousFrameTimes.length

	const frameTimeUsage = averageFrameTime / averageDeltaTime

	const color = Math.floor(quad(frameTimeUsage + 1) * 127)

	pieGraph(context, frameTimeUsage, color)
	fpsGraph(context)
	details(context, averageFrameTime, averageDeltaTime)
}
