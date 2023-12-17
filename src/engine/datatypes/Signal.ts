import { SignalConnection } from "./SignalConnection"

type Callback<Args extends any[]> = (...args: Args) => void

let queue: { signal: Signal<any>; args: any[] }[] = []

export class Signal<Args extends any[]> {
	private connections: SignalConnection<Args>[] = []

	connect(callback: Callback<Args>): SignalConnection<Args> {
		let connection = new SignalConnection(this, callback)
		this.connections.push(connection)
		return connection
	}

	once(callback: Callback<Args>): SignalConnection<Args> {
		let connection = new SignalConnection(this, (...args) => {
			connection.disconnect()
			callback(...args)
		})
		this.connections.push(connection)
		return connection
	}

	fire(...args: Args) {
		this.connections.forEach((c) => {
			try {
				c.callback(...args)
			} catch (e) {
				console.error(e)
			}
		})
	}

	fireAsync(...args: Args) {
		queue.push({ signal: this, args })
	}

	disconnectAll() {
		this.connections = []
	}

	disconnect(connection: SignalConnection<Args>) {
		this.connections = this.connections.filter((c) => c !== connection)
	}

	static fireAll() {
		queue.forEach((q) => {
			q.signal.fire(...q.args)
		})
		queue = []
	}
}
