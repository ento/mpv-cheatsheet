var assdraw = require('./assdraw.js')
var shortcuts = [
  {
    category: 'Navigation',
    shortcuts: [
      {keys: ', / .', effect: 'Seek by frame'},
      {keys: '← / →', effect: 'Seek by 5 seconds'},
      {keys: '↓ / ↑', effect: 'Seek by 1 minute'},
      {keys: '[Shift] PGDWN / PGUP', effect: 'Seek by 10 minutes'},
      {keys: '[Shift] ← / →', effect: 'Seek by 1 second (exact)'},
      {keys: '[Shift] ↓ / ↑', effect: 'Seek by 5 seconds (exact)'},
      {keys: '[Ctrl] ← / →', effect: 'Seek by subtitle'},
      {keys: '[Shift] BACKSPACE', effect: 'Undo last seek'},
      {keys: '[Ctrl+Shift] BACKSPACE', effect: 'Mark current position'},
      {keys: 'l', effect: 'Set/clear A-B loop points'},
      {keys: 'L', effect: 'Toggle infinite looping'},
      {keys: 'PGDWN / PGUP', effect: 'Previous/next chapter'},
      {keys: '< / >', effect: 'Go backward/forward in the playlist'},
      {keys: 'ENTER', effect: 'Go forward in the playlist'},
      {keys: 'F8', effect: 'Show playlist [UI]'},
    ]
  },
  {
    category: 'Playback',
    shortcuts: [
      {keys: 'p / SPACE', effect: 'Pause/unpause'},
      {keys: '[ / ]', effect: 'Decrease/increase speed [10%]'},
      {keys: '{ / }', effect: 'Halve/double speed'},
      {keys: 'BACKSPACE', effect: 'Reset speed'},
      {keys: 'o / P', effect: 'Show progress'},
      {keys: 'O', effect: 'Toggle progress'},
      {keys: 'i / I', effect: 'Show/toggle stats'},
    ]
  },
  {
    category: 'Subtitle',
    shortcuts: [
      {keys: '[Ctrl+Shift] ← / →', effect: 'Adjust subtitle delay [subtitle]'},
      {keys: '[Shift] f / g', effect: 'Adjust subtitle size [0.100]'},
      {keys: 'z / Z', effect: 'Adjust subtitle delay [0.1sec]'},
      {keys: 'v', effect: 'Toggle subtitle visibility'},
      {keys: 'u', effect: 'Toggle subtitle style overrides'},
      {keys: 'V', effect: 'Toggle subtitle VSFilter aspect compatibility mode'},
      {keys: 'r / R', effect: 'Move subtitles up/down'},
      {keys: 'j / J', effect: 'Cycle subtitle'},
      {keys: 'F9', effect: 'Show audio/subtitle list [UI]'},
    ]
  },
  {
    category: 'Audio',
    shortcuts: [
      {keys: 'm', effect: 'Mute sound'},
      {keys: '#', effect: 'Cycle audio track'},
      {keys: '/ / *', effect: 'Decrease/increase volume'},
      {keys: '9 / 0', effect: 'Decrease/increase volume'},
      {keys: '[Ctrl] - / +', effect: 'Decrease/increase audio delay [0.1sec]'},
      {keys: 'F9', effect: 'Show audio/subtitle list [UI]'},
    ]
  },
  {
    category: 'Video',
    shortcuts: [
      {keys: '_', effect: 'Cycle video track'},
      {keys: 'A', effect: 'Cycle aspect ratio'},
      {keys: 'd', effect: 'Toggle deinterlacer'},
      {keys: '[Ctrl] h', effect: 'Toggle hardware video decoding'},
      {keys: 'w / W', effect: 'Decrease/increase pan-and-scan range'},
      {keys: '[Alt] - / +', effect: 'Zoom out/in'},
      {keys: '[Alt] ARROWS', effect: 'Move the video rectangle'},
      {keys: '[Alt] BACKSPACE', effect: 'Reset pan/zoom'},
      {keys: '1 / 2', effect: 'Decrease/increase contrast'},
      {keys: '3 / 4', effect: 'Decrease/increase brightness'},
      {keys: '5 / 6', effect: 'Decrease/increase gamma'},
      {keys: '7 / 8', effect: 'Decrease/increase saturation'},
    ]
  },
  {
    category: 'Application',
    shortcuts: [
      {keys: 'q', effect: 'Quit'},
      {keys: 'Q', effect: 'Save position and quit'},
      {keys: 's', effect: 'Take a screenshot'},
      {keys: 'S', effect: 'Take a screenshot without subtitles'},
      {keys: '[Ctrl] s', effect: 'Take a screenshot as rendered'},
    ]
  },
  {
    category: 'Window',
    shortcuts: [
      {keys: 'f', effect: 'Toggle fullscreen'},
      {keys: '[Command] f', effect: 'Toggle fullscreen [macOS]'},
      {keys: 'ESC', effect: 'Exit fullscreen'},
      {keys: 'T', effect: 'Toggle stay-on-top'},
      {keys: '[Alt] 0', effect: 'Resize window to 0.5x [macOS]'},
      {keys: '[Alt] 1', effect: 'Reset window size [macOS]'},
      {keys: '[Alt] 2', effect: 'Resize window to 2x [macOS]'},
    ]
  },
  {
    category: 'Multimedia keys',
    shortcuts: [
      {keys: 'PAUSE', effect: 'Pause'}, // keyboard with multimedia keys
      {keys: 'STOP', effect: 'Quit'}, // keyboard with multimedia keys
      {keys: 'PREVIOUS / NEXT', effect: 'Seek 1 minute'}, // keyboard with multimedia keys
    ]
  },
]

var State = {
  active: false,
  startLine: 0,
  startCategory: 0
}

var opts = {
  font: 'monospace',
  'font-size': 8,
  'usage-font-size': 6,
}

function repeat(s, num) {
  var ret = '';
  for (var i = 0; i < num; i++) {
    ret = ret + s;
  }
  return ret;
}

function renderCategory(category) {
  var lines = []
  lines.push(assdraw.bolden(category.category))
  var maxKeysLength = 0;
  category.shortcuts.forEach(function(shortcut) {
    if (shortcut.keys.length > maxKeysLength) maxKeysLength = shortcut.keys.length
  })
  category.shortcuts.forEach(function(shortcut) {
    var padding = repeat(" ", maxKeysLength - shortcut.keys.length)
    lines.push(assdraw.escape(shortcut.keys + padding + " " + shortcut.effect))
  })
  return lines
}

function render() {
  var screen = mp.get_osd_size()
  if (!State.active) {
    mp.set_osd_ass(0, 0, '{}')
    return
  }
  var ass = new assdraw()
  ass.newEvent()
  ass.override(function() {
    this.lineAlignment(assdraw.TOP_LEFT)
    this.primaryFillAlpha('00')
    this.borderAlpha('00')
    this.shadowAlpha('99')
    this.primaryFillColor('eeeeee')
    this.borderColor('111111')
    this.shadowColor('000000')
    this.fontName(opts.font)
    this.fontSize(opts['font-size'])
    this.borderSize(1)
    this.xShadowDistance(0)
    this.yShadowDistance(1)
    this.letterSpacing(0)
    this.wrapStyle(assdraw.EOL_WRAPPING)
  })
  var mainLines = [];
  var pushedCategory = false
  shortcuts.forEach(function(category, i) {
    if (i < State.startCategory) {
      return;
    }
    pushedCategory = true;
    if (pushedCategory) {
      mainLines.push("")
    }
    mainLines.push.apply(mainLines, renderCategory(category))
  })
  mainLines.slice(State.startLine).forEach(function(line) {
    ass.appendLN(line);
  })

  ass.newEvent()
  var sideLines = renderCategory({
    category: 'usage',
    shortcuts: Keybindings
  })
  ass.override(function() {
    this.lineAlignment(assdraw.TOP_RIGHT)
    this.fontSize(opts['usage-font-size'])
  })
  sideLines.forEach(function(line) {
    ass.appendLN(line);
  })

  mp.set_osd_ass(0, 0, ass.text)
}

function setActive(active) {
  if (active == State.active) return
  if (active) {
    State.active = true
    updateBindings(Keybindings, true)
  } else {
    State.active = false
    updateBindings(Keybindings, false)
  }
  render()
}

function updateBindings(bindings, enable) {
  bindings.forEach(function(binding, i) {
    var name = '__cheatsheet_binding_' + i
    if (enable) {
      mp.add_forced_key_binding(binding.keys, name, binding.callback, binding.options)
    } else {
      mp.remove_key_binding(name)
    }
  })
}

var Keybindings = [
  {
    keys: 'esc',
    effect: 'close',
    callback: function() { setActive(false) }
  },
  {
    keys: '?',
    effect: 'close',
    callback: function() { setActive(false) }
  },
  {
    keys: 'j',
    effect: 'next line',
    callback: function() {
      State.startLine += 1
      render()
    },
    options: 'repeatable'
  },
  {
    keys: 'k',
    effect: 'prev line',
    callback: function() {
      State.startLine = Math.max(0, State.startLine - 1)
      render()
    },
    options: 'repeatable'
  },
  {
    keys: 'n',
    effect: 'next category',
    callback: function() {
      State.startCategory += 1
      State.startLine = 0
      render()
    },
    options: 'repeatable'
  },
  {
    keys: 'p',
    effect: 'prev category',
    callback: function() {
      State.startCategory = Math.max(0, State.startCategory - 1)
      State.startLine = 0
      render()
    },
    options: 'repeatable'
  },
]

mp.add_key_binding('?', 'cheatsheet-enable', function() { setActive(true) })

mp.observe_property('osd-width', 'native', render)
mp.observe_property('osd-height', 'native', render)
