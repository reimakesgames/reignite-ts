import Settings from "./Settings.js";

let CanvasContainer = document.createElement('div');
CanvasContainer.classList.add('canvas-container');

let Canvas = document.createElement('canvas');
Canvas.width = Settings.SCREEN_SIZE_X;
Canvas.height = Settings.SCREEN_SIZE_Y;

CanvasContainer.appendChild(Canvas);
document.body.appendChild(CanvasContainer);

function fitToScreen() {
	if (Settings.FILL) {
		CanvasContainer.style.width = '100%';
		CanvasContainer.style.height = '100%';
	} else {
		const ratio = Settings.SCREEN_SIZE_X / Settings.SCREEN_SIZE_Y;
		const windowRatio = window.innerWidth / window.innerHeight;
		if (windowRatio > ratio) {
			CanvasContainer.style.width = `${window.innerHeight * ratio}px`;
			CanvasContainer.style.height = `${window.innerHeight}px`;
		} else {
			CanvasContainer.style.width = `${window.innerWidth}px`;
			CanvasContainer.style.height = `${window.innerWidth / ratio}px`;
		}
	}
	requestAnimationFrame(fitToScreen);
}
requestAnimationFrame(fitToScreen);

let CanvasRenderer = Canvas.getContext('2d') as CanvasRenderingContext2D;
if (!CanvasRenderer) {
	throw new Error('Could not get 2D context');
}

CanvasRenderer.fillStyle = '#17171F';
CanvasRenderer.fillRect(0, 0, Settings.SCREEN_SIZE_X, Settings.SCREEN_SIZE_Y);

CanvasRenderer.fillStyle = '#FFFFFF';
CanvasRenderer.font = '36px Ubuntu';
CanvasRenderer.textAlign = 'center';
CanvasRenderer.textBaseline = 'bottom';
CanvasRenderer.fillText('REIGNITE', Settings.SCREEN_SIZE_X / 2, Settings.SCREEN_SIZE_Y / 2);

CanvasRenderer.font = '12px Ubuntu';
CanvasRenderer.textBaseline = 'top';
CanvasRenderer.fillText('A TypeScript Game Engine by Rei', Settings.SCREEN_SIZE_X / 2, Settings.SCREEN_SIZE_Y / 2 + 4);

CanvasRenderer.strokeStyle = '#FFFFFF';
CanvasRenderer.beginPath();
CanvasRenderer.moveTo(Settings.SCREEN_SIZE_X/2 - 120, Math.floor(Settings.SCREEN_SIZE_Y / 2));
CanvasRenderer.lineTo(Settings.SCREEN_SIZE_X/2 + 120, Math.floor(Settings.SCREEN_SIZE_Y / 2));
CanvasRenderer.stroke();
