import Vector3 from "./Vector3.js"

type Matrix3Raw = [
	[number, number, number],
	[number, number, number],
	[number, number, number]
]
type Range = 0 | 1 | 2

function logMatrix(m: Matrix3x3) {
	let thing = []
	for (let i = 0 as Range; i < 3; i++) {
		// print i, j, k hat as row and x, y, z hat as column
		thing.push([m.Matrix[0][i], m.Matrix[1][i], m.Matrix[2][i]])
	}
	return thing
}

class Matrix3x3 {
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

	public Determinant(): number {
		const [a, b, c] = this.Matrix[0]
		const [d, e, f] = this.Matrix[1]
		const [g, h, i] = this.Matrix[2]

		return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
	}

	public Multiply(other: Matrix3x3): Matrix3x3
	public Multiply(other: Vector3): Vector3
	public Multiply(scalar: number): Matrix3x3
	public Multiply(other: Matrix3x3 | Vector3 | Number): Matrix3x3 | Vector3 {
		if (other instanceof Vector3) {
			const matrix = this.Matrix
			const x =
				matrix[0][0] * other.X +
				matrix[0][1] * other.Y +
				matrix[0][2] * other.Z
			const y =
				matrix[1][0] * other.X +
				matrix[1][1] * other.Y +
				matrix[1][2] * other.Z
			const z =
				matrix[2][0] * other.X +
				matrix[2][1] * other.Y +
				matrix[2][2] * other.Z

			return new Vector3(x, y, z)
		} else if (other instanceof Matrix3x3) {
			// aj + bm + cp, ak + bn + cq, al + bo + cr
			// dj + em + fp, dk + en + fq, dl + eo + fr
			// gj + hm + ip, gk + hn + iq, gl + ho + ir

			const matrix: Matrix3Raw = [
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0],
			]

			for (let i = 0 as Range; i < 3; i++) {
				for (let j = 0 as Range; j < 3; j++) {
					matrix[i][j] =
						this.Matrix[i][0] * other.Matrix[0][j] +
						this.Matrix[i][1] * other.Matrix[1][j] +
						this.Matrix[i][2] * other.Matrix[2][j]
				}
			}

			return new Matrix3x3(matrix)
		} else if (typeof other === "number") {
			const matrix: Matrix3Raw = [
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0],
			]

			for (let i = 0 as Range; i < 3; i++) {
				for (let j = 0 as Range; j < 3; j++) {
					matrix[i][j] = this.Matrix[i][j] * other
				}
			}

			return new Matrix3x3(matrix)
		} else {
			throw new Error("Invalid type")
		}
	}

	public Inverse(): Matrix3x3 {
		const [a, b, c] = this.Matrix[0]
		const [d, e, f] = this.Matrix[1]
		const [g, h, i] = this.Matrix[2]

		const det =
			a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)

		const final = new Matrix3x3([
			[
				(e * i - f * h) / det,
				-(b * i - c * h) / det,
				(b * f - c * e) / det,
			],
			[
				-(d * i - f * g) / det,
				(a * i - c * g) / det,
				-(a * f - c * d) / det,
			],
			[
				(d * h - e * g) / det,
				-(a * h - b * g) / det,
				(a * e - b * d) / det,
			],
		])

		// sexy optimization brought the time taken by a whopping 50% !!! holy hell

		return final
	}

	public VectorToObjectSpace(vector: Vector3): Vector3 {
		return this.Multiply(vector)
	}

	public static Angles(x: number, y: number, z: number): Matrix3x3 {
		const xMatrix = new Matrix3x3([
			[1, 0, 0],
			[0, Math.cos(x), -Math.sin(x)],
			[0, Math.sin(x), Math.cos(x)],
		])
		const yMatrix = new Matrix3x3([
			[Math.cos(y), 0, Math.sin(y)],
			[0, 1, 0],
			[-Math.sin(y), 0, Math.cos(y)],
		])
		const zMatrix = new Matrix3x3([
			[Math.cos(z), -Math.sin(z), 0],
			[Math.sin(z), Math.cos(z), 0],
			[0, 0, 1],
		])

		return zMatrix.Multiply(yMatrix).Multiply(xMatrix)
	}

	public static LookAt(
		position: Vector3,
		target: Vector3,
		up: Vector3 = new Vector3(0, 1, 0)
	): Matrix3x3 {
		const forward = target.Sub(position).Unit()
		const right = forward.Cross(up).Unit()
		const up2 = right.Cross(forward).Unit()

		return new Matrix3x3([
			[-right.X, up2.X, forward.X],
			[-right.Y, up2.Y, forward.Y],
			[-right.Z, up2.Z, forward.Z],
		])
	}

	public static Identity(): Matrix3x3 {
		return new Matrix3x3()
	}
}

export default Matrix3x3
