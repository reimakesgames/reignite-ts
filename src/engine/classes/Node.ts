type Subclass<T extends Node> = T | null

abstract class Node {
	public readonly Children: Node[] = []
	public readonly Name: string
	public _parent: Subclass<Node> = null

	constructor(name: string, parent: Node | null = null) {
		this.Name = name ?? "Node"
		this.Parent = parent
	}

	public set Parent(parent: Subclass<Node>) {
		if (this._parent) {
			this._parent.Children.splice(this._parent.Children.indexOf(this), 1)
		}

		this._parent = parent

		if (parent) {
			parent.Children.push(this)
		}
	}

	public get Parent(): Subclass<Node> {
		return this._parent
	}
}

export default Node
