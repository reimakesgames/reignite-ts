const SETTINGS = {
	SCREEN_SIZE_X: 1920,
	SCREEN_SIZE_Y: 1080,
	SCREEN_FILL: false, // Should the canvas fill the screen? If false, the canvas will be centered and letterboxed.

	PRELOADER_THREADS: 4, // How many green threads should the preloader use to load assets? (0 = unlimited)

	RENDER_MARGIN: 1, // Percentage of the screen to render outside of the screen bounds. This is useful for rendering objects that are partially off-screen.
	// Note: This is a percentage of the screen size, not a percentage of the object size.
	// PS. This is a feature, not a bug. Do not ask me to change it unless you have a good fix for the problem.
	// I am losing my mind over the math required to fix this.

	ENABLE_WIREFRAME: false, // Should the engine render wireframes of 3d objects?

	ENABLE_SPLASH_SCREEN: true, // Should the engine display the splash screen?
	ENABLE_LOGGING: true, // Should the engine log debug messages to the console?
	ENABLE_FPS_COUNTER: true, // Should the engine display the FPS counter?
	ENABLE_PROFILER: true, // Should the engine display the profiler?

	IMAGE_SMOOTHING_QUALITY: "high" as ImageSmoothingQuality,
}

export function extendSettings(settings: Partial<typeof SETTINGS>) {
	Object.assign(SETTINGS, settings)
}

export { SETTINGS }
