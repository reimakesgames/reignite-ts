# Reignite Typescript Game Engine Changelog

# [v1.096.1] WORK IN PROGRESS

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

## Changed

-   `Matrix3d.lookAt` properly calculates the matrix now
-   TypeDoc is now reutilized for documentation
-   Q and E keys are now used to lower and raise the camera
-   Scroll wheel is now used to zoom in and out

# [v1.096.0-pre.1]

## Added

-   Electron test and support
-   Electron configuration

## Changed

-   Default Engine Font is now imported as a local asset instead of a local installed font

# [v1.095.1]

## Added

-   Preloader system with customizable preloaders

## Changed

-   Splash screen waits for preloader and user input instead of just user input
-   requestPointerLock is now called onclick instead of every frame
-   Reorganized the project structure to prepare for Editor development
-   Changed html file from `index.html` to `game.html` to prepare for Editor development

# [v1.095.0]

## Added

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
