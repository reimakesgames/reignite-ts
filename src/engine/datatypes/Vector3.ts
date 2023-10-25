/**
 * Docs WIP
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

	readonly magnitude: number

	private readonly unitElements: [number, number, number]
	private unitVector?: Vector3
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

	cross(other: Vector3): Vector3 {
		return new Vector3(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x
		)
	}

	angle(other: Vector3, axis: Vector3): number {
		const a = this.subtract(axis)
		const b = other.subtract(axis)

		return Math.atan2(a.cross(b).magnitude, a.dot(b))
	}

	dot(other: Vector3): number {
		return this.x * other.x + this.y * other.y + this.z * other.z
	}

	fuzzyEq(other: Vector3, epilson: number): boolean {
		return (
			Math.abs(this.x - other.x) < epilson &&
			Math.abs(this.y - other.y) < epilson &&
			Math.abs(this.z - other.z) < epilson
		)
	}

	lerp(other: Vector3, alpha: number): Vector3 {
		return new Vector3(
			this.x + (other.x - this.x) * alpha,
			this.y + (other.y - this.y) * alpha,
			this.z + (other.z - this.z) * alpha
		)
	}

	max(other: Vector3): Vector3 {
		return new Vector3(
			Math.max(this.x, other.x),
			Math.max(this.y, other.y),
			Math.max(this.z, other.z)
		)
	}

	min(other: Vector3): Vector3 {
		return new Vector3(
			Math.min(this.x, other.x),
			Math.min(this.y, other.y),
			Math.min(this.z, other.z)
		)
	}

	add(other: Vector3): Vector3 {
		return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z)
	}

	subtract(other: Vector3): Vector3 {
		return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z)
	}

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

	negate(): Vector3 {
		return new Vector3(-this.x, -this.y, -this.z)
	}

	static zero(): Vector3 {
		return new Vector3()
	}

	static one(): Vector3 {
		return new Vector3(1, 1, 1)
	}

	static unitX(): Vector3 {
		return new Vector3(1, 0, 0)
	}

	static unitY(): Vector3 {
		return new Vector3(0, 1, 0)
	}

	static unitZ(): Vector3 {
		return new Vector3(0, 0, 1)
	}
}
