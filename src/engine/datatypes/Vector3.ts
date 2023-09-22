class Vector3 {
	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.X = x
		this.Y = y
		this.Z = z
		this._magnitude = Math.sqrt(x * x + y * y + z * z)
		this._unitValues = [
			x / this._magnitude,
			y / this._magnitude,
			z / this._magnitude,
		]
	}

	public readonly X: number
	public readonly Y: number
	public readonly Z: number

	private readonly _unitValues: [number, number, number]
	private _unitVector: Vector3 | null = null // only exists if Unit is called, then it's cached
	private readonly _magnitude: number

	public Cross(other: Vector3): Vector3 {
		return new Vector3(
			this.Y * other.Z - this.Z * other.Y,
			this.Z * other.X - this.X * other.Z,
			this.X * other.Y - this.Y * other.X
		)
	}

	public Angle(other: Vector3, axis: Vector3): number {
		const a = this.Sub(axis)
		const b = other.Sub(axis)

		return Math.atan2(a.Cross(b).Magnitude(), a.Dot(b))
	}

	public Dot(other: Vector3): number {
		return this.X * other.X + this.Y * other.Y + this.Z * other.Z
	}

	public FuzzyEq(other: Vector3, epilson: number): boolean {
		return (
			Math.abs(this.X - other.X) < epilson &&
			Math.abs(this.Y - other.Y) < epilson &&
			Math.abs(this.Z - other.Z) < epilson
		)
	}

	public Lerp(other: Vector3, alpha: number): Vector3 {
		return new Vector3(
			this.X + (other.X - this.X) * alpha,
			this.Y + (other.Y - this.Y) * alpha,
			this.Z + (other.Z - this.Z) * alpha
		)
	}

	public Max(other: Vector3): Vector3 {
		return new Vector3(
			Math.max(this.X, other.X),
			Math.max(this.Y, other.Y),
			Math.max(this.Z, other.Z)
		)
	}

	public Min(other: Vector3): Vector3 {
		return new Vector3(
			Math.min(this.X, other.X),
			Math.min(this.Y, other.Y),
			Math.min(this.Z, other.Z)
		)
	}

	public Add(other: Vector3): Vector3 {
		return new Vector3(this.X + other.X, this.Y + other.Y, this.Z + other.Z)
	}

	public Sub(other: Vector3): Vector3 {
		return new Vector3(this.X - other.X, this.Y - other.Y, this.Z - other.Z)
	}

	public Mul(other: Vector3 | number): Vector3 {
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

	public Div(other: Vector3 | number): Vector3 {
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

	public Neg(): Vector3 {
		return new Vector3(-this.X, -this.Y, -this.Z)
	}

	public Magnitude(): number {
		return this._magnitude
	}

	public Unit(): Vector3 {
		if (!this._unitVector) {
			this._unitVector = new Vector3(
				this._unitValues[0],
				this._unitValues[1],
				this._unitValues[2]
			)
		}

		return this._unitVector
	}

	public static Zero(): Vector3 {
		return new Vector3()
	}

	public static One(): Vector3 {
		return new Vector3(1, 1, 1)
	}

	public static UnitX(): Vector3 {
		return new Vector3(1, 0, 0)
	}

	public static UnitY(): Vector3 {
		return new Vector3(0, 1, 0)
	}

	public static UnitZ(): Vector3 {
		return new Vector3(0, 0, 1)
	}
}

export default Vector3
