# Reignite Typescript Game Engine Changelog

## [v1.97.0]

### Changed

-   `Vector3.fuzzyEq`'s epsilon now defaults to `Number.EPSILON`

## [v1.96.3]

### Added

-   Codecov integration
-   Unit tests on CI
-   Signal class
-   childAdded/descendantAdded events
-   Ancestry Viewer

## [v1.96.2]

### Changed

-   Preloader cache bug fixed
-   Experimental IPC system

## [v1.96.1]

```
This commit mostly refactored the system to partially follow Google's Typescript Style Guide to allow for easier code readability and maintainability.

The following changes were made:
-   All classes are now PascalCase
-   All interfaces are now PascalCase
-   All enums are now PascalCase
-   All types are now PascalCase

-   All constants are now SNAKE_CASE
-   All variables are now camelCase
-   All functions are now camelCase

- Cleared most boilerplate (by including public in methods and properties)
- Exports do not use default anymore
```

### Changed

-   `Matrix3d.lookAt` properly calculates the matrix now
-   TypeDoc is now reutilized for documentation
-   Q and E keys are now used to lower and raise the camera
-   Scroll wheel is now used to zoom in and out
-   Code that utilizes `TextureCoordinates` now uses `Vector2` instead for simplicity
-   Replaced `jest` with `vitest` for easier debugging and integration with vscode
-   `tests` folder is gone and is now integrated with the `src` folder via `*.spec.ts` files
-   Engine now doesn't run on its own, instead it is imported and used by the user
-   Game is now the entry point of the engine, instead of the engine itself
-   COOP and COEP headers are now added to the server to allow more control over the browser
-   Profiler's `Depth` system now works properly
-   Better CLI scripts
-   Updated dependencies (December 13, 2023)
-   Removed cjs build because of dep updates
-   Actually added typescript as a dev dependency (oops)

## [v1.96.0-pre.1]

### Added

-   Electron test and support
-   Electron configuration

### Changed

-   Default Engine Font is now imported as a local asset instead of a local installed font

## [v1.95.1]

### Added

-   Preloader system with customizable preloaders

### Changed

-   Splash screen waits for preloader and user input instead of just user input
-   requestPointerLock is now called onclick instead of every frame
-   Reorganized the project structure to prepare for Editor development
-   Changed html file from `index.html` to `game.html` to prepare for Editor development

## [v1.95.0]

### Added

-   Matrix3x3 datatype
-   Matrix2x2 datatype
-   Transform datatype
-   Vector3 datatype

-   Camera class
-   GameObject class

-   HTML5 Canvas Configuration and Bootstrapping system
-   Camera Projection system
-   Rendering system
-   Splash Screen system

-   Typescript configuration
-   TSUP configuration
-   Jest configuration
-   TypeDoc configuration
