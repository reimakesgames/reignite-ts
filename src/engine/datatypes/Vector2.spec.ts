import { describe, expect, it } from "vitest"
import { Vector2 } from "./Vector2"

describe.sequential("Vector2", () => {
	describe("constructor", () => {
		it("should create a vector with the given elements", () => {
			const vector = new Vector2(1, 2)
			expect(vector.X).toBe(1)
			expect(vector.Y).toBe(2)
		})

		it("should create a zero vector if no elements are given", () => {
			const vector = new Vector2()
			expect(vector.X).toBe(0)
			expect(vector.Y).toBe(0)
		})
	})

	describe("magnitude", () => {
		it("should return the magnitude of the vector", () => {
			const vector = new Vector2(3, 4)
			expect(vector.magnitude).toBe(5)
		})
	})

	describe("unit", () => {
		it("should return a unit vector with the same direction", () => {
			const vector = new Vector2(3, 4)
			const unit = vector.unit
			expect(unit.X).toBeCloseTo(0.6)
			expect(unit.Y).toBeCloseTo(0.8)
		})

		it("should return the same unit vector on subsequent calls", () => {
			const vector = new Vector2(3, 4)
			const unit = vector.unit
			expect(unit).toBe(vector.unit)
		})
	})

	describe("angle", () => {
		it("should return the angle between two vectors", () => {
			const vector1 = new Vector2(1, 0)
			const vector2 = new Vector2(0, 1)
			const vector3 = new Vector2(0, -1)
			expect(vector1.angle(vector2)).toBeCloseTo(Math.PI / 2)
			expect(vector1.angle(vector3)).toBeCloseTo(-Math.PI / 2)
		})
	})

	describe("cross", () => {
		it("should return the cross product of two vectors", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = new Vector2(3, 4)
			expect(vector1.cross(vector2)).toBe(-2)
		})
	})

	describe("dot", () => {
		it("should return the dot product of two vectors", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = new Vector2(3, 4)
			expect(vector1.dot(vector2)).toBe(11)
		})
	})

	describe("fuzzyEq", () => {
		it("should return true if two vectors are equal within a certain epsilon", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = new Vector2(1.0000001, 2.0000001)
			expect(vector1.fuzzyEq(vector2, 0.000001)).toBe(true)
		})

		it("should return false if two vectors are not equal within a certain epsilon", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = new Vector2(1.0000001, 2.0000001)
			expect(vector1.fuzzyEq(vector2, 0.00000001)).toBe(false)
		})
	})

	describe("lerp", () => {
		it("should interpolate between two vectors by a certain alpha", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = new Vector2(3, 4)
			const vector3 = vector1.lerp(vector2, 0.5)
			expect(vector3.X).toBe(2)
			expect(vector3.Y).toBe(3)
		})
	})

	describe("max", () => {
		it("should return a new vector where the highest value of each component is chosen", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = new Vector2(3, 4)
			const vector3 = vector1.max(vector2)
			expect(vector3.X).toBe(3)
			expect(vector3.Y).toBe(4)
		})
	})

	describe("min", () => {
		it("should return a new vector where the lowest value of each component is chosen", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = new Vector2(3, 4)
			const vector3 = vector1.min(vector2)
			expect(vector3.X).toBe(1)
			expect(vector3.Y).toBe(2)
		})
	})

	describe("multiply", () => {
		it("should multiply the vector by a scalar", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = vector1.multiply(2)
			expect(vector2.X).toBe(2)
			expect(vector2.Y).toBe(4)
		})

		it("should multiply the vector by another vector", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = new Vector2(3, 4)
			const vector3 = vector1.multiply(vector2)
			expect(vector3.X).toBe(3)
			expect(vector3.Y).toBe(8)
		})

		it("should throw a type error if the parameter is not a number or vector", () => {
			const vector1 = new Vector2(1, 2)
			// @ts-expect-error
			expect(() => vector1.multiply("2")).toThrow(TypeError)
		})
	})

	describe("multiply", () => {
		it("should divide two vectors", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = new Vector2(3, 4)
			const vector3 = vector1.divide(vector2)
			expect(vector3.X).toBeCloseTo(1 / 3)
			expect(vector3.Y).toBeCloseTo(2 / 4)
		})
	})

	describe("add", () => {
		it("should add two vectors together", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = new Vector2(3, 4)
			const vector3 = vector1.add(vector2)
			expect(vector3.X).toBe(4)
			expect(vector3.Y).toBe(6)
		})
	})

	describe("subtract", () => {
		it("should subtract two vectors", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = new Vector2(3, 4)
			const vector3 = vector1.subtract(vector2)
			expect(vector3.X).toBe(-2)
			expect(vector3.Y).toBe(-2)
		})
	})

	describe("negate", () => {
		it("should negate a vector", () => {
			const vector1 = new Vector2(1, 2)
			const vector2 = vector1.negate()
			expect(vector2.X).toBe(-1)
			expect(vector2.Y).toBe(-2)
		})
	})

	describe("serialize", () => {
		it("should serialize the vector", () => {
			const vector = new Vector2(1, 2)
			const serialized = vector.serialize()
			expect(serialized.datatype).toBe("Vector2")
			expect(serialized.value).toEqual([1, 2])
		})
	})

	describe("zero", () => {
		it("should return a vector with all components as zero", () => {
			const vector = Vector2.zero
			expect(vector.X).toBe(0)
			expect(vector.Y).toBe(0)
		})
	})

	describe("one", () => {
		it("should return a vector with all components as one", () => {
			const vector = Vector2.one
			expect(vector.X).toBe(1)
			expect(vector.Y).toBe(1)
		})
	})

	describe("unitX", () => {
		it("should return a vector with the X component as one", () => {
			const vector = Vector2.unitX
			expect(vector.X).toBe(1)
			expect(vector.Y).toBe(0)
		})
	})

	describe("unitY", () => {
		it("should return a vector with the Y component as one", () => {
			const vector = Vector2.unitY
			expect(vector.X).toBe(0)
			expect(vector.Y).toBe(1)
		})
	})
})
