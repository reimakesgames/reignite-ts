import { describe, it, expect, vi, afterEach } from "vitest"

import { Signal } from "./Signal"

const signal = new Signal()

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// sad that we have to use await delay() in these tests, but it's the only way to
// make sure that the callbacks have been called because the signal.fire() call
// has a setTimeout(, 0) in it, which means that the callbacks will be called
// a little bit later when the event loop is empty

describe.sequential("Signal", () => {
	afterEach(() => {
		signal.disconnectAll()
	})

	// immediate mode tests

	it("should call the callback immediately", async () => {
		const callback = vi.fn()
		signal.connect(callback)
		signal.fire()
		await delay(100)
		expect(callback).toHaveBeenCalled()
	})

	it("should not fire when disconnected", async () => {
		const callback = vi.fn()
		const connection = signal.connect(callback)
		connection.disconnect()
		signal.fire()
		await delay(100)
		expect(callback).not.toHaveBeenCalled()
	})

	// deferred mode tests

	it("should not fire when deferred", async () => {
		const callback = vi.fn()
		signal.connect(callback)
		signal.fireDeferred()
		await delay(100)
		expect(callback).not.toHaveBeenCalled()
	})

	it("should fire when deferred and met resumption point", async () => {
		const callback = vi.fn()
		signal.connect(callback)
		signal.fireDeferred()
		Signal.interalResumeDeferred()
		await delay(100)
		expect(callback).toHaveBeenCalled()
	})

	it("should not fire when deferred and disconnected", async () => {
		const callback = vi.fn()
		const connection = signal.connect(callback)
		signal.fireDeferred()
		connection.disconnect()
		Signal.interalResumeDeferred()
		await delay(100)
		expect(callback).not.toHaveBeenCalled()
	})

	// once cases

	it("should fire once", async () => {
		const callback = vi.fn()
		signal.once(callback)
		signal.fire()
		signal.fire()
		await delay(100)
		expect(callback).toHaveBeenCalledTimes(1)
	})

	it("should not fire when once and disconnected", async () => {
		const callback = vi.fn()
		const connection = signal.once(callback)
		connection.disconnect()
		signal.fire()
		await delay(100)
		expect(callback).not.toHaveBeenCalled()
	})

	// weird cases

	it("should not break when a callback throws an error", async () => {
		const callback = vi.fn(() => {
			throw new Error("test")
		})
		const callback2 = vi.fn()
		signal.connect(callback)
		signal.connect(callback2)
		signal.fire()
		await delay(100)
		expect(callback).toHaveBeenCalled()
		expect(callback2).toHaveBeenCalled()
	})

	it("should not block when a callback yields", async () => {
		const callback = vi.fn(function* () {
			yield
		})
		signal.connect(callback)
		signal.fire()
		await delay(100)
		expect(callback).toHaveBeenCalled()
	})

	it("should not block when a callback is async", async () => {
		const callback = vi.fn(async () => {})
		signal.connect(callback)
		signal.fire()
		await delay(100)
		expect(callback).toHaveBeenCalled()
	})

	it("should not block caller when a callback is slow", async () => {
		const callback = vi.fn(() => {
			for (let i = 0; i < 1000000000; i++) {}
		})
		const callback2 = vi.fn(() => {})

		signal.connect(callback)
		signal.connect(callback2)
		const start = performance.now()
		signal.fire()
		const end = performance.now()
		expect(end - start).toBeLessThan(200)
		await delay(100)
		expect(callback).toHaveBeenCalled()
		expect(callback2).toHaveBeenCalled()
	})

	// argument tests

	it("should pass arguments to the callback", async () => {
		const callback = vi.fn()
		signal.connect(callback)
		signal.fire(1, 2, 3)
		await delay(100)
		expect(callback).toHaveBeenCalledWith(1, 2, 3)
	})

	it("should pass arguments to the callback when deferred", async () => {
		const callback = vi.fn()
		signal.connect(callback)
		signal.fireDeferred(1, 2, 3)
		Signal.interalResumeDeferred()
		await delay(100)
		expect(callback).toHaveBeenCalledWith(1, 2, 3)
	})
})
