jQuery(document).ready(function() {
  var container = $('.container'),
  cover = $('.cover'),
  mute = $('#mute'),
  muted = $('#muted'),
  close = $('#close'),
  // duration = song.duration,
  manifest = [
      {
        id: "hth",
        src: "assets/Get Home Molly HTH.mp3"
      }
  ],
  soundInstance,
  curtime = 0,
  positionInterval,
  loadComplete = false;

  createjs.Sound.addEventListener("loadComplete", function () {
    loadComplete = true;
  });

  createjs.Sound.registerManifest(manifest);
  soundInstance = createjs.Sound.createInstance("hth");
  $('.container').on({click: function(e) {
    e.preventDefault();
    clearInterval(positionInterval);
    if (curtime < 1) {
      soundInstance.play();
          
      // Attach an event listener to when track is finished to change
      // the button back to play
      soundInstance.addEventListener("complete", function (e) {
        $("#pause").replaceWith('<a class="button gradient" id="play" href="" title=""></a>');
      });
    }
    else {
      console.log("resuming");
      soundInstance.resume();
    }
    $(this).replaceWith('<div class="button gradient" id="pause" href="" title=""></div>');
    container.addClass('containerLarge');
    cover.addClass('coverLarge');
    $('#close').fadeIn(300);
    $('#seek').attr('max',parseInt(soundInstance.getDuration()/1000, 10));
    trackTime();

    $('.container').on("mouseenter", function (e) {
          $('.player').fadeIn(200);
        }).on("mouseleave", function (e) {
          $('.player').fadeOut(200);
        });
  }}, '#play');

  $('.container').on({click: function(e) {
    e.preventDefault();
    soundInstance.pause();
    clearInterval(positionInterval);
    // soundInstance.dispatchEvent("timeupdate");
    $(this).replaceWith('<a class="button gradient" id="play" href="" title=""></a>');
  }}, '#pause');

  $('.container').on({click: function(e) {
    e.preventDefault();
    soundInstance.setVolume(0) ;
    $(this).replaceWith('<a class="button gradient" id="muted" href="" title=""></a>');

  }}, '#mute');

  $('.container').on({click: function(e) {
    e.preventDefault();
    soundInstance.setVolume(1);
    $(this).replaceWith('<a class="button gradient" id="mute" href="" title=""></a>');

  }}, '#muted');

  $('.container').on({click: function(e) {
    e.preventDefault();
    clearInterval(positionInterval);
    container.removeClass('containerLarge');
    cover.removeClass('coverLarge');
    soundInstance.pause();
    soundInstance.setPosition(0);
    curtime = 0;
    $("#seek").attr("value", curtime.toString());
    $('#pause').replaceWith('<a class="button gradient" id="play" href="" title=""></a>');
    $('#close').fadeOut(300);
    $('.container').off("mouseenter mouseleave");
  }}, '#close');

  $(".container").bind({change: function() {
    console.log("changed");
    soundInstance.setPosition($("#seek").val()*1000);
    clearInterval(positionInterval);
    trackTime();
  }}, "#seek");

  $(".container").bind({timechange: function(event, curtime) {
    // Gotta do both for some reason, otherwise it will either
    // not update the slider position, or not update the value
    // attribute! Don't know why...
    $("#seek").val(curtime);
    $("#seek").attr("value", curtime);
  }});

  // Set up a position interval to check the position of the song
  // every second. Fire an event accordingly, passing the new
  // time.
  function trackTime() {
    positionInterval = setInterval(function(event) {
      curtime = (parseInt(soundInstance.getPosition()/1000, 10));
      $("#seek").trigger("timechange", curtime);
    }, 1000);
  }
});