import { describe, expect, it } from "vitest"
import { Matrix2d } from "./Matrix2d"

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

	describe("determinant", () => {
		it("should return the determinant of the matrix", () => {
			const matrix = new Matrix2d([
				[1, 2],
				[3, 4],
			])
			expect(matrix.determinant).toBe(-2)
		})
	})
})
