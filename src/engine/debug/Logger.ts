import { SETTINGS } from "../Settings"

/**
 * A simple logger class that can be used to log messages to the console.
 *
 * This class is used by the engine to log identifying messages to the console.
 * It's construction is literally just prepending an identifier to the message.
 */
export class Logger {
	constructor(
		readonly identifier: string,
		readonly respectSettings: boolean = true
	) {}

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
