class Search {
	constructor() {
		this.searchToggle = document.getElementById('searchToggle')
		this.searchInput = document.getElementById('searchInput')
		this.closeSearch = document.getElementById('closeSearch')
		this.searchResults = document.getElementById('searchResults')
		this.searchInputContainer = document.querySelector(
			'.search-input-container'
		)
		this.currentHighlights = []
		this.currentMatchIndex = -1

		if (this.isSearchAvailable()) {
			this.init()
		}
	}

	isSearchAvailable() {
		return (
			this.searchToggle &&
			this.searchInput &&
			this.closeSearch &&
			this.searchResults &&
			this.searchInputContainer
		)
	}

	init() {
		this.setupEventListeners()
	}

	setupEventListeners() {
		if (this.searchToggle) {
			this.searchToggle.addEventListener('click', () => {
				this.toggleSearch()
			})
		}

		if (this.closeSearch) {
			this.closeSearch.addEventListener('click', () => {
				this.closeSearchPanel()
			})
		}

		if (this.searchInput) {
			this.searchInput.addEventListener('input', e => {
				this.handleSearch(e.target.value)
			})

			this.searchInput.addEventListener('keypress', e => {
				if (e.key === 'Enter') {
					this.performSearch(this.searchInput.value)
					if (this.searchResults) {
						this.searchResults.classList.remove('active')
					}
				}
			})
		}

		document.addEventListener('keydown', e => {
			if (e.key === 'Escape') {
				this.closeSearchPanel()
			}

			if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
				e.preventDefault()
				this.openSearchPanel()
			}

			if (e.key === 'F3') {
				e.preventDefault()
				if (this.searchInput && this.searchInput.value) {
					this.navigateToNextMatch(!e.shiftKey)
				}
			}
		})

		document.addEventListener('click', e => {
			if (
				this.searchInputContainer &&
				this.searchInputContainer.classList.contains('active') &&
				!this.searchInputContainer.contains(e.target) &&
				!(this.searchToggle && this.searchToggle.contains(e.target)) &&
				!(this.searchResults && this.searchResults.contains(e.target))
			) {
				this.closeSearchPanel()
			}
		})
	}

	toggleSearch() {
		if (!this.searchInputContainer) return

		this.searchInputContainer.classList.toggle('active')
		if (this.searchInputContainer.classList.contains('active')) {
			this.searchInput?.focus()
		} else {
			this.closeSearchPanel()
		}
	}

	openSearchPanel() {
		if (!this.searchInputContainer || !this.searchInput) return

		this.searchInputContainer.classList.add('active')
		this.searchInput.focus()
		this.searchInput.select()
	}

	closeSearchPanel() {
		if (!this.searchInputContainer || !this.searchInput) return

		this.searchInputContainer.classList.remove('active')
		this.searchInput.value = ''

		if (this.searchResults) {
			this.searchResults.classList.remove('active')
			this.searchResults.innerHTML = ''
		}

		this.searchInput.blur()
		this.removeHighlights()
		this.currentHighlights = []
		this.currentMatchIndex = -1
	}

	handleSearch(query) {
		if (!this.searchResults) return

		if (query.length < 2) {
			this.searchResults.innerHTML = ''
			this.searchResults.classList.remove('active')
			this.removeHighlights()
			this.currentHighlights = []
			this.currentMatchIndex = -1
			return
		}

		const results = this.searchInContent(query)
		this.displayResults(results, query)
	}

	searchInContent(query) {
		const content = document.querySelector('.content') || document.body
		if (!content) return []

		const text = content.textContent.toLowerCase()
		const queryLower = query.toLowerCase()

		if (text.includes(queryLower)) {
			return [
				{
					type: 'page_content',
					title: 'Text found on this page',
					content: this.extractSnippet(content.textContent, query),
					element: content,
				},
			]
		}

		return []
	}

	extractSnippet(text, query) {
		const index = text.toLowerCase().indexOf(query.toLowerCase())
		if (index === -1) return ''

		const start = Math.max(0, index - 50)
		const end = Math.min(text.length, index + query.length + 50)

		let snippet = text.substring(start, end)
		if (start > 0) snippet = '...' + snippet
		if (end < text.length) snippet = snippet + '...'

		return snippet
	}

	displayResults(results, query) {
		if (!this.searchResults) return

		this.searchResults.innerHTML = ''

		if (results.length === 0) {
			this.searchResults.innerHTML = `
				<div class="search-result-item">
					<p>No results found for "${query}"</p>
				</div>
			`
			this.searchResults.classList.add('active')
			return
		}

		results.forEach(result => {
			const resultElement = document.createElement('div')
			resultElement.className = 'search-result-item'
			resultElement.innerHTML = `
				<h4>${result.title}</h4>
				<p>${this.highlightText(result.content, query)}</p>
			`

			resultElement.addEventListener('click', () => {
				this.performSearch(query)
				if (this.searchResults) {
					this.searchResults.classList.remove('active')
				}
			})

			this.searchResults.appendChild(resultElement)
		})

		this.searchResults.classList.add('active')
	}

	highlightText(text, query) {
		const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi')
		return text.replace(regex, '<span class="search-highlight">$1</span>')
	}

	escapeRegex(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	}

	performSearch(query) {
		if (!query.trim()) return
		this.removeHighlights()
		this.highlightAllMatches(query)
		this.navigateToNextMatch(true)
	}

	highlightAllMatches(query) {
		const content = document.querySelector('.content') || document.body
		if (!content) return false

		this.removeHighlights()

		const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
			acceptNode: node =>
				node.parentNode.nodeName !== 'SCRIPT' &&
				node.parentNode.nodeName !== 'STYLE' &&
				node.textContent.trim().length > 0
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_REJECT,
		})

		const regex = new RegExp(this.escapeRegex(query), 'gi')
		const highlights = []

		while (walker.nextNode()) {
			const node = walker.currentNode
			const text = node.textContent

			if (regex.test(text)) {
				const parent = node.parentNode
				const matches = []
				let match

				regex.lastIndex = 0
				while ((match = regex.exec(text)) !== null) {
					matches.push({
						index: match.index,
						length: match[0].length,
					})
				}

				const fragment = document.createDocumentFragment()
				let lastIndex = 0

				matches.forEach(match => {
					if (match.index > lastIndex) {
						fragment.appendChild(
							document.createTextNode(text.substring(lastIndex, match.index))
						)
					}

					const highlight = document.createElement('span')
					highlight.className = 'search-highlight'
					highlight.textContent = text.substring(
						match.index,
						match.index + match.length
					)
					fragment.appendChild(highlight)
					highlights.push(highlight)

					lastIndex = match.index + match.length
				})

				if (lastIndex < text.length) {
					fragment.appendChild(
						document.createTextNode(text.substring(lastIndex))
					)
				}

				parent.replaceChild(fragment, node)
			}
		}

		this.currentHighlights = highlights
		this.currentMatchIndex = -1
		return highlights.length > 0
	}

	navigateToNextMatch(forward = true) {
		if (this.currentHighlights.length === 0) return

		if (forward) {
			this.currentMatchIndex =
				(this.currentMatchIndex + 1) % this.currentHighlights.length
		} else {
			this.currentMatchIndex =
				(this.currentMatchIndex - 1 + this.currentHighlights.length) %
				this.currentHighlights.length
		}

		const currentMatch = this.currentHighlights[this.currentMatchIndex]

		this.currentHighlights.forEach(highlight => {
			highlight.classList.remove('search-highlight-active')
		})

		currentMatch.classList.add('search-highlight-active')

		currentMatch.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'nearest',
		})

		this.searchInput?.focus()
	}

	removeHighlights() {
		const highlights = document.querySelectorAll('.search-highlight')
		highlights.forEach(highlight => {
			const parent = highlight.parentNode
			if (parent) {
				const text = document.createTextNode(highlight.textContent)
				parent.replaceChild(text, highlight)
			}
		})

		this.currentHighlights = []
		this.currentMatchIndex = -1
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new Search()
})
