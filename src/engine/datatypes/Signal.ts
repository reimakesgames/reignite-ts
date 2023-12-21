import { SignalConnection } from "./SignalConnection"

type Callback<Args extends any[]> = (...args: Args) => void

let queue: { signal: Signal<any>; args: any[] }[] = []

/**
 * A signal is a way to connect callbacks to events.
 */
export class Signal<Args extends any[]> {
	private connections: SignalConnection<Args>[] = []

	/**
	 * Connects a callback to this signal.
	 */
	connect(callback: Callback<Args>): SignalConnection<Args> {
		let connection = new SignalConnection(this, callback)
		this.connections.push(connection)
		return connection
	}

	/**
	 * Connects a callback to this signal, but disconnects it after it has been called once.
	 */
	once(callback: Callback<Args>): SignalConnection<Args> {
		let connection = new SignalConnection(this, (...args) => {
			connection.disconnect()
			callback(...args)
		})
		this.connections.push(connection)
		return connection
	}

	/**
	 * Calls all connected callbacks.
	 */
	fire(...args: Args) {
		setTimeout(() => {
			this.connections.forEach((c) => {
				try {
					c.callback(...args)
				} catch (e) {
					console.error(e)
				}
			})
		}, 0)
	}

	/**
	 * Calls all connected callbacks, but queues them until the next frame.
	 */
	fireDeferred(...args: Args) {
		queue.push({ signal: this, args })
	}

	/**
	 * Disconnects all connected callbacks.
	 */
	disconnectAll() {
		this.connections = []
	}

	/**
	 * Disconnects a specific callback.
	 *
	 * Use the returned connection by connect instead of using this method.
	 */
	internalDisconnect(connection: SignalConnection<Args>) {
		this.connections = this.connections.filter((c) => c !== connection)
	}

	/**
	 * Calls all queued signals.
	 *
	 * This is an internal method, and should not be used.
	 */
	static internalResumeDeferred() {
		queue.forEach((q) => {
			q.signal.fire(...q.args)
		})
		queue = []
	}
}
