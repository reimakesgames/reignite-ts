// import { typeError } from "../modules/Debugger"

import { DatatypeStorage } from "../modules/Serde"

/**
 * A 2d vector that represents a position or direction in 2d space.
 */
export class Vector2 {
	constructor(readonly X: number = 0, readonly Y: number = 0) {
		this.magnitude = Math.sqrt(this.X * this.X + this.Y * this.Y)
		this.unitElements = [this.X / this.magnitude, this.Y / this.magnitude]
	}

	readonly magnitude: number

	private unitElements: [number, number]
	private unitVector?: Vector2
	/**
	 * A normalized copy of the Vector.
	 */
	get unit(): Vector2 {
		if (!this.unitVector) {
			this.unitVector = new Vector2(
				this.unitElements[0],
				this.unitElements[1]
			)
		}
		return this.unitVector
	}

	/**
	 * Calculates the angle between two vectors.
	 */
	angle(other: Vector2): number {
		return Math.atan2(this.cross(other), this.dot(other))
	}

	/**
	 * Calculates the cross product of two vectors.
	 */
	cross(other: Vector2): number {
		return this.X * other.Y - this.Y * other.X
	}

	/**
	 * Calculates the dot product of two vectors.
	 */
	dot(other: Vector2): number {
		return this.X * other.X + this.Y * other.Y
	}

	/**
	 * Checks if two vectors are equal within a certain epilson.
	 */
	fuzzyEq(other: Vector2, epsilon: number): boolean {
		return (
			Math.abs(this.X - other.X) < epsilon &&
			Math.abs(this.Y - other.Y) < epsilon
		)
	}

	/**
	 * Interpolates between two vectors by a certain alpha where 0 is the first vector and 1 is the second.
	 */
	lerp(other: Vector2, alpha: number): Vector2 {
		return new Vector2(
			this.X + alpha * (other.X - this.X),
			this.Y + alpha * (other.Y - this.Y)
		)
	}

	/**
	 * Returns a new Vector2 where the highest value of each component is chosen.
	 */
	max(other: Vector2): Vector2 {
		return new Vector2(Math.max(this.X, other.X), Math.max(this.Y, other.Y))
	}

	/**
	 * Returns a new Vector2 where the lowest value of each component is chosen.
	 */
	min(other: Vector2): Vector2 {
		return new Vector2(Math.min(this.X, other.X), Math.min(this.Y, other.Y))
	}

	/**
	 * Multiplies the vector by a scalar.
	 */
	multiply(scalar: number): Vector2
	/**
	 * Multiplies the vector by another vector.
	 */
	multiply(other: Vector2): Vector2
	multiply(other: Vector2 | number): Vector2 {
		if (typeof other === "number") {
			return new Vector2(this.X * other, this.Y * other)
		} else if (other instanceof Vector2) {
			return new Vector2(this.X * other.X, this.Y * other.Y)
		}
		// throw typeError("other", ["number", "Vector2"], other)
		throw new TypeError("Invalid type on parameter `other`")
	}

	/**
	 * Divides two vectors.
	 */
	divide(other: Vector2): Vector2 {
		return new Vector2(this.X / other.X, this.Y / other.Y)
	}

	/**
	 * Adds two vectors together.
	 */
	add(other: Vector2): Vector2 {
		return new Vector2(this.X + other.X, this.Y + other.Y)
	}

	/**
	 * Subtracts two vectors.
	 */
	subtract(other: Vector2): Vector2 {
		return new Vector2(this.X - other.X, this.Y - other.Y)
	}

	/**
	 * Negates a vector.
	 */
	negate(): Vector2 {
		return new Vector2(-this.X, -this.Y)
	}

	serialize(): DatatypeStorage {
		return {
			datatype: "Vector2",
			value: [this.X, this.Y],
		}
	}

	/**
	 * Returns a new Vector2 with all components as zero.
	 */
	static get zero(): Vector2 {
		return new Vector2()
	}

	/**
	 * Returns a new Vector2 with all components as one.
	 */
	static get one(): Vector2 {
		return new Vector2(1, 1)
	}

	/**
	 * Returns a new Vector2 with the X component as one.
	 */
	static get unitX(): Vector2 {
		return new Vector2(1, 0)
	}

	/**
	 * Returns a new Vector2 with the Y component as one.
	 */
	static get unitY(): Vector2 {
		return new Vector2(0, 1)
	}
}
