window.onload = function() {
    let menuButton = document.getElementById("openMenu");
    //menuButton.click();

    updateCurrentInfo("", "");
    initializeMusic();
};

const stations = {
    Lofi: [
        "lofi-songs/308. Lo-Fi.mp3",
        "lofi-songs/309. Hip Hop.mp3",
        "lofi-songs/310. Hip-Hop.mp3",
        "lofi-songs/Seasons.wav",
        "lofi-songs/Lost.mp3",
        "lofi-songs/Miracle.mp3",
        "lofi-songs/Mood.mp3",
        "lofi-songs/Sunset.mp3",
        "lofi-songs/PTSD.mp3",
        "lofi-songs/atoll - Why.mp3",
        "lofi-songs/Assim E Assado.mp3",
        "lofi-songs/Cookies.mp3",
        "lofi-songs/Graceful.mp3"
    ],
    Elevator: [
        "jazz-songs/Foolish Things - GrayMic.mp3",
        "jazz-songs/Mesmerized - Angus & Friends.mp3",
        "jazz-songs/Roscoe's Blues - Andrew Fazackerley.mp3",
        "jazz-songs/Sentimental - Alexey Anisimov.mp3",
        "jazz-songs/Cure For the Fuss - astat.mp3",
        "jazz-songs/Sie7e - Jazz Oil.mp3"
    ],
    Electro: [
        "electro-songs/Agharta.mp3",
        "electro-songs/Mineral - HRCRX.mp3",
        "electro-songs/Wish You Were Here - The Madpix Project.mp3",
        "electro-songs/You and Me - Jekk.mp3",
        "electro-songs/I Need Your Love - BASXHKZIR.mp3",
        "electro-songs/Life Goes On - Paradise Nation.mp3",
        "electro-songs/Dont Look Back - Infraction.mp3",
        "electro-songs/Wrong Thing - Hazardous.mp3",
        "electro-songs/Twst - Bedrov.mp3",
        "electro-songs/SAL_9000 - MEDBERG.mp3"
    ]
};

let currentStation = null;
let isMusicPlaying = false;
let currentSongIndex = 0;
const audio = document.getElementById("audio");
const progressBar = document.getElementById('progressBar');
const currentProgress = document.getElementById('currentProgress');
const progressBarContainer = document.getElementById('progressBarContainer');
const hoverTimeDisplay = document.getElementById('hoverTimeDisplay');
const currentTimeElement = document.getElementById('currentTime');
const durationElement = document.getElementById('duration');
const x = document.getElementById('myDiv');
let currentTime = 0;
let isPaused = false;

function initializeMusic() {
    // Any setup for initializing music can go here
    audio.controls = false;
}

audio.addEventListener("timeupdate", updateProgressBar);
audio.addEventListener("durationchange", updateDuration);

progressBarContainer.addEventListener("mouseover", showHoverTime);
progressBarContainer.addEventListener("mouseout", hideHoverTime);

function updateProgressBar() {
    // Update progress bar
    const progress = (audio.currentTime / audio.duration) * 100;
    currentProgress.style.width = progress + '%';

    // Update current time display
    currentTimeElement.textContent = formatTime(audio.currentTime);

    // Update duration display if duration is a valid number
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        durationElement.textContent = formatTime(audio.duration);
    } else {
        // If duration is not available, display nothing or some placeholder
        durationElement.textContent = '';
    }
}

function updateDuration(){
    //Update duration display
    durationElement.textContent = formatTime(audio.duration);
}

function showHoverTime(event) {
    // Calculate the time based on the mouse position
    const progressBarWidth = progressBarContainer.offsetWidth;
    const mouseX = event.clientX - progressBarContainer.getBoundingClientRect().left;
    const percentage = (mouseX / progressBarWidth) * 100;
    const hoverTime = (percentage / 100) * audio.duration;

    // Update the time display
    hoverTimeDisplay.textContent = formatTime(hoverTime);
    hoverTimeDisplay.style.display = 'block';
}

function hideHoverTime() {
    // Hide the time display when the mouse is not over the progress bar
    hoverTimeDisplay.style.display = 'none';
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function seek(event) {
    const progressBarRect = progressBar.getBoundingClientRect();
    const seekPercentage = (event.clientX - progressBarRect.left) / progressBarRect.width;
    const seekTime = seekPercentage * audio.duration;

    // Set the currentTime directly
    audio.currentTime = seekTime;

    if (isPaused) {
        // If the audio is paused, update the currentTime variable
        currentTime = seekTime;
    } else {
        // If the audio is playing, play from the new seek position
        audio.play();
    }
}

function playMusic(station) {
    if (!isMusicPlaying || currentStation !== station) {
        currentStation = station;
        currentSongIndex = -1;
        playNextSong();
        isMusicPlaying = true;
    }
}

function playNextSong() {
    const stationSongs = stations[currentStation];
    currentSongIndex = (currentSongIndex + 1) % stationSongs.length;

    const fullSongPath = stationSongs[currentSongIndex];

    // Extracting the filename from the full path
    const fileName = fullSongPath.split('/').pop();

    // Removing the file extension
    const songTitle = fileName.split('.')[0];

    audio.src = fullSongPath;
    audio.play();

    updateCurrentInfo(currentStation, songTitle);
}

function playLastSong() {
    const stationSongs = stations[currentStation];
    currentSongIndex = (currentSongIndex - 1 + stationSongs.length) % stationSongs.length;

    const fullSongPath = stationSongs[currentSongIndex];

    // Extracting the filename from the full path
    const fileName = fullSongPath.split('/').pop();

    // Removing the file extension
    const songTitle = fileName.split('.')[0];

    audio.src = fullSongPath;
    audio.play();

    updateCurrentInfo(currentStation, songTitle);
}

function updateCurrentInfo(station, song) {
    const currentInfoElement = document.getElementById("currentInfo");
    if (currentInfoElement) {
        const stationElement = document.getElementById("stationName");
        const songElement = document.getElementById("songName");

        if (stationElement && songElement) {
            // Check if station and song are not null before updating
            stationElement.textContent = station || "";
            songElement.textContent = song || "";
        }
    }
}

function pauseMusic() {
    audio.pause();
    currentTime = audio.currentTime;
    isPaused = true;
}

function skipSong() {
    playNextSong();
}

function resumeSong() {
    if (isPaused) {
        audio.currentTime = currentTime;
        audio.play();
        isPaused = false;
    }
}

function showHide() {
    if (x.style.opacity === '1') {
        x.style.opacity = '0';
    } else {
        x.style.opacity = '1';
        x.style.display = 'block';
    }
}