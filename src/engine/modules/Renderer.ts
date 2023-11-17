import { SETTINGS } from "../Settings"
import { Camera } from "../classes/Camera"
import { Vector3 } from "../datatypes/Vector3"
import { Profiler } from "../debug/Profiler"
import RenderCube from "../debug/RenderCube"
import { Projector } from "./Projector"

export function renderer(
	context: CanvasRenderingContext2D,
	deltaTime: number,
	camera: Camera
) {
	Profiler.startProfile("Renderer")

	Profiler.startProfile("Clear Screen")
	context.clearRect(0, 0, SETTINGS.screenSizeX, SETTINGS.screenSizeY)
	context.fillStyle = "#1f1f1f"
	context.fillRect(0, 0, SETTINGS.screenSizeX, SETTINGS.screenSizeY)
	Profiler.endProfile()

	Profiler.startProfile("Draw Axes")
	const origin = new Vector3(0, 0, 0)
	const x = new Vector3(1, 0, 0)
	const y = new Vector3(0, 1, 0)
	const z = new Vector3(0, 0, 1)

	const originProjected = Projector(origin, camera)
	const xProjected = Projector(x, camera)
	const yProjected = Projector(y, camera)
	const zProjected = Projector(z, camera)

	context.strokeStyle = "#ff0000"
	context.beginPath()
	context.moveTo(originProjected.X, originProjected.Y)
	context.lineTo(xProjected.X, xProjected.Y)
	context.stroke()

	context.strokeStyle = "#00ff00"
	context.beginPath()
	context.moveTo(originProjected.X, originProjected.Y)
	context.lineTo(yProjected.X, yProjected.Y)
	context.stroke()

	context.strokeStyle = "#0000ff"
	context.beginPath()
	context.moveTo(originProjected.X, originProjected.Y)
	context.lineTo(zProjected.X, zProjected.Y)
	context.stroke()

	// make arrow heads
	context.fillStyle = "#ff0000"
	context.beginPath()
	context.moveTo(xProjected.X, xProjected.Y)
	context.lineTo(xProjected.X - 8, xProjected.Y - 8)
	context.lineTo(xProjected.X - 8, xProjected.Y + 8)
	context.fill()

	context.fillStyle = "#00ff00"
	context.beginPath()
	context.moveTo(yProjected.X, yProjected.Y)
	context.lineTo(yProjected.X - 8, yProjected.Y + 8)
	context.lineTo(yProjected.X + 8, yProjected.Y + 8)
	context.fill()
	Profiler.endProfile()

	Profiler.startProfile("Make Floor")
	const floorPoints = []
	for (let x = -5; x <= 5; x++) {
		let line = []
		for (let y = -5; y <= 5; y++) {
			line.push(new Vector3(x, 0, y))
		}
		floorPoints.push(line)
	}
	const floorProjected = floorPoints.map((line) => {
		return line.map((point) => {
			return Projector(point, camera)
		})
	})
	Profiler.endProfile()

	Profiler.startProfile("Draw Floor")
	context.strokeStyle = "#ffffff"
	for (let x = 0; x < floorProjected.length; x++) {
		const line = floorProjected[x] as Vector3[]
		for (let y = 0; y < line.length; y++) {
			const point = line[y] as Vector3
			if (x < floorProjected.length - 1) {
				const nextLine = floorProjected[x + 1] as Vector3[]
				const nextPoint = nextLine[y] as Vector3
				if (point.Z < 0 && nextPoint.Z < 0) {
					continue
				}
				context.beginPath()
				context.moveTo(point.X, point.Y)
				context.lineTo(nextPoint.X, nextPoint.Y)
				context.stroke()
			}
			if (y < line.length - 1) {
				const nextPoint = line[y + 1] as Vector3
				if (point.Z < 0 && nextPoint.Z < 0) {
					continue
				}
				context.beginPath()
				context.moveTo(point.X, point.Y)
				context.lineTo(nextPoint.X, nextPoint.Y)
				context.stroke()
			}
		}
	}
	Profiler.endProfile()

	RenderCube(context, camera)

	Profiler.endProfile()
}
