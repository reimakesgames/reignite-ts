import Camera from "../classes/Camera"
import { Matrix3d } from "../datatypes/Matrix3d"
import { Vector2 } from "../datatypes/Vector2"
import { Vector3 } from "../datatypes/Vector3"
import Projector from "../modules/Projector"
import Texturer from "../modules/Texturer"
import Profiler from "./Profiler"

const texture = new Image()
// texture.src =
// 	"https://media.discordapp.net/stickers/1098863054369865868.png?size=160"
texture.src = "./assets/normal.png"

const cubeVertices = [
	new Vector3(-1, -1, -1),
	new Vector3(-1, -1, 1),
	new Vector3(-1, 1, -1),
	new Vector3(-1, 1, 1),
	new Vector3(1, -1, -1),
	new Vector3(1, -1, 1),
	new Vector3(1, 1, -1),
	new Vector3(1, 1, 1),
]

const cubeFaces = [
	[2, 3, 1, 0],
	[3, 7, 5, 1],
	[7, 6, 4, 5],
	[6, 2, 0, 4],
	[4, 0, 1, 5],
	[2, 6, 7, 3],
]

export default function RenderCube(
	context: CanvasRenderingContext2D,
	camera: Camera
) {
	Profiler.Begin("Draw Cube")

	Profiler.Begin("Rotate Cube")
	const cubeRotation = new Vector3(
		performance.now() / 1000,
		performance.now() / 1000,
		performance.now() / 1000
	)

	// const cubeRotationMatrix = new Matrix3d([
	// 	[Math.cos(cubeRotation.Z), -Math.sin(cubeRotation.Z), 0],
	// 	[Math.sin(cubeRotation.Z), Math.cos(cubeRotation.Z), 0],
	// 	[0, 0, 1],
	// ])
	// 	.multiply(
	// 		new Matrix3d([
	// 			[Math.cos(cubeRotation.Y), 0, Math.sin(cubeRotation.Y)],
	// 			[0, 1, 0],
	// 			[-Math.sin(cubeRotation.Y), 0, Math.cos(cubeRotation.Y)],
	// 		])
	// 	)
	// 	.multiply(
	// 		new Matrix3d([
	// 			[1, 0, 0],
	// 			[0, Math.cos(cubeRotation.X), -Math.sin(cubeRotation.X)],
	// 			[0, Math.sin(cubeRotation.X), Math.cos(cubeRotation.X)],
	// 		])
	// 	)
	const pos = new Vector3(
		Math.sin(performance.now() / 1000) * 4,
		Math.cos(performance.now() / 1000) * 4,
		0
	)
	const cubeRotationMatrix = Matrix3d.lookAt(
		pos,
		new Vector3(0, 0, 0),
		new Vector3(0, 0, 1)
	)

	let cubeRotatedVertices = cubeVertices.map((vertex) => {
		return cubeRotationMatrix.multiply(vertex) as Vector3
	})
	cubeRotatedVertices = cubeRotatedVertices.map((vertex) => {
		return vertex.add(
			new Vector3(
				Math.sin(performance.now() / 1000) * 4,
				Math.cos(performance.now() / 1000) * 4,
				0
			)
		)
	})
	Profiler.End()

	Profiler.Begin("Project Cube")
	const cubeProjectedVertices = cubeRotatedVertices.map((vertex) => {
		return Projector(vertex, camera)
	})
	Profiler.End()

	Profiler.Begin("Sort Cube Faces")
	const sortedDrawOrder = cubeFaces
		.map((face, index) => {
			// get average distance of each face
			const faceVertices = cubeFaces[index]
			const faceProjectedVertices = faceVertices?.map((vertex) => {
				return cubeProjectedVertices[vertex]
			}) as Vector3[]
			const faceDistance =
				faceProjectedVertices.reduce((acc, vertex) => {
					return acc + vertex.Z
				}, 0) / faceProjectedVertices?.length
			return {
				index: index,
				distance: faceDistance,
			}
		})
		.sort((a, b) => {
			return b.distance - a.distance
		})
	Profiler.End()

	Profiler.Begin("Draw Cube Faces")
	sortedDrawOrder.forEach((face) => {
		const faceVertices = cubeFaces[face.index]
		const faceProjectedVertices = faceVertices?.map((vertex) => {
			return cubeProjectedVertices[vertex]
		}) as Vector3[]
		if (faceProjectedVertices.some((vertex) => vertex.Z < 0)) {
			return
		}

		context.fillStyle = `#000000`
		context.beginPath()
		context.moveTo(
			faceProjectedVertices[0]?.X || 0,
			faceProjectedVertices[0]?.Y || 0
		)
		faceProjectedVertices.forEach((vertex) => {
			context.lineTo(vertex.X, vertex.Y)
		})
		context.closePath()
		context.fill()

		let image = new Texturer(texture)
		image.p1 = new Vector2(
			faceProjectedVertices[0]?.X,
			faceProjectedVertices[0]?.Y
		)
		image.p2 = new Vector2(
			faceProjectedVertices[1]?.X,
			faceProjectedVertices[1]?.Y
		)
		image.p3 = new Vector2(
			faceProjectedVertices[2]?.X,
			faceProjectedVertices[2]?.Y
		)
		image.p4 = new Vector2(
			faceProjectedVertices[3]?.X,
			faceProjectedVertices[3]?.Y
		)
		image.Draw(context)
	})
	Profiler.End()

	Profiler.End()
}
