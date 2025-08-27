const modal = document.getElementById('imageModal')

const modalImg = document.getElementById('modalImage')
const images = document.querySelectorAll('.modal-image')
let currentIndex = 0

const imageArray = Array.from(images)

images.forEach((img, index) => {
	img.addEventListener('click', function () {
		modal.style.display = 'block'
		modalImg.src = this.src
		modalImg.alt = this.alt
		currentIndex = index
		updateNavigationButtons()
	})
})

const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')

function showNextImage() {
	currentIndex = (currentIndex + 1) % imageArray.length
	modalImg.src = imageArray[currentIndex].src
	modalImg.alt = imageArray[currentIndex].alt
	updateNavigationButtons()
}

function showPrevImage() {
	currentIndex = (currentIndex - 1 + imageArray.length) % imageArray.length
	modalImg.src = imageArray[currentIndex].src
	modalImg.alt = imageArray[currentIndex].alt
	updateNavigationButtons()
}

function updateNavigationButtons() {
	if (imageArray.length <= 1) {
		prevBtn.style.display = 'none'
		nextBtn.style.display = 'none'
	} else {
		prevBtn.style.display = 'block'
		nextBtn.style.display = 'block'
	}
}

nextBtn.addEventListener('click', function (e) {
	e.stopPropagation()
	showNextImage()
})

prevBtn.addEventListener('click', function (e) {
	e.stopPropagation()
	showPrevImage()
})

modal.addEventListener(
	'wheel',
	function (event) {
		if (modal.style.display === 'block') {
			event.preventDefault()

			if (event.deltaY > 0) {
				showNextImage()
			} else if (event.deltaY < 0) {
				showPrevImage()
			}
		}
	},
	{ passive: false }
)

document.addEventListener('keydown', function (event) {
	if (modal.style.display === 'block') {
		if (event.key === 'ArrowRight') {
			showNextImage()
		} else if (event.key === 'ArrowLeft') {
			showPrevImage()
		} else if (event.key === 'Escape') {
			modal.style.display = 'none'
		}
	}
})

const span = document.getElementsByClassName('close')[0]

span.onclick = function () {
	modal.style.display = 'none'
}

modal.onclick = function (event) {
	if (event.target === modal) {
		modal.style.display = 'none'
	}
}
