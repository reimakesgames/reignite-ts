// Similar to Roblox's CFrame, and Unity's Transform.

import Matrix3x3 from "./Matrix3x3"
import Vector3 from "./Vector3"

class Transform {
	constructor(position: Vector3, rotation: Matrix3x3)
	constructor(x: number, y: number, z: number)
	constructor()
	constructor(x?: Vector3 | number, y?: Matrix3x3 | number, z?: number) {
		if (x instanceof Vector3 && y instanceof Matrix3x3) {
			this.Position = x
			this.Rotation = y
		} else if (
			typeof x === "number" &&
			typeof y === "number" &&
			typeof z === "number"
		) {
			this.Position = new Vector3(x, y, z)
			this.Rotation = new Matrix3x3()
		} else {
			this.Position = new Vector3()
			this.Rotation = new Matrix3x3()
		}
	}

	public Position: Vector3 = new Vector3()
	public Rotation: Matrix3x3 = new Matrix3x3()

	public get LookVector(): Vector3 {
		return this.Rotation.LookVector
	}
	public get UpVector(): Vector3 {
		return this.Rotation.UpVector
	}
	public get RightVector(): Vector3 {
		return this.Rotation.RightVector
	}

	public Multiply(other: Vector3) {
		return this.Position.Add(this.Rotation.Multiply(other))
	}

	public VectorToObjectSpace(other: Vector3): Vector3 {
		return this.Rotation.Inverse().Multiply(other.Sub(this.Position))
	}

	public PointToWorldSpace(other: Vector3): Vector3 {
		return this.Position.Add(this.Rotation.Multiply(other))
	}

	public Inverse(): Transform {
		// new position based on visual testing should be
		// the position of the origin based on the rotation

		return new Transform(
			this.Rotation.Multiply(this.Position).Mul(-1),
			this.Rotation.Inverse()
		)
	}

	public static LookAt(
		position: Vector3,
		target: Vector3,
		up: Vector3 = new Vector3(0, 1, 0)
	): Transform {
		return new Transform(position, Matrix3x3.LookAt(position, target, up))
	}
}

export default Transform
