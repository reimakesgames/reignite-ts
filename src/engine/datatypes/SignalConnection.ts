import { Signal } from "./Signal"

type Callback<Args extends any[]> = (...args: Args) => void

export class SignalConnection<Args extends any[]> {
	constructor(
		private signal: Signal<Args>,
		public callback: Callback<Args>
	) {}

	connected = true

	disconnect(): void {
		this.connected = false
		this.signal.disconnect(this)
	}
}
