console.log("Let write Javascript")

async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs
}
async function main() {
    // get the ist of all songs
    let songs = await getSongs()
    console.log(songs)

   let songUL= document.querySelector(".songlist").getElementsByTagName("ul")[0]
   for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `  <li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song}</div>
                                <div>Neel</div>
                            </div>
                            <div class="playnow">
                                <span>Playnow</span>
                                <img class="invert" src="play-button-svgrepo-com (1).svg" alt="">
                            </div>
                        </li> `
    
   }

    // play the first audio
    var audio = new Audio(songs[0]);
    audio.play();


    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(audio.duration,audio.currentSrc,audio.currentTime)
        // The duration variable now holds the duration (in seconds) of the audio clip
    });
     
}

    main()