import { canvas } from "./CanvasViewport"
import { Camera } from "../classes/Camera"

import { renderer } from "./Renderer"
import { root } from "../classes/Root"

import { Profiler } from "../debug/Profiler"
import { profilerGui } from "../debug/ProfilerGui"
import { performanceMetrics } from "../debug/PerformanceMetrics"
import { Settings } from "../Settings"
import { Signal } from "../datatypes/Signal"
import { ancestryViewer } from "../debug/AncestryViewer"

let previousFrameTime = 0

let update = (deltaTime: number) => {}

export function setUpdateFunction(fn: (deltaTime: number) => void) {
	update = fn
}

export function setWindowTitle(title: string) {
	;(window as any).cross.setWindowTitle(title)
	// this is going to make me explode, too bad!
}

export function main(context: CanvasRenderingContext2D) {
	const scene = root.loadSceneFromJson(
		JSON.stringify({
			class: "Scene",
			properties: {
				name: "Scene1",
			},
			children: [
				{
					class: "Camera",
					properties: {
						name: "Camera1",
						FieldOfView: 70,
						Transform: {
							datatype: "Transform",
							value: [
								{
									datatype: "Vector3",
									value: [0, 0, 0],
								},
								{
									datatype: "Matrix3d",
									value: [
										[1, 0, 0],
										[0, 1, 0],
										[0, 0, 1],
									],
								},
							],
						},
					},
					children: [
						{
							class: "Camera",
							properties: {
								name: "Camera1",
								FieldOfView: 70,
								Transform: {
									datatype: "Transform",
									value: [
										{
											datatype: "Vector3",
											value: [0, 0, 0],
										},
										{
											datatype: "Matrix3d",
											value: [
												[1, 0, 0],
												[0, 1, 0],
												[0, 0, 1],
											],
										},
									],
								},
							},
						},
						{
							class: "Camera",
							properties: {
								name: "Camera1",
								FieldOfView: 70,
								Transform: {
									datatype: "Transform",
									value: [
										{
											datatype: "Vector3",
											value: [0, 0, 0],
										},
										{
											datatype: "Matrix3d",
											value: [
												[1, 0, 0],
												[0, 1, 0],
												[0, 0, 1],
											],
										},
									],
								},
							},
						},
					],
				},
				{
					class: "Camera",
					properties: {
						name: "Camera1",
						FieldOfView: 70,
						Transform: {
							datatype: "Transform",
							value: [
								{
									datatype: "Vector3",
									value: [0, 0, 0],
								},
								{
									datatype: "Matrix3d",
									value: [
										[1, 0, 0],
										[0, 1, 0],
										[0, 0, 1],
									],
								},
							],
						},
					},
				},
			],
		})
	)
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

		Signal.internalResumeDeferred()

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
		performanceMetrics(context, deltaTime, previousFrameTime)
		ancestryViewer(context)
		Profiler.endProfile()

		Profiler.stopFrame()

		profilerGui(context, frameTime)

		previousFrameTime = frameTime

		requestAnimationFrame(internalUpdate)
	}
	internalUpdate()
}
