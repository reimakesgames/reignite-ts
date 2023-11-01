type Matrix2x2 = [[number, number], [number, number]]

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

	get determinant(): number {
		const [a, b] = this.matrix[0]
		const [c, d] = this.matrix[1]

		return a * d - b * c
	}
}
