type Subclass<T extends GameObject> = T | null

abstract class GameObject {
	public readonly Children: GameObject[] = []
	public readonly Name: string
	public _parent: Subclass<GameObject> = null

	constructor(name: string, parent: Subclass<GameObject> = null) {
		this.Name = name ?? "Node"
		this.Parent = parent
	}

	public set Parent(parent: Subclass<GameObject>) {
		if (parent === this) {
			throw new Error("Cannot set parent to self")
		}
		if (parent && parent.IsDescendantOf(this)) {
			throw new Error("Cannot set parent to descendant")
		}
		if (typeof parent !== "object" && parent !== null) {
			throw new Error("Parent must be a GameObject")
		}
		if (this._parent) {
			this._parent.Children.splice(this._parent.Children.indexOf(this), 1)
		}

		this._parent = parent

		if (parent) {
			parent.Children.push(this)
		}
	}

	public get Parent(): Subclass<GameObject> {
		return this._parent
	}

	public IsDescendantOf(parent: GameObject): boolean {
		if (this.Parent === parent) {
			return true
		}
		if (this.Parent === null) {
			return false
		}
		return this.Parent.IsDescendantOf(parent)
	}

	public Update(): void {}
	public Render(): void {}
}

export default GameObject
