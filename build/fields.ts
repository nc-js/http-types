import { toPascalCase } from '@std/text'
import { union } from '@nc/typegen/composite'
import { alias, exportThis } from '@nc/typegen/types'
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

		const fieldUnion = exportThis(alias(
			'HttpField',
			union(fieldTypes, 0),
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

		const forbiddenRequestFieldUnion = exportThis(alias(
			'HttpForbiddenRequestField',
			union(forbiddenRequestFields, 0),
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
	},
})
