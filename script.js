console.log("Let's start javascript");
let songs;
let currFolder;
let currentSongs = new Audio();
function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
async function getSongs(folder){
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    console.log(as);
    let song = [];
    for (let index = 0; index < as.length; index++) {
        let element = as[index];
        if(element.href.endsWith(".mp3")){
            song.push(element.href);
        }
    }
    return song;

}

function displaySongs(){
    let s = document.querySelector(".songslists");
    let list = s.querySelector("ul");
    list.innerHTML = "";
    for (const element of songs) {
        const song = element.split(`/${currFolder}/`)[1].replaceAll("-"," ").replace(".mp3","");
        const son = song.charAt(0).toUpperCase() + song.slice(1);
        let musicname = son.split(" by ")[0];
        let artistname = son.split(" by ")[1];
        let fi = artistname.split(" ");
        let final = "";
        for(let index = 0; index < fi.length; index++){
            let a = fi[index].charAt(0).toUpperCase() + fi[index].slice(1) + " ";
            final += a;
        }
        let str = `<li data-src=${element} data-songname="${musicname}" data-songinfo="${final}">
                            <div class="puttingsongs">
                                <img class = "musicsvg" src="Img/music.svg" alt="music">
                                <div class="songinfo">
                                    <div class="songname">${musicname}</div>
                                    <div class="songinfo">${final}</div>
                                </div>
                                <div class="playnow">Play now</div>
                                <img class="gplayimg" src="Img/gplay.svg" alt="gpay">
                            </div>
                        </li>`
        list.innerHTML = list.innerHTML + str;        
    }
    console.log(list)
}
async function displayAlbums(){
    let a = await fetch("http://127.0.0.1:5500/Songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    console.log(div); 
    let anchors = div.getElementsByTagName("a");
    let cardssection = document.querySelector(".cardssection");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if(element.href.includes("/Songs/") && !element.href.includes(".mp3")){
            let folder = element.href.split("Songs/")[1]
            let a = await fetch(`http://127.0.0.1:5500/Songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response);
            console.log(folder);
            let str = `<div data-folder="${folder}" class="cards">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                                <rect width="100" height="100" rx="25" fill="#2ECC71" />
                                
                                <polygon points="40,30 70,50 40,70" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2"
                                stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="http://127.0.0.1:5500/Songs/${folder}/cover.jpg" alt="songs">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`;
            cardssection.innerHTML = cardssection.innerHTML + str;

        }
        
    }
    Array.from(document.getElementsByClassName("cards")).forEach(e=>{
        e.addEventListener("click",async item=>{
            console.log(item,item.currentTarget.dataset)
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
            displaySongs();
            currentSongs.src = songs[0];
            console.log(currentSongs.src)
            currentSongs.play();
            document.querySelector(".playpause").innerHTML = `<img src="Img/pause.svg" alt="pause"></div>`
        })
    });
}




displayAlbums();





async function main(){
    songs = await getSongs("Songs");
    displaySongs();
    console.log(songs);
    //var audio = new Audio(songs[0]);
    // audio.play(); 

    //audio.addEventListener("loadeddata", () => {
    //let duration = audio.duration;
    // audio.currentSrc, audio.currentTime
    // The duration variable now holds the duration (in seconds) of the audio clip
    //console.log(duration);
//});
    // let currentSongs = new Audio();

    let s = document.querySelector(".songslists");
    let list = s.querySelector("ul");
    
    let sn = document.querySelector("#songname");
    let si = document.querySelector("#songinfo");
    list.addEventListener("click",(element)=>{
        // console.log(element.target.closest("li"));
        const playbtn = element.target.classList.contains("gplayimg");
        if(!playbtn) return;
        let song = element.target.closest("li");
        const currentsongname = song.getAttribute("data-songname");
        const currentsonginfo = song.getAttribute("data-songinfo");
        if(song){
            const songURL = song.getAttribute("data-src");
            // console.log("Playing: ", songURL);
            if(currentSongs){
                currentSongs.pause();
            }
            currentSongs.src = songURL;
            currentSongs.play();
            sn.innerText = currentsongname;
            si.innerText = currentsonginfo;
            document.querySelector(".songbtn").querySelector(".playpause").innerHTML = `<img src="Img/pause.svg" alt="play">`;
        }
    })
    
    let pp = document.querySelector(".songbtn").querySelector(".playpause");
    pp.addEventListener("click",(element)=>{
        if(currentSongs.paused){
            currentSongs.play();
            pp.innerHTML = `<img src="Img/pause.svg" alt="play">`;
            console.log(currentSongs.src);

        }else{
            currentSongs.pause();
            console.log(currentSongs.src);
            pp.innerHTML = `<img src="Img/play.svg" alt="play">`;
        }
    })
    let timing = document.querySelector(".songtime");
    currentSongs.addEventListener("timeupdate",()=>{
        // console.log(currentSongs.duration,currentSongs.currentTime);
        timing.innerText = `${formatTime(currentSongs.currentTime)} / ${formatTime(currentSongs.duration)}`;
        document.querySelector(".circle").style.left = (currentSongs.currentTime/currentSongs.duration) * 100 + "%";
        // console.log((currentSongs.currentTime/currentSongs.duration) * 100 + "%")

    })



    // Update the songname and songinfo
    currentSongs.addEventListener("loadstart", () => {
    // Find the <li> element that matches the newly loaded song URL
    let targetLi = document.querySelector(`li[data-src="${currentSongs.src}"]`);
    
    if (targetLi) {
        // Extract the song details from that row's custom attributes
        const currentsongname = targetLi.getAttribute("data-songname");
        const currentsonginfo = targetLi.getAttribute("data-songinfo");
        
        // Update your playbar IDs directly without any clicks!
        document.getElementById("songname").innerText = currentsongname;
        document.getElementById("songinfo").innerText = currentsonginfo;
        
        console.log("Automatically updated playbar text for:", currentsongname);
    }
});


    // adda an event for updation od circle in seekbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSongs.currentTime = (currentSongs.duration*percent)/100
    })
    // add an event for hamburger
    document.querySelector(".ham").addEventListener("click",(e)=>{
        document.querySelector(".left").style.left = 0;
    })
    // add an event for close button
    document.querySelector(".close").addEventListener("click",(e)=>{
        document.querySelector(".left").style.left = -100 + "%";
    })
    // add an event for previous button
    document.querySelector(".previousbtn").addEventListener("click",(e)=>{
        let index = songs.indexOf(currentSongs.src);
        if(index - 1 >= 0){
            currentSongs.src = songs[index-1];
            currentSongs.play();
           
        }
    })
    // add an event for next button
    document.querySelector(".nextbtn").addEventListener("click",(e)=>{
        let index = songs.indexOf(currentSongs.src);

        if(index + 1 < songs.length){
            currentSongs.src = songs[index+1];
            currentSongs.play();
            
        }
    })
    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e.target.value);
        currentSongs.volume = parseInt(e.target.value)/100
    })
    // Add an event for choose the folder
    Array.from(document.getElementsByClassName("cards")).forEach(e=>{
        e.addEventListener("click",async item=>{
            console.log(item,item.currentTarget.dataset)
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
            displaySongs();
        })
    });
    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("Img/volume.svg")){
            e.target.src = e.target.src.replace("Img/volume.svg", "Img/mute.svg")
            currentSongs.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("Img/mute.svg", "Img/volume.svg")
            currentSongs.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

}
main();
