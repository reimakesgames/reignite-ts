import {
	CanvasContainer,
	Context,
	CreateCanvas,
	EnableFill,
} from "./CanvasViewport.js"
import SplashScreen from "./SplashScreen.js"

CreateCanvas()
document.body.appendChild(CanvasContainer)
EnableFill(false)

SplashScreen(Context)
