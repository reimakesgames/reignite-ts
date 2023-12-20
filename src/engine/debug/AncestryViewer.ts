import { Settings } from ".."
import { GameObject } from "../classes/GameObject"
import { root } from "../classes/Root"

type ElementData = {
	gameObject: GameObject
	depth: number
}

const PADDING = 8
const LINE_HEIGHT = 12
const HALF_LINE_HEIGHT = LINE_HEIGHT / 2

export function ancestryViewer(context: CanvasRenderingContext2D) {
	let list: ElementData[] = []

	function traverse(gameObject: GameObject, depth: number) {
		list.push({
			gameObject,
			depth,
		})
		gameObject.children.forEach((child) => traverse(child, depth + 1))
	}

	traverse(root, 0)

	context.font = `${LINE_HEIGHT}px monospace`
	context.textAlign = "left"
	context.textBaseline = "top"
	context.lineWidth = 2

	let maxWidth = 0
	for (let i = 0; i < list.length; i++) {
		const element = list[i] as ElementData
		const width =
			PADDING +
			element.depth * LINE_HEIGHT +
			context.measureText(element.gameObject.name).width
		if (width > maxWidth) {
			maxWidth = width
		}
	}

	// draw background box
	context.fillStyle = "#0000003f"
	context.fillRect(
		0,
		0,
		maxWidth + PADDING * 2,
		list.length * LINE_HEIGHT + PADDING * 2
	)

	context.fillStyle = "#ffffff"

	for (let i = 0; i < list.length; i++) {
		const element = list[i] as ElementData
		context.fillText(
			element.gameObject.name,
			PADDING + element.depth * LINE_HEIGHT,
			PADDING + LINE_HEIGHT * i
		)

		const previousElement = list[i - 1] as ElementData

		if (previousElement) {
			if (previousElement.depth < element.depth) {
				context.beginPath()
				context.moveTo(
					PADDING +
						HALF_LINE_HEIGHT +
						previousElement.depth * LINE_HEIGHT,
					PADDING + LINE_HEIGHT * i
				)
				context.lineTo(
					PADDING +
						HALF_LINE_HEIGHT +
						previousElement.depth * LINE_HEIGHT,
					PADDING + HALF_LINE_HEIGHT + LINE_HEIGHT * i
				)
				context.lineTo(
					PADDING + element.depth * LINE_HEIGHT,
					PADDING + HALF_LINE_HEIGHT + LINE_HEIGHT * i
				)
				context.stroke()
			} else if (previousElement.depth === element.depth) {
				context.beginPath()
				context.moveTo(
					PADDING -
						HALF_LINE_HEIGHT +
						previousElement.depth * LINE_HEIGHT,
					PADDING - HALF_LINE_HEIGHT + LINE_HEIGHT * i
				)
				context.lineTo(
					PADDING -
						HALF_LINE_HEIGHT +
						previousElement.depth * LINE_HEIGHT,
					PADDING + HALF_LINE_HEIGHT + LINE_HEIGHT * i
				)
				context.lineTo(
					PADDING + element.depth * LINE_HEIGHT,
					PADDING + HALF_LINE_HEIGHT + LINE_HEIGHT * i
				)
				context.stroke()
			} else if (previousElement.depth > element.depth) {
				// find the first element with a depth that is less than the current element
				let j = i - 1
				while (
					j >= 0 &&
					(list[j] as ElementData).depth > element.depth
				) {
					j--
				}

				context.beginPath()
				context.moveTo(
					PADDING +
						HALF_LINE_HEIGHT +
						(element.depth - 1) * LINE_HEIGHT,
					PADDING + LINE_HEIGHT * (list[j] as ElementData).depth
				)
				context.lineTo(
					PADDING +
						HALF_LINE_HEIGHT +
						(element.depth - 1) * LINE_HEIGHT,
					PADDING + HALF_LINE_HEIGHT + LINE_HEIGHT * i
				)
				context.lineTo(
					PADDING + element.depth * LINE_HEIGHT,
					PADDING + HALF_LINE_HEIGHT + LINE_HEIGHT * i
				)
				context.stroke()
			}
		}
	}

	context.lineWidth = 1
}
