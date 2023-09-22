import Settings from "../../Settings.js"
import Profiler from "./Profiler.js"

const hexColors: string[] = [
	"#FF0000", // Red
	"#00FF00", // Green
	"#0000FF", // Blue
	"#FFFF00", // Yellow
	"#FF00FF", // Magenta
	"#00FFFF", // Cyan
	"#FFA500", // Orange
	"#800080", // Purple
	"#008000", // Dark Green
	"#000080", // Navy
	"#800000", // Maroon
	"#008080", // Teal
]

export default function ProfilerGui(
	context: CanvasRenderingContext2D,
	frameTime: number
) {
	if (Settings.ENABLE_PROFILER === false) {
		return
	}
	const frame = Profiler.GetFrame()

	for (const label of frame.Labels) {
		const firstLabel = frame.Labels[0]
		context.fillStyle = hexColors[label.Depth % hexColors.length] as string
		context.fillRect(
			(label.Start - (firstLabel?.Start || 0)) *
				frameTime *
				Settings.PROFILER_ZOOM,
			Settings.SCREEN_SIZE_Y / 2 + label.Depth * 16,
			label.Duration * frameTime * Settings.PROFILER_ZOOM,
			16
		)
		context.fillStyle = "#000000"
		context.font = "12px Arial"
		context.textBaseline = "top"
		context.fillText(
			`${label.Name} ${(label.Duration * 1000).toFixed(2)}μs`,
			(label.Start - (firstLabel?.Start || 0)) *
				frameTime *
				Settings.PROFILER_ZOOM +
				1,
			Settings.SCREEN_SIZE_Y / 2 + label.Depth * 16 + 5
		)
		context.fillStyle = "#ffffff"
		context.fillText(
			`${label.Name} ${(label.Duration * 1000).toFixed(2)}μs`,
			(label.Start - (firstLabel?.Start || 0)) *
				frameTime *
				Settings.PROFILER_ZOOM,
			Settings.SCREEN_SIZE_Y / 2 + label.Depth * 16 + 4
		)
	}
}
