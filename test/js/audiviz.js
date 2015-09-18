(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Audiviz = (function() {
    function Audiviz(canvasId, playerId) {
      this.draw = bind(this.draw, this);
      this.canvas = document.querySelector(canvasId);
      this.player = document.getElementById(playerId);
      this.canvasCtx = this.canvas.getContext("2d");
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioCtx.createAnalyser();
      this.WIDTH = this.canvas.width;
      this.HEIGHT = this.canvas.height;
    }

    Audiviz.prototype.init = function() {
      this.analyser.fftSize = 256;
      this.source = this.audioCtx.createMediaElementSource(this.player);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      this.bufferLength = this.analyser.frequencyBinCount;
      return this.dataArray = new Uint8Array(this.bufferLength);
    };

    Audiviz.prototype.draw = function() {
      var barHeight, barWidth, drawVisual, i, len, ref, results, x;
      drawVisual = requestAnimationFrame(this.draw);
      this.analyser.getByteFrequencyData(this.dataArray);
      this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
      barWidth = this.WIDTH / this.bufferLength * 2.5;
      x = 0;
      ref = this.dataArray;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        barHeight = ref[i];
        this.canvasCtx.fillStyle = 'rgb(' + barHeight + 100 + ',50,50)';
        this.canvasCtx.fillRect(x, this.HEIGHT - (barHeight / 2), barWidth, barHeight / 2);
        results.push(x += barWidth + 1);
      }
      return results;
    };

    Audiviz.prototype.run = function() {
      this.player.play();
      this.init();
      return this.draw();
    };

    return Audiviz;

  })();

}).call(this);
