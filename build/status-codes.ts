import { union } from '@nc/typegen/composite'
import { alias, exportThis } from '@nc/typegen/types'
import { httpDocs } from './utils/http.ts'
import { appendTextFile, generate } from './utils/generator.ts'

type Digit = '1' | '2' | '3' | '4' | '5'

function aliasCode(
	kind: string,
	types: string[],
	newlines: number = 2,
): string {
	return exportThis(
		alias(`Http${kind}StatusCode`, union(types, 0), true),
	) + '\n'.repeat(newlines)
}

generate({
	path: 'status-codes.ts',
	conceptIdent: 'http-status-code',
	conceptName: 'HTTP status codes',

	generateFn: (destPath, concept): void => {
		const codes: string[] = []
		const categorized: Record<Digit, string[]> = {
			'1': [],
			'2': [],
			'3': [],
			'4': [],
			'5': [],
		}

		for (const conceptValue of concept.values) {
			const statusCodeName = conceptValue.value
			const statusCodeTypeName = `HttpStatusCode${statusCodeName}`
			codes.push(statusCodeTypeName)
			const typeAlias = exportThis(
				alias(statusCodeTypeName, statusCodeName),
			)
			const docBlock = httpDocs(conceptValue)
			appendTextFile(destPath, `${docBlock}\n${typeAlias}\n\n`)

			const digit = statusCodeName[0]
			switch (digit) {
				case '1':
					categorized['1'].push(statusCodeTypeName)
					break
				case '2':
					categorized['2'].push(statusCodeTypeName)
					break
				case '3':
					categorized['3'].push(statusCodeTypeName)
					break
				case '4':
					categorized['4'].push(statusCodeTypeName)
					break
				case '5':
					categorized['5'].push(statusCodeTypeName)
					break
			}
		}

		appendTextFile(destPath, aliasCode('Info', categorized[1]))
		appendTextFile(destPath, aliasCode('Success', categorized[2]))
		appendTextFile(destPath, aliasCode('Redirect', categorized[3]))
		appendTextFile(destPath, aliasCode('Client', categorized[4]))
		appendTextFile(destPath, aliasCode('Server', categorized[5]))
		appendTextFile(
			destPath,
			aliasCode('', [
				'HttpInfoStatusCode',
				'HttpSuccessStatusCode',
				'HttpRedirectStatusCode',
				'HttpClientStatusCode',
				'HttpServerStatusCode',
			], 1),
		)
	},
})
