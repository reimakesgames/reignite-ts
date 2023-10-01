import { Canvas } from "./CanvasViewport.js"
import Camera from "./engine/classes/Camera.js"
import Matrix3x3 from "./engine/datatypes/Matrix3x3.js"
import Transform from "./engine/datatypes/Transform.js"
import Vector3 from "./engine/datatypes/Vector3.js"
import { Renderer } from "./engine/modules/Renderer.js"

let PlayerTransform = new Transform(0, 2, 0)
let WDown = false
let ADown = false
let SDown = false
let DDown = false
let MouseDelta: [number, number] = [0, 0]

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

		// camera.Transform = Transform.LookAt(
		// 	new Vector3(
		// 		Math.sin(currentTime / 4000) * 8,
		// 		10,
		// 		Math.cos(currentTime / 4000) * 8
		// 	),
		// 	new Vector3(0, 0, 0)
		// )
		let MovementVector = new Vector3(0, 0, 0)
		let RotationMatrix = PlayerTransform.Rotation
		if (WDown) MovementVector = MovementVector.Add(new Vector3(0, 0, 1))
		if (ADown) MovementVector = MovementVector.Add(new Vector3(1, 0, 0))
		if (SDown) MovementVector = MovementVector.Add(new Vector3(0, 0, -1))
		if (DDown) MovementVector = MovementVector.Add(new Vector3(-1, 0, 0))
		MovementVector = MovementVector.Unit()
		MovementVector = MovementVector.Mul(deltaTime / 100)
		// check if the movement vector is nan, if it is, set it to 0
		MovementVector = new Vector3(
			isNaN(MovementVector.X) ? 0 : MovementVector.X,
			isNaN(MovementVector.Y) ? 0 : MovementVector.Y,
			isNaN(MovementVector.Z) ? 0 : MovementVector.Z
		)
		// rotate the entire rotation matrix on the world Y axis
		RotationMatrix = Matrix3x3.Angles(0, -MouseDelta[0] / 1000, 0).Multiply(
			RotationMatrix
		)
		// rotate the matrix on its own X axis
		RotationMatrix = RotationMatrix.Multiply(
			Matrix3x3.Angles(MouseDelta[1] / 1000, 0, 0)
		)

		PlayerTransform = new Transform(
			PlayerTransform.PointToWorldSpace(MovementVector),
			RotationMatrix
		)
		camera.Transform = PlayerTransform
		Renderer(context, deltaTime, camera)
		requestAnimationFrame(Update)

		MouseDelta = [0, 0]

		Canvas.requestPointerLock()
	}
	Update()
}

onkeydown = (e) => {
	switch (e.key) {
		case "w":
			WDown = true
			break
		case "a":
			ADown = true
			break
		case "s":
			SDown = true
			break
		case "d":
			DDown = true
			break
	}
}

onkeyup = (e) => {
	switch (e.key) {
		case "w":
			WDown = false
			break
		case "a":
			ADown = false
			break
		case "s":
			SDown = false
			break
		case "d":
			DDown = false
			break
	}
}

onmousemove = (e) => {
	MouseDelta = [e.movementX, e.movementY]
}
