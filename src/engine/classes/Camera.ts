import { Transform } from "../datatypes/Transform"

class Camera {
	constructor() {
		this.Transform = new Transform()
		this.FieldOfView = 70
	}

	public Transform: Transform
	public FieldOfView: number
}

export default Camera
