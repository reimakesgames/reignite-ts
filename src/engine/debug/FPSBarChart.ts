import { SETTINGS } from "../Settings"

const FPSBarHeight = 10
const UsageBarHeight = 100
const quadA = -1
const quadB = 2

let previousFrameTimes: number[] = []
let previousDeltaTimes: number[] = []

function CreateMarker(
	ctx: CanvasRenderingContext2D,
	i: number,
	ident: string
): void {
	ctx.beginPath()
	ctx.moveTo(SETTINGS.screenSizeX - i * 4, SETTINGS.screenSizeY)
	ctx.lineTo(SETTINGS.screenSizeX - i * 4, SETTINGS.screenSizeY - 32)
	ctx.stroke()

	ctx.font = "12px Arial"
	ctx.fillStyle = "#ffffff"
	ctx.textAlign = "left"
	ctx.textBaseline = "top"
	ctx.fillText(
		ident,
		SETTINGS.screenSizeX - i * 4 + 4,
		SETTINGS.screenSizeY - 32
	)
}

function UsageWarning(
	ctx: CanvasRenderingContext2D,
	usageTime: number,
	color: number
) {
	ctx.font = "12px Arial"
	ctx.textAlign = "right"
	ctx.textBaseline = "bottom"
	ctx.fillStyle = `rgba(255, ${127 + color}, ${127 + color}, 1)`
	ctx.fillText(
		`Usage: ${(usageTime * 100).toFixed(0)}%`,
		SETTINGS.screenSizeX - 960 - 12,
		SETTINGS.screenSizeY - 8
	)
}

function CreateFpsMarker(ctx: CanvasRenderingContext2D, fps: number): void {
	ctx.strokeStyle = "#00ff00"
	ctx.beginPath()
	ctx.moveTo(
		SETTINGS.screenSizeX,
		SETTINGS.screenSizeY - (1 / fps) * FPSBarHeight * 1000
	)
	ctx.lineTo(
		SETTINGS.screenSizeX - 64,
		SETTINGS.screenSizeY - (1 / fps) * FPSBarHeight * 1000
	)
	ctx.stroke()

	ctx.font = "12px Arial"
	ctx.fillStyle = "#00ff00"
	ctx.textAlign = "right"
	ctx.textBaseline = "bottom"
	ctx.fillText(
		fps.toFixed(2),
		SETTINGS.screenSizeX - 8,
		SETTINGS.screenSizeY - (1 / fps) * FPSBarHeight * 1000 - 4
	)
}

function Quad(x: number): number {
	return quadA * x * x + quadB * x
}

export default function FPSBarChart(
	context: CanvasRenderingContext2D,
	dt: number,
	ft: number
) {
	previousDeltaTimes.push(dt)
	previousFrameTimes.push(ft)

	if (previousDeltaTimes.length > 240) previousDeltaTimes.shift()
	if (previousFrameTimes.length > 240) previousFrameTimes.shift()

	const averageDeltaTime =
		previousDeltaTimes.reduce((a, b) => a + b, 0) /
		previousDeltaTimes.length
	const averageFrameTime =
		previousFrameTimes.reduce((a, b) => a + b, 0) /
		previousFrameTimes.length

	context.strokeStyle = "#ffffff"
	context.beginPath()
	context.moveTo(SETTINGS.screenSizeX - 960, SETTINGS.screenSizeY)
	for (let i = 0; i < previousDeltaTimes.length; i++) {
		const sel = previousDeltaTimes[i] || 0
		context.lineTo(
			SETTINGS.screenSizeX - 960 + i * 4,
			SETTINGS.screenSizeY - sel * FPSBarHeight
		)
	}
	context.stroke()

	for (let i = 0; i < previousFrameTimes.length; i++) {
		const sel = previousFrameTimes[i] || 0
		context.fillStyle = `rgba(255, 127, 0, ${i / 240})`
		context.fillRect(
			SETTINGS.screenSizeX - 960 + i * 4,
			SETTINGS.screenSizeY - sel * FPSBarHeight,
			4,
			sel * 100
		)
	}

	// time markers
	let timePassed = 0
	let markers = {
		".5s": false,
		"1s": false,
		"2s": false,
	}
	context.strokeStyle = "#00ff00"
	for (let i = 0; i < 240; i++) {
		const sel = previousDeltaTimes[i] || 0
		timePassed += sel
		if (timePassed > 500 && !markers[".5s"]) {
			markers[".5s"] = true
			CreateMarker(context, i, "0.5s")
		}
		if (timePassed > 1000 && !markers["1s"]) {
			markers["1s"] = true
			CreateMarker(context, i, "1s")
		}
		if (timePassed > 2000 && !markers["2s"]) {
			markers["2s"] = true
			CreateMarker(context, i, "2s")
		}
	}

	CreateFpsMarker(context, 30)
	CreateFpsMarker(context, 60)
	CreateFpsMarker(context, 165)

	const frameTimeUsage = averageFrameTime / averageDeltaTime
	context.fillStyle = "#000000"
	context.fillRect(
		SETTINGS.screenSizeX - 960 - 8,
		SETTINGS.screenSizeY - UsageBarHeight,
		8,
		UsageBarHeight
	)
	const color = Math.floor(Quad(frameTimeUsage + 1) * 127)
	context.fillStyle = `rgba(255, ${color + 127}, ${color + 127}, 1)`
	context.fillRect(
		SETTINGS.screenSizeX - 960 - 8,
		SETTINGS.screenSizeY,
		8,
		-frameTimeUsage * UsageBarHeight
	)
	UsageWarning(context, frameTimeUsage, color)

	context.font = "12px Arial"
	context.fillStyle = "#ffffff"
	context.textAlign = "left"
	context.textBaseline = "bottom"
	context.fillText(
		`Avg Process: ${averageFrameTime.toFixed(2)}ms`,
		SETTINGS.screenSizeX - 960 + 8,
		SETTINGS.screenSizeY - 8 - 12 * 4
	)
	context.fillText(
		`Avg Delta: ${averageDeltaTime.toFixed(2)}ms`,
		SETTINGS.screenSizeX - 960 + 8,
		SETTINGS.screenSizeY - 8 - 12 * 3
	)
	context.fillText(
		`Avg FPS: ${(1000 / averageDeltaTime).toFixed(2)}`,
		SETTINGS.screenSizeX - 960 + 8,
		SETTINGS.screenSizeY - 8 - 12 * 2
	)
	context.fillText(
		`Avg Usage: ${((averageFrameTime / averageDeltaTime) * 100).toFixed(
			0
		)}%`,
		SETTINGS.screenSizeX - 960 + 8,
		SETTINGS.screenSizeY - 8 - 12
	)
}
