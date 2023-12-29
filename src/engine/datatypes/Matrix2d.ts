import { DatatypeStorage } from "../modules/Serde"
import { Vector2 } from "./Vector2"

type Matrix2x2 = [[number, number], [number, number]]

type Range = 0 | 1

/**
 * A 2x2 matrix that can be used to represent rotations and transformations in 2D space.
 *
 * Hosts methods relating to matrix operations which can be used to transform vectors.
 *
 * The matrix is stored in row-major order.
 */
export class Matrix2d {
	/**
	 * Creates a new matrix from the given 2x2 matrix.
	 *
	 * This is how the matrix looks like:
	 * ```ts
	 * [
	 * 	[a, b],
	 * 	[c, d],
	 * ]
	 * ```
	 *
	 * This class is a stub, future additions will be made when needed.
	 */
	constructor(
		readonly matrix: Matrix2x2 = [
			[1, 0],
			[0, 1],
		]
	) {}

	private cachedRightVector?: Vector2
	/**
	 * The right vector of the matrix.
	 *
	 * The first column of the matrix.
	 */
	get rightVector(): Vector2 {
		// cached for performance
		// do not compute at creation or an endless loop will occur
		// if we make the right vector already made when creating the matrix,
		// it will generate its internal properties over and over again.
		if (!this.cachedRightVector) {
			this.cachedRightVector = new Vector2(
				this.matrix[0][0],
				this.matrix[1][0]
			)
		}
		return this.cachedRightVector
	}

	private cachedUpVector?: Vector2
	/**
	 * The up vector of the matrix.
	 *
	 * The second column of the matrix.
	 */
	get upVector(): Vector2 {
		// cached for performance
		// do not compute at creation or an endless loop will occur
		// if we make the up vector already made when creating the matrix,
		// it will generate its internal properties over and over again.
		if (!this.cachedUpVector) {
			this.cachedUpVector = new Vector2(
				this.matrix[0][1],
				this.matrix[1][1]
			)
		}
		return this.cachedUpVector
	}

	private cachedDeterminant?: number
	/**
	 * The determinant of the matrix.
	 */
	determinant(): number {
		if (!this.cachedDeterminant) {
			const [a, b] = this.matrix[0]
			const [c, d] = this.matrix[1]
			this.cachedDeterminant = a * d - b * c
		}
		return this.cachedDeterminant
	}

	/**
	 * Multiplies the matrix with another matrix.
	 */
	multiply(matrix: Matrix2d): Matrix2d
	/**
	 * Multiplies the matrix with a vector.
	 */
	multiply(vector: Vector2): Vector2
	/**
	 * Multiplies the matrix with a scalar.
	 */
	multiply(scalar: number): Matrix2d
	/**
	 * Multiplies the matrix with another matrix, vector or scalar.
	 */
	multiply(other: Matrix2d | Vector2 | number): Matrix2d | Vector2 | number {
		if (other instanceof Vector2) {
			return this.vectorToObjectSpace(other)
		} else if (other instanceof Matrix2d) {
			// const [[a, b], [c, d]] = this.matrix
			// const [[e, f], [g, h]] = other.matrix
			// return new Matrix2d([
			// 	[a * e + b * g, a * f + b * h],
			// 	[c * e + d * g, c * f + d * h],
			// ])
			const matrix: Matrix2x2 = [
				[0, 0],
				[0, 0],
			]
			for (let i = 0 as Range; i < 2; i++) {
				for (let j = 0 as Range; j < 2; j++) {
					matrix[i][j] =
						this.matrix[i][0] * other.matrix[0][j] +
						this.matrix[i][1] * other.matrix[1][j]
				}
			}

			return new Matrix2d(matrix)
		} else if (typeof other === "number") {
			const [[a, b], [c, d]] = this.matrix
			return new Matrix2d([
				[a * other, b * other],
				[c * other, d * other],
			])
		} else {
			throw new TypeError("Invalid type")
		}
	}

	private cachedInverse?: Matrix2d
	/**
	 * The inverse of the matrix.
	 */
	inverse(): Matrix2d {
		if (!this.cachedInverse) {
			const [[a, b], [c, d]] = this.matrix
			const determinant = a * d - b * c
			this.cachedInverse = new Matrix2d([
				[d / determinant, -b / determinant],
				[-c / determinant, a / determinant],
			])
		}
		return this.cachedInverse
	}

	/**
	 * Transforms a vector from world space to object space.
	 *
	 * In other words, it transforms a vector from the space of the matrix to the space of the world.
	 */
	vectorToObjectSpace(vector: Vector2): Vector2 {
		const matrix = this.matrix

		return new Vector2(
			vector.X * matrix[0][0] + vector.Y * matrix[0][1],
			vector.X * matrix[1][0] + vector.Y * matrix[1][1]
		)
	}

	serialize(): DatatypeStorage {
		return {
			datatype: "Matrix2d",
			value: this.matrix,
		}
	}

	/**
	 * Generates a rotation matrix from the given angle in radians clockwise.
	 */
	static angle(angle: number): Matrix2d {
		const cos = Math.cos(angle)
		const sin = Math.sin(angle)
		return new Matrix2d([
			[cos, sin],
			[-sin, cos],
		])
	}

	/**
	 * Generates a rotation matrix from the `position` and `up` vectors.
	 */
	static lookAt(position: Vector2, up: Vector2): Matrix2d {
		const forward = up.subtract(position).unit
		const right = new Vector2(forward.Y, -forward.X)
		return new Matrix2d([
			[right.X, forward.X],
			[right.Y, forward.Y],
		])
	}

	private static identity: Matrix2d
	/**
	 * The identity matrix.
	 */
	static get IDENTITY(): Matrix2d {
		if (!this.identity) {
			this.identity = new Matrix2d()
		}
		return this.identity
	}
}
