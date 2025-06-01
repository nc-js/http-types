import { toPascalCase } from '@std/text/to-pascal-case'
import type { ConceptValue } from './concepts.ts'
import { UrlLabelProvider } from './url-labeler.ts'
import { DocBlock } from './docs.ts'

const labelProvider = new UrlLabelProvider()
export const httpDocs = (conceptValue: ConceptValue): DocBlock => {
	const docBlock = new DocBlock()
	docBlock.summary = conceptValue.details[0].description

	for (const detail of conceptValue.details) {
		docBlock.see(
			new URL(detail.documentation),
			`Documentation → ${labelProvider.provideLabel(detail, true)}`,
		)
	}

	return docBlock
}

export const getMethodTypeName = (method: string): string => {
	switch (method) {
		case 'MKACTIVITY':
			return 'MkActivity'
		case 'MKCALENDAR':
			return 'MkCalendar'
		case 'MKCOL':
			return 'MkCol'
		case 'MKREDIRECTREF':
			return 'MkRedirectRef'
		case 'MKWORKSPACE':
			return 'MkWorkspace'
		case 'ORDERPATCH':
			return 'OrderPatch'
		case 'PROPFIND':
			return 'PropFind'
		case 'PROPPATCH':
			return 'PropPatch'
		case 'UPDATEREDIRECTREF':
			return 'UpdateRedirectRef'
		default:
			return toPascalCase(method.toLowerCase())
	}
}

export const isForbiddenRequestField = (field: string): boolean =>
	field.startsWith('Proxy') ||
	field.startsWith('Sec') ||
	/X(-HTTP)?-(Connect|Trace|Track)-Method(-Override)?/i.test(field) ||
	ForbiddenHttpRequestField.has(field)

const ForbiddenHttpRequestField = new Map([
	['Accept-Charset', true],
	['Accept-Encoding', true],
	['Access-Control-Request-Headers', true],
	['Access-Control-Request-Method', true],
	['Connection', true],
	['Content-Length', true],
	['Cookie', true],
	['DNT', true],
	['Date', true],
	['Expect', true],
	['Host', true],
	['Keep-Alive', true],
	['Origin', true],
	['Permissions-Policy', true],
	['Referer', true],
	['TE', true],
	['Trailer', true],
	['Transfer-Encoding', true],
	['Upgrade', true],
	['Via', true],
])
