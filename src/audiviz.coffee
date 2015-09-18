class @Audiviz
  constructor: (canvasClass, playerId) ->
    @canvas    = document.querySelector(canvasClass);
    @player    = document.getElementById(playerId);
    @canvasCtx = @canvas.getContext("2d")
    @audioCtx  = new (window.AudioContext || window.webkitAudioContext)()
    @analyser  = @audioCtx.createAnalyser()
    @WIDTH     = @canvas.width
    @HEIGHT    = @canvas.height

  init: ->
    @analyser.fftSize = 256
    @source = @audioCtx.createMediaElementSource(@player)
    @source.connect(@analyser);
    @analyser.connect(@audioCtx.destination);
    @bufferLength = @analyser.frequencyBinCount;
    @dataArray = new Uint8Array(@bufferLength);


  draw: =>
    drawVisual = requestAnimationFrame(@draw)
    @analyser.getByteFrequencyData @dataArray
    @canvasCtx.fillStyle = 'rgb(0, 0, 0)'
    @canvasCtx.fillRect 0, 0, @WIDTH, @HEIGHT
    barWidth = @WIDTH / @bufferLength * 2.5
    x = 0
    for barHeight in @dataArray
      @canvasCtx.fillStyle = 'rgb(' + barHeight + 100 + ',50,50)'
      @canvasCtx.fillRect x, @HEIGHT - (barHeight / 2), barWidth, barHeight / 2
      x += barWidth + 1

  run: ->
    @player.play()
    @init()
    @draw()