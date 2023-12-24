import { describe, expect, it } from "vitest"
import { Vector3 } from "./Vector3"

describe.concurrent("Vector3", () => {
	describe("constructor", () => {
		it("should set the correct values", () => {
			const v = new Vector3(1, 2, 3)
			expect(v.X).toBe(1)
			expect(v.Y).toBe(2)
			expect(v.Z).toBe(3)
		})
	})

	describe("magnitude", () => {
		it("should return the correct value", () => {
			const v = new Vector3(1, 2, 3)
			expect(v.magnitude).toBe(Math.sqrt(14))
		})
	})

	describe("unit", () => {
		it("should return a new vector with the correct values", () => {
			const v = new Vector3(1, 2, 3)
			const u = v.unit
			expect(u.X).toBe(1 / Math.sqrt(14))
			expect(u.Y).toBe(2 / Math.sqrt(14))
			expect(u.Z).toBe(3 / Math.sqrt(14))
		})

		// This test is a bit silly, but it's here to make sure that the unit
		// vector is cached.
		it("should return the same vector on subsequent calls", () => {
			const v = new Vector3(1, 2, 3)
			const u1 = v.unit
			const u2 = v.unit
			expect(u1).toBe(u2)
		})

		it("should return a Vector3 with NaN values if the magnitude is 0", () => {
			const v = new Vector3()
			const u = v.unit
			expect(u.X).toBeNaN()
			expect(u.Y).toBeNaN()
			expect(u.Z).toBeNaN()
		})
		// Do we really care if users generate a unit vector from a zero vector?
		// I don't think so. so have NaNs.

		it("should throw when setting the unit vector", () => {
			const v = new Vector3()
			expect(() => {
				// @ts-expect-error
				v.unit = new Vector3()
			}).toThrow()
		})
	})

	describe("angle", () => {
		it("should return the correct value", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(4, 5, 6)
			const a = v1.angle(v2, new Vector3())
			expect(a).toBeCloseTo(0.2257261285527342)
		})
	})

	describe("cross", () => {
		it("should return a new vector with the correct values", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(4, 5, 6)
			const v3 = v1.cross(v2)
			expect(v3.X).toBe(-3)
			expect(v3.Y).toBe(6)
			expect(v3.Z).toBe(-3)
		})
	})

	describe("dot", () => {
		it("should return the correct value", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(4, 5, 6)
			const d = v1.dot(v2)
			expect(d).toBe(32)
		})
	})

	describe("fuzzyEq", () => {
		it("should return true if the vectors are equal", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(1, 2, 3)
			expect(v1.fuzzyEq(v2)).toBe(true)
		})

		it("should return false if the vectors are not equal", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(4, 5, 6)
			expect(v1.fuzzyEq(v2)).toBe(false)
		})

		it("should return true if the vectors are within the epilson", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(2, 2, 3)
			expect(v1.fuzzyEq(v2, 2)).toBe(true)
		})

		it("should return false if the vectors are not within the epilson", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(3, 2, 3)
			expect(v1.fuzzyEq(v2, 1)).toBe(false)
		})
	})

	describe("lerp", () => {
		it("should return a new vector with the correct values", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(4, 5, 6)
			const v3 = v1.lerp(v2, 0.5)
			expect(v3.X).toBe(2.5)
			expect(v3.Y).toBe(3.5)
			expect(v3.Z).toBe(4.5)
		})
	})

	describe("max", () => {
		it("should return a new vector with the correct values", () => {
			const v1 = new Vector3(1, 5, 3)
			const v2 = new Vector3(4, 2, 6)
			const v3 = v1.max(v2)
			expect(v3.X).toBe(4)
			expect(v3.Y).toBe(5)
			expect(v3.Z).toBe(6)
		})
	})

	describe("min", () => {
		it("should return a new vector with the correct values", () => {
			const v1 = new Vector3(1, 5, 3)
			const v2 = new Vector3(4, 2, 6)
			const v3 = v1.min(v2)
			expect(v3.X).toBe(1)
			expect(v3.Y).toBe(2)
			expect(v3.Z).toBe(3)
		})
	})

	describe("multiply", () => {
		it("should return a new vector with the correct values when multiplying by a number", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = v1.multiply(2)
			expect(v2.X).toBe(2)
			expect(v2.Y).toBe(4)
			expect(v2.Z).toBe(6)
		})

		it("should return a new vector with the correct values when multiplying by a vector", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(4, 5, 6)
			const v3 = v1.multiply(v2)
			expect(v3.X).toBe(4)
			expect(v3.Y).toBe(10)
			expect(v3.Z).toBe(18)
		})
	})

	describe("divide", () => {
		it("should return a new vector with the correct values when dividing by a number", () => {
			const v1 = new Vector3(2, 4, 6)
			const v2 = v1.divide(2)
			expect(v2.X).toBe(1)
			expect(v2.Y).toBe(2)
			expect(v2.Z).toBe(3)
		})

		it("should return a new vector with the correct values when dividing by a vector", () => {
			const v1 = new Vector3(4, 10, 18)
			const v2 = new Vector3(4, 5, 6)
			const v3 = v1.divide(v2)
			expect(v3.X).toBe(1)
			expect(v3.Y).toBe(2)
			expect(v3.Z).toBe(3)
		})
	})

	describe("add", () => {
		it("should return a new vector with the correct values", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(4, 5, 6)
			const v3 = v1.add(v2)
			expect(v3.X).toBe(5)
			expect(v3.Y).toBe(7)
			expect(v3.Z).toBe(9)
		})
	})

	describe("subtract", () => {
		it("should return a new vector with the correct values", () => {
			const v1 = new Vector3(4, 5, 6)
			const v2 = new Vector3(1, 2, 3)
			const v3 = v1.subtract(v2)
			expect(v3.X).toBe(3)
			expect(v3.Y).toBe(3)
			expect(v3.Z).toBe(3)
		})
	})

	describe("negate", () => {
		it("should return a new vector with the correct values", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = v1.negate()
			expect(v2.X).toBe(-1)
			expect(v2.Y).toBe(-2)
			expect(v2.Z).toBe(-3)
		})
	})

	describe("serialize", () => {
		it("should return the correct value", () => {
			const v = new Vector3(1, 2, 3)
			const s = v.serialize()
			expect(s).toEqual({
				datatype: "Vector3",
				value: [1, 2, 3],
			})
		})
	})

	describe("zero", () => {
		it("should return a new vector with all components as zero", () => {
			const v = Vector3.zero
			expect(v.X).toBe(0)
			expect(v.Y).toBe(0)
			expect(v.Z).toBe(0)
		})
	})

	describe("one", () => {
		it("should return a new vector with all components as one", () => {
			const v = Vector3.one
			expect(v.X).toBe(1)
			expect(v.Y).toBe(1)
			expect(v.Z).toBe(1)
		})
	})

	describe("unitX", () => {
		it("should return a new vector with only the X component as one", () => {
			const v = Vector3.unitX
			expect(v.X).toBe(1)
			expect(v.Y).toBe(0)
			expect(v.Z).toBe(0)
		})
	})

	describe("unitY", () => {
		it("should return a new vector with only the Y component as one", () => {
			const v = Vector3.unitY
			expect(v.X).toBe(0)
			expect(v.Y).toBe(1)
			expect(v.Z).toBe(0)
		})
	})

	describe("unitZ", () => {
		it("should return a new vector with only the Z component as one", () => {
			const v = Vector3.unitZ
			expect(v.X).toBe(0)
			expect(v.Y).toBe(0)
			expect(v.Z).toBe(1)
		})
	})
})
