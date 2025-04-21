let currentsong = new Audio();
let songs = [];
let currfolder = "";

// Utility: convert seconds to mm:ss
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${minutes}:${secs}`;
}

// Fetch song list from folder
async function getSongs(folder) {
  currfolder = folder;
  const res = await fetch(`public/${folder}/index.json`);
  const data = await res.json();
  songs = data.songs;

  const songul = document.querySelector(".songslist ul");
  songul.innerHTML = "";

  for (const song of songs) {
    songul.innerHTML += `
      <li>
        <img class="invert" src="svgs/music.svg" alt="">
        <div class="songinfo">
          <div>${song}</div>
          <div>artist name</div>
        </div>
        <img class="invert" id="plays" src="svgs/play1.svg" alt=""> 
      </li>`;
  }

  // Add click event for each song
  Array.from(document.querySelectorAll(".songslist li")).forEach(e =>
    e.addEventListener("click", () => {
      const track = e.querySelector(".songinfo").firstElementChild.innerHTML.trim();
      playMusic(track);
    })
  );

  return songs;
}

// Play a given song
const playMusic = (track, pause = false) => {
  const encodedTrack = encodeURIComponent(track);
  currentsong.src = `/public/${currfolder}/${encodedTrack}`;

  if (!pause) {
    currentsong.play();
    play.src = "svgs/pause.svg";
  }

  document.querySelector(".songdetail").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

// Load album cards and set click to load songs
async function displayalbum() {
  const folders = ["pop", "beats"];
  const cardcontainer = document.querySelector(".card-container");

  for (const folder of folders) {
    try {
      const res = await fetch(`/public/songs/${folder}/info.json`);
      const info = await res.json();

      cardcontainer.innerHTML += `
        <div class="card" data-folder="${folder}">
          <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#000">
              <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      `;
    } catch (error) {
      console.error(`Error loading album: ${folder}`, error);
    }
  }

  document.querySelectorAll(".card").forEach(e => {
    e.addEventListener("click", async () => {
      const folder = e.dataset.folder;
      await getSongs(`songs/${folder}`);
      playMusic(songs[0]);
    });
  });
}

// Main function
async function main() {
  await getSongs("songs/pop");
  playMusic(songs[0], true);
  displayalbum();

  const play = document.querySelector("#play");
  const previous = document.querySelector("#previous");
  const next = document.querySelector("#next");

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "svgs/pause.svg";
    } else {
      currentsong.pause();
      play.src = "svgs/play.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
    document.querySelector(".left").style.position = "fixed";
  });

  document.querySelector(".logo").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  document.querySelector(".range input").addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  previous.addEventListener("click", () => {
    let currentTrack = decodeURIComponent(currentsong.src.split("/").pop());
    let index = songs.indexOf(currentTrack);
    if (index > 0) playMusic(songs[index - 1]);
  });

  next.addEventListener("click", () => {
    let currentTrack = decodeURIComponent(currentsong.src.split("/").pop());
    let index = songs.indexOf(currentTrack);
    if (index < songs.length - 1) playMusic(songs[index + 1]);
  });

  document.addEventListener("keydown", e => {
    if (e.key === " ") {
      e.preventDefault(); // prevent page scroll
      if (currentsong.paused) {
        currentsong.play();
        play.src = "svgs/pause.svg";
      } else {
        currentsong.pause();
        play.src = "svgs/play.svg";
      }
    }
  });

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    const vol = document.querySelector(".range input");
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentsong.volume = 0;
      vol.value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentsong.volume = 0.3;
      vol.value = 30;
    }
  });
}

main();
