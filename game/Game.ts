import { root } from "../src/engine/classes/Root"
import { Matrix3d, Transform, Vector3 } from "../src/engine/index"

let PlayerTransform = Transform.lookAt(
	new Vector3(0, 2, 8),
	new Vector3(0, 0, 0)
)
let WDown = false
let ADown = false
let SDown = false
let DDown = false
let QDown = false
let EDown = false
let MouseDelta: [number, number] = [0, 0]
let shiftDown = false

function Update(deltaTime: number) {
	let MovementVector = new Vector3(0, 0, 0)
	let RotationMatrix = PlayerTransform.rotation
	if (WDown) MovementVector = MovementVector.add(new Vector3(0, 0, 1))
	if (ADown) MovementVector = MovementVector.add(new Vector3(1, 0, 0))
	if (SDown) MovementVector = MovementVector.add(new Vector3(0, 0, -1))
	if (DDown) MovementVector = MovementVector.add(new Vector3(-1, 0, 0))
	if (QDown) MovementVector = MovementVector.add(new Vector3(0, -1, 0))
	if (EDown) MovementVector = MovementVector.add(new Vector3(0, 1, 0))
	MovementVector = MovementVector.unit
	MovementVector = MovementVector.multiply(deltaTime / 100).multiply(
		shiftDown ? 0.2 : 1
	)
	// check if the movement vector is nan, if it is, set it to 0
	MovementVector = new Vector3(
		isNaN(MovementVector.X) ? 0 : MovementVector.X,
		isNaN(MovementVector.Y) ? 0 : MovementVector.Y,
		isNaN(MovementVector.Z) ? 0 : MovementVector.Z
	)
	// rotate the entire rotation matrix on the world Y axis
	RotationMatrix = Matrix3d.angles(0, -MouseDelta[0] / 1000, 0).multiply(
		RotationMatrix
	)
	// rotate the matrix on its own X axis
	RotationMatrix = RotationMatrix.multiply(
		Matrix3d.angles(MouseDelta[1] / 1000, 0, 0)
	)

	PlayerTransform = new Transform(
		PlayerTransform.pointToWorldSpace(MovementVector),
		RotationMatrix
	)
	if (root.currentScene) {
		if (root.currentScene.currentCamera)
			root.currentScene.currentCamera.transform = PlayerTransform
	}

	MouseDelta = [0, 0]
}

document.onwheel = (e) => {
	if (!root.currentScene?.currentCamera) return
	PlayerTransform = new Transform(
		root.currentScene.currentCamera.transform.position.add(
			root.currentScene.currentCamera.transform.lookVector.multiply(
				1.5 * Math.sign(e.deltaY)
			)
		),
		root.currentScene.currentCamera.transform.rotation
	)
}

onkeydown = (e) => {
	if (e.key.toLowerCase() === "w") WDown = true
	if (e.key.toLowerCase() === "a") ADown = true
	if (e.key.toLowerCase() === "s") SDown = true
	if (e.key.toLowerCase() === "d") DDown = true
	if (e.key.toLowerCase() === "q") QDown = true
	if (e.key.toLowerCase() === "e") EDown = true
	e.shiftKey ? (shiftDown = true) : (shiftDown = false)
}

onkeyup = (e) => {
	if (e.key.toLowerCase() === "w") WDown = false
	if (e.key.toLowerCase() === "a") ADown = false
	if (e.key.toLowerCase() === "s") SDown = false
	if (e.key.toLowerCase() === "d") DDown = false
	if (e.key.toLowerCase() === "q") QDown = false
	if (e.key.toLowerCase() === "e") EDown = false
	e.shiftKey ? (shiftDown = true) : (shiftDown = false)
}

onmousemove = (e) => {
	MouseDelta = [e.movementX, e.movementY]
}

export { Update }
