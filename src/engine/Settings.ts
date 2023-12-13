const Settings = {
	screenSizeX: 1920,
	screenSizeY: 1080,
	screenFill: false, // Should the canvas fill the screen? If false, the canvas will be centered and letterboxed.

	preloaderThreads: 4, // How many green threads should the preloader use to load assets? (0 = unlimited)

	renderClippingPercentage: 1, // Percentage of the screen to render outside of the screen bounds. This is useful for rendering objects that are partially off-screen.
	// Note: This is a percentage of the screen size, not a percentage of the object size.
	// PS. This is a feature, not a bug. Do not ask me to change it unless you have a good fix for the problem.
	// I am losing my mind over the math required to fix this.

	wireframeOn3dObjects: false, // Should the engine render wireframes of 3d objects?

	enableSplashScreen: true, // Should the engine display the splash screen?
	enableLogging: true, // Should the engine log debug messages to the console?
	enableFpsCounter: true, // Should the engine display the FPS counter?
	enableProfiler: true, // Should the engine display the profiler?

	imageSmoothingQuality: "high" as ImageSmoothingQuality,
}

export function extendSettings(settings: Partial<typeof Settings>) {
	Object.assign(Settings, settings)
}

export { Settings }
