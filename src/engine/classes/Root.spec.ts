import { describe, expect, it } from "vitest"
import { root } from "./Root"
import { Camera } from "./Camera"
import { Transform } from "../datatypes/Transform"
import { Vector3 } from "../datatypes/Vector3"
import { Matrix3d } from "../datatypes/Matrix3d"

describe.sequential("Root", () => {
	describe("currentScene", () => {
		it("should throw an error if no scene is loaded", () => {
			expect(() => root.currentScene).toThrow("No scene is loaded")
		})

		it("should return the loaded scene", () => {
			const scene = root.loadSceneFromJson(
				JSON.stringify({
					class: "Scene",
					properties: {
						name: "Test",
					},
				})
			)
			expect(root.currentScene).toBe(scene)
		})
	})

	describe("loadSceneFromJson", () => {
		it("should load a scene from a JSON string", () => {
			const scene = root.loadSceneFromJson(
				JSON.stringify({
					class: "Scene",
					properties: {
						name: "Test",
					},
				})
			)
			expect(scene.name).toBe("Test")
		})

		it("should be able to support nested objects", () => {
			const scene = root.loadSceneFromJson(
				JSON.stringify({
					class: "Scene",
					properties: {
						name: "Test",
					},
					children: [
						{
							class: "Camera",
							properties: {
								name: "Camera",
							},
						},
					],
				})
			)
			expect(scene.children.length).toBe(1)
			expect(scene.children[0]?.name).toBe("Camera")
		})

		it("should be able to support datatype objects", () => {
			const scene = root.loadSceneFromJson(
				JSON.stringify({
					class: "Scene",
					properties: {
						name: "Test",
					},
					children: [
						{
							class: "Camera",
							properties: {
								transform: {
									datatype: "Transform",
									value: [
										{
											datatype: "Vector3",
											value: [0, 0, 0],
										},
										{
											datatype: "Matrix3d",
										},
									],
								},
								name: "Camera",
							},
						},
					],
				})
			)
			expect(scene.children.length).toBe(1)
			expect(scene.children[0]?.name).toBe("Camera")
			if (!scene.children[0] || !(scene.children[0] instanceof Camera))
				return // for typescript
			expect(scene.children[0]?.transform).toBeInstanceOf(Transform)
			expect(scene.children[0]?.transform.position).toBeInstanceOf(
				Vector3
			)
			expect(scene.children[0]?.transform.rotation).toBeInstanceOf(
				Matrix3d
			)
		})
	})

	describe("misc", () => {
		it("should not be serializable", () => {
			expect(root.serialize()).toBe(undefined)
		})

		it("should not be able to be updated", () => {
			expect(root.update()).toBe(undefined)
		})

		it("should not be able to be rendered", () => {
			expect(root.render()).toBe(undefined)
		})
	})
})
