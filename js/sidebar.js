document.addEventListener('DOMContentLoaded', function () {
	const sectionHeaders = document.querySelectorAll('.section-header')

	function saveSidebarState() {
		const state = {}
		document.querySelectorAll('.sidebar-section').forEach((section, index) => {
			const isExpanded = section
				.querySelector('.pages-list')
				.classList.contains('expanded')
			state[`section-${index}`] = isExpanded
		})
		localStorage.setItem('sidebarState', JSON.stringify(state))
	}

	function restoreSidebarState() {
		const savedState = localStorage.getItem('sidebarState')
		if (savedState) {
			const state = JSON.parse(savedState)
			document
				.querySelectorAll('.sidebar-section')
				.forEach((section, index) => {
					const key = `section-${index}`
					if (state[key]) {
						section.querySelector('.pages-list').classList.add('expanded')
						section.querySelector('.section-icon').classList.add('rotated')
						section.querySelector('.section-header').classList.add('active')
					}
				})
		}
	}

	restoreSidebarState()

	const activePage = document.querySelector('.pages-list a.active')
	if (activePage) {
		const activeSection = activePage.closest('.sidebar-section')
		if (activeSection) {
			activeSection.querySelector('.pages-list').classList.add('expanded')
			activeSection.querySelector('.section-icon').classList.add('rotated')
			activeSection.querySelector('.section-header').classList.add('active')
		}
	}

	sectionHeaders.forEach(header => {
		header.addEventListener('click', function () {
			const section = this.parentElement
			const pagesList = section.querySelector('.pages-list')
			const icon = this.querySelector('.section-icon')

			pagesList.classList.toggle('expanded')
			icon.classList.toggle('rotated')
			this.classList.toggle('active')

			saveSidebarState()
		})
	})

	document.querySelectorAll('.pages-list a').forEach(link => {
		link.addEventListener('click', function () {
			saveSidebarState()
		})
	})
})

window.onload = function () {
	setTimeout(function () {
		document.getElementById('body').style.display = ''
	}, 1)
}

function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	})
}

document.addEventListener('DOMContentLoaded', function () {
	const navLinks = document.querySelectorAll('.header-nav a')

	navLinks.forEach(link => {
		link.addEventListener('click', function (e) {
			if (this.textContent === 'Главная') {
				e.preventDefault()
				scrollToTop()
			}
		})
	})
})
