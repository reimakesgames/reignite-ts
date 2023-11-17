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
	depth: number = -1
	private labelStack: string[] = []
	private currentLabel?: ProfilingLabel

	public begin(name: string) {
		this.depth++
		this.labelStack.push(name)
		let label = new ProfilingLabel(name, performance.now(), this.depth)
		this.labels.push(label)
		this.currentLabel = label
	}

	public end() {
		this.depth--
		this.currentLabel!.end = performance.now()
		this.currentLabel = this.labels[this.labelStack.length - 1]
		this.labelStack.pop()
	}

	public stop() {
		this.end()
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
