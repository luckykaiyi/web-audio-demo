(function() {
  // create web audio context
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // create source
  var myAudio = document.querySelector('audio');
  var source = audioCtx.createMediaElementSource(myAudio);

  // create analyser
  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  var bufferlength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferlength);

  //connect nodes
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  
  // create canvas context
  var canvas = document.getElementById('visualizer');
  var canvasCtx = canvas.getContext('2d');
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  var barWidth = canvasWidth / bufferlength; 
  var barHeight;
  var capH = 3; //顶部小块的高度
  var caps = [];

  // create LinearGradient
  var gradient = canvasCtx.createLinearGradient(0,0,0,canvasHeight);
  gradient.addColorStop(0,"#e01d4e");
  gradient.addColorStop(0.5,"#9a1de0");
  gradient.addColorStop(1,"#17e9f9");
 
  function initAudio() {
    var defaultMusic = document.querySelector('.music');
    myAudio.src = defaultMusic.getAttribute('data-src');
    switchMusic();
  }

  function getCaps() {
    dataArray.forEach(function() {
      caps.push({h: 0})
    })
  }

  function switchMusic() {
    var musics = Array.prototype.slice.call(document.getElementsByClassName('music'));
    musics.forEach(function(music) {
      var src = music.getAttribute('data-src');
      music.onclick = function() {
        myAudio.src = src;
        myAudio.play();
      }
    })
  }

  function draw() {
    requestAnimationFrame(draw);
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    analyser.getByteFrequencyData(dataArray);
    for(var i = 0; i < bufferlength; i++) {
      var cap = caps[i];
      barHeight = dataArray[i] / 256 * canvasHeight;
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(barWidth * i, canvasHeight - barHeight, barWidth * 0.8, barHeight);
      canvasCtx.fillRect(barWidth * i, canvasHeight - (capH + cap.h), barWidth * 0.8, capH);
      cap.h--;
      cap.h = Math.max(cap.h, 0);
      if(barHeight > 0 && cap.h < barHeight + 30){
        cap.h = Math.min(barHeight + 30, canvasHeight - capH);
      }
    }
  }
  initAudio();
  getCaps();
  draw();
}());