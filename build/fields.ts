import { toPascalCase } from '@std/text'
import { union } from '@nc/typegen/composite'
import { alias, exclude, exportThis } from '@nc/typegen/types'
import { singleQuoteLit, type Stringable } from '@nc/typegen/strings'
import {
	aliasWithDocBlock,
	appendTextFile,
	generate,
} from './utils/generator.ts'
import { DocBlock } from './utils/docs.ts'
import { httpDocs, isForbiddenRequestField } from './utils/http.ts'

type AliasRecord = {
	summary: string
	definition: Stringable | ((types: string[]) => string)
}

type AliasName =
	| 'HttpField'
	| 'HttpRequestField'
	| 'HttpResponseField'
	| 'HttpForbiddenRequestField'
	| 'HttpForbiddenResponseField'

const aliases: Record<AliasName, AliasRecord> = {
	HttpField: {
		summary:
			'Key-value pairs attached as metadata to an HTTP request or response',
		definition: (types) => union(types, 0),
	},
	HttpForbiddenRequestField: {
		summary: 'HTTP fields forbidden from usage in HTTP requests',
		definition: (types) => union(types, 0),
	},
	HttpForbiddenResponseField: {
		summary: 'HTTP fields forbidden from usage in HTTP responses',
		definition: union([
			'HttpFieldSetCookie',
			'HttpFieldSetCookie2',
		]),
	},
	HttpRequestField: {
		summary: 'HTTP fields allowed for using within HTTP requests',
		definition: exclude(
			union(['HttpField']),
			union(['HttpForbiddenRequestField']),
		),
	},
	HttpResponseField: {
		summary: 'HTTP fields allowed for using within HTTP responses',
		definition: exclude(
			union(['HttpField']),
			union(['HttpForbiddenResponseField']),
		),
	},
}

function topAliases(
	destPath: string,
	fields: string[],
	forbiddenRequestFields: string[],
) {
	Object.entries(aliases).forEach((entry) => {
		const [key, value] = entry
		let definition: Stringable

		if (typeof value.definition === 'function') {
			const inputTypes = key === 'HttpForbiddenRequestField'
				? forbiddenRequestFields
				: fields
			definition = value.definition(inputTypes)
		} else {
			definition = value.definition
		}

		appendTextFile(
			destPath,
			aliasWithDocBlock(
				new DocBlock(value.summary),
				exportThis(alias(key, definition)),
			),
		)
	})
}

generate({
	path: 'fields.ts',
	conceptIdent: 'http-header',
	conceptName: 'HTTP fields',

	generateFn: (destPath, concept): void => {
		const fieldTypes: string[] = []
		const forbiddenRequestFields: string[] = []

		for (const conceptValue of concept.values) {
			const fieldName = conceptValue.value
			const fieldTypeName = `HttpField${toPascalCase(fieldName)}`
			fieldTypes.push(fieldTypeName)

			const typeAlias = exportThis(
				alias(fieldTypeName, singleQuoteLit(fieldName)),
			)

			if (isForbiddenRequestField(fieldName)) {
				forbiddenRequestFields.push(fieldTypeName)
			}

			const docBlock = httpDocs(conceptValue)
			appendTextFile(destPath, aliasWithDocBlock(docBlock, typeAlias))
		}

		topAliases(destPath, fieldTypes, forbiddenRequestFields)
	},
})
