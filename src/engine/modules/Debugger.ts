function union(types: string[] | string): string {
	if (typeof types === "string") {
		return `\`${types}\``
	} else if (types instanceof Array) {
		// wrap types in backticks
		const wrapped = types.map((type) => `\`${type}\``)
		// if there are two types, join them with "or"
		if (types.length === 2) {
			return wrapped.join(" or ")
		}
		// otherwise, join them with commas and an "or"
		return wrapped.slice(0, -1).join(", ") + ", or " + wrapped.slice(-1)
	}
	throw new Error("Invalid debugger union types")
}

export function typeError(
	argname: string,
	expected: string[] | string,
	got: any
): Error {
	return new Error(
		`Invalid type on parameter \`${argname}\`, expected ${union(
			expected
		)}, got \`${typeof got}\``
	)
}
