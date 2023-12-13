import { Settings } from "../Settings"
import { Profiler } from "./Profiler"

const HEX_COLORS: string[] = [
	"#FF0000", // Red
	"#FF7F00", // Orange
	"#FFFF00", // Yellow
	"#7FFF00", // Chartreuse
	"#00FF00", // Green
	"#00FF7F", // Spring Green
	"#00FFFF", // Cyan
	"#007FFF", // Azure
	"#0000FF", // Blue
	"#7F00FF", // Violet
	"#FF00FF", // Magenta
	"#FF007F", // Rose
]

const PIXELS_PER_MILISECOND = 500
const PROPORTIONAL_SCALING = false

export function profilerGui(ctx: CanvasRenderingContext2D, frameTime: number) {
	if (Settings.enableProfiler === false) {
		return
	}
	const frame = Profiler.getFrame()

	const firstLabel = frame.labels[0]
	const scale = PROPORTIONAL_SCALING
		? Settings.screenSizeX / frameTime
		: PIXELS_PER_MILISECOND

	for (const label of frame.labels) {
		const positionX = (label.start - (firstLabel?.start || 0)) * scale
		const positionY = Settings.screenSizeY / 4 + label.depth * 16

		ctx.save()

		ctx.fillStyle = HEX_COLORS[label.depth % HEX_COLORS.length] as string
		ctx.fillRect(positionX, positionY, label.duration * scale, 16)

		ctx.font = "12px Arial"
		ctx.textBaseline = "top"

		ctx.beginPath()
		ctx.moveTo(positionX, positionY)
		ctx.lineTo(positionX, positionY + 16)
		ctx.lineTo(positionX + label.duration * scale, positionY + 16)
		ctx.lineTo(positionX + label.duration * scale, positionY)
		ctx.closePath()

		ctx.clip()

		ctx.fillStyle = "#000000"
		ctx.fillText(
			`${label.name} ${label.duration.toFixed(2)}ms`,
			positionX + 1,
			positionY + 5
		)

		ctx.fillStyle = "#ffffff"
		ctx.fillText(
			`${label.name} ${label.duration.toFixed(2)}ms`,
			positionX,
			positionY + 4
		)

		ctx.restore()
	}
}
