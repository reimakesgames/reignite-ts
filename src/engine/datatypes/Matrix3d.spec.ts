import { describe, expect, it } from "vitest"

import { Matrix3d } from "./Matrix3d"
import { Vector3 } from "./Vector3"

describe("Matrix3d", () => {
	describe("constructor", () => {
		it("should create a new matrix with the correct values", () => {
			const m = new Matrix3d([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			])
			expect(m.matrix).toEqual([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			])
		})
	})

	describe("rightVector", () => {
		it("should return the correct value", () => {
			const m = new Matrix3d([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			])
			const v = m.rightVector
			expect(v.X).toBe(1)
			expect(v.Y).toBe(4)
			expect(v.Z).toBe(7)
		})

		it("should return the same value with subsequent calls", () => {
			const m = new Matrix3d([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			])
			const v1 = m.rightVector
			const v2 = m.rightVector
			expect(v1).toBe(v2)
		})
	})

	describe("upVector", () => {
		it("should return the correct value", () => {
			const m = new Matrix3d([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			])
			const v = m.upVector
			expect(v.X).toBe(2)
			expect(v.Y).toBe(5)
			expect(v.Z).toBe(8)
		})

		it("should return the same value with subsequent calls", () => {
			const m = new Matrix3d([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			])
			const v1 = m.upVector
			const v2 = m.upVector
			expect(v1).toBe(v2)
		})
	})

	describe("lookVector", () => {
		it("should return the correct value", () => {
			const m = new Matrix3d([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			])
			const v = m.lookVector
			expect(v.X).toBe(-3)
			expect(v.Y).toBe(-6)
			expect(v.Z).toBe(-9)
		})

		it("should return the same value with subsequent calls", () => {
			const m = new Matrix3d([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			])
			const v1 = m.lookVector
			const v2 = m.lookVector
			expect(v1).toBe(v2)
		})
	})

	describe("determinant", () => {
		it("should return the correct value", () => {
			const m = new Matrix3d([
				[6, 1, 1],
				[4, -2, 5],
				[2, 8, 7],
			])
			expect(m.determinant()).toBe(-306)
		})

		it("should return the same value with subsequent calls", () => {
			const m = new Matrix3d([
				[6, 1, 1],
				[4, -2, 5],
				[2, 8, 7],
			])
			const d1 = m.determinant()
			const d2 = m.determinant()
			expect(d1).toBe(d2)
		})
	})

	describe("multiply", () => {
		it("should multiply Matrix3ds correctly", () => {
			const m1 = new Matrix3d([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			])
			const m2 = new Matrix3d([
				[10, 11, 12],
				[13, 14, 15],
				[16, 17, 18],
			])
			const m3 = m1.multiply(m2)
			expect(m3.matrix).toEqual([
				[84, 90, 96],
				[201, 216, 231],
				[318, 342, 366],
			])
		})

		it("should multiply Vector3s correctly", () => {
			const m = new Matrix3d([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			])
			const v = m.multiply(new Vector3(10, 11, 12))
			expect(v.X).toBe(68)
			expect(v.Y).toBe(167)
			expect(v.Z).toBe(266)
		})

		it("should multiply numbers correctly", () => {
			const m = new Matrix3d([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			])
			const m2 = m.multiply(2)
			expect(m2.matrix).toEqual([
				[2, 4, 6],
				[8, 10, 12],
				[14, 16, 18],
			])
		})

		it("should throw with anything else", () => {
			const m = new Matrix3d([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			])

			expect(() => m.multiply("foo" as any)).toThrow()
		})
	})

	describe("inverse", () => {
		it("should return the correct value", () => {
			const m = new Matrix3d([
				[6, 1, 1],
				[4, -2, 5],
				[2, 8, 7],
			])
			const inverse = m.inverse()
			expect(inverse.matrix).toEqual([
				[
					0.17647058823529413, -0.0032679738562091504,
					-0.02287581699346405,
				],
				[
					0.058823529411764705, -0.13071895424836602,
					0.08496732026143791,
				],
				[-0.11764705882352941, 0.1503267973856209, 0.05228758169934641],
			])
			// had so much trouble with this one because of floating point errors
			// thanks copilot for not helping at all, thanks for the stupid maths
		})

		it("should return the same value with subsequent calls", () => {
			const m = new Matrix3d([
				[6, 1, 1],
				[4, -2, 5],
				[2, 8, 7],
			])
			const m1 = m.inverse()
			const m2 = m.inverse()
			expect(m1).toBe(m2)
		})
	})

	describe("vectorToObjectSpace", () => {
		it("should return the correct value", () => {
			const m = new Matrix3d([
				[0, 1, 0],
				[0, 0, 1],
				[1, 0, 0],
			])
			const v = m.vectorToObjectSpace(new Vector3(1, 2, 3))
			expect(v.X).toBe(2)
			expect(v.Y).toBe(3)
			expect(v.Z).toBe(1)
		})
	})

	describe("serialize", () => {
		it("should serialize correctly", () => {
			const m = new Matrix3d([
				[0, 1, 0],
				[0, 0, 1],
				[1, 0, 0],
			])
			expect(m.serialize()).toEqual({
				datatype: "Matrix3d",
				value: [
					[0, 1, 0],
					[0, 0, 1],
					[1, 0, 0],
				],
			})
		})
	})

	describe("angles", () => {
		it("should return the correct value", () => {
			const m = Matrix3d.angles(Math.PI / 2, Math.PI / 2, Math.PI / 2)
			// bro floating point errors are so annoying
			let roundedMatrix = m.matrix.map((row) =>
				row.map((value) => Math.round(value * 100000) / 100000)
			)
			expect(roundedMatrix).toEqual([
				[0, 0, 1],
				[0, 1, 0],
				[-1, 0, 0],
			])
		})
	})

	describe("lookAt", () => {
		it("should return the correct value", () => {
			const m = Matrix3d.lookAt(
				new Vector3(0, 0, 0),
				new Vector3(0, 0, 1),
				new Vector3(0, 1, 0)
			)
			expect(m.matrix).toEqual([
				[1, 0, -0],
				[-0, 1, -0],
				[0, 0, 1],
			])
		})
	})

	describe("IDENTITY", () => {
		it("should return the correct value", () => {
			expect(Matrix3d.IDENTITY.matrix).toEqual([
				[1, 0, 0],
				[0, 1, 0],
				[0, 0, 1],
			])
		})

		it("should return the same value with subsequent calls", () => {
			const m1 = Matrix3d.IDENTITY
			const m2 = Matrix3d.IDENTITY
			expect(m1).toBe(m2)
		})
	})
})
