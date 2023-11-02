import { GameObject } from "../../src/engine/classes/GameObject"
// extend the GameObject class to make it testable
class TestObject extends GameObject {
	override update(): void {}
	override render(): void {}
}

let parent: TestObject
let child: TestObject

describe("GameObject", () => {
	beforeEach(() => {
		parent = new TestObject("parent")
		child = new TestObject("Child", parent)
	})

	it("should set the name", () => {
		const object = new TestObject("Test")
		expect(object.name).toBe("Test")
	})

	it("should set the parent", () => {
		expect(child.parent).toBe(parent)
	})

	it("should add the child to the parent's children", () => {
		expect(parent.children).toContain(child)
	})

	it("should set the parent", () => {
		child.parent = parent
		expect(child.parent).toBe(parent)
	})

	it("should remove the child from the old parent's children", () => {
		const newparent = new TestObject("New parent")
		child.parent = newparent
		expect(parent.children).not.toContain(child)
	})

	it("should add the child to the new parent's children", () => {
		const newparent = new TestObject("New parent")
		child.parent = newparent
		expect(newparent.children).toContain(child)
	})

	it("should be able to set the parent to null", () => {
		child.parent = null
		expect(child.parent).toBe(null)
	})

	it("should throw an error if the parent is set to itself", () => {
		expect(() => {
			child.parent = child
		}).toThrow()
	})

	it("should throw an error if the parent is set to a descendant", () => {
		const grandChild = new TestObject("Grand Child", child)
		expect(() => {
			child.parent = grandChild
		}).toThrow()
	})

	it("should throw an error if the parent is set to a non-GameObject", () => {
		expect(() => {
			child.parent = {} as GameObject
		}).toThrow()
	})
})
