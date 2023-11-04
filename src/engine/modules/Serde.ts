import { Camera } from "../classes/Camera"
import { GameObject } from "../classes/GameObject"
import { Transform } from "../datatypes/Transform"
import { Vector3 } from "../datatypes/Vector3"

const Classes: { [key: string]: new (...args: any[]) => any } = {
	Camera,
}
const Datatypes: { [key: string]: new (...args: any[]) => any } = {
	Transform,
	Vector3,
}

export interface ClassSerializationTemplate {
	class: string
	properties: {
		[key: string]:
			| DatatypeSerializationTemplate
			| ClassSerializationTemplate
			| any
	}
	children?: ClassSerializationTemplate[]
}

export interface DatatypeSerializationTemplate {
	datatype: string
	value: any
}

function isDatatypeSerializationTemplate(
	obj: any
): obj is DatatypeSerializationTemplate {
	return obj && obj.datatype && obj.value
}

function isClassSerializationTemplate(
	obj: any
): obj is ClassSerializationTemplate {
	return obj && obj.class && obj.properties && obj.children
}

export function loadGameObjectFromObj(
	obj: ClassSerializationTemplate
): GameObject | null {
	const children: GameObject[] = []
	if (obj.children) {
		for (const child of obj.children) {
			children.push(loadGameObjectFromObj(child)!)
		}
	}

	const className = obj.class
	const classObj = Classes[className]
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
		if (isDatatypeSerializationTemplate(value)) {
			const datatypeName = value.datatype
			const datatypeObj = Datatypes[datatypeName]
			if (!datatypeObj) {
				console.error(`Datatype ${datatypeName} not found`)
				continue
			}
			gameObject[key] = new datatypeObj(value.value)
		} else if (isClassSerializationTemplate(value)) {
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
