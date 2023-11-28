const GENERATORS = ["Added", "Removed", "Changed"]

const ACCESS_MODIF = ["private", "protected"]
// static flag here
const POLYMORPHISM = [
	// smh ts doesn't have virtual
	"abstract",
	"override",
]
// readonly flag here

const appendChild = document.body.appendChild.bind(document.body)

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
	const id =
		name.toLowerCase() +
		"-flag" +
		Math.random().toString(36).substring(2, 9)

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

	return { row: row, checkbox: checkbox }
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

	row.appendChild(value)
	generator.appendChild(row)
	generator.appendChild(copy)

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

	row.appendChild(generic)
	generator.appendChild(row)
	generator.appendChild(copy)

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
	const optionalFlag = GeneratorFlag("optional", "Optional")
	const colon = GeneratorSpan(":")
	const parameterType = GeneratorText("parameterType")
	const equals = GeneratorSpan("=")
	const defaultValue = GeneratorText("defaultValue")
	const copy = GeneratorCopy(() => {
		let parameterStr =
			'\t<div class="parameter-type">\n' +
			'\t\t<span class="parameter"' +
			(optionalFlag.checkbox.checked ? '  data-optional="true">' : ">") +
			parameterName.value +
			"</span>\n" +
			'\t\t<span class="type">' +
			parameterType.value +
			"</span>\n" +
			'\t\t<span class="defaults">' +
			primitiveGenerator(defaultValue.value) +
			"</span>\n" +
			"\t</div>"
		navigator.clipboard.writeText(parameterStr)
	})

	row.appendChild(parameterName)
	row.appendChild(optionalFlag.row)
	row.appendChild(colon)
	row.appendChild(parameterType)
	row.appendChild(equals)
	row.appendChild(defaultValue)
	generator.appendChild(row)
	generator.appendChild(copy)

	return generator
}

function AddedClassGenerator() {
	const generator = Generator("Added Class", "Generates a class")
	const row = GeneratorRow()

	const abstract = GeneratorFlag("abstract", "Abstract")
	const className = GeneratorText("className")
	const params = GeneratorSpan("()")
	const colon = GeneratorSpan("extends")
	const baseClass = GeneratorText("baseClass")
	const copy = GeneratorCopy(() => {
		let classStr =
			'<div class="added">\n' +
			'\t<span class="class">' +
			className.value +
			"</span>\n" +
			'\t<div class="brackets">\n\n' +
			"\t</div>\n" +
			'\t<span class="extends">\n' +
			'\t\t<span class="class">' +
			baseClass.value +
			"</span>\n" +
			"\t</span>\n" +
			"</div>"
		navigator.clipboard.writeText(classStr)
	})

	row.appendChild(abstract.row)
	row.appendChild(className)
	row.appendChild(params)
	row.appendChild(colon)
	row.appendChild(baseClass)
	generator.appendChild(row)
	generator.appendChild(copy)

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
	const staticFlag = GeneratorFlag("static", "Static")
	const polymorphism = GeneratorSelect(POLYMORPHISM)
	const readonlyFlag = GeneratorFlag("readonly", "Readonly")
	const className = GeneratorText("className")
	const dot = GeneratorSpan(".")
	const methodName = GeneratorText("methodName")
	const brackets = GeneratorSpan("()")
	const colon = GeneratorSpan(":")
	const returnType = GeneratorText("returnType")
	const copy = GeneratorCopy(() => {
		let accessModifHtml = modifier.value
			? `\t<span class="modifier">${modifier.value}</span>\n`
			: ""
		let staticFlagHtml = staticFlag.checkbox.checked
			? `\t<span class="modifier">static</span>\n`
			: ""
		let polymorphismHtml = polymorphism.value
			? `\t<span class="modifier">${polymorphism.value}</span>\n`
			: ""
		let readonlyFlagHtml = readonlyFlag.checkbox.checked
			? `\t<span class="modifier">readonly</span>\n`
			: ""

		let methodStr =
			'<div class="added">\n' +
			accessModifHtml +
			staticFlagHtml +
			polymorphismHtml +
			readonlyFlagHtml +
			'\t<span class="class">' +
			className.value +
			"</span>\n" +
			'\t<span class="method">' +
			methodName.value +
			"</span>\n" +
			'\t<div class="brackets">\n\n' +
			"\t</div>\n" +
			'\t<span class="return-type">' +
			returnType.value +
			"</span>\n" +
			"</div>"
		navigator.clipboard.writeText(methodStr)
	})

	row.appendChild(modifier)
	row.appendChild(staticFlag.row)
	row.appendChild(polymorphism)
	row.appendChild(readonlyFlag.row)
	row.appendChild(className)
	row.appendChild(dot)
	row.appendChild(methodName)
	row.appendChild(brackets)
	row.appendChild(colon)
	row.appendChild(returnType)
	generator.appendChild(row)
	generator.appendChild(copy)

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
	const staticFlag = GeneratorFlag("static", "Static")
	const polymorphism = GeneratorSelect(POLYMORPHISM)
	const readonlyFlag = GeneratorFlag("readonly", "Readonly")
	const className = GeneratorText("className")
	const dot = GeneratorSpan(".")
	const propertyName = GeneratorText("propertyName")
	const optionalFlag = GeneratorFlag("optional", "Optional")
	const colon = GeneratorSpan(":")
	const propertyType = GeneratorText("propertyType")
	const equals = GeneratorSpan("=")
	const defaultValue = GeneratorText("defaultValue")
	const copy = GeneratorCopy(() => {
		let accessModifHtml = modifier.value
			? `\t<span class="modifier">${modifier.value}</span>\n`
			: ""
		let staticFlagHtml = staticFlag.checkbox.checked
			? `\t<span class="modifier">static</span>\n`
			: ""
		let polymorphismHtml = polymorphism.value
			? `\t<span class="modifier">${polymorphism.value}</span>\n`
			: ""
		let readonlyFlagHtml = readonlyFlag.checkbox.checked
			? `\t<span class="modifier">readonly</span>\n`
			: ""

		let propertyStr =
			'<div class="added">\n' +
			accessModifHtml +
			staticFlagHtml +
			polymorphismHtml +
			readonlyFlagHtml +
			'\t<span class="class">' +
			className.value +
			"</span>\n" +
			'\t<div class="property-type">\n' +
			'\t\t<span class="property"' +
			(optionalFlag.checkbox.checked ? '  data-optional="true">' : ">") +
			propertyName.value +
			"</span>\n" +
			'\t\t<span class="type">' +
			propertyType.value +
			"</span>\n" +
			'\t\t<span class="defaults">' +
			primitiveGenerator(defaultValue.value) +
			"</span>\n" +
			"\t</div>\n" +
			"</div>"
		navigator.clipboard.writeText(propertyStr)
	})

	row.appendChild(modifier)
	row.appendChild(staticFlag.row)
	row.appendChild(polymorphism)
	row.appendChild(readonlyFlag.row)
	row.appendChild(className)
	row.appendChild(dot)
	row.appendChild(propertyName)
	row.appendChild(optionalFlag.row)
	row.appendChild(colon)
	row.appendChild(propertyType)
	row.appendChild(equals)
	row.appendChild(defaultValue)
	generator.appendChild(row)
	generator.appendChild(copy)

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

	generator.appendChild(row)
	generator.appendChild(copy)

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

	generator.appendChild(row)
	generator.appendChild(copy)

	return generator
}
appendChild(DefaultValueGenerator())
appendChild(GenericGenerator())
appendChild(ParameterTypedGenerator())
appendChild(ChangedGenerator())
appendChild(RemovedGenerator())
appendChild(AddedClassGenerator())
appendChild(AddedMethodGenerator())
appendChild(AddedPropertyGenerator())
