import Transform from "../datatypes/Transform.js"
import Vector3 from "../datatypes/Vector3.js"

class Camera {
	constructor() {
		this.Transform = new Transform()
		this.FieldOfView = 70
	}

	public Transform: Transform
	public FieldOfView: number
}

export default Camera
