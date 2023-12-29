import { DatatypeStorage } from "../modules/Serde"
import { Matrix2d } from "./Matrix2d"
import { Vector2 } from "./Vector2"
export class Transform2d {
	constructor()
	constructor(x: number, y: number)
	constructor(position: Vector2, rotation: number)
	constructor(x?: Vector2 | number, y?: number) {
		if (x instanceof Vector2 && typeof y === "number") {
			this.position = x
			this.rotation = y
		} else if (typeof x === "number" && typeof y === "number") {
			this.position = new Vector2(x, y)
			this.rotation = 0
		} else if (typeof x === "undefined" && typeof y === "undefined") {
			this.position = new Vector2()
			this.rotation = 0
		} else {
			throw new TypeError(`Invalid signature: ${x}, ${y}`)
		}
		this.matrix = Matrix2d.angle(this.rotation)
	}
	readonly position: Vector2 = Vector2.zero
	readonly rotation: number = 0
	readonly matrix: Matrix2d

	/**
	 * The RightVector of the Transform2d.
	 *
	 * Note: This is the positive X axis of the rotation matrix.
	 */
	get rightVector(): Vector2 {
		return this.matrix.rightVector
	}

	/**
	 * The UpVector of the Transform2d.
	 *
	 * Note: This is the positive Y axis of the rotation matrix.
	 */
	get upVector(): Vector2 {
		return this.matrix.upVector
	}

	/**
	 * The inverse of the Transform2d.
	 */
	inverse(): Transform2d {
		return new Transform2d(
			this.matrix.multiply(this.position).multiply(-1),
			-Math.atan2(this.rightVector.Y, this.rightVector.X)
		)
	}

	/**
	 * Returns the composition of two Transform2ds.
	 *
	 * Right to left.
	 */
	multiply(other: Transform2d): Transform2d
	/**
	 * Returns a Vector2 transformed by this Transform2d.
	 */
	multiply(other: Vector2): Vector2
	multiply(other: Transform2d | Vector2) {
		if (other instanceof Transform2d) {
			return new Transform2d(
				this.matrix.multiply(other.position),
				this.rotation + other.rotation
			)
		} else if (other instanceof Vector2) {
			return this.matrix.multiply(other)
		}
		throw new TypeError("Invalid type")
	}

	/**
	 * Returns a new Transform2d that is translated by the given Vector2.
	 */
	add(other: Vector2) {
		return new Transform2d(this.position.add(other), this.rotation)
	}

	/**
	 * Returns a new Transform2d that is translated by the given Vector2.
	 */
	subtract(other: Vector2) {
		return new Transform2d(this.position.subtract(other), this.rotation)
	}

	/**
	 * Returns the Transform2d transformed by this Transform2d.
	 *
	 * Equivalent to `this.multiply(other)`.
	 */
	toWorldSpace(other: Transform2d): Transform2d {
		return this.multiply(other)
	}

	/**
	 * Returns the Transform2d in the object space of this Transform2d.
	 *
	 * Equivalent to `this.inverse().multiply(other)`.
	 */
	toObjectSpace(other: Transform2d): Transform2d {
		return this.inverse().multiply(other)
	}

	/**
	 * Returns a worldspace vector from a local vector.
	 *
	 * Equivalent to transforming the input vector from object space to worldspace using this transformation:
	 *	`(this.matrix * other + this.position)`
	 */
	vectorToWorldSpace(other: Vector2): Vector2 {
		return this.matrix.multiply(other).add(this.position)
	}

	/**
	 * Returns a local vector from a worldspace vector.
	 *
	 * Equivalent to transforming the input vector from worldspace to object space using this transformation:
	 *	`(this.matrix.inverse() * (other - this.position))`
	 */
	vectorToObjectSpace(other: Vector2): Vector2 {
		return this.matrix.inverse().multiply(other.subtract(this.position))
	}

	/**
	 * Returns a vector from the object space of this Transform2d to world space.
	 *
	 * `this.position.add(this.rotation.multiply(other))`
	 */
	pointToWorldSpace(other: Vector2): Vector2 {
		return this.position.add(this.matrix.multiply(other))
	}

	/**
	 * Returns a vector from world space to the object space of this Transform2d.
	 *
	 * `this.rotation.inverse().multiply(other.subtract(this.position))`
	 */
	pointToObjectSpace(other: Vector2): Vector2 {
		return this.matrix.inverse().multiply(other.subtract(this.position))
	}

	/**
	 * Returns a new Transform2d with the given position.
	 */
	withPosition(position: Vector2): Transform2d {
		return new Transform2d(position, this.rotation)
	}

	/**
	 * Returns a new Transform2d with the given rotation.
	 */
	withRotation(rotation: number): Transform2d {
		return new Transform2d(this.position, rotation)
	}

	serialize(): DatatypeStorage {
		return {
			datatype: "Transform2d",
			value: [this.position.serialize(), this.rotation],
		}
	}

	/**
	 * Creates a Transform2d at the given position pointed at the given target.
	 */
	static lookAt(position: Vector2, target: Vector2): Transform2d {
		const forward = target.subtract(position).unit
		return new Transform2d(position, Math.atan2(forward.Y, forward.X))
	}
}
