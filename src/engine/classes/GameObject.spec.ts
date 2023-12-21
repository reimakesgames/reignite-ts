import { it, beforeEach, expect, describe, vi } from "vitest"

import { GameObject } from "./GameObject"

// extend the GameObject class to make it testable
class TestObject extends GameObject {
	override serialize() {
		return {
			class: "TestObject",
			properties: {
				name: this.name,
			},
		}
	}
	override update(): void {}
	override render(): void {}
}

describe.sequential("GameObject", () => {
	describe("constructor", () => {
		it("should handle no arguments", () => {
			const object = new TestObject()
			expect(object.parent).toBe(null)
			expect(object.children).toEqual([])
		})
		it("should handle a parent argument", () => {
			const parent = new TestObject()
			const object = new TestObject(parent)
			expect(object.parent).toBe(parent)
			expect(object.children).toEqual([])
		})
		it("should handle a props argument", () => {
			const object = new TestObject({
				name: "Test",
			})
			expect(object.parent).toBe(null)
			expect(object.children).toEqual([])
			expect(object.name).toBe("Test")
		})
		it("should handle a props and parent argument", () => {
			const parent = new TestObject()
			const object = new TestObject(
				{
					name: "Test",
				},
				parent
			)
			expect(object.parent).toBe(parent)
			expect(object.children).toEqual([])
			expect(object.name).toBe("Test")
		})
		it("should throw an error if the props argument is invalid", () => {
			expect(() => {
				new TestObject("fish" as any)
			}).toThrow()
			expect(() => {
				new TestObject(["fish"] as any)
			}).toThrow()
			expect(() => {
				new TestObject(3 as any)
			}).toThrow()
		})
	})

	describe("name", () => {
		it("should default to GameObject", () => {
			const object = new TestObject()
			expect(object.name).toBe("GameObject")
		})
		it("should be settable", () => {
			const object = new TestObject()
			object.name = "Test"
			expect(object.name).toBe("Test")
		})
	})

	describe("parent", () => {
		it("should default to null", () => {
			const object = new TestObject()
			expect(object.parent).toBe(null)
		})
		it("should be settable", () => {
			const object = new TestObject()
			const parent = new TestObject()
			object.parent = parent
			expect(object.parent).toBe(parent)
		})
		it("should be able to set to null", () => {
			const object = new TestObject()
			const parent = new TestObject()
			object.parent = parent
			object.parent = null
			expect(object.parent).toBe(null)
		})
		it("should warn if set to undefined", () => {
			const spy = vi.spyOn(console, "warn")
			const object = new TestObject()
			object.parent = undefined as any
			expect(spy).toHaveBeenCalled()
			spy.mockRestore()
		})
		it("should throw an error if set to itself", () => {
			const object = new TestObject()
			expect(() => {
				object.parent = object
			}).toThrow()
		})
		it("should throw an error if set to a descendant", () => {
			const object = new TestObject()
			const child = new TestObject(object)
			expect(() => {
				object.parent = child
			}).toThrow()
		})
		it("should throw an error if set to a non-GameObject", () => {
			const object = new TestObject()
			expect(() => {
				object.parent = "fish" as any
			}).toThrow()
			expect(() => {
				object.parent = {} as any
			}).toThrow()
		})
	})
	describe("children", () => {
		it("should be an empty array", () => {
			const object = new TestObject()
			expect(object.children).toEqual([])
		})
		it("should add a child when a child is added", () => {
			const object = new TestObject()
			const child = new TestObject(object)
			expect(object.children).toEqual([child])
		})
		it("should remove a child when a child is removed", () => {
			const object = new TestObject()
			const child = new TestObject(object)
			child.parent = null
			expect(object.children).toEqual([])
		})
	})
	describe("isDescendantOf", () => {
		it("should return true if the object is a child", () => {
			const object = new TestObject()
			const child = new TestObject(object)
			expect(child.isDescendantOf(object)).toBe(true)
		})
		it("should return true if the object is a grandchild", () => {
			const object = new TestObject()
			const child = new TestObject(object)
			const grandchild = new TestObject(child)
			expect(grandchild.isDescendantOf(object)).toBe(true)
		})
		it("should return false if the object is not a descendant", () => {
			const object = new TestObject()
			const child = new TestObject()
			expect(child.isDescendantOf(object)).toBe(false)
		})
		it("should return false if the object is the same", () => {
			const object = new TestObject()
			expect(object.isDescendantOf(object)).toBe(false)
		})
	})
	describe("childAdded", () => {
		it("should fire when a child is added", () => {
			const object = new TestObject()
			const spy = vi.spyOn(object.childAdded, "fire")
			const child = new TestObject(object)
			expect(spy).toHaveBeenCalledWith(child)
		})
		it("should not fire when a child is removed", () => {
			const object = new TestObject()
			const child = new TestObject(object)
			const spy = vi.spyOn(object.childAdded, "fire")
			child.parent = null
			expect(spy).not.toHaveBeenCalled()
		})
	})
	describe("descendantAdded", () => {
		it("should fire when a child is added", () => {
			const object = new TestObject()
			const spy = vi.spyOn(object.descendantAdded, "fire")
			const child = new TestObject(object)
			expect(spy).toHaveBeenCalledWith(child)
		})
		it("should fire when a grandchild is added", () => {
			const object = new TestObject()
			const child = new TestObject(object)
			const spy = vi.spyOn(object.descendantAdded, "fire")
			const grandchild = new TestObject(child)
			expect(spy).toHaveBeenCalledWith(grandchild)
		})
		it("should not fire when a child is removed", () => {
			const object = new TestObject()
			const child = new TestObject(object)
			const spy = vi.spyOn(object.descendantAdded, "fire")
			child.parent = null
			expect(spy).not.toHaveBeenCalled()
		})
		it("should not fire when a grandchild is removed", () => {
			const object = new TestObject()
			const child = new TestObject(object)
			const grandchild = new TestObject(child)
			const spy = vi.spyOn(object.descendantAdded, "fire")
			grandchild.parent = null
			expect(spy).not.toHaveBeenCalled()
		})
	})
	describe("serialize", () => {
		it("should be able to serialize an array of GameObjects", () => {
			const object = new TestObject()
			const array = [object, object]
			const serialized = GameObject.serializeGameObjectChildren(array)
			expect(serialized).toEqual([
				{
					class: "TestObject",
					properties: {
						name: "GameObject",
					},
				},
				{
					class: "TestObject",
					properties: {
						name: "GameObject",
					},
				},
			])
		})
		it("should return an empty array when serializing an empty array", () => {
			const serialized = GameObject.serializeGameObjectChildren([])
			expect(serialized).toEqual([])
		})
	})
})
