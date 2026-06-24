(function() {
  var game;
  var ui;

  var DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric' };

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    // Add your custom code here.
  };

  var TITLE = "Washington 1865: An Alternate History" + '_' + "Squareptune";

  // the url is a link to game.json
  // test url: https://aucchen.github.io/social_democracy_mods/v0.1.json
  // TODO; 
  window.loadMod = function(url) {
      ui.loadGame(url);
  };

  window.showStats = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('library')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('library');
    }
  };

  window.showMods = function() {
    window.hideOptions();
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('mod_loader')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('mod_loader');
    }
  };
  
  window.showOptions = function() {
      var save_element = document.getElementById('options');
      window.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  window.hideOptions();
              }
          };
      }
  };

  window.hideOptions = function() {
      var save_element = document.getElementById('options');
      save_element.style.display = "none";
  };

  window.disableBg = function() {
      window.dendryUI.disable_bg = true;
      document.body.style.backgroundImage = 'none';
      window.dendryUI.saveSettings();
  };

  window.enableBg = function() {
      window.dendryUI.disable_bg = false;
      window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
      window.dendryUI.saveSettings();
  };

  window.disableAnimate = function() {
      window.dendryUI.animate = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimate = function() {
      window.dendryUI.animate = true;
      window.dendryUI.saveSettings();
  };

  window.disableAnimateBg = function() {
      window.dendryUI.animate_bg = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimateBg = function() {
      window.dendryUI.animate_bg = true;
      window.dendryUI.saveSettings();
  };

  window.disableAudio = function() {
      window.dendryUI.toggle_audio(false);
      window.dendryUI.saveSettings();
  };

  window.enableAudio = function() {
      window.dendryUI.toggle_audio(true);
      window.dendryUI.saveSettings();
  };

  window.enableImages = function() {
      window.dendryUI.show_portraits = true;
      window.dendryUI.saveSettings();
  };

  window.disableImages = function() {
      window.dendryUI.show_portraits = false;
      window.dendryUI.saveSettings();
  };

  window.enableLightMode = function() {
      window.dendryUI.dark_mode = false;
      document.body.classList.remove('dark-mode');
      window.dendryUI.saveSettings();
  };
  window.enableDarkMode = function() {
      window.dendryUI.dark_mode = true;
      document.body.classList.add('dark-mode');
      window.dendryUI.saveSettings();
  };

  // populates the checkboxes in the options view
  window.populateOptions = function() {
    var disable_bg = window.dendryUI.disable_bg;
    var animate = window.dendryUI.animate;
    var disable_audio = window.dendryUI.disable_audio;
    var show_portraits = window.dendryUI.show_portraits;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (disable_audio) {
        $('#audio_no')[0].checked = true;
    } else {
        $('#audio_yes')[0].checked = true;
    }
    if (show_portraits) {
        $('#images_yes')[0].checked = true;
    } else {
        $('#images_no')[0].checked = true;
    }
    if (window.dendryUI.dark_mode) {
        $('#dark_mode')[0].checked = true;
    } else {
        $('#light_mode')[0].checked = true;
    }
  };

  
  // This function allows you to modify the text before it's displayed.
  // E.g. wrapping chat-like messages in spans.
  window.displayText = function(text) {
      return text;
  };

  // This function allows you to do something in response to signals.
  window.handleSignal = function(signal, event, scene_id) {
  };
  
  // This function runs on a new page. Right now, this auto-saves.
  window.onNewPage = function() {
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root' && !window.justLoaded) {
        window.dendryUI.autosave();
    }
    if (window.justLoaded) {
        window.justLoaded = false;
    }
  };

  // TODO: have some code for tabbed sidebar browsing.
  window.updateSidebar = function() {
      $('#qualities').empty();
      var scene = dendryUI.game.scenes[window.statusTab];
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#qualities').append(dendryUI.contentToHTML.convert(displayContent));
  };

  window.changeTab = function(newTab, tabId) {
      if (tabId == 'poll_tab' && dendryUI.dendryEngine.state.qualities.historical_mode) {
          window.alert('Polls are not available in historical mode.');
          return;
      }
      var tabButton = document.getElementById(tabId);
      var tabButtons = document.getElementsByClassName('tab_button');
      for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
      }
      tabButton.className += ' active';
      window.statusTab = newTab;
      window.updateSidebar();
  };

  window.onDisplayContent = function() {
      window.updateSidebar();
  };

  window.updateSouthPanel = function() {
    var Q = window.dendryUI.dendryEngine.state.qualities;
    if (!Q) return;

    var para = Math.round((Q.kkk_strength || 0) + (Q.whiteL_strength || 0));
    var fed  = Math.round((Q.South_army_strength || 0) + (Q.Us_police_strength || 0));
    var ul   = Math.round(Q.Union_League_strength || 0);
    var total = para + fed + ul || 1;

    var vp = Q.ViolencePenalty || 0;
    var situation, sitColor;
    if (vp < 5)       { situation = "Calm";      sitColor = "#639922"; }
    else if (vp < 15) { situation = "Turbulent"; sitColor = "#BA7517"; }
    else if (vp < 25) { situation = "Violent";   sitColor = "#D85A30"; }
    else              { situation = "Critical";   sitColor = "#A32D2D"; }

    var paraW  = Math.round((para / total) * 100);
    var fedW   = Math.round((fed  / total) * 100);
    var ulW    = Math.round((ul   / total) * 100);

    var readmitted = 0;
    var southern = ['VA','NC','SC','GA','AL','FL','MS','AK','TX','LA'];
    southern.forEach(function(s) { if (Q[s + '_admitted']) readmitted++; });

    var turnout = Q.freedmen_turnout || 0;
    var enf = Q.enforcement_acts ? 'Active' : 'Not passed';
    var enfColor = Q.enforcement_acts ? '#639922' : '#A32D2D';

    var html = '<p style="font-size:0.75em; font-weight:bold; text-transform:uppercase; letter-spacing:0.08em; margin:0 0 6px; text-indent:0;">Situation in the South</p>';

    html += '<p style="margin:0 0 10px; text-indent:0;"><span style="display:inline-block; padding:2px 10px; border-radius:3px; font-size:0.85em; font-weight:bold; background:' + sitColor + '33; color:' + sitColor + ';">● ' + situation + '</span></p>';

    // Semicircle arc chart
    html += '<canvas id="southArc" width="180" height="100" style="display:block; margin:0 auto 4px;"></canvas>';
    html += '<div style="display:flex; justify-content:space-between; font-size:0.7em; color:var(--text-color); margin-bottom:10px; text-indent:0;">';
    html += '<span style="color:#A32D2D;">Para</span><span style="color:#185FA5;">Federal</span><span style="color:#3B6D11;">League</span></div>';

    // Bars
    function bar(label, val, maxVal, color) {
        var w = Math.min(100, Math.round((val / (maxVal || 1)) * 100));
        return '<div style="margin-bottom:7px;">' +
            '<div style="display:flex; justify-content:space-between; font-size:0.8em; margin-bottom:2px; text-indent:0;">' +
            '<span>' + label + '</span><span style="font-weight:bold; color:' + color + ';">' + val + '</span></div>' +
            '<div style="height:5px; background:var(--unavailable-bg-color); border-radius:3px;">' +
            '<div style="height:100%; width:' + w + '%; background:' + color + '; border-radius:3px;"></div></div></div>';
    }

    html += bar('Paramilitary', para, 1000, '#A32D2D');
    html += bar('Federal forces', fed, 1000, '#185FA5');
    html += bar('Union League', ul, 1000, '#3B6D11');

    // Stats
    html += '<div style="border-top:1px solid var(--border-color); padding-top:8px; margin-top:4px; font-size:0.8em;">';
    function row(label, val, color) {
        color = color || 'var(--text-color)';
        return '<div style="display:flex; justify-content:space-between; margin-bottom:4px; text-indent:0;">' +
            '<span style="color:var(--text-color);">' + label + '</span>' +
            '<span style="font-weight:bold; color:' + color + ';">' + val + '</span></div>';
    }
    html += row('Freedmen turnout', turnout + '%');
    html += row('Enforcement Acts', enf, enfColor);
    html += row('States readmitted', readmitted + ' / 10');
    html += row('Freedmen education', Math.round(Q.freedmen_education || 0));
    html += '</div>';

    document.getElementById('south_panel').innerHTML = html;

    // Draw arc
    var canvas = document.getElementById('southArc');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var cx = W / 2, cy = H - 8, r = 80;
    var segments = [
        { val: para, color: '#A32D2D' },
        { val: fed,  color: '#185FA5' },
        { val: ul,   color: '#3B6D11' }
    ];
    var start = Math.PI;
    ctx.clearRect(0, 0, W, H);
    segments.forEach(function(seg) {
        var sweep = (seg.val / total) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, start, start + sweep);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();
        start += sweep;
    });
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.50, Math.PI, 2 * Math.PI);
    ctx.fillStyle = window.dendryUI.dark_mode ? '#242424' : '#f3f3f3';
    ctx.fill();
    ctx.font = 'bold 14px Georgia, serif';
    ctx.fillStyle = '#A32D2D';
    ctx.textAlign = 'center';
    ctx.fillText(paraW + '%', cx, cy - 22);
    ctx.font = '10px Georgia, serif';
    ctx.fillStyle = window.dendryUI.dark_mode ? '#fff' : '#431';
    ctx.fillText('paramilitary', cx, cy - 8);
};

window.onDisplayContent = function() {
    window.updateSidebar();
    window.updateSouthPanel();
};

  /*
   * This function copied from the code for Infinite Space Battle Simulator
   *
   * quality - a number between max and min
   * qualityName - the name of the quality
   * max and min - numbers
   * colors - if true/1, will use some color scheme - green to yellow to red for high to low
   * */
  window.generateBar = function(quality, qualityName, max, min, colors) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      var value = document.createElement('div');
      value.className = 'barValue';
      var width = (quality - min)/(max - min);
      if (width > 1) {
          width = 1;
      } else if (width < 0) {
          width = 0;
      }
      value.style.width = Math.round(width*100) + '%';
      if (colors) {
          value.style.backgroundColor = window.probToColor(width*100);
      }
      bar.textContent = qualityName + ': ' + quality;
      if (colors) {
          bar.textContent += '/' + max;
      }
      bar.appendChild(value);
      return bar;
  };


  window.justLoaded = true;
  window.statusTab = "status";
  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.onload = function() {
    window.dendryUI.loadSettings({show_portraits: false});
    if (window.dendryUI.dark_mode) {
        document.body.classList.add('dark-mode');
    }
    window.pinnedCardsDescription = "Advisor cards - actions are only usable once per 6 months.";
  };

}());
