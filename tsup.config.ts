// @ts-nocheck
import { defineConfig } from "tsup"

export default defineConfig((options) => ({
	entry: ["src/engine/electron.ts", "src/engine/index.ts", "game/Game.ts"],
	format: ["esm"],

	splitting: false, // No need since app must be a single file for use
	treeshake: true, // Trim unused code
	minify: true, // Minify code

	clean: true,
	dts: true,
	esbuildOptions(options, context) {
		options.external = ["electron"]
	},
}))
