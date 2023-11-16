import { SETTINGS } from "../Settings"

export class Logger {
	constructor(identifier: string, respectSettings: boolean = true) {
		this.identifier = identifier
		this.respectSettings = respectSettings
	}

	identifier: string
	respectSettings: boolean

	log(message: string) {
		if (!this.respectSettings || SETTINGS.enableLogging)
			console.log(`[${this.identifier}] ${message}`)
	}

	warn(message: string) {
		if (!this.respectSettings || SETTINGS.enableLogging)
			console.warn(`[${this.identifier}] ${message}`)
	}

	error(message: string) {
		if (!this.respectSettings || SETTINGS.enableLogging)
			console.error(`[${this.identifier}] ${message}`)
	}
}
