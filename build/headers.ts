import { toPascalCase } from '@std/text'
import { union } from '@nc/typegen/composite'
import { alias, exportThis } from '@nc/typegen/types'
import { singleQuoteLit } from '@nc/typegen/strings'
import { appendTextFile, generate } from './utils/generator.ts'
import { httpDocs, isForbiddenRequestHeader } from './utils/http.ts'

generate({
	path: 'headers.ts',
	conceptIdent: 'http-header',
	conceptName: 'HTTP headers',

	generateFn: (destPath, concept): void => {
		const headerTypes: string[] = []
		const forbiddenRequestHeaders: string[] = []

		for (const conceptValue of concept.values) {
			const headerName = toPascalCase(conceptValue.value)
			const headerTypeName = `HttpHeader${headerName}`
			headerTypes.push(headerTypeName)

			const typeAlias = exportThis(
				alias(headerTypeName, singleQuoteLit(headerName)),
			)

			if (isForbiddenRequestHeader(headerName)) {
				forbiddenRequestHeaders.push(headerName)
			}

			const docBlock = httpDocs(conceptValue)
			appendTextFile(destPath, `${docBlock}\n${typeAlias}\n\n`)
		}

		const topAlias = exportThis(alias(
			'HttpHeader',
			union(headerTypes, 0),
			true,
		))
		appendTextFile(destPath, topAlias + '\n')
	},
})
