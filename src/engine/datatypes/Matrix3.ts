import Vector3 from "./Vector3.js"

type Matrix3Raw = [
	[number, number, number],
	[number, number, number],
	[number, number, number]
]
type Range = 0 | 1 | 2
class Matrix3 {
	constructor(
		matrix: Matrix3Raw = [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1],
		]
	) {
		this.Matrix = matrix
	}

	public Matrix: Matrix3Raw = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
	]

	public Multiply(other: Matrix3): Matrix3
	public Multiply(other: Vector3): Vector3
	public Multiply(other: Matrix3 | Vector3): Matrix3 | Vector3 {
		if (other instanceof Vector3) {
			const x =
				this.Matrix[0][0] * other.X +
				this.Matrix[0][1] * other.Y +
				this.Matrix[0][2] * other.Z
			const y =
				this.Matrix[1][0] * other.X +
				this.Matrix[1][1] * other.Y +
				this.Matrix[1][2] * other.Z
			const z =
				this.Matrix[2][0] * other.X +
				this.Matrix[2][1] * other.Y +
				this.Matrix[2][2] * other.Z

			return new Vector3(x, y, z)
		} else if (other instanceof Matrix3) {
			const matrix: Matrix3Raw = [
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0],
			]

			for (let i = 0 as Range; i < 3; i++) {
				for (let j = 0 as Range; j < 3; j++) {
					for (let k = 0 as Range; k < 3; k++) {
						matrix[i][j] += this.Matrix[i][k] * other.Matrix[k][j]
					}
				}
			}

			return new Matrix3(matrix)
		} else {
			throw new Error("Invalid type")
		}
	}

	public VectorToObjectSpace(vector: Vector3): Vector3 {
		return this.Multiply(vector)
	}

	public static Angles(x: number, y: number, z: number): Matrix3 {
		const xMatrix = new Matrix3([
			[1, 0, 0],
			[0, Math.cos(x), -Math.sin(x)],
			[0, Math.sin(x), Math.cos(x)],
		])
		const yMatrix = new Matrix3([
			[Math.cos(y), 0, Math.sin(y)],
			[0, 1, 0],
			[-Math.sin(y), 0, Math.cos(y)],
		])
		const zMatrix = new Matrix3([
			[Math.cos(z), -Math.sin(z), 0],
			[Math.sin(z), Math.cos(z), 0],
			[0, 0, 1],
		])

		return zMatrix.Multiply(yMatrix).Multiply(xMatrix)
	}

	public static LookAt(position: Vector3, target: Vector3): Matrix3 {
		const forward = target.Sub(position).Unit()
		const right = forward.Cross(new Vector3(0, 1, 0)).Unit()
		const up = right.Cross(forward).Unit()

		return new Matrix3([
			[right.X, up.X, -forward.X],
			[right.Y, up.Y, -forward.Y],
			[right.Z, up.Z, -forward.Z],
		])
	}

	public static Identity(): Matrix3 {
		return new Matrix3()
	}
}

export default Matrix3
