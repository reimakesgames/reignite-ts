import Settings from "../../game/Settings"
import TextureCoordinates from "../datatypes/TextureCoordinates"
import Vector2 from "../datatypes/Vector2"

class Triangle {
	constructor(
		p0: Vector2,
		p1: Vector2,
		p2: Vector2,
		t0: TextureCoordinates,
		t1: TextureCoordinates,
		t2: TextureCoordinates
	) {
		this.p0 = p0
		this.p1 = p1
		this.p2 = p2

		this.t0 = t0
		this.t1 = t1
		this.t2 = t2
	}

	public p0: Vector2
	public p1: Vector2
	public p2: Vector2

	public t0: TextureCoordinates
	public t1: TextureCoordinates
	public t2: TextureCoordinates
}

class Texturer {
	constructor(image: HTMLImageElement) {
		this.image = image
	}

	private _render(triangle: Triangle) {
		if (!this.context) {
			return
		}
		if (Settings.ENABLE_WIREFRAME) {
			this.context.strokeStyle = "black"
			this.context.beginPath()
			this.context.moveTo(triangle.p0.X, triangle.p0.Y)
			this.context.lineTo(triangle.p1.X, triangle.p1.Y)
			this.context.lineTo(triangle.p2.X, triangle.p2.Y)
			this.context.lineTo(triangle.p0.X, triangle.p0.Y)
			this.context.stroke()
			this.context.closePath()
		}

		if (this.image) {
			this._drawTriangle(
				this.context,
				this.image,
				triangle.p0,
				triangle.p1,
				triangle.p2,
				triangle.t0,
				triangle.t1,
				triangle.t2
			)
		}
	}

	private _calculateGeometry() {
		this.triangles = []

		let dx1 = this.p4.X - this.p1.X
		let dy1 = this.p4.Y - this.p1.Y
		let dx2 = this.p3.X - this.p2.X
		let dy2 = this.p3.Y - this.p2.Y

		let imgW = this.image.naturalWidth
		let imgH = this.image.naturalHeight

		for (let sub = 0; sub < this.VerticalSubdivisions; ++sub) {
			let curRow = sub / this.VerticalSubdivisions
			let nextRow = (sub + 1) / this.VerticalSubdivisions

			let curRowX1 = this.p1.X + dx1 * curRow
			let curRowY1 = this.p1.Y + dy1 * curRow

			let curRowX2 = this.p2.X + dx2 * curRow
			let curRowY2 = this.p2.Y + dy2 * curRow

			let nextRowX1 = this.p1.X + dx1 * nextRow
			let nextRowY1 = this.p1.Y + dy1 * nextRow

			let nextRowX2 = this.p2.X + dx2 * nextRow
			let nextRowY2 = this.p2.Y + dy2 * nextRow

			for (let div = 0; div < this.HorizontalSubdivisions; ++div) {
				let curCol = div / this.HorizontalSubdivisions
				let nextCol = (div + 1) / this.HorizontalSubdivisions

				let dCurX = curRowX2 - curRowX1
				let dCurY = curRowY2 - curRowY1
				let dNextX = nextRowX2 - nextRowX1
				let dNextY = nextRowY2 - nextRowY1

				let p1x = curRowX1 + dCurX * curCol
				let p1y = curRowY1 + dCurY * curCol

				let p2x = curRowX1 + (curRowX2 - curRowX1) * nextCol
				let p2y = curRowY1 + (curRowY2 - curRowY1) * nextCol

				let p3x = nextRowX1 + dNextX * nextCol
				let p3y = nextRowY1 + dNextY * nextCol

				let p4x = nextRowX1 + dNextX * curCol
				let p4y = nextRowY1 + dNextY * curCol

				let u1 = curCol * imgW
				let u2 = nextCol * imgW
				let v1 = curRow * imgH
				let v2 = nextRow * imgH

				this.triangles.push(
					new Triangle(
						new Vector2(p1x, p1y),
						new Vector2(p3x, p3y),
						new Vector2(p4x, p4y),
						new TextureCoordinates(u1, v1),
						new TextureCoordinates(u2, v2),
						new TextureCoordinates(u1, v2)
					)
				)
				this.triangles.push(
					new Triangle(
						new Vector2(p1x, p1y),
						new Vector2(p2x, p2y),
						new Vector2(p3x, p3y),
						new TextureCoordinates(u1, v1),
						new TextureCoordinates(u2, v1),
						new TextureCoordinates(u2, v2)
					)
				)
			}
		}
	}

	private _drawTriangle(
		ctx: CanvasRenderingContext2D,
		im: HTMLImageElement,
		v0: Vector2,
		v1: Vector2,
		v2: Vector2,
		tp0: TextureCoordinates,
		tp1: TextureCoordinates,
		tp2: TextureCoordinates
	) {
		ctx.save()

		// Clip the output to the on-screen triangle boundaries.
		ctx.beginPath()
		ctx.moveTo(v0.X, v0.Y)
		ctx.lineTo(v1.X, v1.Y)
		ctx.lineTo(v2.X, v2.Y)
		ctx.closePath()
		//ctx.stroke();//xxxxxxx for wireframe
		ctx.clip()
		/*
		ctx.transform(m11, m12, m21, m22, dx, dy) sets the context transform matrix.

		The context matrix is:

		[ m11 m21 dx ]
		[ m12 m22 dy ]
		[  0   0   1 ]

		Coords are column vectors with a 1 in the z coord, so the transform is:
		x_out = m11 * x + m21 * y + dx;
		y_out = m12 * x + m22 * y + dy;

		From Maxima, these are the transform values that map the source
		coords to the dest coords:

		sy0 (x2 - x1) - sy1 x2 + sy2 x1 + (sy1 - sy2) x0
		[m11 = - -----------------------------------------------------,
		sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

		sy1 y2 + sy0 (y1 - y2) - sy2 y1 + (sy2 - sy1) y0
		m12 = -----------------------------------------------------,
		sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

		sx0 (x2 - x1) - sx1 x2 + sx2 x1 + (sx1 - sx2) x0
		m21 = -----------------------------------------------------,
		sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

		sx1 y2 + sx0 (y1 - y2) - sx2 y1 + (sx2 - sx1) y0
		m22 = - -----------------------------------------------------,
		sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

		sx0 (sy2 x1 - sy1 x2) + sy0 (sx1 x2 - sx2 x1) + (sx2 sy1 - sx1 sy2) x0
		dx = ----------------------------------------------------------------------,
		sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

		sx0 (sy2 y1 - sy1 y2) + sy0 (sx1 y2 - sx2 y1) + (sx2 sy1 - sx1 sy2) y0
		dy = ----------------------------------------------------------------------]
		sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
	  */

		// TODO: eliminate common subexpressions.
		let denom =
			tp0.U * (tp2.V - tp1.V) -
			tp1.U * tp2.V +
			tp2.U * tp1.V +
			(tp1.U - tp2.U) * tp0.V
		if (denom == 0) {
			return
		}
		let m11 =
			-(
				tp0.V * (v2.X - v1.X) -
				tp1.V * v2.X +
				tp2.V * v1.X +
				(tp1.V - tp2.V) * v0.X
			) / denom
		let m12 =
			(tp1.V * v2.Y +
				tp0.V * (v1.Y - v2.Y) -
				tp2.V * v1.Y +
				(tp2.V - tp1.V) * v0.Y) /
			denom
		let m21 =
			(tp0.U * (v2.X - v1.X) -
				tp1.U * v2.X +
				tp2.U * v1.X +
				(tp1.U - tp2.U) * v0.X) /
			denom
		let m22 =
			-(
				tp1.U * v2.Y +
				tp0.U * (v1.Y - v2.Y) -
				tp2.U * v1.Y +
				(tp2.U - tp1.U) * v0.Y
			) / denom
		let dx =
			(tp0.U * (tp2.V * v1.X - tp1.V * v2.X) +
				tp0.V * (tp1.U * v2.X - tp2.U * v1.X) +
				(tp2.U * tp1.V - tp1.U * tp2.V) * v0.X) /
			denom
		let dy =
			(tp0.U * (tp2.V * v1.Y - tp1.V * v2.Y) +
				tp0.V * (tp1.U * v2.Y - tp2.U * v1.Y) +
				(tp2.U * tp1.V - tp1.U * tp2.V) * v0.Y) /
			denom

		ctx.transform(m11, m12, m21, m22, dx, dy)

		// Draw the whole image.  Transform and clip will map it onto the
		// correct output triangle.
		//
		// TODO: figure out if drawImage goes faster if we specify the rectangle that
		// bounds the source coords.
		ctx.drawImage(im, 0, 0)
		ctx.restore()
	}

	public Draw(
		context: CanvasRenderingContext2D,
		verticalSubdivisions?: number,
		horizontalSubdivisions?: number
	) {
		this.context = context
		if (verticalSubdivisions) {
			this.VerticalSubdivisions = verticalSubdivisions
		}
		if (horizontalSubdivisions) {
			this.HorizontalSubdivisions = horizontalSubdivisions
		}

		this._calculateGeometry()

		for (var i = 0; i < this.triangles.length; ++i) {
			var triangle = this.triangles[i] as Triangle
			this._render(triangle)
		}
	}

	public image: HTMLImageElement
	public p1: Vector2 = new Vector2()
	public p2: Vector2 = new Vector2()
	public p3: Vector2 = new Vector2()
	public p4: Vector2 = new Vector2()
	public VerticalSubdivisions: number = 1
	public HorizontalSubdivisions: number = 1
	public context: CanvasRenderingContext2D | null = null
	private triangles: Triangle[] = []
}

export default Texturer
