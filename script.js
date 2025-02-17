let currentsong = new Audio();
let songs;
let currfolder;


function secondsToMinutesSeconds (seconds) {
  if (isNaN(seconds) ||   seconds < 0){
  return "00:00";
  }
else{
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds) .padStart(2, '0');
  
  return `${ formattedMinutes}: ${ formattedSeconds}` ;
  }}

async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songul=document.querySelector(".songslist").getElementsByTagName("ul")[0];
  songul.innerHTML = "";
  for (const song of songs) {
      songul.innerHTML=songul.innerHTML + 
      `<li>
      <img class="invert" src="svgs/music.svg" alt="">
            <div class="songinfo">
              <div>${song.replaceAll("%20"," ").replaceAll("%26"," ")}</div>
              <div>artist name</div>
            </div>
            <img class="invert" id="plays" src="svgs/play1.svg" alt=""> </li>`;
  }
  Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e=>
    e.addEventListener("click",element=>{
      playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML.trim());
    })
  )
  return songs;
}
const playMusic =(track, pause=false)=>{
  currentsong.src = `/${currfolder}/` + track;
  if(!pause){
  currentsong.play();
  play.src="svgs/pause.svg";
  }
  document.querySelector(".songdetail").innerHTML= decodeURI(track);
  document.querySelector(".songtime").innerHTML="00:00 / 00:00";
 
}

async function displayalbum(){
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardcontainer = document.querySelector(".card-container");
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
    }
    if(e.href.includes("/songs/") && !e.href.includes(".haccess")){
      let folder = e.href.split("/").slice(-1)[0];
      let a = await  fetch(`/songs/${folder}/info.json`);
      let response = await a.json(); 
      console.log(response);
      cardcontainer.innerHTML=cardcontainer.innerHTML + 
      `<div class="card">
                            <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="#000000">
                              <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                          </svg></div>
                              <img src="songs/${folder}/cover.jpeg" alt="">
                              <p><h4>${response.title}</h4><br>
                               ${response.description}</p>
          
                         
                </div>
                `
    }
}
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    playMusic(songs[0]);
    })
  })
  
async function main(){

    await getSongs("songs/pop");
    playMusic(songs[0],true);

   displayalbum();
    play.addEventListener("click",()=>{
      if(currentsong.paused){
        currentsong.play();
        play.src="svgs/pause.svg";
      }
      else{
        currentsong.pause();
        play.src="svgs/play.svg";
      }
    })

    currentsong.addEventListener("timeupdate",()=>{
      document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
      document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
      let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
          document.querySelector(".circle").style.left = percent + "%";
          currentsong.currentTime = (currentsong.duration*percent)/100;
    })
  
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "0%";
    document.querySelector(".left").style.position = "fixed";
  })
  document.querySelector(".logo").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-120%";
  })

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>
  {
     currentsong.volume =parseInt(e.target.value)/100;
     currvolume = currentsong.volume;
  })
  previous.addEventListener("click",()=>{
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if((index-1)>=0){
      playMusic(songs[index-1]);
    }
  })

  next.addEventListener("click",()=>{
    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if((index+1)<songs.length){
      playMusic(songs[index+1]);
    }

  })
  document.addEventListener("keydown",e=>{
    if(e.key=== " "){
      if(currentsong.paused){
        currentsong.play();
        play.src="svgs/pause.svg";
      }
      else{
        currentsong.pause();
        play.src="svgs/play.svg";
      }
    }
  })
  document.querySelector(".volume>img").addEventListener("click",(e)=>{
      if(e.target.src.includes("svgs/volume.svg")){
        e.target.src = e.target.src.replace("svgs/volume.svg","svgs/mute.svg");
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
      }
      else{
        e.target.src = e.target.src.replace("svgs/mute.svg","svgs/volume.svg",);
        currentsong.volume = 0.30;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
      }
  })
 
}
main();



