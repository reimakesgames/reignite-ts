import { ClassSerializationTemplate } from "../modules/Serde"
import { Camera } from "./Camera"
import { GameObject } from "./GameObject"

export class Scene extends GameObject {
	constructor(
		readonly name: string = "Scene",
		parent: GameObject | null = null
	) {
		super(name, parent)
	}

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
