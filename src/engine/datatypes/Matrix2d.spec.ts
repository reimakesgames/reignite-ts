import { describe, expect, it } from "vitest"
import { Matrix2d } from "./Matrix2d"
import { Vector2 } from "./Vector2"

describe.sequential("Matrix2d", () => {
	describe("constructor", () => {
		it("should create a matrix with the given elements", () => {
			const matrix = new Matrix2d([
				[1, 2],
				[3, 4],
			])
			expect(matrix.matrix).toEqual([
				[1, 2],
				[3, 4],
			])
		})

		it("should create an identity matrix if no elements are given", () => {
			const matrix = new Matrix2d()
			expect(matrix.matrix).toEqual([
				[1, 0],
				[0, 1],
			])
		})
	})

	describe("rightVector", () => {
		it("should return the right vector of the matrix", () => {
			const matrix = new Matrix2d([
				[1, 2],
				[3, 4],
			])
			expect(matrix.rightVector.X).toBe(1)
			expect(matrix.rightVector.Y).toBe(3)
		})
	})

	describe("upVector", () => {
		it("should return the up vector of the matrix", () => {
			const matrix = new Matrix2d([
				[1, 2],
				[3, 4],
			])
			expect(matrix.upVector.X).toBe(2)
			expect(matrix.upVector.Y).toBe(4)
		})
	})

	describe("determinant", () => {
		it("should return the determinant of the matrix", () => {
			const matrix = new Matrix2d([
				[1, 2],
				[3, 4],
			])
			expect(matrix.determinant()).toBe(-2)
		})
	})

	describe("multiply", () => {
		it("should return the product of the two matrices", () => {
			const m1 = new Matrix2d([
				[1, 2],
				[3, 4],
			])
			const m2 = new Matrix2d([
				[5, 6],
				[7, 8],
			])
			expect(m1.multiply(m2).matrix).toEqual([
				[19, 22],
				[43, 50],
			])
		})

		it("should return the product of a matrix and a vector", () => {
			const m = new Matrix2d([
				[1, 2],
				[3, 4],
			])
			const v = new Vector2(5, 6)
			expect(m.multiply(v).X).toEqual(17)
			expect(m.multiply(v).Y).toEqual(39)
		})

		it("should return the product of a matrix and a scalar", () => {
			const m = new Matrix2d([
				[1, 2],
				[3, 4],
			])
			expect(m.multiply(5).matrix).toEqual([
				[5, 10],
				[15, 20],
			])
		})

		it("should throw type error if the argument is not a matrix, vector or scalar", () => {
			const m = new Matrix2d([
				[1, 2],
				[3, 4],
			])
			expect(() => m.multiply("test" as any)).toThrow(TypeError)
		})
	})

	describe("inverse", () => {
		it("should return the inverse of the matrix", () => {
			const m = new Matrix2d([
				[1, 2],
				[3, 4],
			])
			expect(m.inverse().matrix).toEqual([
				[-2, 1],
				[1.5, -0.5],
			])
		})
	})

	describe("vectorToObjectSpace", () => {
		it("should return the vector in object space", () => {
			const m = new Matrix2d([
				[1, 2],
				[3, 4],
			])
			const v = new Vector2(5, 6)
			expect(m.vectorToObjectSpace(v).X).toBe(17)
			expect(m.vectorToObjectSpace(v).Y).toBe(39)
		})
	})

	describe("serialize", () => {
		it("should serialize the matrix", () => {
			const matrix = new Matrix2d([
				[1, 2],
				[3, 4],
			])
			expect(matrix.serialize()).toEqual({
				datatype: "Matrix2d",
				value: [
					[1, 2],
					[3, 4],
				],
			})
		})
	})

	describe("angle", () => {
		it("should return the correct value", () => {
			const m = Matrix2d.angle(Math.PI / 2)
			expect(m.matrix[0][0]).toBeCloseTo(0)
			expect(m.matrix[1][0]).toBeCloseTo(-1)
			expect(m.matrix[0][1]).toBeCloseTo(1)
			expect(m.matrix[1][1]).toBeCloseTo(0)
		})
	})

	describe("lookAt", () => {
		it("should return the correct value", () => {
			const m = Matrix2d.lookAt(Vector2.zero, Vector2.one)
			expect(m.matrix[0][0]).toBeCloseTo(0.70711)
			expect(m.matrix[1][0]).toBeCloseTo(-0.70711)
			expect(m.matrix[0][1]).toBeCloseTo(0.70711)
			expect(m.matrix[1][1]).toBeCloseTo(0.70711)
		})
	})

	describe("IDENTITY", () => {
		it("should return the identity matrix", () => {
			expect(Matrix2d.IDENTITY.matrix).toEqual([
				[1, 0],
				[0, 1],
			])
		})

		it("should return the same matrix on subsequent calls", () => {
			expect(Matrix2d.IDENTITY).toBe(Matrix2d.IDENTITY)
		})
	})
})
