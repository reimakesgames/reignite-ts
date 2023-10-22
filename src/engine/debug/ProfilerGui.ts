import Settings from "../Settings"
import Profiler from "./Profiler"

const hexColors: string[] = [
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

const ProfilerZoom = 10 // How much should the profiler be zoomed in? 1 is normal, 2 is twice as zoomed in, etc.

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
			(label.Start - (firstLabel?.Start || 0)) * frameTime * ProfilerZoom,
			Settings.SCREEN_SIZE_Y / 2 + label.Depth * 16,
			label.Duration * frameTime * ProfilerZoom,
			16
		)
		context.fillStyle = "#000000"
		context.font = "12px Arial"
		context.textBaseline = "top"
		context.fillText(
			`${label.Name} ${(label.Duration * 1000).toFixed(2)}μs`,
			(label.Start - (firstLabel?.Start || 0)) *
				frameTime *
				ProfilerZoom +
				1,
			Settings.SCREEN_SIZE_Y / 2 + label.Depth * 16 + 5
		)
		context.fillStyle = "#ffffff"
		context.fillText(
			`${label.Name} ${(label.Duration * 1000).toFixed(2)}μs`,
			(label.Start - (firstLabel?.Start || 0)) * frameTime * ProfilerZoom,
			Settings.SCREEN_SIZE_Y / 2 + label.Depth * 16 + 4
		)
	}
}
