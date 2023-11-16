import { Vector3 } from "../datatypes/Vector3"
import { Camera } from "../classes/Camera"
import { SETTINGS } from "../Settings"

const ASPECT_RATIO = SETTINGS.screenSizeX / SETTINGS.screenSizeY
const SCREEN_X = SETTINGS.screenSizeX
const SCREEN_Y = SETTINGS.screenSizeY
const RENDER_CLIPPING_MARGIN = SETTINGS.renderClippingPercentage

export function Projector(position: Vector3, camera: Camera): Vector3 {
	const fieldOfView = camera.fieldOfView * (Math.PI / 180)

	const dirToObj = camera.transform.vectorToObjectSpace(position)
	const distToObj = dirToObj.magnitude

	const outputX =
		SCREEN_X / 2 +
		((SCREEN_X / 2 / Math.tan(fieldOfView / 2)) *
			-(dirToObj.X / dirToObj.Z)) /
			ASPECT_RATIO

	const outputY =
		SCREEN_Y / 2 -
		(SCREEN_Y / 2 / Math.tan(fieldOfView / 2)) * (dirToObj.Y / dirToObj.Z)

	const isInRenderBounds = !(
		dirToObj.Z <= 0 ||
		distToObj <= 0 ||
		outputX < 0 - SCREEN_X * RENDER_CLIPPING_MARGIN ||
		outputX > SCREEN_X + SCREEN_X * RENDER_CLIPPING_MARGIN ||
		outputY < 0 - SCREEN_Y * RENDER_CLIPPING_MARGIN ||
		outputY > SCREEN_Y + SCREEN_Y * RENDER_CLIPPING_MARGIN
	)

	const dist = isInRenderBounds ? distToObj : -distToObj

	return new Vector3(outputX, outputY, dist)
}
