const scrollToTopBtn = document.getElementById('scrollToTop')

window.onscroll = function () {
	if (
		document.body.scrollTop > 300 ||
		document.documentElement.scrollTop > 300
	) {
		scrollToTopBtn.style.display = 'block'
	} else {
		scrollToTopBtn.style.display = 'none'
	}
}

scrollToTopBtn.addEventListener('click', () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	})
})

const currentLocation = location.href
const menuItems = document.querySelectorAll('.sidebar-menu a')

menuItems.forEach(item => {
	if (item.href === currentLocation) {
		item.classList.add('active')
	}
})

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault()

		const targetId = this.getAttribute('href')
		if (targetId === '#') return

		const targetElement = document.querySelector(targetId)
		if (targetElement) {
			const headerOffset = 40
			const elementPosition = targetElement.getBoundingClientRect().top
			const offsetPosition = elementPosition + window.pageYOffset - headerOffset

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth',
			})

			history.pushState(null, null, targetId)
		}
	})
})

document.addEventListener('DOMContentLoaded', function () {
	const sections = document.querySelectorAll('h2[id], h3[id]')
	const navLinks = document.querySelectorAll('.right-nav a')

	function activateNavLink() {
		let current = ''
		let closestDistance = Infinity

		if (window.scrollY < 50) {
			navLinks.forEach(link => link.classList.remove('active'))
			return
		}

		sections.forEach(section => {
			const rect = section.getBoundingClientRect()
			const distance = Math.abs(rect.top)

			if (distance < closestDistance && rect.top <= 100) {
				closestDistance = distance
				current = section.getAttribute('id')
			}
		})

		navLinks.forEach(link => {
			link.classList.remove('active')
			if (link.getAttribute('href') === '#' + current) {
				link.classList.add('active')
			}
		})
	}

	activateNavLink()
	window.addEventListener('scroll', activateNavLink)
})

history.scrollRestoration = 'manual'

window.addEventListener('load', function () {
	window.scrollTo(0, 0)
})
