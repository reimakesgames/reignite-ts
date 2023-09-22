import Matrix3 from "../datatypes/Matrix3.js"
import Vector3 from "../datatypes/Vector3.js"

class Camera {
	constructor() {
		this.Position = new Vector3(0, 0, 0)
		this.FieldOfView = 70
	}

	public Position: Vector3
	public FieldOfView: number
}

export default Camera
