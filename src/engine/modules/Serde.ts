import { Camera } from "../classes/Camera"
import { GameObject } from "../classes/GameObject"
import { Transform } from "../datatypes/Transform"
import { Vector3 } from "../datatypes/Vector3"
import { Scene } from "../classes/Scene"

const CLASSES: { [key: string]: new (...args: any[]) => any } = {
	Camera,
	Scene,
}
const DATATYPES: { [key: string]: new (...args: any[]) => any } = {
	Transform,
	Vector3,
}

export interface ClassStorage {
	class: string
	properties: {
		[key: string]: DatatypeStorage | ClassStorage | any
	}
	children?: ClassStorage[]
}

export interface DatatypeStorage {
	datatype: string
	value: any
}

function isDatatypeStorage(obj: any): obj is DatatypeStorage {
	return obj && obj.datatype && obj.value
}

function isClassStorage(obj: any): obj is ClassStorage {
	return obj && obj.class && obj.properties && obj.children
}

export function loadGameObjectFromObj(obj: ClassStorage): GameObject | null {
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
		// deserialize datatypes or other things

		const value = properties[key]
		if (isDatatypeStorage(value)) {
			const datatypeName = value.datatype
			const datatypeObj = DATATYPES[datatypeName]
			if (!datatypeObj) {
				console.error(`Datatype ${datatypeName} not found`)
				continue
			}
			gameObject[key] = new datatypeObj(value.value)
		} else if (isClassStorage(value)) {
			gameObject[key] = loadGameObjectFromObj(value)
		} else {
			gameObject[key] = value // TODO: unsafe
		}
	}
	for (const child of children) {
		child.parent = gameObject
	}

	return gameObject
}
