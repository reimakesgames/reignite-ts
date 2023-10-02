class Matrix2x2 {
	constructor(a: number, b: number, c: number, d: number)
	constructor([m00, m01, m10, m11]: [number, number, number, number])
	constructor(
		a: number | [number, number, number, number],
		b?: number,
		c?: number,
		d?: number
	) {
		if (typeof a === "number") {
			this.Matrix = [
				[a, b!],
				[c!, d!],
			]
		} else {
			this.Matrix = [
				[a[0], a[1]],
				[a[2], a[3]],
			]
		}
	}

	public Matrix: [[number, number], [number, number]] = [
		[1, 0],
		[0, 1],
	]

	public get Determinant(): number {
		const [a, b] = this.Matrix[0]
		const [c, d] = this.Matrix[1]

		return a * d - b * c
	}
}

export default Matrix2x2
