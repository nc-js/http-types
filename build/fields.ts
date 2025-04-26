import { toPascalCase } from '@std/text'
import { union } from '@nc/typegen/composite'
import { alias, exportThis } from '@nc/typegen/types'
import { singleQuoteLit } from '@nc/typegen/strings'
import { appendTextFile, generate } from './utils/generator.ts'
import { httpDocs, isForbiddenRequestField } from './utils/http.ts'

generate({
	path: 'fields.ts',
	conceptIdent: 'http-header',
	conceptName: 'HTTP fields',

	generateFn: (destPath, concept): void => {
		const fieldTypes: string[] = []
		const forbiddenRequestFields: string[] = []

		for (const conceptValue of concept.values) {
			const fieldName = toPascalCase(conceptValue.value)
			const fieldTypeName = `HttpField${fieldName}`
			fieldTypes.push(fieldTypeName)

			const typeAlias = exportThis(
				alias(fieldTypeName, singleQuoteLit(fieldName)),
			)

			if (isForbiddenRequestField(fieldName)) {
				forbiddenRequestFields.push(fieldName)
			}

			const docBlock = httpDocs(conceptValue)
			appendTextFile(destPath, `${docBlock}\n${typeAlias}\n\n`)
		}

		const topAlias = exportThis(alias(
			'HttpField',
			union(fieldTypes, 0),
			true,
		))
		appendTextFile(destPath, topAlias + '\n')
	},
})
