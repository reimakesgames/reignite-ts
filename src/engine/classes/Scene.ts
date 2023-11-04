import { ClassSerializationTemplate } from "../modules/Serde"
import { Camera } from "./Camera"
import { GameObject, PropertiesOf } from "./GameObject"

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
			children: this.children.map((child) => child.serialize()),
		}
	}

	override update(): void {}
	override render(): void {}
}
