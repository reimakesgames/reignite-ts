import { describe, expect, it } from "vitest"
import { Vector3 } from "./Vector3"

describe.concurrent("Vector3", () => {
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
})
