import { SETTINGS } from "../Settings"
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

const ZOOM = 1000 // How much should the profiler be zoomed in? 1 is normal, 2 is twice as zoomed in, etc.

export function profilerGui(ctx: CanvasRenderingContext2D, frameTime: number) {
	if (SETTINGS.enableProfiler === false) {
		return
	}
	const frame = Profiler.getFrame()

	for (const label of frame.labels) {
		const firstLabel = frame.labels[0]
		ctx.fillStyle = HEX_COLORS[label.depth % HEX_COLORS.length] as string
		ctx.fillRect(
			(label.start - (firstLabel?.start || 0)) * frameTime * ZOOM,
			SETTINGS.screenSizeY / 2 + label.depth * 16,
			label.duration * frameTime * ZOOM,
			16
		)
		ctx.fillStyle = "#000000"
		ctx.font = "12px Arial"
		ctx.textBaseline = "top"
		ctx.fillText(
			`${label.name} ${(label.duration * 1000).toFixed(2)}μs`,
			(label.start - (firstLabel?.start || 0)) * frameTime * ZOOM + 1,
			SETTINGS.screenSizeY / 2 + label.depth * 16 + 5
		)
		ctx.fillStyle = "#ffffff"
		ctx.fillText(
			`${label.name} ${(label.duration * 1000).toFixed(2)}μs`,
			(label.start - (firstLabel?.start || 0)) * frameTime * ZOOM,
			SETTINGS.screenSizeY / 2 + label.depth * 16 + 4
		)
	}
}
