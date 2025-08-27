document.querySelectorAll('.category-link').forEach(link => {
	link.addEventListener('click', function (e) {
		e.preventDefault()
		const targetId = this.getAttribute('href')
		const targetSection = document.querySelector(targetId)

		if (targetSection) {
			document.querySelectorAll('.category-link').forEach(item => {
				item.classList.remove('active')
			})

			this.classList.add('active')

			targetSection.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	})
})

const scrollToTopBtn = document.getElementById('scrollToTop')

window.addEventListener('scroll', () => {
	if (window.pageYOffset > 300) {
		scrollToTopBtn.style.display = 'block'
	} else {
		scrollToTopBtn.style.display = 'none'
	}
})

scrollToTopBtn.addEventListener('click', () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	})
})

window.addEventListener('scroll', () => {
	const sections = document.querySelectorAll('.category-section')
	const navLinks = document.querySelectorAll('.category-link')
	let currentSection = ''

	sections.forEach(section => {
		const sectionTop = section.offsetTop
		const sectionHeight = section.clientHeight

		if (window.pageYOffset >= sectionTop - 100) {
			currentSection = section.getAttribute('id')
		}
	})

	navLinks.forEach(link => {
		link.classList.remove('active')
		if (link.getAttribute('href') === `#${currentSection}`) {
			link.classList.add('active')
		}
	})
})
