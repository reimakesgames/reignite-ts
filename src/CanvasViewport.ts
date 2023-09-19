import Settings from "./Settings.js"

let CanvasContainer: HTMLDivElement = null as any
let Canvas: HTMLCanvasElement = null as any
let Context: CanvasRenderingContext2D = null as any

function CreateCanvas() {
	CanvasContainer = document.createElement("div")
	CanvasContainer.classList.add("canvas-container")

	Canvas = document.createElement("canvas")
	Canvas.width = Settings.SCREEN_SIZE_X
	Canvas.height = Settings.SCREEN_SIZE_Y

	Context = Canvas.getContext("2d") as CanvasRenderingContext2D

	CanvasContainer.appendChild(Canvas)
}

function EnableFill(enable: boolean) {
	Settings.SCREEN_FILL = enable
}

function FitToScreen() {
	if (Settings.SCREEN_FILL) {
		CanvasContainer.style.width = "100%"
		CanvasContainer.style.height = "100%"
	} else {
		// TODO: Make this more performant, maybe?
		const ratio = Settings.SCREEN_SIZE_X / Settings.SCREEN_SIZE_Y
		const windowRatio = window.innerWidth / window.innerHeight
		if (windowRatio > ratio) {
			CanvasContainer.style.width = `${window.innerHeight * ratio}px`
			CanvasContainer.style.height = `${window.innerHeight}px`
		} else {
			CanvasContainer.style.width = `${window.innerWidth}px`
			CanvasContainer.style.height = `${window.innerWidth / ratio}px`
		}
	}
	requestAnimationFrame(FitToScreen)
}
requestAnimationFrame(FitToScreen)

export { CanvasContainer, Canvas, Context, CreateCanvas, EnableFill }
