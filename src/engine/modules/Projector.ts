import Vector3 from "../datatypes/Vector3"
import Camera from "../classes/Camera"
import Settings from "../../game/Settings"

const AspectRatio = Settings.SCREEN_SIZE_X / Settings.SCREEN_SIZE_Y
const ScreenX = Settings.SCREEN_SIZE_X
const ScreenY = Settings.SCREEN_SIZE_Y
const RenderMargin = Settings.RENDER_MARGIN

export default function Projector(position: Vector3, camera: Camera): Vector3 {
	const FieldOfView = camera.FieldOfView * (Math.PI / 180)

	const cameraTransform = camera.Transform

	const directionToObject = cameraTransform.VectorToObjectSpace(position)
	const distanceToObject = directionToObject.Magnitude()

	const projectedX =
		ScreenX / 2 +
		((ScreenX / 2 / Math.tan(FieldOfView / 2)) *
			-(directionToObject.X / directionToObject.Z)) /
			AspectRatio

	const projectedY =
		ScreenY / 2 -
		(ScreenY / 2 / Math.tan(FieldOfView / 2)) *
			(directionToObject.Y / directionToObject.Z)

	const isSeen = !(
		directionToObject.Z <= 0 ||
		distanceToObject <= 0 ||
		projectedX < 0 - ScreenX * RenderMargin ||
		projectedX > ScreenX + ScreenX * RenderMargin ||
		projectedY < 0 - ScreenY * RenderMargin ||
		projectedY > ScreenY + ScreenY * RenderMargin
	)

	const distance = isSeen ? distanceToObject : -distanceToObject

	return new Vector3(projectedX, projectedY, distance)
}
