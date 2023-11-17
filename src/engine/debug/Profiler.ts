let currentFrame: ProfilingFrame

class ProfilingLabel {
	constructor(
		readonly name: string,
		readonly start: number,
		readonly depth: number
	) {
		this.end = null
	}

	end: number | null
	public get duration(): number {
		return this.end ? this.end - this.start : 0
	}
}

class ProfilingFrame {
	constructor() {
		this.begin("Process")
	}

	labels: ProfilingLabel[] = []
	depth: number = 0
	private labelChain: ProfilingLabel[] = []
	private currentLabel?: ProfilingLabel

	public begin(name: string) {
		const label = new ProfilingLabel(name, performance.now(), this.depth)
		this.labels.push(label)
		this.labelChain.push(label)

		this.currentLabel = label
		this.depth++
	}

	public end() {
		if (!this.currentLabel) {
			throw new Error("No current label")
		}

		// we want to end the label
		this.currentLabel.end = performance.now()
		this.currentLabel = this.labelChain[this.labelChain.length - 2]
		this.labelChain.pop()

		this.depth--
	}

	public stop() {
		this.end()
		console.log("Frame was stopped")
	}
}

export namespace Profiler {
	export function createFrame() {
		currentFrame = new ProfilingFrame()
		return currentFrame
	}

	export function stopFrame() {
		if (currentFrame) {
			currentFrame.stop()
		}
	}

	export function getFrame() {
		return currentFrame
	}

	export function startProfile(name: string) {
		if (currentFrame) {
			currentFrame.begin(name)
		}
	}

	export function endProfile() {
		if (currentFrame) {
			currentFrame.end()
		}
	}
}

export type { ProfilingFrame, ProfilingLabel }
