import { SETTINGS } from "../Settings"

export let canvasContainer: HTMLDivElement
export let canvas: HTMLCanvasElement
export let ctx: CanvasRenderingContext2D

function fitToScreen() {
	if (SETTINGS.screenFill) {
		canvasContainer.style.width = "100%"
		canvasContainer.style.height = "100%"
	} else {
		// TODO: Make this more performant, maybe?
		const ratio = SETTINGS.screenSizeX / SETTINGS.screenSizeY
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
	canvas.width = SETTINGS.screenSizeX
	canvas.height = SETTINGS.screenSizeY

	ctx = canvas.getContext("2d") as CanvasRenderingContext2D

	canvasContainer.appendChild(canvas)

	requestAnimationFrame(fitToScreen)
}

export function enableFill(enable: boolean) {
	SETTINGS.screenFill = enable
}
