(function() {
  // create web audio context
  var audioCtx = new (window.AudioContext || window.webkitAudioContext) ();

  var keys = Array.prototype.slice.call(document.getElementsByClassName('key'));

  keys.forEach(function(key) {
    key.onmouseover = function() {
      var oscillator = audioCtx.createOscillator();
      
      var gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = parseFloat(key.getAttribute('data-freq')); // value in hertz

      // 最初音量为0
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      // 0.01秒后音量为1
      gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
      // 从当前时间播放
      oscillator.start(audioCtx.currentTime);
      // 1秒内声音逐渐降低
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      // 1秒后停止播放
      oscillator.stop(audioCtx.currentTime + 1);
    }
  })
}());


