import { GameObject } from "./GameObject"
import { Scene } from "./Scene"
import { loadGameObjectFromObj } from "../modules/Serde"
import { Camera } from "./Camera"

class Root extends GameObject {
	constructor(
		readonly name: string = "root",
		parent: GameObject | null = null
	) {
		super(name, parent)
	}

	private wrappedCurrentScene: Scene | null = null
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
