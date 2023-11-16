// @ts-nocheck
import { defineConfig } from "tsup"

export default defineConfig((options) => ({
	entry: ["src/engine/electron.ts", "src/engine/index.ts", "game/Game.ts"],
	splitting: false,
	clean: true,
	treeshake: true,
	minify: false,
	format: ["cjs", "esm"],
	esbuildOptions(options, context) {
		options.metafile = true
		options.external = ["electron"]
	},
}))
