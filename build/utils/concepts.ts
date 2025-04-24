/**
 * All types below are described by the informal JSON schema
 * defined by https://webconcepts.info/JSON-concepts
 */

export type Concept = {
	/**
	 * the concept’s name as it is referred to in the source data
	 */
	concept: string
	/**
	 * the concept identifier (a URI) which can be used as a URI
	 * in a browser, and is also used to identify the concept
	 * in JSON data
	 */
	id: URL
	/**
	 * the singular version of the concept’s human-readable name
	 */
	'name-singular': string
	/**
	 * the plural version of the concept’s human-readable name
	 */
	'name-plural': string
	/**
	 * identifies a registry of all well-known values, if such
	 * a registry exists
	 */
	registry?: URL
	/**
	 * an array of all known values for the concept
	 */
	values: ConceptValue[]
}

export type ConceptValue = {
	/**
	 * The concept value itself
	 */
	value: string
	/**
	 * The identifier of the concept that the value is defined for
	 */
	concept: URL
	/**
	 * the value identifier (a URI) which can be used as a URI in
	 * a browser, and is also used to identify the value in JSON
	 * data.
	 */
	id: URL
	/**
	 * An array of all known descriptions of the value
	 */
	details: ConceptValueDetail[]
}

export type ConceptValueDetail = {
	/**
	 * A human-readable text snippet that describes the value
	 */
	description: string
	/**
	 * a URI identifying the documentation where the concept
	 * value is defined for
	 */
	documentation: string
	/**
	 * the identifier of the specification from which the
	 * definition and documentation have been harvested
	 */
	specification: string
	/**
	 * a short human-readable name for the specification that
	 * can be used when linking to the documentation
	 */
	'spec-name': string
}
