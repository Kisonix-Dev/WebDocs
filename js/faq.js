function initFAQAccordion() {
	const faqItems = document.querySelectorAll('.faq-item')

	faqItems.forEach(item => {
		const question = item.querySelector('.faq-question')

		question.addEventListener('click', function () {
			faqItems.forEach(otherItem => {
				if (otherItem !== item && otherItem.classList.contains('active')) {
					otherItem.classList.remove('active')
				}
			})

			item.classList.toggle('active')
		})
	})
}

document.addEventListener('DOMContentLoaded', function () {
	initFAQAccordion()
})
