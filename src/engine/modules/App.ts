import { canvas } from "./CanvasViewport"
import { Camera } from "../classes/Camera"

import { renderer } from "./Renderer"
import { root } from "../classes/Root"

import { Scene } from "../classes/Scene"
import { Profiler } from "../debug/Profiler"
import { profilerGui } from "../debug/ProfilerGui"
import { FPSBarChart } from "../debug/FPSBarChart"
import { SETTINGS } from "../Settings"

let previousFrameTime = 0

let update = (deltaTime: number) => {}

export function setUpdateFunction(fn: (deltaTime: number) => void) {
	update = fn
}

export function main(context: CanvasRenderingContext2D) {
	const scene = root.loadSceneFromJson(`{
		"class": "Scene",
		"properties": {
			"name": "Scene1"
		},
		"children": [
			{
				"class": "Camera",
				"properties": {
					"name": "Camera1",
					"FieldOfView": 70,
					"Transform": {
						"datatype": "Transform",
						"value": {
							"position": {
								"datatype": "Vector3",
								"value": [0, 0, 0]
							},
							"rotation": {
								"datatype": "Matrix3d",
								"value": [
									[1, 0, 0],
									[0, 1, 0],
									[0, 0, 1]
								]
							}
						}
					}
				}
			}
		]
	}`)
	scene.currentCamera = scene.children[0] as Camera

	// fix so that the console doesn't spam errors
	canvas.addEventListener("click", () => {
		canvas.requestPointerLock()
	})

	context.globalAlpha = 1
	context.imageSmoothingEnabled = false
	context.imageSmoothingQuality = "high"

	let previousTime = 0

	function internalUpdate() {
		const currentTime = performance.now()
		const deltaTime = currentTime - previousTime
		previousTime = currentTime

		Profiler.createFrame()

		Profiler.startProfile("External Update")
		update(deltaTime)
		Profiler.endProfile()

		Profiler.startProfile("Internal Update")
		if (root.currentScene.currentCamera)
			renderer(context, deltaTime, root.currentScene.currentCamera)
		Profiler.endProfile()

		const frameTime = performance.now() - currentTime

		Profiler.startProfile("Draw Debug Info")
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
			SETTINGS.screenSizeY - 10
		)

		FPSBarChart(context, deltaTime, previousFrameTime)
		Profiler.endProfile()

		Profiler.stopFrame()

		profilerGui(context, frameTime)

		previousFrameTime = frameTime

		requestAnimationFrame(internalUpdate)
	}
	internalUpdate()
}
