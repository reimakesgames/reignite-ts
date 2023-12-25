import { Signal } from "../datatypes/Signal"
import { ClassStorage } from "../modules/Serde"

export type PropertiesOf<T> = {
	[P in keyof T as T[P] extends (...args: any) => any ? never : P]?: T[P]
}

/**
 * A GameObject is the base class for all objects in the engine
 */
export abstract class GameObject {
	/**
	 * Creates a new GameObject, optionally with the given properties and parent.
	 *
	 * Always defaults to null parent if no parent is given
	 *
	 * Overload 1: No arguments
	 * Overload 2: Parent only
	 * Overload 3: Properties only
	 * Overload 4: Properties and parent
	 */
	constructor(parent?: GameObject | null)
	constructor(props: PropertiesOf<GameObject>, parent?: GameObject | null)
	constructor(
		props?: PropertiesOf<GameObject> | GameObject | null,
		parent?: GameObject | null
	) {
		if (props === undefined || props === null) return // no args

		// If the first argument is a GameObject, then it's the parent
		if (props instanceof GameObject) {
			this.parent = props
			return
		} else if (props instanceof Object && !(props instanceof Array)) {
			Object.assign(this, props)
			this.parent = parent || null
			return
		}

		throw new TypeError("Invalid runtime arguments!")
	}

	/**
	 * A non-unique name for the GameObject
	 */
	name = "GameObject"

	/**
	 * The array of the GameObject's children
	 */
	// TODO: implement proper readonly arrays (im gonna explode)
	readonly children: GameObject[] = []
	private parentReference: GameObject | null = null

	/**
	 * The parent of the GameObject
	 */
	set parent(parent: GameObject | null) {
		if (parent === this) {
			throw new Error("Cannot set parent to self")
		}
		if (parent === undefined) {
			console.warn(`Attempt to set parent of ${this.name} to undefined`)
			parent = null
		}
		if (typeof parent !== "object" && parent !== null) {
			throw new Error("Parent must be a GameObject")
		}
		if (parent && parent.isDescendantOf(this)) {
			throw new Error("Cannot set parent to descendant")
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

			parent.childAdded.fire(this)
			while (parent) {
				parent.descendantAdded.fire(this)
				parent = parent.parent
			}
		}
	}

	get parent(): GameObject | null {
		return this.parentReference
	}

	/**
	 * Returns true if the GameObject is a descendant of the given GameObject
	 */
	// just realized js doesn't optimize tail recursion!!! too bad
	isDescendantOf(parent: GameObject): boolean {
		let current: GameObject | null = this
		if (current === parent) {
			return false
		}
		while (current) {
			if (current === parent) {
				return true
			}
			current = current.parent
		}
		return false
	}

	readonly childAdded = new Signal<[GameObject]>()
	readonly descendantAdded = new Signal<[GameObject]>()

	/**
	 * A required method for serializing the GameObject, can be overridden to allow for custom serialization
	 *
	 * BEWARE: Any class that doesn't serialize itself won't let you serialize it's children
	 */
	abstract serialize(): ClassStorage | void

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

	static serializeGameObjectChildren(children: GameObject[]): ClassStorage[] {
		if (children.length === 0) return []
		return children
			.map((child) => child.serialize())
			.filter((child) => child !== null) as ClassStorage[]
	}
}
