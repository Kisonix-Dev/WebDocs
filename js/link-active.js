document.addEventListener('DOMContentLoaded', function () {
	const navLinks = document.querySelectorAll('.header-nav a')
	const sections = document.querySelectorAll('section[id]')

	function updateActiveNav() {
		let current = ''
		const scrollPosition = window.scrollY + 100

		sections.forEach(section => {
			const sectionTop = section.offsetTop
			const sectionHeight = section.clientHeight

			if (
				scrollPosition >= sectionTop &&
				scrollPosition < sectionTop + sectionHeight
			) {
				current = section.getAttribute('id')
			}
		})

		navLinks.forEach(link => {
			link.classList.remove('active', 'scroll-active')
			const href = link.getAttribute('href')

			if (href === `#${current}` || (current === '' && href === '#')) {
				link.classList.add('active', 'scroll-active')
			}
		})

		if (window.scrollY < 100) {
			navLinks.forEach(link => {
				if (link.getAttribute('href') === '#') {
					link.classList.add('active', 'scroll-active')
				}
			})
		}
	}

	updateActiveNav()

	window.addEventListener('scroll', updateActiveNav)

	navLinks.forEach(link => {
		link.addEventListener('click', function (e) {
			if (this.getAttribute('href').startsWith('#')) {
				e.preventDefault()
				const targetId = this.getAttribute('href').substring(1)
				const targetElement = targetId
					? document.getElementById(targetId)
					: document.body

				if (targetElement) {
					window.scrollTo({
						top: targetElement.offsetTop - 80,
						behavior: 'smooth',
					})
				}
			}
		})
	})
})
