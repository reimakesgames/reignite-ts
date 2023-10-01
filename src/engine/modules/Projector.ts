import Vector3 from "../datatypes/Vector3.js"
import Camera from "../classes/Camera.js"
import Settings from "../../Settings.js"

const FOV = 70 * (Math.PI / 180)
const AspectRatio = Settings.SCREEN_SIZE_X / Settings.SCREEN_SIZE_Y

export default function Projector(position: Vector3, camera: Camera): Vector3 {
	const cameraTransform = camera.Transform

	const directionToObject = cameraTransform.VectorToObjectSpace(position)
	const distanceToObject = directionToObject.Magnitude()

	const projectedX =
		Settings.SCREEN_SIZE_X / 2 +
		((Settings.SCREEN_SIZE_X / 2) *
			(1 / Math.tan(FOV / 2)) *
			-(directionToObject.X / directionToObject.Z)) /
			AspectRatio

	const projectedY =
		Settings.SCREEN_SIZE_Y / 2 -
		(Settings.SCREEN_SIZE_Y / 2) *
			(1 / Math.tan(FOV / 2)) *
			(directionToObject.Y / directionToObject.Z)

	return new Vector3(projectedX, projectedY, distanceToObject)
}
