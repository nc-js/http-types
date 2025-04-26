import type { IsExact } from '@std/testing/types'
import { assertType } from '@std/testing/types'
import type {
	HttpClientStatusCode,
	HttpInfoStatusCode,
	HttpRedirectStatusCode,
	HttpServerStatusCode,
	HttpSuccessStatusCode,
} from './status-codes.ts'

// sanity tests below
Deno.test('info status codes - 1xx', () => {
	assertType<IsExact<HttpInfoStatusCode, 100 | 101 | 102 | 103>>(true)
})

// deno-fmt-ignore
Deno.test('success status codes - 2xx', () => {
	assertType<
		IsExact<
			HttpSuccessStatusCode,
			| 200 | 201 | 202 | 203 | 204
			| 205 | 206 | 207 | 208 | 226
		>
	>(true)
})

// deno-fmt-ignore
Deno.test('redirect status codes - 3xx', () => {
	assertType<
		IsExact<
			HttpRedirectStatusCode,
			| 300 | 301 | 302 | 303 | 304
			| 305 | 306 | 307 | 308
		>
	>(true)
})

// deno-fmt-ignore
Deno.test('client status codes - 4xx', () => {
	assertType<
		IsExact<
			HttpClientStatusCode,
			| 400 | 401 | 402 | 403 | 404
			| 405 | 406 | 407 | 408 | 409
			| 410 | 411 | 412 | 413 | 414
			| 415 | 416 | 417 | 418 | 421
			| 422 | 423 | 424 | 425 | 426
			| 428 | 429 | 431 | 451
		>
	>(true)
})

// deno-fmt-ignore
Deno.test('server status codes - 5xx', () => {
	assertType<
		IsExact<
			HttpServerStatusCode,
			| 500 | 501 | 502 | 503 | 504
			| 505 | 506 | 507 | 508 | 510
			| 511
		>
	>(true)
})
