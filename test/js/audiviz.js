(function() {
  var slice = [].slice,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  (function($, window) {
    var Audiviz;
    return Audiviz = (function() {
      Audiviz.prototype.defaults = {
        canvas: '.visualizer',
        style: 'circle'
      };

      function Audiviz(el, options) {
        var audiviz;
        this.options = $.extend({}, this.defaults, options);
        this.$el = $(el);
        audiviz = new Main(el, this.options.canvas, this.options.style);
        audiviz.run();
      }

      $.fn.extend({
        audiViz: function() {
          var args, option;
          option = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          return this.each(function() {
            var $this, data;
            $this = $(this);
            data = $this.data('audiViz');
            if (!data) {
              return $this.data('audiViz', (data = new Audiviz(this, option)));
            }
          });
        }
      });

      return Audiviz;

    })();
  })(window.jQuery, window);

  this.Main = (function() {
    function Main(player, canvasClass, style) {
      this.player = player;
      this.canvas = document.querySelector(canvasClass);
      this.style = style;
    }

    Main.prototype.draw = function() {
      var visualizer;
      switch (this.style) {
        case "bars":
          visualizer = new Bars(this.canvas, this.player);
          break;
        case "dots":
          visualizer = new Dots(this.canvas, this.player);
          break;
        case "circle":
          visualizer = new Circle(this.canvas, this.player);
      }
      return visualizer.draw();
    };

    Main.prototype.run = function() {
      this.player.play();
      return this.draw();
    };

    return Main;

  })();

  this.Base = (function() {
    function Base(canvas, player, background, foreground) {
      if (background == null) {
        background = 'rgb(0, 0, 0)';
      }
      if (foreground == null) {
        foreground = 'rgb(100, 50, 50)';
      }
      this.canvasCtx = canvas.getContext("2d");
      this.background = background;
      this.foreground = foreground;
      this.WIDTH = canvas.width;
      this.HEIGHT = canvas.height;
      this.init(player);
    }

    Base.prototype.init = function(player) {
      var audioCtx;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.connect(audioCtx.destination);
      this.source = audioCtx.createMediaElementSource(player);
      return this.source.connect(this.analyser);
    };

    Base.prototype.setBackground = function() {
      this.canvasCtx.fillStyle = this.background;
      return this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
    };

    Base.prototype.setAnimationFrame = function() {
      var drawVisual;
      drawVisual = requestAnimationFrame(this.draw);
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
      return this.analyser.getByteFrequencyData(this.dataArray);
    };

    return Base;

  })();

  this.Bars = (function(superClass) {
    extend(Bars, superClass);

    function Bars() {
      this.draw = bind(this.draw, this);
      return Bars.__super__.constructor.apply(this, arguments);
    }

    Bars.prototype.draw = function() {
      var height, i, len, ref, results, width, x;
      this.setAnimationFrame();
      this.setBackground();
      width = this.WIDTH / this.bufferLength * 2.5;
      x = 0;
      ref = this.dataArray;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        height = ref[i];
        this.canvasCtx.fillStyle = 'rgb(' + parseInt(height + 100) + ',50,50)';
        this.canvasCtx.fillRect(x, this.HEIGHT - (height / 2), width, height / 2);
        results.push(x += width + 1);
      }
      return results;
    };

    return Bars;

  })(Base);

  this.Dots = (function(superClass) {
    extend(Dots, superClass);

    function Dots() {
      this.draw = bind(this.draw, this);
      return Dots.__super__.constructor.apply(this, arguments);
    }

    Dots.prototype.draw = function() {
      var height, i, len, ref, results, width, x;
      this.setAnimationFrame();
      this.setBackground();
      width = this.WIDTH / this.bufferLength * 2.5;
      x = 0;
      ref = this.dataArray;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        height = ref[i];
        this.canvasCtx.strokeStyle = 'rgb(' + parseInt(height + 100) + ',50,50)';
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(x, this.HEIGHT - (height / 2), width / 4, 0, 2 * Math.PI);
        this.canvasCtx.fillStyle = 'rgb(' + parseInt(height + 100) + ',50,50)';
        this.canvasCtx.fill();
        this.canvasCtx.stroke();
        results.push(x += width + 1);
      }
      return results;
    };

    return Dots;

  })(Base);

  this.Circle = (function(superClass) {
    extend(Circle, superClass);

    function Circle() {
      this.draw = bind(this.draw, this);
      return Circle.__super__.constructor.apply(this, arguments);
    }

    Circle.prototype.draw = function() {
      var height, i, len, ref, results, width, x;
      this.setAnimationFrame();
      this.setBackground();
      width = this.WIDTH / this.bufferLength * 2.5;
      x = 0;
      ref = this.dataArray;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        height = ref[i];
        this.canvasCtx.strokeStyle = 'rgb(' + parseInt(height + 100) + ',50,50)';
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(this.WIDTH / 2, this.HEIGHT / 2, width * height, 0, 2 * Math.PI);
        this.canvasCtx.fillStyle = 'rgb(' + parseInt(height + 100) + ',50,50)';
        this.canvasCtx.fill();
        this.canvasCtx.lineWidth = 4;
        this.canvasCtx.strokeStyle = '#ff6600';
        this.canvasCtx.stroke();
        results.push(x += width + 1);
      }
      return results;
    };

    return Circle;

  })(Base);

}).call(this);
