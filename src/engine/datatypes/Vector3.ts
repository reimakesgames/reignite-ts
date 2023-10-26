/**
 * A 3d vector that represents a position or direction in 3d space.
 */
export class Vector3 {
	constructor(
		readonly x: number = 0,
		readonly y: number = 0,
		readonly z: number = 0
	) {
		this.magnitude = Math.sqrt(x * x + y * y + z * z)
		this.unitElements = [
			x / this.magnitude,
			y / this.magnitude,
			z / this.magnitude,
		]
	}

	/**
	 * The length of the Vector.
	 */
	readonly magnitude: number
	private readonly unitElements: [number, number, number]
	private unitVector?: Vector3
	/**
	 * A normalized copy of the Vector.
	 */
	get unit(): Vector3 {
		if (!this.unitVector) {
			this.unitVector = new Vector3(
				this.unitElements[0],
				this.unitElements[1],
				this.unitElements[2]
			)
		}
		return this.unitVector
	}

	/**
	 * Calculates the cross product of two vectors.
	 */
	cross(other: Vector3): Vector3 {
		return new Vector3(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x
		)
	}

	/**
	 * Calculates the angle between two vectors.
	 */
	angle(other: Vector3, axis: Vector3): number {
		const a = this.subtract(axis)
		const b = other.subtract(axis)

		return Math.atan2(a.cross(b).magnitude, a.dot(b))
	}

	/**
	 * Calculates the dot product of two vectors.
	 */
	dot(other: Vector3): number {
		return this.x * other.x + this.y * other.y + this.z * other.z
	}

	/**
	 * Checks if two vectors are equal within a certain epilson.
	 */
	fuzzyEq(other: Vector3, epilson: number): boolean {
		return (
			Math.abs(this.x - other.x) < epilson &&
			Math.abs(this.y - other.y) < epilson &&
			Math.abs(this.z - other.z) < epilson
		)
	}

	/**
	 * Interpolates between two vectors by a certain alpha where 0 is the first vector and 1 is the second.
	 */
	lerp(other: Vector3, alpha: number): Vector3 {
		return new Vector3(
			this.x + (other.x - this.x) * alpha,
			this.y + (other.y - this.y) * alpha,
			this.z + (other.z - this.z) * alpha
		)
	}

	/**
	 * Returns a new Vector3 where the highest value of each component is chosen.
	 */
	max(other: Vector3): Vector3 {
		return new Vector3(
			Math.max(this.x, other.x),
			Math.max(this.y, other.y),
			Math.max(this.z, other.z)
		)
	}

	/**
	 * Returns a new Vector3 where the lowest value of each component is chosen.
	 */
	min(other: Vector3): Vector3 {
		return new Vector3(
			Math.min(this.x, other.x),
			Math.min(this.y, other.y),
			Math.min(this.z, other.z)
		)
	}

	/**
	 * Adds two vectors together.
	 */
	add(other: Vector3): Vector3 {
		return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z)
	}

	/**
	 * Subtracts two vectors.
	 */
	subtract(other: Vector3): Vector3 {
		return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z)
	}

	/**
	 * Multiplies two vectors.
	 */
	multiply(other: Vector3 | number): Vector3 {
		if (typeof other === "number") {
			return new Vector3(this.x * other, this.y * other, this.z * other)
		} else {
			return new Vector3(
				this.x * other.x,
				this.y * other.y,
				this.z * other.z
			)
		}
	}

	/**
	 * Divides two vectors.
	 */
	divide(other: Vector3 | number): Vector3 {
		if (typeof other === "number") {
			return new Vector3(this.x / other, this.y / other, this.z / other)
		} else {
			return new Vector3(
				this.x / other.x,
				this.y / other.y,
				this.z / other.z
			)
		}
	}

	/**
	 * Negates a vector.
	 */
	negate(): Vector3 {
		return new Vector3(-this.x, -this.y, -this.z)
	}

	/**
	 * Returns a new Vector3 with all components as zero.
	 */
	static zero(): Vector3 {
		return new Vector3()
	}

	/**
	 * Returns a new Vector3 with all components as one.
	 */
	static one(): Vector3 {
		return new Vector3(1, 1, 1)
	}

	/**
	 * Returns a new Vector3 with only the X component as one.
	 */
	static unitX(): Vector3 {
		return new Vector3(1, 0, 0)
	}

	/**
	 * Returns a new Vector3 with only the Y component as one.
	 */
	static unitY(): Vector3 {
		return new Vector3(0, 1, 0)
	}

	/**
	 * Returns a new Vector3 with only the Z component as one.
	 */
	static unitZ(): Vector3 {
		return new Vector3(0, 0, 1)
	}
}
