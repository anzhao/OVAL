/**
 *  OVAL (Online Video Annotation for Learning) is a video annotation tool
 *  that allows users to make annotations on videos uploaded to the platform.
 *
 *  Copyright (C) 2014  Shane Dawson, University of South Australia, Australia
 *  Copyright (C) 2014  An Zhao, University of South Australia, Australia
 *  Copyright (C) 2014  Dragan Gasevic, University of Edinburgh, United Kingdom
 *  Copyright (C) 2014  Neging Mirriahi, University of New South Wales, Australia
 *  Copyright (C) 2014  Abelardo Pardo, University of Sydney, Australia
 *  Copyright (C) 2014  Alan Kingstone, University of British Columbia, Canada
 *  Copyright (C) 2014  Thomas Dang, , University of British Columbia, Canada
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>
 */

// The initial checkin (v1) is authored by John Bratlien, up to Oct 2012.
// Subsequent modifications by Thomas Dang, Oct 2012 onward
// Further modifications to be fit with the YouTube player is done by An ZHAO from Nov/2013.

// when mw is ready we can read video duration, etc.
mw.ready(function () {
  var intervalTimer;

  var player = $j("#player");

  player1.bind("play", function (e) {
    recordPlayEvent();
  });
  player1.bind("pause", function (e) {
    recordPauseEvent();
  });
  player1.bind("ended", function (e) {
    recordPlaybackFinishedEvent();
  });
  $(window).bind("unload", function (e) {
    recordDisruptedPlayEvent();
  });
  //  player.bind( "seeked", function(e) { recordPlayEvent() });
  //  player.bind( "timeupdate", function(e) { console.log("timeupdate: " + getCurrentYouTime()); });
});

function onLogOutEvent() {
  recordDisruptedPlayEvent();
  var player = $j("#player").get(0);
  player1.pause(); // pause here so that the disrupted play event doesn't get fired twice
}

function recordDisruptedPlayEvent() {
  //alert("getCurrentYouTime: " + getCurrentYouTime() + "\n");

  if (getCurrentYouTime() > 0 && !playerPaused()) {
    recordEvent(getCurrentYouTime(), 0);
  }
}

// TODO: unused, untested
function getCurrentTimeFromSlider() {
  var slider = $("div.play_head > a.ui-slider-handle");

  var playheadPosition = $(this).css("left");
  var currTime = parseInt((parseFloat(playheadPosition) / 100) * getDuration());

  return currTime;
}

function getCurrentYouTime() {
  //  var player=$j('#player').get(0);

  // return youtubeTime;
  //   return 1;
  return Math.floor(player1.getCurrentTime());
  // return player.getCurrentTime();
}

function getDuration() {
  var player = $j("#player").get(0);
  //alert("The duration is: " + player1.getDuration());
  return Math.floor(player1.getDuration());
}

function recordEvent(playbackPosition, playbackStart) {
  console.log(
    "recordEvent(playbackPosition:" +
      playbackPosition +
      ", playbackStart:" +
      playbackStart +
      ")"
  );
  $.ajax({
    type: "POST",
    url: "ajax/update_views.php",
    data: {
      video_id: videoID,
      playback_position: playbackPosition,
      playback_start: playbackStart,
    },
    success: function (data) {
      console.log("data " + data);
    },
    error: function (request, status, error) {
      console.log(
        "request.status: " +
          request.status +
          " error " +
          error +
          "<error>" +
          request.responseText +
          "</error>"
      );
      console.log("ERROR! request.status: " + request.status);
    },
    async: false,
  });
}

function recordPlayEvent() {
  console.log("recordPlayEvent()");
  if (playerPaused()) return;
  // current time may not be accurate for seek
  //if (playerSeeking()) console.log("seeking");
  recordEvent(getCurrentYouTime(), 1);

  // update trendline visibility
  $.ajax({
    type: "GET",
    url: "ajax/get_trendline_visibility.php",
    data: { video_id: videoID, user_id: userID },
    dataType: "json",
    success: function (data) {
      if (false == data) {
        $("#annotation-view").css("display", "none");
      } else {
        $("#annotation-view").css("display", "block");
      }
    },
    error: function (request, status, error) {
      console.log("ERROR! request.status: " + request.status);
    },
    async: true,
  });
}

function recordPlaybackFinishedEvent() {
  recordEvent(mediaDuration, 0);
}

function recordPauseEvent() {
  alert("Pause event!");
  console.log("am I being called!" + recordEvent(getCurrentYouTime(), 0));
  recordEvent(eetCurrentYouTime(), 0);
}

function playerPaused() {
  //alert("player paused!");
  //var player=$j('#player').get(0);
  return player1.paused;
}

function playerSeeking() {
  var player = $j("#player").get(0);
  return player1.seeking;
}

// editStartTime is a boolean flag
function playerSeek(seconds, editStartTime) {
  var player = $j("#player").get(0);

  if (null == seconds) {
    time = annotations[openAnnotationIndex].startTime;
    //time = dialogAnnotationStartTime;
  } else {
    annotationTimeModified = true;
    seconds = parseInt(seconds);
    // this should accumulate
    if (editStartTime) {
      //console.log("openAnnotationIndex: " + openAnnotationIndex);
      if (invalidTimeRange(seconds, true)) return;
      startTimeSeekPosition += seconds;
      annotations[openAnnotationIndex].startTime += seconds;
      time = dialogAnnotationStartTime + startTimeSeekPosition;
      setDialogStartTime(time);
      //intervalID = setTimeout("playerSeek(" + seekSpeed + ", true)", 100);
    } else {
      //console.log("*** this should not be triggered");
      // edit end time
      if (invalidTimeRange(seconds, false)) return;
      endTimeSeekPosition += seconds;
      annotations[openAnnotationIndex].endTime += seconds;
      time = dialogAnnotationEndTime + endTimeSeekPosition;
    }
  }

  setAnnotationPosition(time);

  percent = time / mediaDuration;
  percent.toFixed(5);
  player1.doSeek(percent);

  if (playerPaused() && null != editStartTime) {
    // pause unless already in playback or dialog "Play" button clicked
    player1.pause();
  } else {
    player1.play();
  }
}

/*
Created by: Sung Hwang
Date: July/11/2012

Function Name: playerSeekForAnnotationItem(endTime)
Purpose: To find out the annotation start time and play the video from the start time.
*/
function playerSeekForAnnotationItem(seconds, editStartTime) {
  var playTime =
    annotations[openAnnotationIndex].endTime -
    annotations[openAnnotationIndex].startTime;
  var player = $j("#player").get(0);

  if (null == annotations[openAnnotationIndex].startTime) {
    time = annotations[openAnnotationIndex].startTime;
    //time = dialogAnnotationStartTime;
  } else {
    //annotationTimeModified = true;
    seconds = parseInt(annotations[openAnnotationIndex].startTime);
    // this should accumulate

    //if (invalidTimeRange(annotations[openAnnotationIndex].startTime, true)) return;
    startTimeSeekPosition = annotations[openAnnotationIndex].startTime;

    time = annotations[openAnnotationIndex].startTime;
    setDialogStartTime(time);
  }

  //setAnnotationPosition(time);

  percent = time / mediaDuration;
  percent.toFixed(5);
  player.doSeek(percent);

  //if (playerPaused() && null != editStartTime) {
  //if (playerPaused()) {
  // pause unless already in playback or dialog "Play" button clicked
  //player.pause();
  //} else {
  player.play();
  //}

  //alert("startTime");
  //alert(annotations[openAnnotationIndex].startTime);
  //alert("endTime");
  //alert(annotations[openAnnotationIndex].endTime);

  //alert("playTime");
  //alert(playTime);
  //setInterval(function(playTime){player.pause(); playerPaused();}, playTime*1000);
  var intervalTimer = setInterval(function (playTime) {
    player.pause();
    clearInterval(intervalTimer);
  }, playTime * 1000);
}

function setAnnotationPosition(time) {
  var target =
    "#annotation-list > ul > li > #" + annotations[openAnnotationIndex].id;
  var rule = getStartPosition(time);
  alert("target: " + target + " rule: " + rule);
  //console.log('target:' + target + ' rule:' + rule);
  $(target).css("left", rule);
  //        $(target).css('border-left', '5px solid orange');
}

function invalidTimeRange(seconds, editStartTime) {
  //console.log("seconds:" + seconds + " editStartTime:" + editStartTime);
  //console.log("dialogAnnotationStartTime:" + dialogAnnotationStartTime + " startTime:" + startTime + " duration:" + duration);
  var duration = getDuration();

  if (editStartTime) {
    startTime = dialogAnnotationStartTime + startTimeSeekPosition + seconds;
    if (startTime < 0 || startTime >= duration) {
      //console.log("Invalid startTime seek (outside of video duration)");
      return true;
    }
  }

  return false;
}

function showPlayer(videoAnnotationID) {
  // CUSTOMIZE_THIS: Replace all the instances of 999999999 in this text with your actual partner ID on kaltura

  // TODO: REFACTOR TO INTERNAL KALTURA
  var html =
    '<object id="kaltura_player_1331578128" ' +
    'name="kaltura_player_1331578128" type="application/x-shockwave-flash" ' +
    'allowFullScreen="true" allowNetworking="all" allowScriptAccess="always" ' +
    'height="255" width="340" bgcolor="#000000" xmlns:dc="http://purl.org/dc/terms/" ' +
    'xmlns:media="http://search.yahoo.com/searchmonkey/media/" rel="media:video" ' +
    'resource="https://www.kaltura.com/index.php/kwidget/cache_st/1331578128/wid/_999999999/uiconf_id/7510542/entry_id/' +
    videoAnnotationID +
    '" data="https://www.kaltura.com/index.php/kwidget/cache_st/1331578128/wid/_999999999/uiconf_id/7510542/entry_id/' +
    videoAnnotationID +
    '"><param name="allowFullScreen" value="true" /><param name="allowNetworking" ' +
    'value="all" /><param name="allowScriptAccess" value="always" />' +
    '<param name="bgcolor" value="#000000" /><param name="flashVars" value="&" />' +
    '<param name="movie" value="http://www.kaltura.com/index.php/kwidget/cache_st/1331578128/wid/_999999999/uiconf_id/7510542/entry_id/' +
    videoAnnotationID +
    '" /><a href="http://corp.kaltura.com">video platform</a> <a href="http://corp.kaltura.com/video_platform/video_management">video management</a> ' +
    '<a href="http://corp.kaltura.com/solutions/video_solution">video solutions</a> ' +
    '<a href="http://corp.kaltura.com/video_platform/video_publishing">video player</a> ' +
    '<a rel="media:thumbnail" href="https://cdnbakmi.kaltura.com/p/999999999/sp/99999999900/thumbnail/entry_id/' +
    videoAnnotationID +
    '/width/120/height/90/bgcolor/000000/type/2"></a> ' +
    '<span property="dc:description" content=""></span>' +
    '<span property="media:title" content="recorded_entry_pid_999999999665588">' +
    '</span> <span property="media:width" content="200"></span>' +
    '<span property="media:height" content="150"></span> ' +
    '<span property="media:type" content="application/x-shockwave-flash"></span> </object>' +
    '<div style="text-decoration:underline;float:right;margin-right:40px;cursor:pointer;display:none;" id="record-again">' +
    "re-record video</div>";
  $("#webcam").html(html);
  $("#webcam").css("display", "block");
}

function showRecorder() {
  var frameHTML =
    '<iframe width="400" height="330" frameBorder="0" scrolling="no" src="includes/webcam_recording/webcam.php"></iframe>';
  $("#webcam").html(frameHTML);
  $("#webcam").css("display", "block");
}
