import { describe, it, expect } from "vitest"
import { Transform } from "./Transform"
import { Vector3 } from "./Vector3"
import { Matrix3d } from "./Matrix3d"

describe.sequential("Transform", () => {
	describe("constructor", () => {
		it("should accept position and rotation signature", () => {
			const position = new Vector3(1, 2, 3)
			const rotation = Matrix3d.angles(0, 0, 0)
			const transform = new Transform(position, rotation)

			expect(transform.position).toEqual(position)
			expect(transform.rotation).toEqual(rotation)
		})
		it("should accept x, y, z signature", () => {
			const x = 1
			const y = 2
			const z = 3
			const transform = new Transform(x, y, z)

			expect(transform.position).toEqual(new Vector3(x, y, z))
			expect(transform.rotation).toEqual(new Matrix3d())
		})
		it("should accept no signature", () => {
			const transform = new Transform()

			expect(transform.position).toEqual(new Vector3())
			expect(transform.rotation).toEqual(new Matrix3d())
		})
		it("should reject invalid signatures", () => {
			// @ts-expect-error
			expect(() => new Transform(1)).toThrow()
			// @ts-expect-error
			expect(() => new Transform(1, 2)).toThrow()
			// expect(() => new Transform(1, 2, 3, 4)).toThrow()
			// no need to test excessive arguments because TS will catch it? idk
			// @ts-expect-error
			expect(() => new Transform(1, 2, "3")).toThrow()
		})
	})

	describe("lookAt", () => {
		it("should return a Transform that looks at the target", () => {
			const position = new Vector3(1, 2, 3)
			const target = new Vector3(4, 5, 6)
			const transform = Transform.lookAt(position, target)

			expect(transform.position).toEqual(position)
			expect(
				transform.lookVector
					.negate()
					.fuzzyEq(target.subtract(position).unit)
			).toBe(true)
		})
		it("should return a Transform that looks at the target with the given upVector", () => {
			const position = new Vector3(1, 0, 0)
			const target = new Vector3(0, 0, 1)
			const upVector = new Vector3(0, 2, 0)
			const transform = Transform.lookAt(position, target, upVector)

			expect(transform.position).toEqual(position)
			expect(
				transform.lookVector
					.negate()
					.fuzzyEq(target.subtract(position).unit)
			).toBe(true)
			expect(transform.upVector.fuzzyEq(upVector.unit)).toBe(true)
		})
	})

	describe("position", () => {
		it("should be a Vector3", () => {
			const transform = new Transform()

			expect(transform.position).toBeInstanceOf(Vector3)
		})
	})

	describe("rotation", () => {
		it("should be a Matrix3d", () => {
			const transform = new Transform()

			expect(transform.rotation).toBeInstanceOf(Matrix3d)
		})
	})

	describe("lookVector", () => {
		it("should be the negative Z axis of the rotation matrix", () => {
			const transform = new Transform()

			expect(transform.lookVector).toEqual(transform.rotation.lookVector)
			expect(transform.lookVector.Z).toBe(-1)
		})
	})

	describe("upVector", () => {
		it("should be the Y axis of the rotation matrix", () => {
			const transform = new Transform()

			expect(transform.upVector).toEqual(transform.rotation.upVector)
			expect(transform.upVector.Y).toBe(1)
		})
	})

	describe("rightVector", () => {
		it("should be the X axis of the rotation matrix", () => {
			const transform = new Transform()

			expect(transform.rightVector).toEqual(
				transform.rotation.rightVector
			)
			expect(transform.rightVector.X).toBe(1)
		})
	})

	describe("inverse", () => {
		it("should return a new Transform that is the inverse of this Transform", () => {
			const transform = new Transform(1, 2, 3)
			const inverse = transform.inverse()

			expect(inverse.position).toEqual(
				transform.rotation.multiply(transform.position).multiply(-1)
			)
			expect(inverse.rotation).toEqual(transform.rotation.inverse())
		})
	})

	describe("multiply", () => {
		it("should allow multiplying by a Transform", () => {
			const transform = new Transform(1, 2, 3)
			const other = new Transform(4, 5, 6)
			const result = transform.multiply(other)

			expect(result.position).toEqual(
				transform.rotation
					.multiply(other.position)
					.add(transform.position)
			)
			expect(result.rotation).toEqual(
				transform.rotation.multiply(other.rotation)
			)
		})
		it("should allow multiplying by a Vector3", () => {
			const transform = new Transform(1, 2, 3)
			const other = new Vector3(4, 5, 6)
			const result = transform.multiply(other)

			expect(result).toEqual(
				transform.rotation.multiply(other).add(transform.position)
			)
		})
		it("should throw an error when multiplying by an invalid type", () => {
			const transform = new Transform(1, 2, 3)

			// @ts-expect-error
			expect(() => transform.multiply("invalid")).toThrow()
			// @ts-expect-error
			expect(() => transform.multiply(1)).toThrow()
			// @ts-expect-error
			expect(() => transform.multiply(true)).toThrow()
		})
	})

	describe("add", () => {
		it("should allow adding a Vector3", () => {
			const transform = new Transform(1, 2, 3)
			const other = new Vector3(4, 5, 6)
			const result = transform.add(other)

			expect(result.position).toEqual(transform.position.add(other))
			expect(result.rotation).toEqual(transform.rotation)
		})
	})

	describe("subtract", () => {
		it("should allow subtracting a Vector3", () => {
			const transform = new Transform(1, 2, 3)
			const other = new Vector3(4, 5, 6)
			const result = transform.subtract(other)

			expect(result.position).toEqual(transform.position.subtract(other))
			expect(result.rotation).toEqual(transform.rotation)
		})
	})

	describe("toWorldSpace", () => {
		it("should allow transforming a Transform", () => {
			const transform = new Transform(1, 2, 3)
			const other = new Transform(4, 5, 6)
			const result = transform.toWorldSpace(other)

			expect(result.position).toEqual(
				transform.rotation
					.multiply(other.position)
					.add(transform.position)
			)
			expect(result.rotation).toEqual(
				transform.rotation.multiply(other.rotation)
			)
		})
	})

	describe("toObjectSpace", () => {
		it("should allow transforming a Transform", () => {
			const transform = new Transform(1, 2, 3)
			const other = new Transform(4, 5, 6)
			const result = transform.toObjectSpace(other)

			expect(result.position).toEqual(
				transform.rotation
					.inverse()
					.multiply(other.position.subtract(transform.position))
			)
			expect(result.rotation).toEqual(
				transform.rotation.inverse().multiply(other.rotation)
			)
		})
	})

	describe("vectorToWorldSpace", () => {
		it("should allow transforming a Vector3", () => {
			const transform = new Transform(1, 2, 3)
			const other = new Vector3(4, 5, 6)
			const result = transform.vectorToWorldSpace(other)

			expect(result).toEqual(
				transform.rotation.multiply(other).add(transform.position)
			)
		})
	})

	describe("vectorToObjectSpace", () => {
		it("should allow transforming a Vector3", () => {
			const transform = new Transform(1, 2, 3)
			const other = new Vector3(4, 5, 6)
			const result = transform.vectorToObjectSpace(other)

			expect(result).toEqual(
				transform.rotation
					.inverse()
					.multiply(other.subtract(transform.position))
			)
		})
	})

	describe("pointToWorldSpace", () => {
		it("should allow transforming a Vector3", () => {
			const transform = new Transform(1, 2, 3)
			const other = new Vector3(4, 5, 6)
			const result = transform.pointToWorldSpace(other)

			expect(result).toEqual(
				transform.rotation.multiply(other).add(transform.position)
			)
		})
	})

	describe("pointToObjectSpace", () => {
		it("should allow transforming a Vector3", () => {
			const transform = new Transform(1, 2, 3)
			const other = new Vector3(4, 5, 6)
			const result = transform.pointToObjectSpace(other)

			expect(result).toEqual(
				transform.rotation
					.inverse()
					.multiply(other.subtract(transform.position))
			)
		})
	})

	describe("serialize", () => {
		it("should return a serialized representation of the Transform", () => {
			const transform = new Transform(1, 2, 3)
			const serialized = transform.serialize()

			expect(serialized).toEqual({
				datatype: "Transform",
				value: {
					position: transform.position.serialize(),
					rotation: transform.rotation.serialize(),
				},
			})
		})
	})
})
