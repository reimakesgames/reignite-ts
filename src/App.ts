import Camera from "./engine/classes/Camera.js"
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

	camera.Position = new Vector3(0, 0, 10)

	let previousTime = 0

	function Update() {
		const currentTime = performance.now()
		const deltaTime = currentTime - previousTime
		previousTime = currentTime
		Renderer(context, deltaTime, camera)
		requestAnimationFrame(Update)
	}
	Update()
}
