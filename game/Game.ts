import WorldModel from "../src/engine/classes/WorldModel"
import { Matrix3d } from "../src/engine/datatypes/Matrix3d"
import Transform from "../src/engine/datatypes/Transform"
import Vector3 from "../src/engine/datatypes/Vector3"

let PlayerTransform = Transform.LookAt(
	new Vector3(0, 2, 8),
	new Vector3(0, 0, 0)
)
let WDown = false
let ADown = false
let SDown = false
let DDown = false
let MouseDelta: [number, number] = [0, 0]

function Update(deltaTime: number) {
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
	RotationMatrix = Matrix3d.angles(0, -MouseDelta[0] / 1000, 0).multiply(
		RotationMatrix
	)
	// rotate the matrix on its own X axis
	RotationMatrix = RotationMatrix.multiply(
		Matrix3d.angles(MouseDelta[1] / 1000, 0, 0)
	)

	PlayerTransform = new Transform(
		PlayerTransform.PointToWorldSpace(MovementVector),
		RotationMatrix
	)
	WorldModel.Camera.Transform = PlayerTransform

	MouseDelta = [0, 0]
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

export { Update }
