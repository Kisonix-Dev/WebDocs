function addCopyButtons() {
	const codeBlocks = document.querySelectorAll('pre code')

	codeBlocks.forEach(codeBlock => {
		const container = document.createElement('div')
		container.className = 'code-block-container'

		codeBlock.parentNode.insertBefore(container, codeBlock)
		container.appendChild(codeBlock)

		const copyButton = document.createElement('button')
		copyButton.className = 'copy-button'
		copyButton.textContent = 'Copy'
		copyButton.setAttribute('aria-label', 'Copy code to clipboard')

		container.appendChild(copyButton)

		copyButton.addEventListener('click', async () => {
			try {
				await navigator.clipboard.writeText(codeBlock.textContent)

				copyButton.textContent = 'Copied!'
				copyButton.classList.add('copied')

				setTimeout(() => {
					copyButton.textContent = 'Copy'
					copyButton.classList.remove('copied')
				}, 2000)
			} catch (err) {
				console.error('Failed to copy text: ', err)
				copyButton.textContent = 'Error'

				setTimeout(() => {
					copyButton.textContent = 'Copy'
				}, 2000)
			}
		})
	})
}

document.addEventListener('DOMContentLoaded', addCopyButtons)
