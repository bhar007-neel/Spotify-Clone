console.log("Let write Javascript")
let currentSong = new Audio()
let isPlaying = false;
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs() {
    try {
        let response = await fetch("https://bhar007-neel.github.io/Spotify-Clone/songs/");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let text = await response.text();
        console.log("Fetched data:", text);

        let div = document.createElement("div");
        div.innerHTML = text;
        let as = div.getElementsByTagName("a");
        let songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split("https://bhar007-neel.github.io/Spotify-Clone/songs/")[1]);
            }
        }
        console.log("Parsed songs:", songs);
        return songs;
    } catch (error) {
        console.error("Failed to fetch songs:", error);
    }
}

const playMusic = (track, pause = false) => {
    if (!pause) {
        currentSong.play();
    }
    if (currentSong.src !== "https://bhar007-neel.github.io/Spotify-Clone/songs/" + track) {
        currentSong.pause();
        currentSong.src = "https://bhar007-neel.github.io/Spotify-Clone/songs/" + track;
    }

    currentSong.play().then(() => {
        play.src = "pause.svg";
        isPlaying = true;
    }).catch(error => {
        console.error("Audio play failed:", error);
    });

    document.querySelector('.songinfo').innerHTML = track;
    document.querySelector('.songtime').innerHTML = "00:00/00:00";
}

async function main() {
    // let currentSong = new Audio();
    // get the ist of all songs
    songs = await getSongs()
    playMusic(songs[0], true)



    // Show all th songs in playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `  <li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", "")}</div>
                                <div>Neel</div>
                            </div>
                            <div class="playnow">
                                <span>Playnow</span>
                                <img class="invert" src="play-button-svgrepo-com (1).svg" alt="">
                            </div>
                        </li> `;

    }

    //    attach a event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        });
    });

    // // play the first audio
    // var audio = new Audio(songs[0]);
    // audio.play();


    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log(audio.duration,audio.currentSrc,audio.currentTime)
    //     // The duration variable now holds the duration (in seconds) of the audio clip
    // });

    //  Attach an event listener to next and previous
    play.addEventListener("click", () => {
        if (isPlaying) {
            currentSong.pause();
            play.src = "play-button-svgrepo-com (1).svg";
            isPlaying = false;
        } else {
            currentSong.play().then(() => {
                play.src = "pause.svg";
                isPlaying = true;
            }).catch(error => {
                console.error("Audio play failed:", error);
            });
        }
    });

    // Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100
            + "%"
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // add a event listner for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add a eventListener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //  Add an event listener to previous and next
    previous.addEventListener("click", () => {
        console.log("Privous clicked")
        console.log("current song")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])

        }

    })

    //  Add an event listener to previous and next
    next.addEventListener("click", () => {
        console.log("next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])

        }
    })

    //  add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e,e.target,e.target.value)
        currentSong.volume= parseInt(e.target.value)/100;
    })

}

main()