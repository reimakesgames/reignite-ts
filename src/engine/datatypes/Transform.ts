// Similar to Roblox's CFrame, and Unity's Transform.

import { DatatypeStorage } from "../modules/Serde"
import { Matrix3d } from "./Matrix3d"
import { Vector3 } from "./Vector3"

/**
 * A Matrix3d and Vector3 pair that represents a position and rotation in 3d space.
 *
 * ---
 *
 * [Roblox Reference](https://create.roblox.com/docs/reference/engine/datatypes/CFrame)
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
		} else if (
			typeof x === "undefined" &&
			typeof y === "undefined" &&
			typeof z === "undefined"
		) {
			this.position = new Vector3()
			this.rotation = new Matrix3d()
		} else {
			throw new TypeError("Invalid signature")
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
	get lookVector(): Vector3 {
		return this.rotation.lookVector
	}

	/**
	 * The UpVector of the Transform.
	 */
	get upVector(): Vector3 {
		return this.rotation.upVector
	}

	/**
	 * The RightVector of the Transform.
	 */
	get rightVector(): Vector3 {
		return this.rotation.rightVector
	}

	/**
	 * Returns a new Transform that is the inverse of this Transform.
	 */
	inverse(): Transform {
		// new position based on visual testing should be
		// the position of the origin based on the rotation

		return new Transform(
			this.rotation.multiply(this.position).multiply(-1),
			this.rotation.inverse()
		)
	}

	/**
	 * Returns the composition of two Transforms. Follows the function composition order.
	 *
	 * Right to left.
	 */
	multiply(other: Transform): Transform
	/**
	 * Returns a Vector3 transformed by this Transform.
	 */
	multiply(other: Vector3): Vector3
	multiply(other: Transform | Vector3) {
		if (other instanceof Transform) {
			return new Transform(
				this.position.add(this.rotation.multiply(other.position)),
				this.rotation.multiply(other.rotation)
			)
		} else if (other instanceof Vector3) {
			return this.position.add(this.rotation.multiply(other))
		}
		throw new TypeError("Invalid overload parameters")
	}

	/**
	 * Returns a new Transform that is translated by the given Vector3.
	 */
	add(other: Vector3) {
		return new Transform(this.position.add(other), this.rotation)
	}

	/**
	 * Returns a new Transform that is translated by the given Vector3.
	 */
	subtract(other: Vector3) {
		return new Transform(this.position.subtract(other), this.rotation)
	}

	/**
	 * Returns the Transform transformed by this Transform.
	 *
	 * Equivalent to the operation: `this.multiply(other)`.
	 */
	toWorldSpace(other: Transform): Transform {
		return this.multiply(other)
	}

	/**
	 * Returns the Transform in the object space of this Transform.
	 *
	 * Equivalent to the operation: `this.inverse().multiply(other)`.
	 */
	toObjectSpace(other: Transform): Transform {
		return this.inverse().multiply(other)
	}

	/**
	 * Returns a worldspace vector from a local vector.
	 *
	 * Equivalent to transforming the input vector from object space to worldspace using this transformation:
	 * `(this.rotation * other + this.position)`
	 */
	vectorToWorldSpace(other: Vector3): Vector3 {
		return this.rotation.multiply(other).add(this.position)
	}

	/**
	 * Returns a local vector from a worldspace vector.
	 *
	 * Equivalent to transforming the input vector from worldspace to object space using this transformation:
	 * `(this.rotation.inverse() * (other - this.position))`
	 */
	vectorToObjectSpace(other: Vector3): Vector3 {
		return this.rotation.inverse().multiply(other.subtract(this.position))
	}

	/**
	 * Returns a vector from the object space of this Transform to world space.
	 *
	 * Equivalent to the operation: `this.position.add(this.rotation.multiply(other))`.
	 */
	pointToWorldSpace(other: Vector3): Vector3 {
		return this.position.add(this.rotation.multiply(other))
	}

	/**
	 * Returns a vector in the object space of this Transform.
	 *
	 * Equivalent to the operation: `this.rotation.inverse().multiply(other.subtract(this.position))`.
	 */
	pointToObjectSpace(other: Vector3): Vector3 {
		return this.rotation.inverse().multiply(other.subtract(this.position))
	}

	serialize(): DatatypeStorage {
		return {
			datatype: "Transform",
			value: {
				position: this.position.serialize(),
				rotation: this.rotation.serialize(),
			},
		}
	}

	/**
	 * Creates a Transform at the given position pointed at the given target.
	 *
	 * An optional up vector can be provided. Defaults to (0, 1, 0).
	 */
	static lookAt(
		position: Vector3,
		target: Vector3,
		up: Vector3 = new Vector3(0, 1, 0)
	): Transform {
		return new Transform(position, Matrix3d.lookAt(position, target, up))
	}
}
