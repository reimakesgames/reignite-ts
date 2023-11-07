import { GameObject, PropertiesOf } from "./GameObject"
import { Scene } from "./Scene"
import { loadGameObjectFromObj } from "../modules/Serde"
import { Camera } from "./Camera"

/**
 * The root object of the engine which contains utility services.
 */
class Root extends GameObject {
	constructor(parent?: GameObject)
	constructor(props: PropertiesOf<Root>, parent?: GameObject)
	constructor(props?: PropertiesOf<Root>, parent?: GameObject) {
		if (!props) super(parent)
		else if (props instanceof GameObject) super(props)
		else super(props, parent)
	}

	private wrappedCurrentScene: Scene | null = null
	/**
	 * The active scene in the engine.
	 */
	get currentScene(): Scene {
		if (!this.wrappedCurrentScene) {
			throw new Error("No scene is loaded")
		}
		return this.wrappedCurrentScene
	}
	set currentScene(scene: Scene) {
		this.wrappedCurrentScene = scene
		scene.parent = this
		console.log("Scene loaded")
		// TODO: extra
	}

	/**
	 * Loads a scene from a JSON string.
	 */
	loadSceneFromJson(json: string): void {
		const obj = JSON.parse(json)
		this.currentScene = loadGameObjectFromObj(obj) as Scene
	}

	// serializing root is not necessary
	override serialize(): any {}

	override update(): void {}
	override render(): void {}
}

const root = new Root()

export { root }
