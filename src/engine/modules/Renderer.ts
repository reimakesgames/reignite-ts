import Settings from "../../Settings.js"
import type Camera from "../classes/Camera.js"
import Vector3 from "../datatypes/Vector3.js"
import FPSBarChart from "../debug/FPSBarChart.js"
import Profiler from "../debug/Profiler.js"
import ProfilerGui from "../debug/ProfilerGui.js"
import RenderCube from "../debug/RenderCube.js"
import Projector from "./Projector.js"

let previousFrameTime = 0

export function Renderer(
	context: CanvasRenderingContext2D,
	deltaTime: number,
	camera: Camera
) {
	const frameTimeStart = performance.now()
	Profiler.CreateFrame()

	Profiler.Begin("Renderer")

	camera.Position = new Vector3(Math.sin(performance.now() / 1000) * 8, 1, 10)

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
