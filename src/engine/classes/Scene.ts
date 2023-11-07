import { ClassSerializationTemplate } from "../modules/Serde"
import { Camera } from "./Camera"
import {
	GameObject,
	PropertiesOf,
	serializeGameObjectChildren,
} from "./GameObject"

/**
 * A scene is a collection of GameObjects and other data.
 */
export class Scene extends GameObject {
	constructor(parent?: GameObject)
	constructor(props: PropertiesOf<Scene>, parent?: GameObject)
	constructor(props?: PropertiesOf<Scene>, parent?: GameObject) {
		if (!props) super(parent)
		else if (props instanceof GameObject) super(props)
		else super(props, parent)
	}
	name = "Scene"
	/**
	 * The active camera in the scene.
	 */
	currentCamera: Camera | null = null

	override serialize(): ClassSerializationTemplate {
		return {
			class: "Scene",
			properties: {
				name: this.name,
			},
			children: serializeGameObjectChildren(this.children),
		}
	}

	override update(): void {}
	override render(): void {}
}
