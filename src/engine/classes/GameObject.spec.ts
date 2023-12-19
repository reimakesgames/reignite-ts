import { test, beforeEach, expect, describe } from "vitest"

import { GameObject } from "./GameObject"

// extend the GameObject class to make it testable
class TestObject extends GameObject {
	override serialize() {}
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

	test("should set the name", () => {
		const object = new TestObject({
			name: "Test",
		})
		expect(object.name).toBe("Test")
	})

	test("should set the parent", () => {
		expect(child.parent).toBe(parent)
	})

	test("should add the child to the parent's children", () => {
		expect(parent.children).toContain(child)
	})

	test("should set the parent", () => {
		child.parent = parent
		expect(child.parent).toBe(parent)
	})

	test("should remove the child from the old parent's children", () => {
		const newparent = new TestObject()
		child.parent = newparent
		expect(parent.children).not.toContain(child)
	})

	test("should add the child to the new parent's children", () => {
		const newparent = new TestObject()
		child.parent = newparent
		expect(newparent.children).toContain(child)
	})

	test("should be able to set the parent to null", () => {
		child.parent = null
		expect(child.parent).toBe(null)
	})

	test("should throw an error if the parent is set to itself", () => {
		expect(() => {
			child.parent = child
		}).toThrow()
	})

	test("should throw an error if the parent is set to a descendant", () => {
		const grandChild = new TestObject(child)
		expect(() => {
			child.parent = grandChild
		}).toThrow()
	})

	test("should throw an error if the parent is set to a non-GameObject", () => {
		expect(() => {
			child.parent = {} as GameObject
		}).toThrow()
	})
})
