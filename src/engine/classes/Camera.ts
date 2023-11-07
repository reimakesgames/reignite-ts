import { Transform } from "../datatypes/Transform"
import { ClassSerializationTemplate } from "../modules/Serde"
import { GameObject, PropertiesOf } from "./GameObject"

export class Camera extends GameObject {
	constructor(parent?: GameObject)
	constructor(props: PropertiesOf<Camera>, parent?: GameObject)
	constructor(props?: PropertiesOf<Camera>, parent?: GameObject) {
		if (!props) super(parent)
		else if (props instanceof GameObject) super(props)
		else super(props, parent)
	}
	transform: Transform = new Transform()
	fieldOfView: number = 70

	override serialize(): ClassSerializationTemplate {
		return {
			class: "Camera",
			properties: {
				name: "Camera",
				FieldOfView: this.fieldOfView,
				Transform: this.transform.serialize(),
			},
		}
	}

	override update(): void {}
	override render(): void {}
}
