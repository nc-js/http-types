import wordWrap from 'npm:word-wrap'

export class DocBlock {
	public summary: string
	public tags: string[]

	public constructor(summary: string = '', tags: string[] = []) {
		this.summary = summary
		this.tags = tags
	}

	public pushTag(tag: string, value?: string): void {
		typeof value === 'string'
			? this.tags.push(`@${tag} ${value}`)
			: this.tags.push(`@${tag}`)
	}

	public see(link: URL, label: string): void {
		this.pushTag('see', `{@link ${link} | ${label}}`)
	}

	private formatSummary(): string {
		return wordWrap(this.summary, { width: 60, indent: ' * ', trim: true })
	}

	public toString(): string {
		const docs = []

		docs.push('/**')
		docs.push(this.formatSummary())
		if (this.tags.length !== 0) {
			docs.push(' * ')
			this.tags.map((tag) => docs.push(` * ${tag}`))
		}
		docs.push(' */')

		return docs.join('\n')
	}
}
