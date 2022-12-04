const mainVideo = document.getElementById('video'),
    chooseVideo = document.getElementById('choose-video'),
    playPauseBtn = document.getElementById('play-pause-btn'),
    progressBar = document.querySelector('.progress-bar'),
    progressDetail = document.querySelector('#progress-detail'),
    videoCurrentTime = document.getElementById('video-current-time'),
    videoDuration = document.getElementById('video-duration'),
    volume = document.getElementById('video-volume-range'),
    volumeIcon = document.getElementById('volume-icon'),
    content = document.querySelector('.content'),
    noResult = document.querySelector('.content.no-result'),
    videoBox = document.querySelector('.video-bx')

var playState = false,
    loopState = false,
    volumeLocalKey = 'video-volume'

function handlePlayVideo() {
    playState = !playState

    if (playState) {
        playPauseBtn.innerHTML = '<ion-icon name="pause"></ion-icon>'
        mainVideo.play()
        videoBox.classList.remove('is-pause')
    }
    else {
        playPauseBtn.innerHTML = '<ion-icon name="play"></ion-icon>'
        mainVideo.pause()
        videoBox.classList.add('is-pause')
    }
}

function handleSkipTimeVideo(step) {
    mainVideo.currentTime += step
}

function handleCloseVideo() {
    mainVideo.src = ''
    content.style.display = 'none'
    noResult.style.display = 'flex'
    chooseVideo.value = ''
}

function handleLoopVideo(btn) {
    btn.classList.toggle('actived')
    loopState = btn.classList.contains('actived')
    console.log(loopState);
}

function handleExpandVideo() {
    videoBox.classList.toggle('full-screen')
}

function handleMuteVideo() {
    let volumeVal = 0
    volumeVal = volume.value == 0 ? getCurrentVolume() : 0
    volume.value = volumeVal * 100
    setIconVolume(volumeVal)
    mainVideo.volume = volumeVal
}

chooseVideo.onchange = (e) => {
    if (e.target.value) {
        let url = URL.createObjectURL(e.target.files[0])
        mainVideo.src = url
        content.style.display = 'block'
        noResult.style.display = 'none'
    }
}

progressBar.onclick = (e) => {
    let progressWidthVal = progressBar.clientWidth;
    let clickedOffsetX = e.offsetX;
    let duration = mainVideo.duration;

    mainVideo.currentTime = (clickedOffsetX / progressWidthVal) * duration;
}

volume.oninput = (e) => {
    let volumeVal = e.target.value / 100
    mainVideo.volume = volumeVal
    localStorage.setItem(volumeLocalKey, volumeVal)
    setIconVolume(volumeVal)
}

mainVideo.ontimeupdate = (e) => {
    const currentTime = e.target.currentTime
    const duration = e.target.duration
    let progressWidth = (currentTime / duration) * 100;
    progressDetail.style.width = `${progressWidth}%`

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentMin < 10) {
        currentMin = `0${currentMin}`;
    }
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    videoCurrentTime.innerText = `${currentMin}:${currentSec}`;

    if (currentTime === duration && loopState) {
        mainVideo.currentTime = 0
        mainVideo.play()
    }
    else if (currentTime === duration) {
        playPauseBtn.innerHTML = '<ion-icon name="play"></ion-icon>'
        playState = false
        videoBox.classList.add('is-pause')
    }
}

mainVideo.onloadeddata = () => {
    const duration = mainVideo.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalMin < 10) {
        totalMin = `0${totalMin}`;
    }
    if (totalSec < 10) {
        totalSec = `0${totalSec}`;
    }
    videoDuration.innerText = `${totalMin}:${totalSec}`;

    loadVolume()
    progressDetail.style.width = '0%'
    if (playState) {
        playState = !playState
        playPauseBtn.innerHTML = '<ion-icon name="play"></ion-icon>'
        videoBox.classList.add('is-pause')
    }
}

function getCurrentVolume() {
    return localStorage.getItem(volumeLocalKey)
}

function loadVolume() {
    let volumeVal = getCurrentVolume() || volume.value / 100
    mainVideo.volume = volumeVal
    volume.value = volumeVal * 100
    setIconVolume(volumeVal)
}

function setIconVolume(value) {
    if (value == 0) {
      volumeIcon.setAttribute('name', 'volume-mute');
    }
    if (value <= 0.15 && value > 0) {
      volumeIcon.setAttribute('name', 'volume-off');
    }
    if (value > 0.15 && value <= 0.6) {
      volumeIcon.setAttribute('name', 'volume-low');
    }
    if (value > 0.6) {
      volumeIcon.setAttribute('name', 'volume-high');
    }
} 

function main() {
    loadVolume()
}

main()