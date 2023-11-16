import { SETTINGS } from "../Settings"

export let canvasContainer: HTMLDivElement
export let canvas: HTMLCanvasElement
export let ctx: CanvasRenderingContext2D

function fitToScreen() {
	if (SETTINGS.SCREEN_FILL) {
		canvasContainer.style.width = "100%"
		canvasContainer.style.height = "100%"
	} else {
		// TODO: Make this more performant, maybe?
		const ratio = SETTINGS.SCREEN_SIZE_X / SETTINGS.SCREEN_SIZE_Y
		const windowRatio = window.innerWidth / window.innerHeight
		if (windowRatio > ratio) {
			canvasContainer.style.width = `${window.innerHeight * ratio}px`
			canvasContainer.style.height = `${window.innerHeight}px`
		} else {
			canvasContainer.style.width = `${window.innerWidth}px`
			canvasContainer.style.height = `${window.innerWidth / ratio}px`
		}
	}
	requestAnimationFrame(fitToScreen)
}

export function createCanvas() {
	if (canvasContainer) throw new Error("Canvas already created!")

	canvasContainer = document.createElement("div")
	canvasContainer.classList.add("canvas-container")

	canvas = document.createElement("canvas")
	canvas.width = SETTINGS.SCREEN_SIZE_X
	canvas.height = SETTINGS.SCREEN_SIZE_Y

	ctx = canvas.getContext("2d") as CanvasRenderingContext2D

	canvasContainer.appendChild(canvas)

	requestAnimationFrame(fitToScreen)
}

export function enableFill(enable: boolean) {
	SETTINGS.SCREEN_FILL = enable
}
