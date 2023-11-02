import Camera from "../classes/Camera"
import { GameObject, Subclass } from "../classes/GameObject"

const CLASSES: { [key: string]: new (...args: any[]) => any } = {
	Camera,
}

interface ObjTemplate {
	class: string
	properties: {
		[key: string]: any
	}
	children: ObjTemplate[]
}

export function loadGameObjectFromObj(obj: ObjTemplate): Subclass<GameObject> {
	const children: GameObject[] = []
	if (obj.children) {
		for (const child of obj.children) {
			children.push(loadGameObjectFromObj(child)!)
		}
	}

	const className = obj.class
	const classObj = CLASSES[className]
	if (!classObj) {
		console.error(`Class ${className} not found`)
		return null
	}
	const properties = obj.properties

	const gameObject = new classObj(properties.name, null)
	for (const key in properties) {
		// considered unsafe but it's fine because this is background
		gameObject[key] = properties[key]
	}
	for (const child of children) {
		child.parent = gameObject
	}

	return gameObject
}
