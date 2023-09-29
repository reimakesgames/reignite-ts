import Matrix2x2 from "./Matrix2x2.js"
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
		// det A = a * det e, f, h, i - b * det d, f, g, i + c * det d, e, g, h
		return (
			this.Matrix[0][0] *
				new Matrix2x2([
					this.Matrix[1][1],
					this.Matrix[1][2],
					this.Matrix[2][1],
					this.Matrix[2][2],
				]).Determinant -
			this.Matrix[0][1] *
				new Matrix2x2([
					this.Matrix[1][0],
					this.Matrix[1][2],
					this.Matrix[2][0],
					this.Matrix[2][2],
				]).Determinant +
			this.Matrix[0][2] *
				new Matrix2x2([
					this.Matrix[1][0],
					this.Matrix[1][1],
					this.Matrix[2][0],
					this.Matrix[2][1],
				]).Determinant
		)
	}

	public Multiply(other: Matrix3x3): Matrix3x3
	public Multiply(other: Vector3): Vector3
	public Multiply(scalar: number): Matrix3x3
	public Multiply(other: Matrix3x3 | Vector3 | Number): Matrix3x3 | Vector3 {
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
		} else if (other instanceof Matrix3x3) {
			const matrix: Matrix3Raw = [
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0],
			]

			// aj + bm + cp, ak + bn + cq, al + bo + cr
			// dj + em + fp, dk + en + fq, dl + eo + fr
			// gj + hm + ip, gk + hn + iq, gl + ho + ir

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
		console.table(logMatrix(this))

		let detM = new Matrix3x3([
			[
				new Matrix2x2([
					this.Matrix[1][1],
					this.Matrix[1][2],
					this.Matrix[2][1],
					this.Matrix[2][2],
				]).Determinant,
				new Matrix2x2([
					this.Matrix[1][0],
					this.Matrix[1][2],
					this.Matrix[2][0],
					this.Matrix[2][2],
				]).Determinant,
				new Matrix2x2([
					this.Matrix[1][0],
					this.Matrix[1][1],
					this.Matrix[2][0],
					this.Matrix[2][1],
				]).Determinant,
			],
			[
				new Matrix2x2([
					this.Matrix[0][1],
					this.Matrix[0][2],
					this.Matrix[2][1],
					this.Matrix[2][2],
				]).Determinant,
				new Matrix2x2([
					this.Matrix[0][0],
					this.Matrix[0][2],
					this.Matrix[2][0],
					this.Matrix[2][2],
				]).Determinant,
				new Matrix2x2([
					this.Matrix[0][0],
					this.Matrix[0][1],
					this.Matrix[2][0],
					this.Matrix[2][1],
				]).Determinant,
			],
			[
				new Matrix2x2([
					this.Matrix[0][1],
					this.Matrix[0][2],
					this.Matrix[1][1],
					this.Matrix[1][2],
				]).Determinant,
				new Matrix2x2([
					this.Matrix[0][0],
					this.Matrix[0][2],
					this.Matrix[1][0],
					this.Matrix[1][2],
				]).Determinant,
				new Matrix2x2([
					this.Matrix[0][0],
					this.Matrix[0][1],
					this.Matrix[1][0],
					this.Matrix[1][1],
				]).Determinant,
			],
		])

		let multAndTransp = new Matrix3x3([
			[detM.Matrix[0][0], detM.Matrix[1][0] * -1, detM.Matrix[2][0]],
			[detM.Matrix[0][1] * -1, detM.Matrix[1][1], detM.Matrix[2][1] * -1],
			[detM.Matrix[0][2], detM.Matrix[1][2] * -1, detM.Matrix[2][2]],
		])

		const det = this.Determinant()
		const final = multAndTransp.Multiply(1 / det)

		console.table(logMatrix(final))

		// TODO: optimize operations to reduce number of heavy operations of floating point numbers
		// but i dont know how to !!!
		// damn it js, thanks for dropping SIMD support

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

	public static LookAt(position: Vector3, target: Vector3): Matrix3x3 {
		const forward = target.Sub(position).Unit()
		const right = forward.Cross(new Vector3(0, 1, 0)).Unit()
		const up = right.Cross(forward).Unit()

		return new Matrix3x3([
			[-right.X, up.X, forward.X],
			[-right.Y, up.Y, forward.Y],
			[-right.Z, up.Z, forward.Z],
		])
	}

	public static Identity(): Matrix3x3 {
		return new Matrix3x3()
	}
}

export default Matrix3x3
