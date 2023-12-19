import { Signal } from "./Signal"

type Callback<Args extends any[]> = (...args: Args) => void

/**
 * A SignalConnection is the returned object of a Signal.connect() or Signal.once() call.
 *
 * It can be used to disconnect the callback from the signal.
 */
export class SignalConnection<Args extends any[]> {
	constructor(
		private signal: Signal<Args>,
		public callback: Callback<Args>
	) {}

	/**
	 * Whether or not the callback is still connected to the signal.
	 */
	connected = true

	/**
	 * Disconnects the callback from the signal.
	 */
	disconnect(): void {
		this.connected = false
		this.signal.internalDisconnect(this)
	}
}
