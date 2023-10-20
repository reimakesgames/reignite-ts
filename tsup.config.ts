// @ts-nocheck
import { defineConfig } from "tsup"

export default defineConfig((options) => ({
	entry: ["main.ts", "src/engine/modules/bootstrap.ts"],
	splitting: false,
	sourcemap: true,
	clean: true,
	treeshake: true,
	format: ["cjs", "esm"],
	esbuildOptions(options, context) {
		options.metafile = true
		options.external = ["electron"]
	},
	minify: true,
}))
