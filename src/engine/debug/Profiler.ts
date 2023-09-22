let CurrentFrame: Frame

class Label {
	constructor(name: string, start: number, depth: number) {
		this.Name = name
		this.Start = start
		this.End = null
		this.Depth = depth
	}

	public Name: string
	public Start: number
	public End: number | null
	public Depth: number
	public get Duration(): number {
		return this.End ? this.End - this.Start : 0
	}
}

class Frame {
	constructor() {
		this.Labels = []
		this._labelStack = []
		this._currentLabel = null
		this.Depth = -1
		this.ProfileBegin("Process")
	}

	public Labels: Label[]
	private _labelStack: string[]
	private _currentLabel: Label | null
	public Depth: number

	public ProfileBegin(name: string) {
		this.Depth++
		this._labelStack.push(name)
		let label = new Label(name, performance.now(), this.Depth)
		this.Labels.push(label)
		this._currentLabel = label
	}

	public ProfileEnd() {
		this.Depth--
		this._currentLabel!.End = performance.now()
		this._currentLabel = this.Labels[this._labelStack.length - 1] ?? null
		this._labelStack.pop()
	}

	public Stop() {
		this.ProfileEnd()
	}
}

namespace Profiler {
	export function CreateFrame() {
		CurrentFrame = new Frame()
		return CurrentFrame
	}

	export function GetFrame() {
		return CurrentFrame
	}

	export function Begin(name: string) {
		if (CurrentFrame) {
			CurrentFrame.ProfileBegin(name)
		}
	}

	export function End() {
		if (CurrentFrame) {
			CurrentFrame.ProfileEnd()
		}
	}

	export function Stop() {
		if (CurrentFrame) {
			CurrentFrame.Stop()
		}
	}
}

export type { Frame, Label }

export default Profiler
