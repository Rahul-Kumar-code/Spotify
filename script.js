// Fetch song list from folder
async function getSongs(folder) {
  currfolder = folder;
  // Remove "public" from the path since public directory is served at root in Vercel
  const res = await fetch(`/${folder}/index.json`);
  const data = await res.json();
  songs = data.songs;
  
  // Rest of the function remains the same
}

// Play a given song - adjust path for consistency
const playMusic = (track, pause = false) => {
  const encodedTrack = encodeURIComponent(track);
  currentsong.src = `/${currfolder}/${encodedTrack}`;
  
  // Rest of the function remains the same
}

// Load album cards - adjust paths for consistency
async function displayalbum() {
  const folders = ["pop", "beats"];
  const cardcontainer = document.querySelector(".card-container");

  for (const folder of folders) {
    try {
      const res = await fetch(`/songs/${folder}/info.json`);
      const info = await res.json();

      cardcontainer.innerHTML += `
        <div class="card" data-folder="${folder}">
          <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#000">
              <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </div>
          <img src="/songs/${folder}/cover.jpeg" alt="">
          <p><h4>${info.title}</h4><br>${info.description}</p>
        </div>
      `;
    } catch (error) {
      console.error(`Error loading album: ${folder}`, error);
    }
  }
  
  // Rest of the function remains the same
}

// Main function - adjust initial path
async function main() {
  await getSongs("songs/pop");
  playMusic(songs[0], true);
  displayalbum();
  
  // Rest of the function remains the same
}