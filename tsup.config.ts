// @ts-nocheck
import { defineConfig } from "tsup"

export default defineConfig((options) => ({
	entry: [
		"src/engine/electron.ts",
		"src/engine/bootstrap.ts",
		"src/engine/index.ts",
	],
	splitting: false,
	clean: true,
	treeshake: true,
	minify: true,
	format: ["cjs", "esm"],
	esbuildOptions(options, context) {
		options.metafile = true
		options.external = ["electron"]
	},
}))
