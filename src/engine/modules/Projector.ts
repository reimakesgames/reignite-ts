import Vector3 from "../datatypes/Vector3.js"
import Camera from "../classes/Camera.js"
import Settings from "../../Settings.js"

const FOV = 70 * (Math.PI / 180)
const AspectRatio = Settings.SCREEN_SIZE_X / Settings.SCREEN_SIZE_Y

export default function Projector(position: Vector3, camera: Camera): Vector3 {
	const cameraPosition = camera.Position
	const cameraForward = new Vector3(0, 0, 1)

	const directionToObject = position.Sub(cameraPosition)
	const distanceToObject = Math.sqrt(
		directionToObject.X ** 2 +
			directionToObject.Y ** 2 +
			directionToObject.Z ** 2
	)

	const angleToObject = Math.acos(
		(directionToObject.X * cameraForward.X +
			directionToObject.Y * cameraForward.Y +
			directionToObject.Z * cameraForward.Z) /
			distanceToObject
	)

	const projectedX =
		Settings.SCREEN_SIZE_X / 2 +
		((Settings.SCREEN_SIZE_X / 2) *
			(1 / Math.tan(FOV / 2)) *
			(directionToObject.X / distanceToObject)) /
			-Math.cos(angleToObject) /
			AspectRatio
	const projectedY =
		Settings.SCREEN_SIZE_Y / 2 -
		((Settings.SCREEN_SIZE_Y / 2) *
			(1 / Math.tan(FOV / 2)) *
			(directionToObject.Y / distanceToObject)) /
			-Math.cos(angleToObject)

	return new Vector3(projectedX, projectedY, distanceToObject)
}
