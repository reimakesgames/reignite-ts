export type Range = 0 | 1 | 2

const ourself = {
	Matrix: [
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 0],
	],
}

function Get2x2Determinant(a: number, b: number, c: number, d: number) {
	return a * d - b * c
}

function Get3x3Determinant(matrix) {
	const [a, b, c] = matrix[0]
	const [d, e, f] = matrix[1]
	const [g, h, i] = matrix[2]

	return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
}

function FirstMethod(matrix: number[][]) {
	let detM = [
		[
			Get2x2Determinant(
				matrix[1][1],
				matrix[1][2],
				matrix[2][1],
				matrix[2][2]
			),
			Get2x2Determinant(
				matrix[1][0],
				matrix[1][2],
				matrix[2][0],
				matrix[2][2]
			),
			Get2x2Determinant(
				matrix[1][0],
				matrix[1][1],
				matrix[2][0],
				matrix[2][1]
			),
		],
		[
			Get2x2Determinant(
				matrix[0][1],
				matrix[0][2],
				matrix[2][1],
				matrix[2][2]
			),
			Get2x2Determinant(
				matrix[0][0],
				matrix[0][2],
				matrix[2][0],
				matrix[2][2]
			),
			Get2x2Determinant(
				matrix[0][0],
				matrix[0][1],
				matrix[2][0],
				matrix[2][1]
			),
		],
		[
			Get2x2Determinant(
				matrix[0][1],
				matrix[0][2],
				matrix[1][1],
				matrix[1][2]
			),
			Get2x2Determinant(
				matrix[0][0],
				matrix[0][2],
				matrix[1][0],
				matrix[1][2]
			),
			Get2x2Determinant(
				matrix[0][0],
				matrix[0][1],
				matrix[1][0],
				matrix[1][1]
			),
		],
	]

	let multAndTransp = [
		[detM[0][0], detM[1][0] * -1, detM[2][0]],
		[detM[0][1] * -1, detM[1][1], detM[2][1] * -1],
		[detM[0][2], detM[1][2] * -1, detM[2][2]],
	]

	const det = Get3x3Determinant(matrix)
	for (let i = 0; i < multAndTransp.length; i++) {
		for (let j = 0; j < multAndTransp[i].length; j++) {
			multAndTransp[i][j] *= 1 / det
		}
	}

	return multAndTransp
}

function SecondMethod(matrix: number[][]) {
	const [a, b, c] = matrix[0]
	const [d, e, f] = matrix[1]
	const [g, h, i] = matrix[2]

	const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)

	return [
		[(e * i - f * h) / det, -(b * i - c * h) / det, (b * f - c * e) / det],
		[-(d * i - f * g) / det, (a * i - c * g) / det, -(a * f - c * d) / det],
		[(d * h - e * g) / det, -(a * h - b * g) / det, (a * e - b * d) / det],
	]
}

const iterations = 1000000

let firstTimes: number[] = []
let secondTimes: number[] = []

for (let i = 0; i < 30; i++) {
	let start = performance.now()
	for (let j = 0; j < iterations; j++) {
		FirstMethod(ourself.Matrix)
	}
	let end = performance.now()
	firstTimes.push(end - start)

	start = performance.now()
	for (let j = 0; j < iterations; j++) {
		SecondMethod(ourself.Matrix)
	}
	end = performance.now()
	secondTimes.push(end - start)
}

const firstAvg = firstTimes.reduce((a, b) => a + b) / firstTimes.length
const secondAvg = secondTimes.reduce((a, b) => a + b) / secondTimes.length

console.log(`First method: ${firstAvg}`)
console.log(`Second method: ${secondAvg}`)
