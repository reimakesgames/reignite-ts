import GameObject from "../../src/engine/classes/GameObject"
// extend the GameObject class to make it testable
class TestObject extends GameObject {}

let parent: TestObject
let child: TestObject

describe("GameObject", () => {
	beforeEach(() => {
		parent = new TestObject("Parent")
		child = new TestObject("Child", parent)
	})

	it("should set the name", () => {
		const object = new TestObject("Test")
		expect(object.Name).toBe("Test")
	})

	it("should set the parent", () => {
		expect(child.Parent).toBe(parent)
	})

	it("should add the child to the parent's children", () => {
		expect(parent.Children).toContain(child)
	})

	it("should set the parent", () => {
		child.Parent = parent
		expect(child.Parent).toBe(parent)
	})

	it("should remove the child from the old parent's children", () => {
		const newParent = new TestObject("New Parent")
		child.Parent = newParent
		expect(parent.Children).not.toContain(child)
	})

	it("should add the child to the new parent's children", () => {
		const newParent = new TestObject("New Parent")
		child.Parent = newParent
		expect(newParent.Children).toContain(child)
	})

	it("should be able to set the parent to null", () => {
		child.Parent = null
		expect(child.Parent).toBe(null)
	})

	it("should throw an error if the parent is set to itself", () => {
		expect(() => {
			child.Parent = child
		}).toThrow()
	})

	it("should throw an error if the parent is set to a descendant", () => {
		const grandChild = new TestObject("Grand Child", child)
		expect(() => {
			child.Parent = grandChild
		}).toThrow()
	})

	it("should throw an error if the parent is set to a non-GameObject", () => {
		expect(() => {
			child.Parent = {} as GameObject
		}).toThrow()
	})
})
