import Node from "../../src/engine/classes/Node"
// extend the Node class to make it testable
class TestNode extends Node {}

let parent: TestNode
let child: TestNode

describe("Node", () => {
	beforeEach(() => {
		parent = new TestNode("Parent")
		child = new TestNode("Child", parent)
	})

	it("should set the name", () => {
		const node = new TestNode("Test")
		expect(node.Name).toBe("Test")
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
		const newParent = new TestNode("New Parent")
		child.Parent = newParent
		expect(parent.Children).not.toContain(child)
	})

	it("should add the child to the new parent's children", () => {
		const newParent = new TestNode("New Parent")
		child.Parent = newParent
		expect(newParent.Children).toContain(child)
	})

	it("should be able to set the parent to null", () => {
		child.Parent = null
		expect(child.Parent).toBe(null)
	})
})
