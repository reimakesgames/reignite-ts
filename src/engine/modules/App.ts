import { Canvas } from "./CanvasViewport"
import { Camera } from "../classes/Camera"

import { Renderer } from "./Renderer"
import { root } from "../classes/Root"

import { Update } from "../../../game/Game"
import { Scene } from "../classes/Scene"

export default function App(context: CanvasRenderingContext2D) {
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
	Canvas.addEventListener("click", () => {
		Canvas.requestPointerLock()
	})

	context.globalAlpha = 1
	context.imageSmoothingEnabled = false
	context.imageSmoothingQuality = "high"

	let previousTime = 0

	function InternalUpdate() {
		const currentTime = performance.now()
		const deltaTime = currentTime - previousTime
		previousTime = currentTime

		Update(deltaTime)

		if (root.currentScene.currentCamera)
			Renderer(context, deltaTime, root.currentScene.currentCamera)
		requestAnimationFrame(InternalUpdate)
	}
	InternalUpdate()
}
