import { ClassSerializationTemplate } from "../modules/Serde"

export type Subclass<T extends GameObject> = T | null

export abstract class GameObject {
	readonly children: GameObject[] = []
	private parentReference: Subclass<GameObject> = null

	constructor(
		readonly name: string = "GameObject",
		parent: Subclass<GameObject> = null
	) {
		this.parent = parent
	}

	set parent(parent: Subclass<GameObject>) {
		if (parent === this) {
			throw new Error("Cannot set parent to self")
		}
		if (parent && parent.isDescendantOf(this)) {
			throw new Error("Cannot set parent to descendant")
		}
		if (typeof parent !== "object" && parent !== null) {
			throw new Error("Parent must be a GameObject")
		}
		if (this.parentReference) {
			this.parentReference.children.splice(
				this.parentReference.children.indexOf(this),
				1
			)
		}

		this.parentReference = parent

		if (parent) {
			parent.children.push(this)
		}
	}

	get parent(): Subclass<GameObject> {
		return this.parentReference
	}

	isDescendantOf(parent: GameObject): boolean {
		if (this.parent === parent) {
			return true
		}
		if (this.parent === null) {
			return false
		}
		return this.parent.isDescendantOf(parent)
	}

	abstract serialize(): ClassSerializationTemplate

	abstract update(): void
	abstract render(): void
}
