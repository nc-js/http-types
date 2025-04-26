import { toPascalCase } from '@std/text'
import { union } from '@nc/typegen/composite'
import { alias, exclude, exportThis } from '@nc/typegen/types'
import { singleQuoteLit } from '@nc/typegen/strings'
import {
	aliasWithDocBlock,
	appendTextFile,
	generate,
} from './utils/generator.ts'
import { DocBlock } from './utils/docs.ts'
import { httpDocs, isForbiddenRequestField } from './utils/http.ts'

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

		allFields(destPath, fieldTypes)
		forbiddenRequestField(destPath, forbiddenRequestFields)
		forbiddenResponseField(destPath)
		requestResponseFields(destPath)
	},
})

function allFields(destPath: string, fields: string[]): void {
	const fieldUnion = exportThis(alias(
		'HttpField',
		union(fields, 0),
		true,
	))
	appendTextFile(
		destPath,
		aliasWithDocBlock(
			new DocBlock(
				'Key-value pairs attached as metadata to an HTTP request or response',
			),
			fieldUnion,
		) +
			'\n\n',
	)
}

function forbiddenRequestField(destPath: string, fields: string[]): void {
	const forbiddenRequestFieldUnion = exportThis(alias(
		'HttpForbiddenRequestField',
		union(fields, 0),
		true,
	))
	appendTextFile(
		destPath,
		aliasWithDocBlock(
			new DocBlock(
				'HTTP fields forbidden from usage in HTTP requests',
			),
			forbiddenRequestFieldUnion,
		) + '\n',
	)
}

function forbiddenResponseField(destPath: string): void {
	const forbiddenResponseField = exportThis(alias(
		'HttpForbiddenResponseField',
		union([
			'HttpHeaderSetCookie',
			'HttpHeaderSetCookie2',
		]),
	))
	appendTextFile(
		destPath,
		aliasWithDocBlock(
			new DocBlock(
				'HTTP fields forbidden from usage in HTTP responses',
			),
			forbiddenResponseField,
		) + '\n',
	)
}

function requestResponseFields(destPath: string): void {
	const requestField = exportThis(alias(
		'HttpRequestField',
		exclude(union(['HttpField']), union(['HttpForbiddenRequestField'])),
	))
	appendTextFile(
		destPath,
		aliasWithDocBlock(
			new DocBlock(
				'HTTP fields allowed for using within HTTP requests',
			),
			requestField,
		) + '\n',
	)

	const responseField = exportThis(alias(
		'HttpResponseField',
		exclude(union(['HttpField']), union(['HttpForbiddenResponseField'])),
	))
	appendTextFile(
		destPath,
		aliasWithDocBlock(
			new DocBlock(
				'HTTP fields allowed for using within HTTP responses',
			),
			responseField,
		) + '\n',
	)
}
