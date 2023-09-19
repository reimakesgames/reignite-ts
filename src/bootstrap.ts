import {
	CanvasContainer,
	Context,
	CreateCanvas,
	EnableFill,
} from "./CanvasViewport.js"
import LoadingScreen from "./LoadingScreen.js"

CreateCanvas()
document.body.appendChild(CanvasContainer)
EnableFill(false)

LoadingScreen(Context)
