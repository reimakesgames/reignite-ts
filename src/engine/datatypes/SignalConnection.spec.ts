import { describe, it, expect, vi } from "vitest"

import { SignalConnection } from "./SignalConnection"

describe("SignalConnection", () => {
	it("should disconnect", () => {
		const signal = {
			internalDisconnect: vi.fn(),
		} as any
		const callback = vi.fn()
		const connection = new SignalConnection(signal, callback)
		connection.disconnect()
		expect(connection.connected).toBe(false)
		expect(signal.internalDisconnect).toHaveBeenCalledWith(connection)
	})
})
