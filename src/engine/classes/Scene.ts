import { loadGameObjectFromObj } from "../modules/Serde"
import Camera from "./Camera"
import { GameObject } from "./GameObject"

export class Scene extends GameObject {
	constructor(
		readonly name: string = "Scene",
		parent: GameObject | null = null
	) {
		super(name, parent)
	}

	currentCamera: Camera | null = null

	loadSceneFromJson(json: string): void {
		const obj = JSON.parse(json)
		for (const child of obj) {
			let gameObject = loadGameObjectFromObj(child)
			if (gameObject) {
				gameObject.parent = this

				// hardcoded case for current camera
				if (
					gameObject.name === "Camera1" &&
					gameObject instanceof Camera
				) {
					console.warn("Setting current camera")

					this.currentCamera = gameObject
				}
			}
		}
	}

	override update(): void {}
	override render(): void {}
}
