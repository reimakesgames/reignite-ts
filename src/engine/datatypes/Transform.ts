// Similar to Roblox's CFrame, and Unity's Transform.

import { Matrix3d } from "./Matrix3d"
import { Vector3 } from "./Vector3"

/**
 * A Matrix3d and Vector3 pair that represents a position and rotation in 3d space.
 */
export class Transform {
	constructor(position: Vector3, rotation: Matrix3d)
	constructor(x: number, y: number, z: number)
	constructor()
	constructor(x?: Vector3 | number, y?: Matrix3d | number, z?: number) {
		if (x instanceof Vector3 && y instanceof Matrix3d) {
			this.position = x
			this.rotation = y
		} else if (
			typeof x === "number" &&
			typeof y === "number" &&
			typeof z === "number"
		) {
			this.position = new Vector3(x, y, z)
			this.rotation = new Matrix3d()
		} else {
			this.position = new Vector3()
			this.rotation = new Matrix3d()
		}
	}

	/**
	 * The position of the Transform.
	 */
	readonly position: Vector3 = new Vector3()
	/**
	 * The rotation matrix of the Transform.
	 */
	readonly rotation: Matrix3d = new Matrix3d()

	/**
	 * The LookVector of the Transform.
	 *
	 * Note: This is the negative Z axis of the rotation matrix.
	 */
	get LookVector(): Vector3 {
		return this.rotation.lookVector
	}

	/**
	 * The UpVector of the Transform.
	 */
	get UpVector(): Vector3 {
		return this.rotation.upVector
	}

	/**
	 * The RightVector of the Transform.
	 */
	get RightVector(): Vector3 {
		return this.rotation.rightVector
	}

	Multiply(other: Vector3) {
		return this.position.add(this.rotation.multiply(other))
	}

	VectorToObjectSpace(other: Vector3): Vector3 {
		return this.rotation.inverse().multiply(other.subtract(this.position))
	}

	PointToWorldSpace(other: Vector3): Vector3 {
		return this.position.add(this.rotation.multiply(other))
	}

	/**
	 * Returns a new Transform that is the inverse of this Transform.
	 */
	Inverse(): Transform {
		// new position based on visual testing should be
		// the position of the origin based on the rotation

		return new Transform(
			this.rotation.multiply(this.position).multiply(-1),
			this.rotation.inverse()
		)
	}

	/**
	 * Creates a Transform at the given position pointed at the given target.
	 */
	static LookAt(
		position: Vector3,
		target: Vector3,
		up: Vector3 = new Vector3(0, 1, 0)
	): Transform {
		return new Transform(position, Matrix3d.lookAt(position, target, up))
	}
}
