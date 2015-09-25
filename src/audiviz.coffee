(($, window) ->
  # Define the plugin class
  class Audiviz
    defaults:
      canvas: '.visualizer'
      style: 'circle'

    constructor: (el, options) ->
      @options = $.extend({}, @defaults, options)
      @$el = $(el)
      audiviz = new Main(el, @options.canvas, @options.style);
      audiviz.run();

    # Define the plugin
    $.fn.extend audiViz: (option, args...) ->
      @each ->
        $this = $(this)
        data = $this.data('audiViz')
        if !data
          $this.data 'audiViz', (data = new Audiviz(this, option))
        # if typeof option == 'string'
        #   data[option].apply(data, args)
          
) window.jQuery, window

class @Main
  constructor: (player, canvasClass, style) ->
    @player    = player;
    @canvas    = document.querySelector(canvasClass);
    @style     = style

  draw: ->
    switch @style
      when "bars" then visualizer = new Bars(@canvas, @player)
      when "dots" then visualizer = new Dots(@canvas, @player)
      when "circle" then visualizer = new Circle(@canvas, @player)
    visualizer.draw()

  run: ->
    @player.play()
    @draw()


class @Base
  constructor: (canvas, player, background = 'rgb(0, 0, 0)', foreground = 'rgb(100, 50, 50)') ->
    @canvasCtx  = canvas.getContext("2d")
    @background = background
    @foreground = foreground
    @WIDTH      = canvas.width
    @HEIGHT     = canvas.height
    @init(player)

  init: (player) ->
    audioCtx  = new (window.AudioContext || window.webkitAudioContext)()
    @analyser = audioCtx.createAnalyser()
    @analyser.fftSize = 2048
    @analyser.connect(audioCtx.destination)
    @source = audioCtx.createMediaElementSource(player)
    @source.connect(@analyser)

  setBackground: () ->
    @canvasCtx.fillStyle = @background
    @canvasCtx.fillRect 0, 0, @WIDTH, @HEIGHT

  setAnimationFrame: () ->
    drawVisual = requestAnimationFrame(@draw)
    @bufferLength = @analyser.frequencyBinCount;
    @dataArray = new Uint8Array(@bufferLength);
    @analyser.getByteFrequencyData @dataArray
   

class @Bars extends Base  
  draw: () =>
    @setAnimationFrame()
    @setBackground()
    width = @WIDTH / @bufferLength * 2.5
    x = 0
    for height in @dataArray
      @canvasCtx.fillStyle = 'rgb(' + parseInt(height + 100) + ',50,50)'
      @canvasCtx.fillRect x, @HEIGHT - (height / 2), width, height / 2
      x += width + 1


class @Dots extends Base
  draw: () =>
    @setAnimationFrame()
    @setBackground()
    width = @WIDTH / @bufferLength * 2.5
    x = 0
    for height in @dataArray
      @canvasCtx.strokeStyle = 'rgb(' + parseInt(height + 100) + ',50,50)';
      @canvasCtx.beginPath();
      @canvasCtx.arc(x,  @HEIGHT - (height / 2), width / 4, 0, 2 * Math.PI)
      @canvasCtx.fillStyle = 'rgb(' + parseInt(height + 100) + ',50,50)';
      @canvasCtx.fill();
      @canvasCtx.stroke();
      x += width + 1


class @Circle extends Base
  draw: () =>
    @setAnimationFrame()
    @setBackground()
    width = @WIDTH / @bufferLength * 2.5
    x = 0
    for height in @dataArray
      @canvasCtx.strokeStyle = 'rgb(' + parseInt(height + 100) + ',50,50)';
      @canvasCtx.beginPath();
      @canvasCtx.arc(@WIDTH / 2,  @HEIGHT / 2, width * height, 0, 2 * Math.PI)
      @canvasCtx.fillStyle = 'rgb(' + parseInt(height + 100) + ',50,50)';
      @canvasCtx.fill();
      @canvasCtx.lineWidth = 4;
      @canvasCtx.strokeStyle = '#ff6600';
      @canvasCtx.stroke();
      x += width + 1
