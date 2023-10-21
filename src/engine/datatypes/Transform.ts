// Similar to Roblox's CFrame, and Unity's Transform.

import { Matrix3d } from "./Matrix3d"
import Vector3 from "./Vector3"

/**
 * ### Transform
 *
 */
class Transform {
	constructor(position: Vector3, rotation: Matrix3d)
	constructor(x: number, y: number, z: number)
	constructor()
	constructor(x?: Vector3 | number, y?: Matrix3d | number, z?: number) {
		if (x instanceof Vector3 && y instanceof Matrix3d) {
			this.Position = x
			this.Rotation = y
		} else if (
			typeof x === "number" &&
			typeof y === "number" &&
			typeof z === "number"
		) {
			this.Position = new Vector3(x, y, z)
			this.Rotation = new Matrix3d()
		} else {
			this.Position = new Vector3()
			this.Rotation = new Matrix3d()
		}
	}

	public Position: Vector3 = new Vector3()
	public Rotation: Matrix3d = new Matrix3d()

	public get LookVector(): Vector3 {
		return this.Rotation.lookVector
	}
	public get UpVector(): Vector3 {
		return this.Rotation.upVector
	}
	public get RightVector(): Vector3 {
		return this.Rotation.rightVector
	}

	public Multiply(other: Vector3) {
		return this.Position.Add(this.Rotation.multiply(other))
	}

	public VectorToObjectSpace(other: Vector3): Vector3 {
		return this.Rotation.inverse().multiply(other.Sub(this.Position))
	}

	public PointToWorldSpace(other: Vector3): Vector3 {
		return this.Position.Add(this.Rotation.multiply(other))
	}

	public Inverse(): Transform {
		// new position based on visual testing should be
		// the position of the origin based on the rotation

		return new Transform(
			this.Rotation.multiply(this.Position).Mul(-1),
			this.Rotation.inverse()
		)
	}

	public static LookAt(
		position: Vector3,
		target: Vector3,
		up: Vector3 = new Vector3(0, 1, 0)
	): Transform {
		return new Transform(position, Matrix3d.lookAt(position, target, up))
	}
}

export default Transform
