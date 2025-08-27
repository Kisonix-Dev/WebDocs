class GlobalSettings {
	constructor() {
		this.init()
	}

	init() {
		this.applySavedSettings()
		this.bindEvents()
	}

	applySavedSettings() {
		const fontSize = localStorage.getItem('fontSize') || '16px'
		const lineHeight = localStorage.getItem('lineHeight') || '1.6'
		const disableAnimations =
			localStorage.getItem('disableAnimations') === 'true'
		const focusMode = localStorage.getItem('focusMode') === 'true'

		this.applyStyles(fontSize, lineHeight, disableAnimations, focusMode)
	}

	applyStyles(fontSize, lineHeight, disableAnimations, focusMode) {
		const body = document.body

		this.removeClasses(body, ['font-', 'line-', 'no-animations', 'focus-mode'])

		body.classList.add(`font-${this.getSizeClass(fontSize)}`)

		body.classList.add(`line-${this.getLineHeightClass(lineHeight)}`)

		if (disableAnimations) {
			body.classList.add('no-animations')
		}

		if (focusMode) {
			body.classList.add('focus-mode')
		}
	}

	bindEvents() {
		const settingsTrigger = document.getElementById('settingsTrigger')
		const settingsPanel = document.getElementById('settingsPanel')
		const closeSettings = document.getElementById('closeSettings')
		const applyBtn = document.getElementById('applySettings')
		const resetBtn = document.getElementById('resetSettings')
		const overlay = document.createElement('div')
		overlay.className = 'settings-overlay'
		document.body.appendChild(overlay)

		if (settingsTrigger && settingsPanel) {
			settingsTrigger.addEventListener('click', () => {
				settingsPanel.classList.add('active')
				overlay.classList.add('active')
				this.loadCurrentSettings()
			})

			closeSettings.addEventListener('click', () => {
				this.closePanel(settingsPanel, overlay)
			})

			overlay.addEventListener('click', () => {
				this.closePanel(settingsPanel, overlay)
			})

			document.addEventListener('keydown', e => {
				if (e.key === 'Escape' && settingsPanel.classList.contains('active')) {
					this.closePanel(settingsPanel, overlay)
				}
			})

			applyBtn.addEventListener('click', () =>
				this.applyNewSettings(settingsPanel, overlay)
			)

			resetBtn.addEventListener('click', () => this.resetSettings())
		}
	}

	closePanel(panel, overlay) {
		panel.classList.remove('active')
		overlay.classList.remove('active')
	}

	loadCurrentSettings() {
		const fontSize = document.getElementById('fontSize')
		const lineHeight = document.getElementById('lineHeight')
		const disableAnimations = document.getElementById('disableAnimations')
		const focusMode = document.getElementById('focusMode')

		fontSize.value = localStorage.getItem('fontSize') || '16px'
		lineHeight.value = localStorage.getItem('lineHeight') || '1.6'
		disableAnimations.checked =
			localStorage.getItem('disableAnimations') === 'true'
		focusMode.checked = localStorage.getItem('focusMode') === 'true'
	}

	applyNewSettings(panel, overlay) {
		const fontSize = document.getElementById('fontSize').value
		const lineHeight = document.getElementById('lineHeight').value
		const disableAnimations =
			document.getElementById('disableAnimations').checked
		const focusMode = document.getElementById('focusMode').checked

		localStorage.setItem('fontSize', fontSize)
		localStorage.setItem('lineHeight', lineHeight)
		localStorage.setItem('disableAnimations', disableAnimations)
		localStorage.setItem('focusMode', focusMode)

		this.applyStyles(fontSize, lineHeight, disableAnimations, focusMode)

		this.closePanel(panel, overlay)

		this.showToast('Settings applied to all pages!')
	}

	resetSettings() {
		localStorage.removeItem('fontSize')
		localStorage.removeItem('lineHeight')
		localStorage.removeItem('disableAnimations')
		localStorage.removeItem('focusMode')

		document.getElementById('fontSize').value = '16px'
		document.getElementById('lineHeight').value = '1.6'
		document.getElementById('disableAnimations').checked = false
		document.getElementById('focusMode').checked = false

		this.applyStyles('16px', '1.6', 'standard', false, false)

		this.showToast('Settings reset to default!')
	}

	removeClasses(element, classPrefixes) {
		const classes = element.className
			.split(' ')
			.filter(cls => !classPrefixes.some(prefix => cls.startsWith(prefix)))
		element.className = classes.join(' ')
	}

	getSizeClass(size) {
		const sizes = {
			'14px': 'small',
			'16px': 'standard',
			'18px': 'large',
			'20px': 'xlarge',
		}
		return sizes[size] || 'standard'
	}

	getLineHeightClass(height) {
		const heights = {
			1.4: 'narrow',
			1.6: 'standard',
			1.8: 'wide',
			'2.0': 'xwide',
		}
		return heights[height] || 'standard'
	}

	showToast(message) {
		const toast = document.createElement('div')
		toast.textContent = message
		toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 3000;
            font-weight: 500;
        `

		document.body.appendChild(toast)

		setTimeout(() => {
			document.body.removeChild(toast)
		}, 3000)
	}
}

document.addEventListener('DOMContentLoaded', function () {
	window.globalSettings = new GlobalSettings()
})

document.addEventListener('pageshow', function () {
	if (window.globalSettings) {
		window.globalSettings.applySavedSettings()
	}
})
