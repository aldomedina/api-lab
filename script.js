// p5 functions
// duration() ; currentTime(); jump(); 
// addCue(seconds, fn);


////////////////////////////////////////////////////////
/////////////////////    .API    ///////////////////////
////////////////////////////////////////////////////////
var APIctrl = (function() {
let data = {
    bands: [
        {
            id: 0,
            name: "geometry_dash_1.9",
            songs: []
        }
    ]   
}

let traerArcade = function() {
    fetch('https://archive.org/metadata/geometry_dash_1.9/')
    .then(res => res.json())
    .then(apiData => {
        for (var i = 0; i < apiData.files.length; i++) {
            if (apiData.files[i].format == "VBR MP3") {
                let ul, li, el;
                let originalApiName = apiData.files[i].name;
                let almostName = originalApiName.split(".");
                let almostName2 = almostName[0].split("/");
                let songName = almostName2[1];
                let songUrl = `https://ia800702.us.archive.org/17/items/geometry_dash_1.9/Geometry Dash OST/${songName}.mp3`;
                data.bands[0].songs[i] = {
                    name: songName,
                    media: songUrl
                }
                data.metadata = apiData.metadata;
                ul = document.getElementById("songList");
                li = document.createElement("LI");
                li.id=`${i}`
                el = document.createTextNode(data.bands[0].songs[i].name);
                li.appendChild(el);
                ul.appendChild(li);

                
            }
        }  
        let cont = document.getElementById('otro-5');
        let html = `<div>
            <p><span>api name:  </span>${apiData.metadata.description}<p>
            <p><span>api server:  </span>${apiData.workable_servers[0]}<p>
            <p><span>api creator:  </span>${apiData.metadata.creator}<p>            
        </div>`
        cont.insertAdjacentHTML('beforeend', html);
    })
}
    return {
        getSongs: {
            musicData: data
        },
        getInfo: () => data.metadata,
        showSongs: function() {
            traerArcade()
        }
    }

})();

////////////////////////////////////////////////////////
/////////////////////    DRAW    ///////////////////////
////////////////////////////////////////////////////////

var DRAWctrl = (function() {
    const bgCol = 'lightpink';
    const lnCol = 'red';
    const mainVis = document.getElementById('soundVis');
    const ojoDiv = document.getElementById('otro-4');
    const playBtn = document.getElementById('play');
    const pauseBtn = document.getElementById('pause');
    const playI = document.getElementById('play-icon');
    const pauseI = document.getElementById('pause-icon');
    const graphVis = document.getElementById('otro-6');
    let song;
    

    let displayP5 = function(url, name) {                
        
        let amp = new p5.Amplitude();
        
        let showName = function(name){     
            let songT;

            for (let i=0; i<=1 ;i++){
                songT = document.getElementsByClassName('song-title')[i];
                songT.innerHTML = name;
            }
            
        };

        let audioCtrl = function(p) {  
            if(song) {                        
                song.pause();
                playI.classList.remove('fa-play');
                console.log("song stopped!")
                song = "";
            }
            
            p.setup = function() {        
                p.noCanvas();
                song = p.loadSound(url, loaded);   
            }

            loaded = function() {
                console.log("loaded!");
                playI.classList.add('fa-play');
                let play = function() {                    
                    if (!song.isPlaying()){                
                        song.play();                     
                        console.log("play: " + song);                    
                    }
                }

                let pause = function() {
                    if (song.isPlaying()){ 
                        song.pause();
                       
                        console.log("pause!");
                    }
                }
                playBtn.addEventListener('click', play);        
                pauseBtn.addEventListener('click', pause);        
            }
            return song;
        }
        
        let vis1 = function(p) {
            let width = mainVis.offsetWidth;
            let height = mainVis.offsetHeight;
            p.setup = function() {        
                let cnv = p.createCanvas(width, height);
                cnv.parent('soundVis');
                p.background(bgCol)
            }
        
            p.draw = function() {
                
                let nw = mainVis.offsetWidth;
                let nh = mainVis.offsetHeight;
        
                let vol = amp.getLevel();
                let diam = p.map(vol, 0, 1, height/16, height*4);
                
                p.ellipseMode(p.CENTER);
                p.noFill();
                let checkOdd = p.frameCount % 2;
                if (checkOdd !== 0) {
                    p.stroke(lnCol);
                } else {
                    p.stroke(bgCol);
                }
                p.strokeWeight(3)
                p.ellipse(nw/2, nh/2, diam, diam);
            }
        
            p.windowResized = function() {
                let nw = mainVis.offsetWidth;
                let nh = mainVis.offsetHeight;
                p.resizeCanvas(nw, nh);
            }
        }    
        
        let ojo = function(p) {            
            let width = ojoDiv.offsetWidth;
            let height = ojoDiv.offsetHeight;      

            p.setup = function() {
                let cnv = p.createCanvas(width-2, height-2, p.WEBGL);
                cnv.parent('otro-4');
            }

            p.draw = function() {
                p.background(bgCol)
                let vol = amp.getLevel();
                p.stroke(lnCol)
                p.noFill();
                p.push()
                p.translate(width/2, 0)
                p.push()

                if (vol > 0) {  
                                    
                    p.rotateX(p.frameCount * 0.01*vol);
                    p.rotateY(p.frameCount * 0.01);
                }
                p.sphere(height/2);
                p.pop();       
                p.pop(); 

                p.push()
                p.translate(-width/2, 0)
                p.push()

                if (vol > 0) {  
                                    
                    p.rotateX(p.frameCount * 0.01*vol);
                    p.rotateY(p.frameCount * 0.01);
                }
                p.sphere(height/2);
                p.pop();       
                p.pop();         
            }
            p.windowResized = function() {
                let nw = ojoDiv.offsetWidth;
                let nh = ojoDiv.offsetHeight;
                p.resizeCanvas(nw, nh);
            }    
            
        }
        // let ojo = function(p) {
        //     let eyeball;
        //     let width = ojoDiv.offsetWidth;
        //     let height = ojoDiv.offsetHeight;

        //     p.preload = function() {
        //         // Load model with normalise parameter set to true
        //         img = p.loadImage('media/Eye_D.jpg');
        //         eyeball = p.loadModel('media/eyeball.obj', true);
        //     }

        //     p.setup = function() {
        //         let cnv = p.createCanvas(width-2, height-2, p.WEBGL);
        //         cnv.parent('otro-4');
        //     }

        //     p.draw = function() {
        //         p.background(bgCol)
        //         let vol = amp.getLevel();
        //         let diam = p.map(vol, 0, 1, 0, 3.6);
        //         let pos = p.map(vol, 0, 1, 0, width);
        //         p.scale(diam); // Scaled to make model fit into canvas
        //         p.rotateX(p.frameCount * 0.01);
        //         p.rotateY(p.frameCount * 0.01);
        //         // p.normalMaterial(); // For effect
        //         p.texture(img);
        //         p.translate(pos, pos);
        //         let eye = p.model(eyeball);                        
        //     }
        //     p.windowResized = function() {
        //         let nw = ojoDiv.offsetWidth;
        //         let nh = ojoDiv.offsetHeight;
        //         p.resizeCanvas(nw, nh);
        //     }    
            
        // }

        let graph = function(p) {
            let volHistory;
            let width = graphVis.offsetWidth;
            let height = graphVis.offsetHeight;
            volHistory = [];
            
            p.setup = function() {                      
                let cnv = p.createCanvas(width, height);
                cnv.parent('otro-6');            
            }
            p.draw = function() {
                p.clear();
                p.stroke(bgCol);
                let vol = amp.getLevel();
                let nw = graphVis.offsetWidth;
                let nh = graphVis.offsetHeight;

                volHistory.push(vol);
                p.beginShape();
                p.fill(lnCol);
                // p.noFill();
                p.strokeWeight(1);
                for (let i=0; i<volHistory.length; i++) {
                    let y = p.map(volHistory[i], 0, 0.4, (nh+nh/100), 0);
                    p.vertex(i, y);
                }
                p.endShape();

                if(volHistory.length > width) {
                    volHistory.splice(0, 1);
                }
                
            }

            p.windowResized = function() {
                let nw = graphVis.offsetWidth;
                let nh = graphVis.offsetHeight;
                p.resizeCanvas(nw, nh);
            }    
            
        }

        // Calls 
        showName(name);
        new p5(audioCtrl);
        new p5(vis1);
        new p5(ojo);
        new p5(graph);        
    }
    return {
        choosenSong: function(u,n) {    
            console.log("|||||||||CAMBIO|||||||||||")
            while (mainVis.hasChildNodes()) {  
                mainVis.removeChild(mainVis.firstChild); 
                console.log("vis4 removed")                            
            }             
            while(ojoDiv.hasChildNodes()){
                ojoDiv.removeChild(ojoDiv.firstChild); 
                console.log("ojo removed")    
            }
            while(graphVis.hasChildNodes()){
                graphVis.removeChild(graphVis.firstChild); 
                console.log("graph removed")    
            }
            console.log(u);                               
            displayP5(u,n);
        }
    }
            

})();

////////////////////////////////////////////////////////
/////////////////////    CTRL    ///////////////////////
////////////////////////////////////////////////////////

var MAINctrl = (function(API,DRAW) {

    var eListeners = function() {
        document.getElementById('songList').addEventListener('click', getSong);
    }
    let getSong = function() {
        let id = event.target.id;
        let url = API.getSongs.musicData.bands[0].songs[id].media
        let name = API.getSongs.musicData.bands[0].songs[id].name
        DRAW.choosenSong(url, name);
        console.log(id);
    }

    

    return {
        init: function() {
            API.showSongs();           
            eListeners();
            
        },

    }
})(APIctrl,DRAWctrl);

MAINctrl.init();