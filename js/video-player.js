class VideoPlayer {
	constructor() {
		this.videoElement = document.getElementById('videoElement')
		this.playPauseBtn = document.getElementById('playPause')
		this.progressBar = document.getElementById('progressBar')
		this.progressFill = document.getElementById('progressFill')
		this.timeDisplay = document.getElementById('timeDisplay')
		this.volumeBtn = document.getElementById('volumeBtn')
		this.volumeSlider = document.getElementById('volumeSlider')
		this.volumeFill = document.getElementById('volumeFill')
		this.fullscreenBtn = document.getElementById('fullscreenBtn')
		this.playlistContainer = document.querySelector('.playlist-items')

		this.videos = []
		this.currentVideoIndex = 0
		this.isMuted = false
		this.lastVolume = 1

		this.init()
		this.loadVideoList()
	}

	init() {
		this.playPauseBtn.addEventListener('click', () => this.togglePlayPause())
		this.videoElement.addEventListener('click', () => this.togglePlayPause())
		this.videoElement.addEventListener('timeupdate', () =>
			this.updateProgress()
		)
		this.videoElement.addEventListener('loadedmetadata', () =>
			this.updateDuration()
		)
		this.videoElement.addEventListener('ended', () => this.playNext())

		this.progressBar.addEventListener('input', () => this.seek())
		this.progressBar.addEventListener('change', () => this.seek())

		this.volumeBtn.addEventListener('click', () => this.toggleMute())
		this.volumeSlider.addEventListener('input', () => this.changeVolume())

		this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen())

		this.updateVolumeFill()
		this.updateProgressFill()

		document.addEventListener('keydown', e => this.handleKeyboard(e))
	}

	async loadVideoList() {
		try {
			this.videos = [
				{
					title: 'Introduction Tutorial',
					filename: '1.mp4',
					duration: '0:36',
					thumb: 'video/1-thumb.png',
				},
				{
					title: 'Advanced Features',
					filename: '2.mp4',
					duration: '0:27',
					thumb: 'video/2-thumb.png',
				},
				{
					title: 'Troubleshooting Guide',
					filename: '3.mp4',
					duration: '0:28',
					thumb: 'video/3-thumb.png',
				},
				{
					title: 'Troubleshooting Guide',
					filename: 'troubleshoot.mp4',
					duration: '6:45',
					thumb: 'video/troubleshoot-thumb.png',
				},
			]

			this.renderPlaylist()
			this.preloadThumbnails()
			this.loadVideo(0)
		} catch (error) {
			console.error('Error loading video list:', error)
			this.showError('Failed to load videos. Please check your connection.')
		}
	}

	preloadThumbnails() {
		this.videos.forEach(video => {
			if (video.thumb) {
				const img = new Image()
				img.src = video.thumb
			}
		})
	}

	renderPlaylist() {
		this.playlistContainer.innerHTML = ''

		this.videos.forEach((video, index) => {
			const item = document.createElement('div')
			item.className = 'playlist-item'
			item.innerHTML = `
                <div class="playlist-item-thumb">
                    ${
											video.thumb
												? `<img src="${video.thumb}" alt="${video.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" loading="lazy">`
												: ''
										}
                    <div class="thumb-placeholder" style="${
											video.thumb ? 'display: none;' : ''
										}">
                        ${video.title.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${video.title}</div>
                    <div class="playlist-item-duration">${video.duration}</div>
                </div>
            `

			item.addEventListener('click', () => {
				this.loadVideo(index)
				this.playVideo()
				item.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
			})

			this.playlistContainer.appendChild(item)
		})
	}

	loadVideo(index) {
		if (index < 0 || index >= this.videos.length) return

		this.currentVideoIndex = index
		const video = this.videos[index]
		this.videoElement.src = `video/${video.filename}`

		const items = document.querySelectorAll('.playlist-item')
		items.forEach((item, i) => {
			item.classList.toggle('active', i === index)

			if (i === index) {
				item.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
			}
		})

		this.updatePlayButton()
	}

	playVideo() {
		this.videoElement.play().catch(error => {
			console.error('Error playing video:', error)
		})
		this.updatePlayButton()
	}

	pauseVideo() {
		this.videoElement.pause()
		this.updatePlayButton()
	}

	togglePlayPause() {
		if (this.videoElement.paused) {
			this.playVideo()
		} else {
			this.pauseVideo()
		}
	}

	updatePlayButton() {
		this.playPauseBtn.textContent = this.videoElement.paused ? '▶' : '⏸'
	}

	updateProgress() {
		if (this.videoElement.duration) {
			const percent =
				(this.videoElement.currentTime / this.videoElement.duration) * 100
			this.progressBar.value = percent
			this.updateProgressFill()
			this.updateTimeDisplay()
		}
	}

	updateProgressFill() {
		this.progressFill.style.width = `${this.progressBar.value}%`
	}

	updateVolumeFill() {
		this.volumeFill.style.transform = `scaleX(${this.volumeSlider.value})`
	}

	updateDuration() {
		this.progressBar.max = 100
		this.updateTimeDisplay()
	}

	updateTimeDisplay() {
		const currentTime = this.formatTime(this.videoElement.currentTime)
		const duration = this.formatTime(this.videoElement.duration)
		this.timeDisplay.textContent = `${currentTime} / ${duration}`
	}

	formatTime(seconds) {
		if (isNaN(seconds)) return '00:00'
		const mins = Math.floor(seconds / 60)
		const secs = Math.floor(seconds % 60)
		return `${mins.toString().padStart(2, '0')}:${secs
			.toString()
			.padStart(2, '0')}`
	}

	seek() {
		const time = (this.progressBar.value / 100) * this.videoElement.duration
		this.videoElement.currentTime = time
		this.updateProgressFill()
	}

	toggleMute() {
		if (this.videoElement.volume > 0) {
			this.lastVolume = this.videoElement.volume
			this.videoElement.volume = 0
			this.volumeSlider.value = 0
			this.volumeBtn.textContent = '🔇'
			this.isMuted = true
		} else {
			this.videoElement.volume = this.lastVolume
			this.volumeSlider.value = this.lastVolume
			this.volumeBtn.textContent = this.lastVolume > 0 ? '🔊' : '🔇'
			this.isMuted = false
		}
		this.updateVolumeFill()
	}

	changeVolume() {
		this.videoElement.volume = this.volumeSlider.value
		this.volumeBtn.textContent = this.volumeSlider.value > 0 ? '🔊' : '🔇'
		this.isMuted = this.volumeSlider.value === 0
		this.updateVolumeFill()
	}

	toggleFullscreen() {
		if (!document.fullscreenElement) {
			this.videoElement.requestFullscreen?.().catch(err => {
				console.error('Error attempting to enable fullscreen:', err)
			})
		} else {
			document.exitFullscreen?.()
		}
	}

	playNext() {
		const nextIndex = (this.currentVideoIndex + 1) % this.videos.length
		this.loadVideo(nextIndex)
		this.playVideo()
	}

	handleKeyboard(event) {
		if (event.target.tagName === 'INPUT') return

		switch (event.key) {
			case ' ':
			case 'k':
				event.preventDefault()
				this.togglePlayPause()
				break
			case 'm':
				event.preventDefault()
				this.toggleMute()
				break
			case 'f':
				event.preventDefault()
				this.toggleFullscreen()
				break
			case 'ArrowRight':
				event.preventDefault()
				this.videoElement.currentTime += 10
				break
			case 'ArrowLeft':
				event.preventDefault()
				this.videoElement.currentTime -= 10
				break
			case 'ArrowUp':
				event.preventDefault()
				this.videoElement.volume = Math.min(this.videoElement.volume + 0.1, 1)
				this.volumeSlider.value = this.videoElement.volume
				this.updateVolumeFill()
				break
			case 'ArrowDown':
				event.preventDefault()
				this.videoElement.volume = Math.max(this.videoElement.volume - 0.1, 0)
				this.volumeSlider.value = this.videoElement.volume
				this.updateVolumeFill()
				break
		}
	}

	showError(message) {
		const errorDiv = document.createElement('div')
		errorDiv.style.cssText = `
            background: #fee;
            color: #c33;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            border-left: 4px solid #c33;
        `
		errorDiv.textContent = message
		this.playlistContainer.parentNode.insertBefore(
			errorDiv,
			this.playlistContainer
		)
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new VideoPlayer()
})
