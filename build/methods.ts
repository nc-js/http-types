import { union } from '@nc/typegen/composite'
import { alias, exportThis } from '@nc/typegen/types'
import { singleQuoteLit } from '@nc/typegen/strings'
import {
	aliasWithDocBlock,
	appendTextFile,
	generate,
} from './utils/generator.ts'
import { getMethodTypeName, httpDocs } from './utils/http.ts'
import { DocBlock } from './utils/docs.ts'

generate({
	path: 'methods.ts',
	conceptIdent: 'http-method',
	conceptName: 'HTTP methods',

	generateFn: (destPath, concept): void => {
		const types: string[] = []
		for (const conceptValue of concept.values) {
			// actual name and type alias name
			const methodName = conceptValue.value
			const methodTypeName = `HttpMethod${getMethodTypeName(methodName)}`
			types.push(methodTypeName)

			const typeAlias = exportThis(
				alias(methodTypeName, singleQuoteLit(methodName)),
			)
			const docBlock = httpDocs(conceptValue)
			appendTextFile(destPath, aliasWithDocBlock(docBlock, typeAlias))
		}

		const exportedAlias = exportThis(
			alias('HttpMethod', union(types, 0), true),
		)
		appendTextFile(
			destPath,
			aliasWithDocBlock(
				new DocBlock('HTTP verbs that carry semantics for a request'),
				exportedAlias,
			) +
				'\n',
		)
	},
})
