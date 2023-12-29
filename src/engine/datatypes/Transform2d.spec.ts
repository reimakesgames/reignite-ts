import { describe, expect, it } from "vitest"
import { Transform2d } from "./Transform2d"
import { Vector2 } from "./Vector2"

describe.sequential("Transform2d", () => {
	describe("constructor", () => {
		it("should create a Transform2d with the given elements", () => {
			const transform = new Transform2d(Vector2.zero, 0)
			expect(transform.position.X).toBe(0)
			expect(transform.position.Y).toBe(0)
			expect(transform.rotation).toBe(0)
		})

		it("should create a Transform2d with default elements", () => {
			const transform = new Transform2d()
			expect(transform.position.X).toBe(0)
			expect(transform.position.Y).toBe(0)
			expect(transform.rotation).toBe(0)
		})
	})

	describe("rightVector", () => {
		it("should return the right vector", () => {
			const transform = new Transform2d(Vector2.zero, Math.PI / 2)
			expect(transform.rightVector.X).toBeCloseTo(0)
			expect(transform.rightVector.Y).toBeCloseTo(-1)
		})
	})

	describe("upVector", () => {
		it("should return the up vector", () => {
			const transform = new Transform2d(Vector2.zero, Math.PI / 2)
			expect(transform.upVector.X).toBeCloseTo(1)
			expect(transform.upVector.Y).toBeCloseTo(0)
		})
	})

	describe("inverse", () => {
		it("should return the inverse of the transform", () => {
			const transform = new Transform2d(Vector2.one, 0)
			const inverse = transform.inverse()
			expect(inverse.position.X).toBeCloseTo(-1)
			expect(inverse.position.Y).toBeCloseTo(-1)
			expect(inverse.rotation).toBeCloseTo(0)
			const identity = transform.multiply(inverse)
			expect(identity.position.X).toBeCloseTo(0)
			expect(identity.position.Y).toBeCloseTo(0)
			expect(identity.rotation).toBeCloseTo(0)
		})
	})

	describe("multiply", () => {
		it("should return the composition of two transforms", () => {
			const transform1 = new Transform2d(Vector2.one, Math.PI / 2)
			const transform2 = new Transform2d(Vector2.one, Math.PI / 2)
			const transform3 = transform1.multiply(transform2)
			expect(transform3.position.X).toBeCloseTo(1)
			expect(transform3.position.Y).toBeCloseTo(-1)
			expect(transform3.rotation).toBeCloseTo(Math.PI)
		})

		it("should return a vector transformed by the transform", () => {
			const transform = new Transform2d(Vector2.one, Math.PI / 2)
			const vector = transform.multiply(Vector2.one)
			expect(vector.X).toBeCloseTo(1)
			expect(vector.Y).toBeCloseTo(-1)
		})
	})

	describe("add", () => {
		it("should return a new transform translated by the given vector", () => {
			const transform = new Transform2d(Vector2.one, Math.PI / 2)
			const newTransform = transform.add(Vector2.one)
			expect(newTransform.position.X).toBeCloseTo(2)
			expect(newTransform.position.Y).toBeCloseTo(2)
			expect(newTransform.rotation).toBeCloseTo(Math.PI / 2)
		})
	})

	describe("subtract", () => {
		it("should return a new transform translated by the given vector", () => {
			const transform = new Transform2d(Vector2.one, Math.PI / 2)
			const newTransform = transform.subtract(Vector2.one)
			expect(newTransform.position.X).toBeCloseTo(0)
			expect(newTransform.position.Y).toBeCloseTo(-1)
			expect(newTransform.rotation).toBeCloseTo(Math.PI / 2)
		})
	})

	describe("toWorldSpace", () => {
		it("should return the transform transformed by this transform", () => {
			const transform1 = new Transform2d(Vector2.one, Math.PI / 2)
			const transform2 = new Transform2d(Vector2.one, Math.PI / 2)
			const transform3 = transform1.toWorldSpace(transform2)
			expect(transform3.position.X).toBeCloseTo(2)
			expect(transform3.position.Y).toBeCloseTo(0)
			expect(transform3.rotation).toBeCloseTo(Math.PI)
		})
	})

	describe("toObjectSpace", () => {
		it("should return the transform in the object space of this transform", () => {
			const transform1 = new Transform2d(Vector2.one, Math.PI / 2)
			const transform2 = new Transform2d(Vector2.one, Math.PI / 2)
			const transform3 = transform1.toObjectSpace(transform2)
			expect(transform3.position.X).toBeCloseTo(-1)
			expect(transform3.position.Y).toBeCloseTo(1)
			expect(transform3.rotation).toBeCloseTo(0)
		})
	})

	describe("vectorToWorldSpace", () => {
		it("should return the vector transformed by this transform", () => {
			const transform = new Transform2d(Vector2.one, Math.PI / 2)
			const vector = transform.vectorToWorldSpace(Vector2.one)
			expect(vector.X).toBeCloseTo(2)
			expect(vector.Y).toBeCloseTo(0)
		})
	})

	describe("vectorToObjectSpace", () => {
		it("should return the vector in the object space of this transform", () => {
			const transform = new Transform2d(Vector2.one, Math.PI / 2)
			const vector = transform.vectorToObjectSpace(new Vector2(2, 1))
			expect(vector.X).toBeCloseTo(0)
			expect(vector.Y).toBeCloseTo(1)
		})
	})

	describe("pointToWorldSpace", () => {
		it("should return the point transformed by this transform", () => {
			const transform = new Transform2d(Vector2.one, Math.PI / 2)
			const point = transform.pointToWorldSpace(Vector2.one)
			expect(point.X).toBeCloseTo(2)
			expect(point.Y).toBeCloseTo(0)
		})
	})

	describe("pointToObjectSpace", () => {
		it("should return the point in the object space of this transform", () => {
			const transform = new Transform2d(Vector2.one, Math.PI / 2)
			const point = transform.pointToObjectSpace(new Vector2(1, 0))
			expect(point.X).toBeCloseTo(1)
			expect(point.Y).toBeCloseTo(0)
		})
	})

	describe("withPosition", () => {
		it("should return a new transform with the given position", () => {
			const transform = new Transform2d(Vector2.one, Math.PI / 2)
			const newTransform = transform.withPosition(Vector2.zero)
			expect(newTransform.position.X).toBeCloseTo(0)
			expect(newTransform.position.Y).toBeCloseTo(0)
			expect(newTransform.rotation).toBeCloseTo(Math.PI / 2)
		})
	})

	describe("withRotation", () => {
		it("should return a new transform with the given rotation", () => {
			const transform = new Transform2d(Vector2.one, Math.PI / 2)
			const newTransform = transform.withRotation(Math.PI)
			expect(newTransform.position.X).toBeCloseTo(1)
			expect(newTransform.position.Y).toBeCloseTo(1)
			expect(newTransform.rotation).toBeCloseTo(Math.PI)
		})
	})

	describe("serialize", () => {
		it("should serialize the transform", () => {
			const transform = new Transform2d(Vector2.one, Math.PI / 2)
			const storage = transform.serialize()
			expect(storage.datatype).toBe("Transform2d")
			expect(storage.value).toEqual([
				{
					datatype: "Vector2",
					value: [1, 1],
				},
				Math.PI / 2,
			])
		})
	})

	describe("lookAt", () => {
		it("should return a transform looking at the given target", () => {
			const transform = Transform2d.lookAt(Vector2.zero, Vector2.one)
			expect(transform.position.X).toBeCloseTo(0)
			expect(transform.position.Y).toBeCloseTo(0)
			expect(transform.rotation).toBeCloseTo(Math.PI / 4)
		})
	})
})
