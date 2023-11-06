import { ClassSerializationTemplate } from "../modules/Serde"

export type PropertiesOf<T> = {
	[P in keyof T as T[P] extends (...args: any) => any ? never : P]?: T[P]
}

export function serializeGameObjectChildren(
	children: GameObject[]
): ClassSerializationTemplate[] {
	return children
		.map((child) => child.serialize())
		.filter((child) => child !== null) as ClassSerializationTemplate[]
}

/**
 * A GameObject is the base class for all objects in the engine
 */
export abstract class GameObject {
	/**
	 * Creates a new GameObject, optionally with the given properties and parent
	 *
	 * @param props The properties to assign to the GameObject
	 * @param parent The parent of the GameObject, if any, leave blank for parent to be null
	 * @returns A new GameObject
	 */
	constructor(props?: PropertiesOf<GameObject>, parent?: GameObject)
	constructor(parent?: GameObject)
	constructor(props?: PropertiesOf<GameObject>, parent?: GameObject) {
		if (props instanceof GameObject) {
			this.parent = props
			return
		} else if (props) {
			Object.assign(this, props)
		}
		this.parent = parent || null
	}

	/**
	 * A non-unique name for the GameObject
	 */
	name = "GameObject"

	/**
	 * The array of the GameObject's children
	 */
	readonly children: GameObject[] = []
	private parentReference: GameObject | null = null

	/**
	 * The parent of the GameObject
	 */
	set parent(parent: GameObject | null) {
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

	get parent(): GameObject | null {
		return this.parentReference
	}

	/**
	 * Returns true if the GameObject is a descendant of the given GameObject
	 */
	isDescendantOf(parent: GameObject): boolean {
		if (this.parent === parent) {
			return true
		}
		if (this.parent === null) {
			return false
		}
		return this.parent.isDescendantOf(parent)
	}

	/**
	 * A required method for serializing the GameObject, can be overridden to allow for custom serialization
	 *
	 * BEWARE: Any class that doesn't serialize itself won't let you serialize it's children
	 */
	abstract serialize(): ClassSerializationTemplate | void

	/**
	 * A required method for updating the GameObject, can be overridden to allow for custom updating
	 *
	 * TODO - Add distinction between update and render or remove it
	 */
	abstract update(): void
	/**
	 * i dont know what this does
	 *
	 * TODO - Add distinction between update and render or remove this
	 */
	abstract render(): void
}
