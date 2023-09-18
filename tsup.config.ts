// @ts-nocheck
import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/bootstrap.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  esbuildOptions(options, context) {
    options.metafile = true;
  },
  minify: true,
}));
