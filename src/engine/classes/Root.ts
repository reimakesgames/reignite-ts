import { GameObject } from "./GameObject"
import { Scene } from "./Scene"

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

	override update(): void {}
	override render(): void {}
}

const root = new Root()

export { root }
