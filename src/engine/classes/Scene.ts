import { ClassSerializationTemplate } from "../modules/Serde"
import { Camera } from "./Camera"
import {
	GameObject,
	PropertiesOf,
	serializeGameObjectChildren,
} from "./GameObject"

export class Scene extends GameObject {
	constructor(props?: PropertiesOf<Scene>, parent?: GameObject) {
		super(props, parent)
	}
	name = "Scene"
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
