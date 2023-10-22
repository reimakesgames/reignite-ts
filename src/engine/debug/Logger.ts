import Settings from "../Settings"

class Logger {
	constructor(identifier: string, respectSettings: boolean = true) {
		this.identifier = identifier
		this.respectSettings = respectSettings
	}

	identifier: string
	respectSettings: boolean

	log(message: string) {
		if (!this.respectSettings || Settings.ENABLE_LOGGING)
			console.log(`[${this.identifier}] ${message}`)
	}

	warn(message: string) {
		if (!this.respectSettings || Settings.ENABLE_LOGGING)
			console.warn(`[${this.identifier}] ${message}`)
	}

	error(message: string) {
		if (!this.respectSettings || Settings.ENABLE_LOGGING)
			console.error(`[${this.identifier}] ${message}`)
	}
}

export default Logger
