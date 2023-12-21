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

let parent: TestObject
let child: TestObject

describe.sequential("GameObject", () => {
	beforeEach(() => {
		parent = new TestObject()
		child = new TestObject(parent)
	})

	it("should set the name", () => {
		const object = new TestObject({
			name: "Test",
		})
		expect(object.name).toBe("Test")
	})

	it("should set the parent", () => {
		expect(child.parent).toBe(parent)
	})

	it("should add the child to the parent's children", () => {
		expect(parent.children).toContain(child)
	})

	it("should remove the child from the old parent's children", () => {
		const newparent = new TestObject()
		child.parent = newparent
		expect(parent.children).not.toContain(child)
	})

	it("should add the child to the new parent's children", () => {
		const newparent = new TestObject()
		child.parent = newparent
		expect(newparent.children).toContain(child)
	})

	it("should be able to set the parent to null", () => {
		child.parent = null
		expect(child.parent).toBe(null)
	})

	it("should warn if the parent is set to undefined", () => {
		const spy = vi.spyOn(console, "warn")
		child.parent = undefined as any
		expect(spy).toHaveBeenCalled()
		spy.mockRestore()
	})

	it("should throw an error if the parent is set to itself", () => {
		expect(() => {
			child.parent = child
		}).toThrow()
	})

	it("should throw an error if the parent is set to a descendant", () => {
		const grandChild = new TestObject(child)
		expect(() => {
			child.parent = grandChild
		}).toThrow()
	})

	it("should throw an error if the parent is set to a non-undefined element", () => {
		expect(() => {
			child.parent = {} as GameObject
		}).toThrow()
		expect(() => {
			child.parent = "fish" as any
		}).toThrow()
	})

	it("should throw a type error if the props are invalid", () => {
		expect(() => {
			new TestObject(null as any)
		}).toThrow()
	})

	it("should fire the childAdded event when a child is added", () => {
		const spy = vi.spyOn(parent.childAdded, "fire")
		const newChild = new TestObject(parent)
		expect(spy).toHaveBeenCalledWith(newChild)
	})

	it("should fire the descendantAdded event when a child is added", () => {
		const spy = vi.spyOn(parent.descendantAdded, "fire")
		const newChild = new TestObject(parent)
		expect(spy).toHaveBeenCalledWith(newChild)
	})

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
