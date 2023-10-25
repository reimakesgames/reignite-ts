import Settings from "../Settings"
import Camera from "../classes/Camera"
import { Vector3 } from "../datatypes/Vector3"
import FPSBarChart from "../debug/FPSBarChart"
import Profiler from "../debug/Profiler"
import ProfilerGui from "../debug/ProfilerGui"
import RenderCube from "../debug/RenderCube"
import Projector from "./Projector"

let previousFrameTime = 0

export function Renderer(
	context: CanvasRenderingContext2D,
	deltaTime: number,
	camera: Camera
) {
	const frameTimeStart = performance.now()
	Profiler.CreateFrame()

	Profiler.Begin("Renderer")

	Profiler.Begin("Clear Screen")
	context.clearRect(0, 0, Settings.SCREEN_SIZE_X, Settings.SCREEN_SIZE_Y)
	context.fillStyle = "#1f1f1f"
	context.fillRect(0, 0, Settings.SCREEN_SIZE_X, Settings.SCREEN_SIZE_Y)
	Profiler.End()

	Profiler.Begin("Draw Axes")
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
	context.moveTo(originProjected.x, originProjected.y)
	context.lineTo(xProjected.x, xProjected.y)
	context.stroke()

	context.strokeStyle = "#00ff00"
	context.beginPath()
	context.moveTo(originProjected.x, originProjected.y)
	context.lineTo(yProjected.x, yProjected.y)
	context.stroke()

	context.strokeStyle = "#0000ff"
	context.beginPath()
	context.moveTo(originProjected.x, originProjected.y)
	context.lineTo(zProjected.x, zProjected.y)
	context.stroke()

	// make arrow heads
	context.fillStyle = "#ff0000"
	context.beginPath()
	context.moveTo(xProjected.x, xProjected.y)
	context.lineTo(xProjected.x - 8, xProjected.y - 8)
	context.lineTo(xProjected.x - 8, xProjected.y + 8)
	context.fill()

	context.fillStyle = "#00ff00"
	context.beginPath()
	context.moveTo(yProjected.x, yProjected.y)
	context.lineTo(yProjected.x - 8, yProjected.y + 8)
	context.lineTo(yProjected.x + 8, yProjected.y + 8)
	context.fill()

	Profiler.End()

	Profiler.Begin("Make Floor")
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
	Profiler.End()

	Profiler.Begin("Draw Floor")
	context.strokeStyle = "#ffffff"
	for (let x = 0; x < floorProjected.length; x++) {
		const line = floorProjected[x] as Vector3[]
		for (let y = 0; y < line.length; y++) {
			const point = line[y] as Vector3
			if (x < floorProjected.length - 1) {
				const nextLine = floorProjected[x + 1] as Vector3[]
				const nextPoint = nextLine[y] as Vector3
				if (point.z < 0 && nextPoint.z < 0) {
					continue
				}
				context.beginPath()
				context.moveTo(point.x, point.y)
				context.lineTo(nextPoint.x, nextPoint.y)
				context.stroke()
			}
			if (y < line.length - 1) {
				const nextPoint = line[y + 1] as Vector3
				if (point.z < 0 && nextPoint.z < 0) {
					continue
				}
				context.beginPath()
				context.moveTo(point.x, point.y)
				context.lineTo(nextPoint.x, nextPoint.y)
				context.stroke()
			}
		}
	}
	Profiler.End()

	RenderCube(context, camera)

	Profiler.End()
	Profiler.End()

	Profiler.Stop()

	const frameTimeEnd = performance.now()
	const frameTime = frameTimeEnd - frameTimeStart

	context.fillStyle = "#ffffff"
	context.font = "12px Arial"
	context.textAlign = "left"
	context.textBaseline = "bottom"
	context.fillText(
		`Frame time: ${frameTime.toFixed(2)}ms (%${(
			(frameTime / deltaTime) *
			100
		).toFixed(2)})`,
		10,
		Settings.SCREEN_SIZE_Y - 10
	)

	FPSBarChart(context, deltaTime, previousFrameTime)
	ProfilerGui(context, frameTime)

	previousFrameTime = frameTime
}
