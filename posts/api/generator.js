const GENERATORS = ["Added", "Removed", "Changed"]

const ACCESS_MODIF = ["private", "protected"]
// static flag here
const POLYMORPHISM = [
	// smh ts doesn't have virtual
	"abstract",
	"override",
]
// readonly flag here

const appendToBody = document.body.appendChild.bind(document.body)

function addToElement(element, elements) {
	elements.forEach((el) => {
		element.appendChild(el)
	})
}

function stringToHtmlSafe(str) {
	console.log(str)
	console.log(
		str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
	)
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
}
function stringRemoveStartAndEndQuotes(str) {
	if (
		(str.startsWith('"') && str.endsWith('"')) ||
		(str.startsWith("'") && str.endsWith("'"))
	) {
		return str.slice(1, -1)
	}
	return str
}

/**
 *
 * @param {string} input
 * @returns
 */
function primitiveGenerator(input) {
	input = input.trim()
	let output = '<span class="'

	if (
		(input.startsWith('"') && input.endsWith('"')) ||
		(input.startsWith("'") && input.endsWith("'"))
	) {
		output += "string"
		input = stringRemoveStartAndEndQuotes(input)
		input = stringToHtmlSafe(input)
	} else if ((input.includes(".") || input.includes("e")) && !isNaN(input)) {
		output += "number"
	} else if (input.length > 0 && (input === "true" || input === "false")) {
		output += "boolean"
	} else {
		output += "string"
		input = stringToHtmlSafe(input)
	}
	output += '">' + input + "</span>"

	if (input.length === 0) {
		output = ""
	}

	return output
}

function splitByComma(str) {
	let output = []
	let current = ""
	let inQuotes = false
	for (let i = 0; i < str.length; i++) {
		if (str[i] === '"') {
			inQuotes = !inQuotes
		} else if (str[i] === "," && !inQuotes) {
			output.push(current)
			current = ""
		} else {
			current += str[i].trim()
		}
	}
	output.push(current)
	return output
}

function GeneratorSpan(text) {
	const span = document.createElement("span")
	span.innerText = text

	return span
}

function GeneratorRow() {
	const row = document.createElement("div")
	row.style.display = "flex"
	row.style.flexDirection = "row"
	row.style.gap = "1ch"

	return row
}

function GeneratorText(name) {
	const input = document.createElement("input")
	input.type = "text"
	input.className = name
	input.placeholder = name

	return input
}

function GeneratorSelect(options) {
	const select = document.createElement("select")
	const none = document.createElement("option")
	none.value = ""
	none.innerText = "None"
	select.appendChild(none)
	options.forEach((option) => {
		const opt = document.createElement("option")
		opt.value = option
		opt.innerText = option
		select.appendChild(opt)
	})

	return select
}

function GeneratorFlag(name) {
	const id = `${name.toLowerCase()}-flag${Math.random()
		.toString(36)
		.substring(2, 9)}`

	const checkbox = document.createElement("input")
	checkbox.type = "checkbox"
	checkbox.className = "flag"
	checkbox.id = id

	const label = document.createElement("label")
	label.innerText = name
	label.htmlFor = id

	const row = GeneratorRow()
	row.appendChild(checkbox)
	row.appendChild(label)

	return { row, checkbox }
}

function GeneratorCopy(callback) {
	const copy = document.createElement("button")
	copy.innerText = "Copy"
	copy.onclick = callback

	return copy
}

function Generator(name, desc) {
	const generator = document.createElement("div")
	generator.className = "generator"

	const title = document.createElement("div")
	title.className = "title"
	title.innerText = name

	generator.appendChild(title)
	if (desc) {
		const description = document.createElement("div")
		description.className = "description"
		description.innerText = desc
		generator.appendChild(description)
	}

	return generator
}

function DefaultValueGenerator() {
	const generator = Generator(
		"Default Value",
		"Generates a primitive value, e.g. string, number, boolean"
	)
	const row = GeneratorRow()

	const value = GeneratorText("value")
	const copy = GeneratorCopy(() => {
		let output = primitiveGenerator(value.value)
		navigator.clipboard.writeText(output)
	})

	addToElement(row, [value])
	addToElement(generator, [row, copy])

	return generator
}

function GenericGenerator() {
	const generator = Generator(
		"Generic",
		"Generates a generic, (well the <> part of a generic)"
	)
	const row = GeneratorRow()

	const generic = GeneratorText("generic")
	const copy = GeneratorCopy(() => {
		const inputs = splitByComma(generic.value.trim())
		let output = '<div class="lt-gt">\n'
		inputs.forEach((input) => {
			output += `\t<span class="type">${input}</span>\n`
		})
		output += "</div>"
		navigator.clipboard.writeText(output)
	})

	addToElement(row, [generic])
	addToElement(generator, [row, copy])

	return generator
}

// <div class="parameter-type">
// 	<span class="parameter">speed</span>
// 	<span class="type">number</span>
// </div>
// <div class="parameter-type">
// 	<span class="parameter" data-optional="true">location</span>
// 	<span class="type">string</span>
// 	<span class="defaults">
// 		<span class="string">home</span>
// 	</span>
// </div>
function ParameterTypedGenerator() {
	const generator = Generator(
		"Parameter Typed",
		"Generates a parameter, for use in a method signature"
	)
	const row = GeneratorRow()

	const parameterName = GeneratorText("parameterName")
	const optionalFlag = GeneratorFlag("optional")
	const colon = GeneratorSpan(":")
	const parameterType = GeneratorText("parameterType")
	const equals = GeneratorSpan("=")
	const defaultValue = GeneratorText("defaultValue")
	const copy = GeneratorCopy(() => {
		let parameterStr = `<div class="parameter-type">
	<span class="parameter"${
		optionalFlag.checkbox.checked ? '  data-optional="true"' : ""
	}>${parameterName.value}</span>
	<span class="type">${parameterType.value}</span>
	<span class="defaults">${primitiveGenerator(defaultValue.value)}</span>
</div>
`
		navigator.clipboard.writeText(parameterStr)
	})

	addToElement(row, [
		parameterName,
		optionalFlag.row,
		colon,
		parameterType,
		equals,
		defaultValue,
	])
	addToElement(generator, [row, copy])

	return generator
}

function AddedClassGenerator() {
	const generator = Generator("Added Class", "Generates a class")
	const row = GeneratorRow()

	const abstract = GeneratorFlag("abstract")
	const className = GeneratorText("className")
	const params = GeneratorSpan("()")
	const colon = GeneratorSpan("extends")
	const baseClass = GeneratorText("baseClass")
	const copy = GeneratorCopy(() => {
		let classStr = `<div class="added">
	${abstract.checkbox.checked ? '<span class="modifier">abstract</span>\n' : ""}
	<span class="class">${className.value}</span>
	<div class="brackets">

	</div>
	<span class="extends">
		<span class="class">${baseClass.value}</span>
	</span>
</div>
`
		navigator.clipboard.writeText(classStr)
	})

	addToElement(row, [abstract.row, className, params, colon, baseClass])
	addToElement(generator, [row, copy])

	return generator
}

// <div class="added">
// 	<span class="modifier"></span> // access modif/static/polymorphism/readonly here
// 	<span class="class">className</span>
// 	<span class="method">methodName</span>
// 	<div class="brackets">
//
//	</div>
// 	<span class="return-type"></span>
// </div>
function AddedMethodGenerator() {
	const generator = Generator(
		"Added Method",
		"Generates a method with no params, use Parameter Typed for params"
	)
	const row = GeneratorRow()

	const modifier = GeneratorSelect(ACCESS_MODIF)
	const staticFlag = GeneratorFlag("static")
	const polymorphism = GeneratorSelect(POLYMORPHISM)
	const readonlyFlag = GeneratorFlag("readonly")
	const className = GeneratorText("className")
	const dot = GeneratorSpan(".")
	const methodName = GeneratorText("methodName")
	const brackets = GeneratorSpan("()")
	const colon = GeneratorSpan(":")
	const returnType = GeneratorText("returnType")
	const copy = GeneratorCopy(() => {
		let accessModifHtml = modifier.value
			? `<span class="modifier">${modifier.value}</span>`
			: ""
		let staticFlagHtml = staticFlag.checkbox.checked
			? `<span class="modifier">static</span>`
			: ""
		let polymorphismHtml = polymorphism.value
			? `<span class="modifier">${polymorphism.value}</span>`
			: ""
		let readonlyFlagHtml = readonlyFlag.checkbox.checked
			? `<span class="modifier">readonly</span>`
			: ""

		let methodStr = `<div class="added">
	${accessModifHtml}
	${staticFlagHtml}
	${polymorphismHtml}
	${readonlyFlagHtml}
	<span class="class">${className.value}</span>
	<span class="method">${methodName.value}</span>
	<div class="brackets">

	</div>
	<span class="return-type">${returnType.value}</span>
</div>
`
		navigator.clipboard.writeText(methodStr)
	})

	addToElement(row, [
		modifier,
		staticFlag.row,
		polymorphism,
		readonlyFlag.row,
		className,
		dot,
		methodName,
		brackets,
		colon,
		returnType,
	])
	addToElement(generator, [row, copy])

	return generator
}

// <div class="added">
// 	<span class="modifier">readonly</span>
// 	<span class="class">Fish</span>
// 	<div class="property-type">
// 		<span class="property" data-readonly="true">gills</span>
// 		<span class="type">boolean</span>
// 		<span class="defaults">
// 			<span class="boolean">true</span>
// 		</span>
// 	</div>
// </div>
function AddedPropertyGenerator() {
	const generator = Generator("Added Property", "Generates a property")
	const row = GeneratorRow()

	// TODO: ADD data-readonly="true" to property if readonlyFlag is checked

	const modifier = GeneratorSelect(ACCESS_MODIF)
	const staticFlag = GeneratorFlag("static")
	const polymorphism = GeneratorSelect(POLYMORPHISM)
	const readonlyFlag = GeneratorFlag("readonly")
	const className = GeneratorText("className")
	const dot = GeneratorSpan(".")
	const propertyName = GeneratorText("propertyName")
	const optionalFlag = GeneratorFlag("optional")
	const colon = GeneratorSpan(":")
	const propertyType = GeneratorText("propertyType")
	const equals = GeneratorSpan("=")
	const defaultValue = GeneratorText("defaultValue")
	const copy = GeneratorCopy(() => {
		let accessModifHtml = modifier.value
			? `<span class="modifier">${modifier.value}</span>`
			: ""
		let staticFlagHtml = staticFlag.checkbox.checked
			? `<span class="modifier">static</span>`
			: ""
		let polymorphismHtml = polymorphism.value
			? `<span class="modifier">${polymorphism.value}</span>`
			: ""
		let readonlyFlagHtml = readonlyFlag.checkbox.checked
			? `<span class="modifier">readonly</span>`
			: ""

		let propertyStr = `<div class="added">
	${accessModifHtml}
	${staticFlagHtml}
	${polymorphismHtml}
	${readonlyFlagHtml}
	<span class="class">${className.value}</span>
	<div class="property-type">
		<span class="property"${
			optionalFlag.checkbox.checked ? '  data-optional="true"' : ""
		}${readonlyFlag.checkbox.checked ? '  data-readonly="true"' : ""}>${
			propertyName.value
		}</span>
		<span class="type">${propertyType.value}</span>
		<span class="defaults">${primitiveGenerator(defaultValue.value)}</span>
	</div>
</div>
`
		navigator.clipboard.writeText(propertyStr)
	})

	addToElement(row, [
		modifier,
		staticFlag.row,
		polymorphism,
		readonlyFlag.row,
		className,
		dot,
		propertyName,
		optionalFlag.row,
		colon,
		propertyType,
		equals,
		defaultValue,
	])
	addToElement(generator, [row, copy])

	return generator
}

function ChangedGenerator() {
	const generator = Generator("Changed", "Generates a changed")
	const row = GeneratorRow()

	const copy = GeneratorCopy(() => {
		let output = `<div class="changed">
	<div class="referrent">

	</div>
	<div class="to">

	</div>
</div>`
		navigator.clipboard.writeText(output)
	})

	addToElement(generator, [row, copy])

	return generator
}

function RemovedGenerator() {
	const generator = Generator("Removed", "Generates a removed")
	const row = GeneratorRow()

	const copy = GeneratorCopy(() => {
		let output = `<div class="removed">
</div>`
		navigator.clipboard.writeText(output)
	})

	addToElement(generator, [row, copy])

	return generator
}

function AccessorGenerator() {
	const generator = Generator("Accessor", "Generates a accessor")
	const row = GeneratorRow()

	const get = GeneratorFlag("get")
	const set = GeneratorFlag("set")
	const copy = GeneratorCopy(() => {
		let output = `
	${get.checkbox.checked ? '<span class="accessor">get</span>' : ""}
	${set.checkbox.checked ? '<span class="accessor">set</span>' : ""}
	`
		navigator.clipboard.writeText(output)
	})

	addToElement(row, [get.row, set.row])
	addToElement(generator, [row, copy])

	return generator
}

function InterfaceGenerator() {
	const generator = Generator("Interface", "Generates a interface")
	const row = GeneratorRow()

	const name = GeneratorText("name")
	const copy = GeneratorCopy(() => {
		let output = `<div class="added">
	<span class="interface">${name.value}</span>
</div>`
		navigator.clipboard.writeText(output)
	})

	addToElement(row, [name])
	addToElement(generator, [row, copy])

	return generator
}

appendToBody(DefaultValueGenerator())
appendToBody(GenericGenerator())
appendToBody(ParameterTypedGenerator())
appendToBody(ChangedGenerator())
appendToBody(RemovedGenerator())
appendToBody(AccessorGenerator())
appendToBody(InterfaceGenerator())
appendToBody(AddedClassGenerator())
appendToBody(AddedMethodGenerator())
appendToBody(AddedPropertyGenerator())
