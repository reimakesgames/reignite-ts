import { Canvas } from "./CanvasViewport"
import Camera from "../classes/Camera"

import { Renderer } from "./Renderer"
import WorldModel from "../classes/WorldModel"

import { Update } from "../../game/Game"

export default function App(context: CanvasRenderingContext2D) {
	const camera = new Camera()
	WorldModel.Camera = camera

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

		Renderer(context, deltaTime, camera)
		requestAnimationFrame(InternalUpdate)
	}
	InternalUpdate()
}
