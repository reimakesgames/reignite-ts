import { Canvas } from "./CanvasViewport.js"
import Camera from "./engine/classes/Camera.js"
import Matrix3x3 from "./engine/datatypes/Matrix3x3.js"
import Transform from "./engine/datatypes/Transform.js"
import Vector3 from "./engine/datatypes/Vector3.js"
import { Renderer } from "./engine/modules/Renderer.js"

export default function App(context: CanvasRenderingContext2D) {
	const camera = new Camera()
	let WorldModel = {
		Camera: camera,
	}
	console.log("hi team")
	context.globalAlpha = 1

	new Image().src = "./assets/normal.png"

	let previousTime = 0

	function Update() {
		const currentTime = performance.now()
		const deltaTime = currentTime - previousTime
		previousTime = currentTime

		camera.Transform = Transform.LookAt(
			new Vector3(
				Math.sin(currentTime / 4000) * 8,
				10,
				Math.cos(currentTime / 4000) * 8
			),
			new Vector3(0, 0, 0)
		)
		Renderer(context, deltaTime, camera)
		requestAnimationFrame(Update)
	}
	Update()
}
