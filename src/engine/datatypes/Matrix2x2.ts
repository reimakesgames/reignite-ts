class Matrix2x2 {
	constructor(m00: number, m01: number, m10: number, m11: number)
	constructor([m00, m01, m10, m11]: [number, number, number, number])
	constructor(
		m00: number | [number, number, number, number],
		m01?: number,
		m10?: number,
		m11?: number
	) {
		if (typeof m00 === "number") {
			this.m00 = m00
			this.m01 = m01!
			this.m10 = m10!
			this.m11 = m11!
		} else {
			;[this.m00, this.m01, this.m10, this.m11] = m00
		}
	}

	public m00: number
	public m01: number
	public m10: number
	public m11: number

	public get Determinant(): number {
		return this.m00 * this.m11 - this.m01 * this.m10
	}
}

export default Matrix2x2
