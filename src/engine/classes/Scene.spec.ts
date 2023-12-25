import { describe, expect, it } from "vitest"
import { Scene } from "./Scene"

describe.sequential("Scene", () => {
	describe("constructor", () => {
		it("should create a new scene", () => {
			expect(new Scene()).toBeInstanceOf(Scene)
			expect(new Scene({})).toBeInstanceOf(Scene)
			expect(new Scene(new Scene())).toBeInstanceOf(Scene)
			expect(new Scene({}, new Scene())).toBeInstanceOf(Scene)
		})
	})

	describe("name", () => {
		it("should be 'Scene' by default", () => {
			expect(new Scene().name).toBe("Scene")
		})
	})

	describe("currentCamera", () => {
		it("should be null by default", () => {
			expect(new Scene().currentCamera).toBeNull()
		})
	})

	describe("serialize", () => {
		it("should serialize the scene", () => {
			expect(new Scene().serialize()).toEqual({
				class: "Scene",
				properties: {
					name: "Scene",
				},
				children: [],
			})
		})
	})

	describe("misc", () => {
		it("should not throw errors", () => {
			const scene = new Scene()
			expect(() => scene.update()).not.toThrow()
			expect(() => scene.render()).not.toThrow()
		})
	})
})
