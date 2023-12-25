import { describe, expect, it } from "vitest"
import { Camera } from "./Camera"
import { Transform } from "../datatypes/Transform"

describe.sequential("Camera", () => {
	describe("constructor", () => {
		it("should create a new camera", () => {
			expect(new Camera()).toBeInstanceOf(Camera)
			expect(new Camera({})).toBeInstanceOf(Camera)
			expect(new Camera(new Camera())).toBeInstanceOf(Camera)
			expect(new Camera({}, new Camera())).toBeInstanceOf(Camera)
		})
	})

	describe("transform", () => {
		it("should be a transform", () => {
			expect(new Camera().transform).toBeInstanceOf(Transform)
		})
	})

	describe("fieldOfView", () => {
		it("should be 70 by default", () => {
			expect(new Camera().fieldOfView).toBe(70)
		})
	})

	describe("serialize", () => {
		it("should serialize the camera", () => {
			expect(new Camera().serialize()).toEqual({
				class: "Camera",
				properties: {
					name: "Camera",
					FieldOfView: 70,
					Transform: new Transform().serialize(),
				},
			})
		})
	})

	describe("misc", () => {
		it("should not throw errors", () => {
			const camera = new Camera()
			expect(() => camera.update()).not.toThrow()
			expect(() => camera.render()).not.toThrow()
		})
	})
})
