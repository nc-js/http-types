import { toPascalCase } from '@std/text/to-pascal-case'
import type { ConceptValue } from './concepts.ts'
import { Ietf, UrlLabelProvider, W3Org, Wicg } from './url-labeler.ts'
import { DocBlock } from './docs.ts'

const labelProvider = new UrlLabelProvider([W3Org, Wicg, Ietf])

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
	binarySearch(ForbiddenHttpRequestField, field)

const ForbiddenHttpRequestField = [
	'Accept-Charset',
	'Accept-Encoding',
	'Access-Control-Request-Headers',
	'Access-Control-Request-Method',
	'Connection',
	'Content-Length',
	'Cookie',
	'DNT',
	'Date',
	'Expect',
	'Feature-Policy',
	'Host',
	'Keep-Alive',
	'Origin',
	'Referer',
	'TE',
	'Trailer',
	'Transfer-Encoding',
	'Upgrade',
	'Via',
]

const binarySearch = (items: string[], target: string): boolean => {
	let left = 0
	let right = items.length - 1

	while (left <= right) {
		const mid = Math.floor((left + right) / 2)
		const midValue = items[mid]

		if (midValue === target) {
			return true
		} else if (midValue < target) {
			left = mid + 1
		} else {
			right = mid - 1
		}
	}

	return false
}
