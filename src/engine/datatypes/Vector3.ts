/**
 * A 3d vector that represents a position or direction in 3d space.
 */
export class Vector3 {
	constructor(
		readonly X: number = 0,
		readonly Y: number = 0,
		readonly Z: number = 0
	) {
		this.magnitude = Math.sqrt(X * X + Y * Y + Z * Z)
		this.unitElements = [
			X / this.magnitude,
			Y / this.magnitude,
			Z / this.magnitude,
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
	 * Calculates the angle between two vectors.
	 */
	angle(other: Vector3, axis: Vector3): number {
		const a = this.subtract(axis)
		const b = other.subtract(axis)

		return Math.atan2(a.cross(b).magnitude, a.dot(b))
	}

	/**
	 * Calculates the cross product of two vectors.
	 */
	cross(other: Vector3): Vector3 {
		return new Vector3(
			this.Y * other.Z - this.Z * other.Y,
			this.Z * other.X - this.X * other.Z,
			this.X * other.Y - this.Y * other.X
		)
	}

	/**
	 * Calculates the dot product of two vectors.
	 */
	dot(other: Vector3): number {
		return this.X * other.X + this.Y * other.Y + this.Z * other.Z
	}

	/**
	 * Checks if two vectors are equal within a certain epilson.
	 */
	fuzzyEq(other: Vector3, epilson: number): boolean {
		return (
			Math.abs(this.X - other.X) < epilson &&
			Math.abs(this.Y - other.Y) < epilson &&
			Math.abs(this.Z - other.Z) < epilson
		)
	}

	/**
	 * Interpolates between two vectors by a certain alpha where 0 is the first vector and 1 is the second.
	 */
	lerp(other: Vector3, alpha: number): Vector3 {
		return new Vector3(
			this.X + (other.X - this.X) * alpha,
			this.Y + (other.Y - this.Y) * alpha,
			this.Z + (other.Z - this.Z) * alpha
		)
	}

	/**
	 * Returns a new Vector3 where the highest value of each component is chosen.
	 */
	max(other: Vector3): Vector3 {
		return new Vector3(
			Math.max(this.X, other.X),
			Math.max(this.Y, other.Y),
			Math.max(this.Z, other.Z)
		)
	}

	/**
	 * Returns a new Vector3 where the lowest value of each component is chosen.
	 */
	min(other: Vector3): Vector3 {
		return new Vector3(
			Math.min(this.X, other.X),
			Math.min(this.Y, other.Y),
			Math.min(this.Z, other.Z)
		)
	}

	/**
	 * Multiplies two vectors.
	 */
	multiply(other: Vector3 | number): Vector3 {
		if (typeof other === "number") {
			return new Vector3(this.X * other, this.Y * other, this.Z * other)
		} else {
			return new Vector3(
				this.X * other.X,
				this.Y * other.Y,
				this.Z * other.Z
			)
		}
	}

	/**
	 * Divides two vectors.
	 */
	divide(other: Vector3 | number): Vector3 {
		if (typeof other === "number") {
			return new Vector3(this.X / other, this.Y / other, this.Z / other)
		} else {
			return new Vector3(
				this.X / other.X,
				this.Y / other.Y,
				this.Z / other.Z
			)
		}
	}

	/**
	 * Adds two vectors together.
	 */
	add(other: Vector3): Vector3 {
		return new Vector3(this.X + other.X, this.Y + other.Y, this.Z + other.Z)
	}

	/**
	 * Subtracts two vectors.
	 */
	subtract(other: Vector3): Vector3 {
		return new Vector3(this.X - other.X, this.Y - other.Y, this.Z - other.Z)
	}

	/**
	 * Negates a vector.
	 */
	negate(): Vector3 {
		return new Vector3(-this.X, -this.Y, -this.Z)
	}

	/**
	 * Returns a new Vector3 with all components as zero.
	 */
	static get zero(): Vector3 {
		return new Vector3()
	}

	/**
	 * Returns a new Vector3 with all components as one.
	 */
	static get one(): Vector3 {
		return new Vector3(1, 1, 1)
	}

	/**
	 * Returns a new Vector3 with only the X component as one.
	 */
	static get unitX(): Vector3 {
		return new Vector3(1, 0, 0)
	}

	/**
	 * Returns a new Vector3 with only the Y component as one.
	 */
	static get unitY(): Vector3 {
		return new Vector3(0, 1, 0)
	}

	/**
	 * Returns a new Vector3 with only the Z component as one.
	 */
	static get unitZ(): Vector3 {
		return new Vector3(0, 0, 1)
	}
}
