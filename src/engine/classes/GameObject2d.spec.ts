import { describe, expect, it } from "vitest"
import { GameObject2d } from "./GameObject2d"
import { ClassStorage } from "../modules/Serde"

class TestGameObject2d extends GameObject2d {
	update(): void {}
	render(): void {}
	serialize(): ClassStorage {
		return {
			class: "TestGameObject2d",
			properties: {
				transform: {
					datatype: "Transform2d",
					value: [
						{
							datatype: "Vector2",
							value: [0, 0],
						},
						0,
					],
				},
			},
		}
	}
}

describe.sequential("GameObject2d", () => {
	describe("constructor", () => {
		it("should create a new GameObject2d", () => {
			const gameObject2d = new TestGameObject2d()
			expect(gameObject2d).toBeDefined()
		})
	})
})
