class Vector2 {
	constructor(x: number = 0, y: number = 0) {
		this.X = x
		this.Y = y
	}

	public readonly X: number
	public readonly Y: number

	public Magnitude(): number {
		return Math.sqrt(this.X * this.X + this.Y * this.Y)
	}
}

export default Vector2
