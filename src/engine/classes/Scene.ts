import { ClassStorage } from "../modules/Serde"
import { Camera } from "./Camera"
import { GameObject, PropertiesOf } from "./GameObject"

/**
 * A scene is a collection of GameObjects and other data.
 */
export class Scene extends GameObject {
	constructor(parent?: GameObject)
	constructor(props: PropertiesOf<Scene>, parent?: GameObject)
	constructor(props?: PropertiesOf<Scene> | GameObject, parent?: GameObject) {
		if (!props) super(parent)
		else if (props instanceof GameObject) super(props)
		else super(props, parent)
	}
	name = "Scene"
	/**
	 * The active camera in the scene.
	 */
	currentCamera: Camera | null = null

	override serialize(): ClassStorage {
		return {
			class: "Scene",
			properties: {
				name: this.name,
			},
			children: GameObject.serializeGameObjectChildren(this.children),
		}
	}

	override update(): void {}
	override render(): void {}
}
