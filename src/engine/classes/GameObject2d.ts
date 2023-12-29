import { GameObject, PropertiesOf } from "./GameObject"
import { Transform2d } from "../datatypes/Transform2d"
import { ClassStorage } from "../modules/Serde"
import { Vector2 } from "../datatypes/Vector2"

export abstract class GameObject2d extends GameObject {
	constructor(parent?: GameObject)
	constructor(props: PropertiesOf<GameObject2d>, parent?: GameObject)
	constructor(
		props?: PropertiesOf<GameObject2d> | GameObject,
		parent?: GameObject
	) {
		super(props, parent)
	}

	name = "GameObject2d"

	transform = new Transform2d()

	abstract update(): void
	abstract render(): void
	abstract serialize(): ClassStorage
}
