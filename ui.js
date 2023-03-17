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

var annotationTimeModified = false;
var annotationDialogOpen = false;
var viewAllAnnotations = true; // should default to true because students should see instructor's and TA's comment and vice versa.
var playheadMouseup = false;
// true if viewing/adding 'annotations' false if viewing/adding 'comments'
var annotationMode = true;
// true if in 'psycMode' and 'Add Annotation' button is being pressed
var psycModeAnnotating = false;
var videoAnnotationEntryID = null;
var annotations = [];
var comments = [];

// array index of currently open annotation dialog
var openAnnotationIndex = null;

// the time  the user clicks "Add Annotation"
var createAnnotationStartTime;

// time of the currently active dialog (applies to pre-existing annotations only)
var dialogAnnotationStartTime;
var dialogAnnotationEndTime;

// seek time of the currently active dialog (applies to pre-existing annotations only)
var startTimeSeekPosition = 0;
var intervalID;

/*** CONSTANTS ***/
// seconds to seek at a time
var seekSpeed = 1;
var CONFIRMED = 1;
// set to dimension of video player
var sliderWidth = 550;

// current annotation-item
var currentPreviewItem = null;

function confirmDelete() {
  if (annotationMode) {
    type = "annotation";
    list = annotations;
  } else {
    type = "comment";
    list = comments;
  }

  debug("vid_anno_id " + list[openAnnotationIndex].videoAnnotationID);
  if (confirm("Are you sure you want to delete this " + type + "?")) {
    deleteAnnotation(
      list[openAnnotationIndex].id,
      list[openAnnotationIndex].videoAnnotationID
    );
  }
}

function isVideoAnnotation(videoAnnotationID) {
  if (newAnnotation()) {
    return "video" == $("#annotation-type").val();
  } else {
    // assert: pre-existing annotation
    if (
      null == videoAnnotationID ||
      undefined == videoAnnotationID ||
      "null" == videoAnnotationID
    ) {
      return false;
    } else {
      return true;
    }
  }
}

function playerSee() {
  var val = $("#annotation-start-time").text();
  var a = val.split(":");
  var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

  player1.seekTo(seconds);
}

function setAnnotationWindow(
  startTime,
  endTime,
  tags,
  description,
  isPrivate,
  ID,
  userID,
  userName,
  videoAnnotationID
) {
  description = $.trim(description);

  var saveButton =
    '<a href="#" id="save_annotation" class="dialog-buttons" target="_self" onClick="saveAnnotation();">Save</a>';
  var cancelButton =
    '<a href="#" id="cancel_annotation" class="dialog-buttons" target="_self" onClick="closeAnnotationDialog();">Close</a>';
  var editButton =
    '<a href="#" id="edit_annotation" class="dialog-buttons" target="_self" onClick="updateAnnotation(' +
    ID +
    ');" >Update</a>';
  var deleteButton =
    '<a class="dialog-buttons" href="javascript:confirmDelete()" >Delete</a>';
  var playButton =
    '<a href="#" id="play_annotation" class="dialog-buttons" target="_self" onClick="playerSee();"; >Play</a>';

  setAnnotationFormValues(tags, description, isPrivate);

  showAnnotationForm();
  $("#webcam").css("display", "none"); // WEBCAM ANNOTATION:
  $("#annotation-form select").removeAttr("disabled");
  $("#annotation-form select").val("annotation").attr("selected", true);

  annotationMode ? (list = annotations) : (list = comments);
  var html;
  if (annotationMode) {
    $(".annotation-label > #annotation-type")
      .parent()
      .css("display", "inline-block");
    if (newAnnotation()) {
      html = "<br /><br />" + saveButton + cancelButton;
      $("#annotation-title").html("Add Annotation");
      var startTime = getCurrentYouTime();
      openAnnotationIndex = null;
      setFormWritable();
      editStartTime(false);
      videoAnnotationEntryID = null;
    } else {
      // pre-existing annotation
      if (isVideoAnnotation(videoAnnotationID)) {
        $("#annotation-form select").val("video").attr("selected", true);
        videoAnnotationEntryID = videoAnnotationID;
        showPlayer(videoAnnotationID);
      } else {
        $("#annotation-form select").val("annotation").attr("selected", true);
      }

      // annotation mode readonly for editing
      $("#annotation-form select").attr("disabled", "disabled");
      if ("true" == list[openAnnotationIndex].myAnnotation) {
        // annotation authored by user
        html =
          "<br /><br />" +
          playButton +
          editButton +
          deleteButton +
          cancelButton;
        if (annotationMode) $(".controls img").css("display", "inline-block");
        setFormWritable();
        editStartTime(true);
        $("#annotation-title").html("Edit Annotation (" + userName + ")");
      } else {
        // annotation NOT authored by user
        html = "<br /><br />" + playButton + cancelButton;
        setFormReadonly();
        editStartTime(false);
        $("#annotation-title").html("View Annotation (" + userName + ")");
      }

      startTimeSeekPosition = 0;
    }
  } else {
    // this is a comment
    $(".annotation-label > #annotation-type").parent().css("display", "none");
    $("#start-time-rwd, #start-time-fwd, #annotation-start-time").css(
      "display",
      "none"
    );
    if (newAnnotation()) {
      $("#annotation-title").html("Add Comment");
      setFormWritable();
      // new comment
      html = "<br /><br />" + saveButton + cancelButton;
      // feedback form with points will display after submit the general comments form.
    } else {
      // pre-existing comment
      debug("openAnnotationIndex: " + openAnnotationIndex);
      if ("true" == list[openAnnotationIndex].myAnnotation) {
        // comment authored by user
        $("#annotation-title").html("Edit Comment");
        setFormWritable(false);
        html = "<br /><br />" + editButton + deleteButton + cancelButton;
        // feedback form with points will display after the user update the general comments form.
      } else {
        // authored by others
        $("#annotation-title").html("View Comment");
        setFormReadonly();
        html = "<br /><br />" + cancelButton;
      }
    }
  }

  setDialogStartTime(startTime);

  annotationDialogOpen = true;
  $("#form-buttons").html(html);
}

function setFeedbackWindow(
  startTime,
  endTime,
  tags,
  description,
  isPrivate,
  ID,
  userID,
  userName,
  videoAnnotationID
) {
  description = $.trim(description);

  var saveButton =
    '<a href="#" id="save_annotation" class="dialog-buttons" target="_self" onClick="saveAnnotation();">Save</a>';
  var cancelButton =
    '<a href="#" id="cancel_annotation" class="dialog-buttons" target="_self" onClick="closeAnnotationDialog();">Close</a>';
  var editButton =
    '<a href="#" id="edit_annotation" class="dialog-buttons" target="_self" onClick="updateAnnotation(' +
    ID +
    ');" >Update</a>';
  var deleteButton =
    '<a class="dialog-buttons" href="javascript:confirmDelete()" >Delete</a>';
  var playButton =
    '<a href="#" id="play_annotation" class="dialog-buttons" target="_self" onClick="playerSeek();"; >Play</a>';

  setFeedbackFormValues(tags, description, isPrivate);

  showFeedbackForm();
  $("#webcam").css("display", "none"); // WEBCAM ANNOTATION:
  $("#annotation-form1 select").removeAttr("disabled");
  $("#annotation-form1 select").val("annotation").attr("selected", true);
  $("#annotation-tags").css("display", "none");
  $("#annotation-description").css("display", "none");

  var html;
  // this is a comment
  $(".annotation-label > #annotation-type").parent().css("display", "none");
  $("#start-time-rwd, #start-time-fwd, #annotation-start-time").css(
    "display",
    "none"
  );
  $(".annotation-label").css("display", "none");

  // if (newAnnotation()) {
  $("#annotation-title").html("Feedback");
  $(".annotation-label").html("Is this video talked about unisa");
  //setFormWritable();
  // new comment
  html = "<br /><br />" + saveButton + cancelButton;
  // }
  // else {

  // pre-existing comment
  // 	debug("openAnnotationIndex: " + openAnnotationIndex);
  //     if ("true" == list[openAnnotationIndex].myAnnotation) {
  // comment authored by user
  //         $('#annotation-title').html("Edit Comment");
  //         setFormWritable(false);
  //         html = "<br /><br />" + editButton + deleteButton + cancelButton;
  //     } else {
  // authored by others
  //         $('#annotation-title').html("View Comment");
  //         setFormReadonly();
  //         html = "<br /><br />" + cancelButton;
  //     }
  //  }

  setDialogStartTime(startTime);

  annotationDialogOpen = true;
  $("#form-buttons").html(html);
}

function editStartTime(display) {
  var rule;
  display ? (rule = "inline-block") : (rule = "none");
  $("#annotation-start-time").css("display", "inline-block");
  $("#start-time-rwd, #start-time-fwd").css("display", rule);
}

function setFormWritable() {
  $("#annotation-description").removeAttr("readonly");
  $("#annotation-tags").removeAttr("readonly");
  $("#annotation-privacy").removeAttr("readonly");
  $("#annotation-privacy").css("display", "inline-block");
  $("#annotation-privacy").parent().css("display", "inline-block");
}

function setFormReadonly() {
  $("#start-time-rwd, #start-time-fwd, #annotation-start-time").css(
    "display",
    "none"
  );
  $("#annotation-description").attr("readonly", "readonly");
  $("#annotation-tags").attr("readonly", "readonly");
  $("#annotation-privacy").attr("readonly", "readonly");
  $("#annotation-privacy").css("display", "none");
  $("#annotation-privacy").parent().css("display", "none");
}

function setDialogStartTime(startTime) {
  var startTimeDisplay = formatISO(startTime);
  $("#annotation-start-time").html(startTimeDisplay);
}

function formatISO(seconds) {
  var hours = parseInt(seconds / (60 * 60));
  var rest = parseInt(seconds % (60 * 60));
  var minutes = parseInt(rest / 60);
  rest = parseInt(rest % 60);
  var seconds = parseInt(rest);
  var millis = parseInt(rest);

  return (
    doubleDigits(hours) +
    ":" +
    doubleDigits(minutes) +
    ":" +
    doubleDigits(seconds)
  );
}

function doubleDigits(value) {
  if (value > 9) {
    return value;
  } else {
    return "0" + value;
  }
}

function fadeOutComments(fade) {
  fade ? (opacity = "0.4") : (opacity = "1.0");
  $("#comments").css("opacity", opacity);
}

function fadeOutFeedbacks(fade) {
  fade ? (opacity = "0.4") : (opacity = "1.0");
  $("#feedbacks").css("opacity", opacity);
}

function showAnnotationWindow() {
  fadeOutComments(true);
  ATTENTIONAL_DELAY = 3;

  if (annotationChanged()) {
    // exit
    alertAnnotationChanged();
    return;
  } else {
    createAnnotationStartTime = Math.floor(getCurrentYouTime());
    createAnnotationStartTimeWDelay =
      createAnnotationStartTime > ATTENTIONAL_DELAY
        ? createAnnotationStartTime - ATTENTIONAL_DELAY
        : createAnnotationStartTime;

    if (annotationMode) {
      // iterate through to check if annotation already exists for given time
      for (i = 0; i < annotations.length; i++) {
        var myAnnotation = annotations[i].myAnnotation;
        var startTime = annotations[i].startTime;

        if (
          "true" == myAnnotation &&
          startTime == createAnnotationStartTimeWDelay &&
          annotationMode
        ) {
          alert(
            "You already have an annotation at " +
              createAnnotationStartTimeWDelay +
              " seconds.\n" +
              "You can update or delete the current annotation."
          );
          fadeOutComments(false);
          return;
        }
      }
    }
    openAnnotationIndex = null;
    setAnnotationWindow(null, null, null, null, null, null, null, null);

    annotationDialogOpen = true;

    if (annotationMode) {
      // TODO: look at UI configurations before auto-closing annotation
      // saveAnnotation();
    }
  }
}

function showFeedbackWindow() {
  if (!annotationMode) {
    fadeOutComments(true);
    showFeedbackForm();
    //setFeedbackWindow(null, null, null, null, null, null, null, null);
  }
}

function setAnnotationFormValues(tags, description, isPrivate) {
  var description = $.trim(description);

  $("#annotation-tags").val(tags);
  $("#annotation-description").val(description);

  if (parseInt(isPrivate)) {
    $("#annotation-privacy").attr("checked", "checked");
  } else {
    $("#annotation-privacy").removeAttr("checked");
  }
}

function setFeedbackFormValues(tags, description, isPrivate) {
  tags = "Is this video talked about UniSA?";
  description = null;
}

function showAnnotation(ID, annotationView) {
  if (annotationChanged()) {
    alertAnnotationChanged();
    return;
  }

  var found = false;
  var list;
  annotationView ? (list = annotations) : (list = comments);

  for (i = 0; i < list.length; i++) {
    if (ID == list[i].id) {
      var startTime = list[i].startTime;
      var endTime = list[i].endTime;
      var tags = list[i].tags;
      var description = list[i].description;
      var userID = list[i].userID;
      var userName = list[i].userName;
      var isPrivate = list[i].isPrivate;

      dialogAnnotationStartTime = list[i].startTime;
      dialogAnnotationEndTime = list[i].endTime;

      openAnnotationIndex = i;
      setAnnotationWindow(
        startTime,
        endTime,
        tags,
        description,
        isPrivate,
        list[i].id,
        userID,
        userName,
        list[i].videoAnnotationID
      );
      found = true;
    }
  }

  if (!found) alert("error - ID:" + ID + " not found");
}

function alertAnnotationChanged() {
  if (newAnnotation()) {
    var cancelButton =
      '<a href="#" id="cancel_annotation" class="dialog-buttons" target="_self" onClick="closeAnnotationDialog(' +
      CONFIRMED +
      ');">close</a>';
    var editButton =
      '<a href="#" id="edit_annotation" style="padding:0px" class="dialog-buttons" target="_self" onClick="saveAnnotation();" >save</a>';
  } else {
    // pre-existing annotation
    ID = annotations[openAnnotationIndex].id;

    var editButton =
      '<a href="#" id="edit_annotation" class="dialog-buttons" target="_self" onClick="updateAnnotation(' +
      ID +
      ');" >save</a>';
  }

  annotationMode ? (type = "annotation") : (type = "comment");
  var cancelButton =
    '<a href="#" id="cancel_annotation" style="padding:0px" class="dialog-buttons" target="_self" onClick="closeAnnotationDialog(' +
    CONFIRMED +
    ');">discard</a>';

  if (isVideoAnnotation()) {
    if (webcamRecordingSaved()) {
      msg =
        "To keep your recording please " +
        editButton +
        " this annotation. Or you may " +
        cancelButton +
        " this annotation.";
    } else {
      msg =
        "Please record and save your webcam video. Or " +
        cancelButton +
        " this annotation.";
    }
  } else {
    msg =
      "You have modified the " +
      type +
      ". Please " +
      editButton +
      " or " +
      cancelButton +
      " changes.";
  }

  $("#message-dialog").html(msg);
  $("#message-dialog").dialog();
  $("#message-dialog").dialog({ resizable: false });
}

function alertFeedbackChanged() {
  msg = "points ...";
  $("#message-dialog").html(msg);
  $("#message-dialog").dialog();
  $("#message-dialog").dialog({ resizable: false });
}

function newAnnotation() {
  // new annotations do not have an array index (whereas pre-existing annotations do)
  return null == openAnnotationIndex;
}

function annotationDialogClosed() {
  return !annotationDialogOpen;
}

function webcamRecordingSaved() {
  var currentStatus = $("#webcam iframe")
    .contents()
    .find("#currentStatus")
    .text();

  // recording started and/or stoped but not saved
  if (-1 != currentStatus.indexOf("recording")) {
    return true;
  }

  return "video saved." == currentStatus;
}

function annotationChanged() {
  // no annotation is open
  if (annotationDialogClosed()) return false;

  if (newAnnotation()) {
    if (isVideoAnnotation()) {
      if (webcamRecordingSaved()) {
        debug("webcam recording saved");
        return true;
      } else {
        debug("webcam recording NOT saved");

        //TODO: WEBCAM: prompt user that they have not made a recording
        return true;
      }
    }
    if (
      "" != $.trim($("#annotation-tags").val()) ||
      "" != $.trim($("#annotation-description").val())
    ) {
      return true;
    }
  } else {
    annotationMode ? (list = annotations) : (list = comments);

    if (undefined != openAnnotationIndex) {
      debug("index: " + openAnnotationIndex);
      if (
        $("#annotation-tags").val() != list[openAnnotationIndex].tags ||
        $("#annotation-description").val() !=
          list[openAnnotationIndex].description ||
        annotationTimeModified
      ) {
        return true;
      }
    }
  }

  return false;
}

function closeAnnotationDialog(msg) {
  debug("in closeAnnotationDialog()");
  fadeOutComments(false);

  // if user has not already interacted with message dialog
  if (CONFIRMED != msg) {
    debug("closeAnnotationDialog() - not confirmed " + msg);

    // you don't have confirmation to close dialog
    if (annotationChanged()) {
      alertAnnotationChanged();
      return;
    }
  } else {
    debug("closeAnnotationDialog() - confirmed " + msg);
  }

  $("#recording-annotation").css("display", "none");
  $("#annotation-form").css("display", "none");

  annotationDialogOpen = false;

  closeMessageDialog();

  annotationMode ? (list = annotations) : (list = comments);
  if (!newAnnotation()) {
    // set back annotation start and end time
    list[openAnnotationIndex].startTime = dialogAnnotationStartTime;
    list[openAnnotationIndex].endTime = dialogAnnotationEndTime;

    // this will only be triggered if annotation is not being saved therefore
    // annotation needs to be set back to it's original position
    if (annotationTimeModified)
      setAnnotationPosition(dialogAnnotationStartTime);
  }

  // at this point user has chosen to save or cancel update
  annotationTimeModified = false;
  videoAnnotationEntryID = null;
  openAnnotationIndex = null;
}

function closeAnnotationDialog1(msg) {
  debug("in closeAnnotationDialog1()");
  fadeOutComments(false);

  // if user has not already interacted with message dialog
  if (CONFIRMED != msg) {
    debug("closeAnnotationDialog1() - not confirmed " + msg);

    // you don't have confirmation to close dialog
    if (annotationChanged()) {
      alertAnnotationChanged();
      return;
    }
  } else {
    debug("closeAnnotationDialog1() - confirmed " + msg);
  }

  $("#recording-annotation").css("display", "none");
  $("#annotation-form1").css("display", "none");

  annotationDialogOpen = false;

  closeMessageDialog();

  annotationMode ? (list = annotations) : (list = comments);
  if (!newAnnotation()) {
    // set back annotation start and end time
    list[openAnnotationIndex].startTime = dialogAnnotationStartTime;
    list[openAnnotationIndex].endTime = dialogAnnotationEndTime;

    // this will only be triggered if annotation is not being saved therefore
    // annotation needs to be set back to it's original position
    if (annotationTimeModified)
      setAnnotationPosition(dialogAnnotationStartTime);
  }

  // at this point user has chosen to save or cancel update
  annotationTimeModified = false;
  videoAnnotationEntryID = null;
  openAnnotationIndex = null;
}

function closeMessageDialog() {
  if ($("#message-dialog").dialog("isOpen"))
    $("#message-dialog").dialog("close");
  // rewrite cancel button
  if (isVideoAnnotation()) {
    $("#cancel_annotation").attr("onClick", "closeAnnotationDialog()");
  } else {
    $("#cancel_annotation").attr(
      "onClick",
      "closeAnnotationDialog(" + CONFIRMED + ")"
    );
  }
}

function generateTrendline() {
  var trendline = [];
  annotationsCopy = getAnnotationsCopy();

  // initialize array
  for (i = 0; i < sliderWidth; i++) trendline[i] = 0;
  var largest = 0;

  for (i = 0; i < annotationsCopy.length; i++) {
    startingPosition = Math.floor(
      (annotationsCopy[i].startTime / mediaDuration) * sliderWidth
    );
    // should this be same width as flag?
    endPosition = startingPosition + 3;

    for (j = startingPosition; j < endPosition; j++) {
      trendline[j] = trendline[j] + 1;
      if (trendline[j] > largest) {
        largest = trendline[j];
      }
    }
  }

  //get largest value and scale trendline accordingly
  var trendlineCSS = new String();
  for (i = 0; i < sliderWidth; i++) {
    var scaleFactor = Math.floor(255 / largest);
    // calculate red intensity of RGB
    var red = (trendline[i] * scaleFactor).toString(16);
    if (1 == red.length) red = "0" + red;
    var color = "#" + red + "0000";

    // TODO: group contiguous numbers into one div
    // quick and dirty method until then
    trendlineCSS =
      trendlineCSS +
      '<div style="margin:0;padding:0;float:left;width:1px;height:25px;background-color:' +
      color +
      ';"></div>';
  }

  return trendlineCSS;
}

/*
 * this function is used to encapsulate the annotation object
 */
function Annotation(
  ID,
  startTime,
  endTime,
  tags,
  description,
  description_with_html,
  myAnnotation,
  userID,
  userName,
  isPrivate,
  videoAnnotationID,
  viewMode,
  creationDate
) {
  this.id = ID;
  this.startTime = Math.floor(startTime);
  this.endTime = Math.floor(endTime);
  this.tags = tags;
  this.description = description;
  this.description_with_html = description_with_html;
  this.myAnnotation = myAnnotation;
  this.userID = userID;
  this.userName = userName;
  this.isPrivate = isPrivate;
  this.videoAnnotationID = videoAnnotationID;
  this.viewMode = viewMode;
  this.creationDate = creationDate;
}

function getAnnotationList(viewMode) {
  //debug('in getAnnotationlist()');
  var list = "";
  var tmpList = [];

  $.ajax({
    type: "GET",
    url: "ajax/get_annotations.php",
    data: {
      video_id: videoID,
      annotation_mode: annotationMode,
      view_mode: viewMode,
    },
    dataType: "json",
    beforeSend: function (jqXHR, settings) {},
    success: function (data) {
      $.each(data, function (i, item) {
        if (null == item.start_time) {
          // General comments have a null start_time (as they are not time specific)
          comments.push(
            new Annotation(
              item.annotation_id,
              item.start_time,
              item.end_time,
              item.tags,
              item.description,
              item.description_with_html,
              item.my_annotation,
              item.user_id,
              item.user_name,
              item.is_private,
              item.video_annotation_id,
              viewMode,
              item.creation_date
            )
          );
        } else {
          // all other annotations have a specific start time
          annotations.push(
            new Annotation(
              item.annotation_id,
              item.start_time,
              item.end_time,
              item.tags,
              item.description,
              item.description_with_html,
              item.my_annotation,
              item.user_id,
              item.user_name,
              item.is_private,
              item.video_annotation_id,
              viewMode
            )
          );

          // clone annotations
          //debug(item.annotation_id + " " + item.start_time + " " + item.end_time);
          tmpList.push(
            new Annotation(
              item.annotation_id,
              item.start_time,
              item.end_time,
              item.tags,
              item.description,
              item.description_with_html,
              item.my_annotation,
              item.user_id,
              item.user_name,
              item.is_private,
              item.video_annotation_id,
              viewMode
            )
          );
        }
      });
      list = compactList(tmpList, viewMode);
    },
    error: function (request, status, error) {
      debug(
        "request.status: " +
          request.status +
          " error " +
          error +
          "<error>" +
          request.responseText +
          "</error>"
      );
    },
    async: false,
  });

  if (null != list) {
    list = list.toString();
  } else {
    list = "";
  }
  debug("list " + list);

  return list;
}

function getFeedback() {}

var LIST_ITEM_BORDER_LEFT_BIG = 11;
var LIST_ITEM_BORDER_LEFT_MEDIUM = 7;
var LIST_ITEM_BORDER_LEFT_SMALL = 5;

function formatListItem(ID, startTime, myAnnotation, viewMode, hasData) {
  var startingPosition = getStartPosition(startTime);

  var width = 10; // used to be 7
  var height = 1; // used to be default, let's make these arrows bigger to test how they look, then change to another color.
  var style =
    "margin:0;padding:0;z-index:1;position:absolute;width:" +
    width +
    "px;height:" +
    height +
    "px;left:" +
    startingPosition +
    "px;border-bottom:6px solid transparent;border-top:6px solid transparent;";

  style +=
    "border-left:" +
    LIST_ITEM_BORDER_LEFT_MEDIUM +
    "px solid " +
    getAnnotationColor(viewMode) +
    ";";

  return (
    '<div id="' +
    ID +
    '" class="annotation-list-item" style="' +
    style +
    '"></div>'
  );
}

function getAnnotationColor(viewMode) {
  var color;
  if (MINE == viewMode) {
    color = "#58a0dc"; // BLUE
  } else if (INSTRUCTORS_AND_TAS == viewMode) {
    color = "#000000"; // BLACK  // "#58b947"; // color blindness: green conflicts with orange/red for protanopia and deuteranopia and conflicts with blue for tritanopia.
  } else {
    color = "#ff6b00"; // ORANGE
  }

  return color;
}

function getStartPosition(startTime) {
  // alert("The value of mediaDuration is: " + mediaDuration);
  return Math.floor((startTime / mediaDuration) * sliderWidth);
}

function newWindowPrint(someText) {
  var newWin = window.open("", "", "width=640,height=480");
  newWin.document.writeln(someText);
}

function compactList(listCopy, viewMode) {
  // if no annotations there's nothing to do
  if (0 == listCopy.length) return null;

  // for display purposes give flags an end time that will work out to 7px (the width of the flag icon)
  var flagWidth = 10; // used to be 7

  var duration = (flagWidth / sliderWidth) * mediaDuration;
  // debug("duration: " + duration + "\nflagWidth: " + flagWidth + "\nsliderWidth: " + sliderWidth + "\ngetDuration(): " + duration);
  for (i = 0; i < listCopy.length; i++) {
    listCopy[i].endTime = listCopy[i].startTime + duration;
  }

  var itemsToDelete = [];

  hasData = annotationHasData(listCopy[0].tags, listCopy[0].description);
  var list =
    "<li>" +
    formatListItem(
      listCopy[0].id,
      listCopy[0].startTime,
      listCopy[0].myAnnotation,
      viewMode,
      hasData
    ) +
    "";
  var currentEnd = Math.floor(listCopy[0].endTime);
  listCopy.splice(0, 1);

  while (listCopy.length > 0) {
    for (i = 0; i < listCopy.length; i++) {
      if (currentEnd <= Math.floor(listCopy[i].startTime)) {
        // these annotations do not overlap so they can go on the same line
        hasData = annotationHasData(listCopy[i].tags, listCopy[i].description);
        list =
          list +
          formatListItem(
            listCopy[i].id,
            listCopy[i].startTime,
            listCopy[i].myAnnotation,
            viewMode,
            hasData
          ) +
          "";
        currentEnd = Math.floor(listCopy[i].endTime);

        // we're done with [i] so splice it out
        itemsToDelete.push(i);
      }
    }

    while (itemsToDelete.length > 0) {
      listCopy.splice(itemsToDelete.pop(), 1);
    }

    list = list + "</li>";
    if (listCopy.length > 0) {
      currentEnd = 0;
      list = list + "<li>";
    }
  }

  return "<ul id=" + viewMode + ">" + list + "</ul>";
}

function getAnnotationsCopy() {
  annotationsCopy = [];

  if (viewAllAnnotations) {
    // make a copy of the original array
    annotationsCopy = annotations.slice();
  } else {
    for (i = 0; i < annotations.length; i++) {
      // only keep annotations authored by user
      if ("true" == annotations[i].myAnnotation) {
        annotationsCopy.push(annotations[i]);
      }
    }
  }

  return annotationsCopy;
}

function annotationHasData(tags, description) {
  if ("" == $.trim(tags) && "" == $.trim(description)) {
    return false;
  } else {
    return true;
  }
}

function annotationCommentUpdateOnClick() {
  // close dialog before opening another
  closeAnnotationDialog();

  "comments" == $(this).parent().parent().attr("id")
    ? (annotationMode = false)
    : (annotationMode = true);
  // debug("<>annotationMode: " + annotationMode);

  // open if user does not have an "Add Annotation" dialog open
  // (ie. an annotation is not currently being created)
  if (annotationChanged()) {
    // assert: user has an annotation dialog open
    alertAnnotationChanged();
  } else {
    ID = $(this).attr("id");

    "annotation-list-item" == $(this).attr("class")
      ? showAnnotation(ID, true)
      : showAnnotation(ID, false);
    updateAnnotationViewCount(ID);
    showAnnotationForm();
    debug("'#annotation-form').css('display', 'block')");
  }
}

function formatComments() {
  //create an array with month names
  var months = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];

  if (comments == null || comments.length <= 0) {
    // Display a single, uneditable entry telling people to post something.
    list =
      "<li style='cursor:auto'>" +
      '<br/><span style="white-space:pre-wrap; font-size:80%;">' +
      "There is no comment for this video yet. You can add yours and review them later!" +
      "</span>" +
      "</li>";
  } else {
    // put most recent comments first
    comments.reverse();

    var list = "";
    $.each(comments, function (index, value) {
      if (value.description.length > previewLen) {
        // we must find the last position of </a> from previewLen so that we don't
        // accidentally cut the middle of a link
        indexOfAClosingTag = value.description_with_html.indexOf(
          "</a>",
          previewLen
        );
        preview_with_link_end =
          indexOfAClosingTag >= previewLen
            ? indexOfAClosingTag + 4
            : previewLen;
        description = value.description_with_html.substring(
          0,
          preview_with_link_end
        );
        description = description + "...";
      } else {
        description = value.description_with_html;
      }

      // http://stackoverflow.com/questions/3075577/convert-mysql-datetime-stamp-into-javascripts-date-format
      // Split timestamp into [ Y, M, D, h, m, s ]
      var t = value.creationDate.split(/[- :]/);

      // Apply each element to the Date function
      var dateObj = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

      commentDate = months[dateObj.getMonth()] + " " + dateObj.getDate();

      list +=
        "<li id=" +
        value.id +
        ">" +
        '<span class="label" style="font-size:75%; white-space:pre-wrap;">' +
        "<span class='searchable_word'>" +
        value.userName +
        "</span>" +
        " - " +
        commentDate +
        ":</span><br/>" +
        ' <span style="white-space:pre-wrap; font-size:80%;word-wrap:break-word">' +
        makeSearchableBySingleWord(description) +
        " </span>" +
        "</li>";
    });
  }
  debug("formatComments: " + list);
  return list;
}

function getAnnotations() {
  // clear annotations and comments first before re-fetching
  annotations.splice(0, annotations.length);
  comments.splice(0, comments.length);

  var list = getAnnotationList(MINE);

  //console.log(list);
  // add others users if in view all mode
  if (viewAllAnnotations) {
    list += getAnnotationList(INSTRUCTORS_AND_TAS);
    list += getAnnotationList(STUDENTS);
  }

  if (list != null && list.length > 0) {
    $("#annotation-list").html(list);
    $(".annotation-list-item").click(annotationCommentUpdateOnClick);
  } else {
    var noAnnotationText =
      "<br/>There is no annotation for this video yet.<br/>Add annotations as you find points of interest so you can review them later!</br> ";
    $("#annotation-list").html(
      '</br> <span class="label" style="font-size:75%; white-space:pre-wrap;text-align:center;width:550px;background-color:#ffffff;">' +
        noAnnotationText +
        "</span>"
    );
  }

  var trendline = generateTrendline();
  $("#trends").html(trendline);

  $("#comments ul").html(formatComments());
  if (comments != null && comments.length > 0) {
    $("#comments ul > li").click(annotationCommentUpdateOnClick);
  }
}

function showAnnotationForm() {
  $("#annotation-form").css("display", "block");
  $("#annotation-form").css("z-index", "99");
  $("#comments").css("z-index", "1");
  fadeOutComments(true);
}

function showFeedbackForm() {
  $("#annotation-form1").css("display", "block");
  $("#annotation-form1").css("z-index", "99");
  $("#comments").css("z-index", "1");
}

function saveAnnotation() {
  if (!psycMode) {
    if (isVideoAnnotation() && newAnnotation()) {
      // do not save annotation until webcam recording has been saved
      if (!webcamRecordingSaved()) {
        alertAnnotationChanged();

        debug("! webcamRecordingSaved()");
        return;
      }
    }
  }

  annotationMode || psycMode
    ? (startTime = createAnnotationStartTime)
    : (startTime = null);
  psycMode ? (endTime = getCurrentYouTime()) : (endTime = null);
  var tags = $("#annotation-tags").val();
  var description = $("#annotation-description").val();
  var isPrivate = $("#annotation-privacy").is(":checked");
  var isDeleted = "0";
  var confidenceType = $("#confidence_type").val();

  $.ajax({
    type: "POST",
    url: "ajax/add_annotation.php",
    data: {
      video_id: videoID,
      start_time: startTime,
      end_time: endTime,
      tags: tags,
      description: description,
      is_private: isPrivate,
      is_deleted: isDeleted,
      video_annotation_id: videoAnnotationEntryID,
      confidence_level: confidenceType,
    },
    success: function (data) {
      debug("data " + data);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      debug(xhr.status);
      debug(xhr.responseText);
      debug(thrownError);
    },

    async: false,
  });

  update();
}

function updateAnnotationViewCount(ID) {
  $.ajax({
    type: "POST",
    url: "ajax/increment_annotation_views.php",
    data: { annotation_id: ID },
    success: function (data) {
      debug("data " + data);
    },
    async: false,
  });
}

function updateAnnotation(ID) {
  //debug("in updateAnnotation()");

  var list;
  annotationMode ? (list = annotations) : (list = comments);

  //TODO: direct access would be better than iterating
  for (i = 0; i < list.length; i++) {
    if (ID == list[i].id) {
      annotationMode ? (startTime = list[i].startTime) : (startTime = null);
      var endTime = null;
      var isPrivate = $("#annotation-privacy").is(":checked");
      var tags = $("#annotation-tags").val();
      var description = $("#annotation-description").val();
    }
  }

  // debug("\nstartTime: " + startTime + "\nendTime: " + endTime);

  $.ajax({
    type: "POST",
    url: "ajax/edit_annotation.php",
    data: {
      video_id: videoID,
      id: ID,
      start_time: startTime,
      end_time: endTime,
      tags: tags,
      description: description,
      is_private: isPrivate,
      video_annotation_id: videoAnnotationEntryID,
    },
    success: function (data) {
      debug("data " + data);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      debug(xhr.status);
      debug(xhr.responseText);
      debug(thrownError);
    },
    async: false,
  });

  closeMessageDialog();

  // annotation has been saved so we can set this back to false
  annotationTimeModified = false;

  update();
}

function update() {
  closeAnnotationDialog(CONFIRMED);
  getAnnotations();
  //An ZHAO added for Usyd pilot
  //Feedback window will pop up if there are points
  if (yesChecked) showFeedbackWindow();
}

function update1() {
  closeAnnotationDialog(CONFIRMED);
  getAnnotations();
}

function deleteAnnotation(ID, videoAnnotationID) {
  debug("deleteAnnotation() videoAnnotationID " + videoAnnotationID);
  if (undefined === videoAnnotationID) videoAnnotationID = null;
  $.ajax({
    type: "POST",
    url: "ajax/delete_annotation.php",
    data: { id: ID, video_annotation_id: videoAnnotationID },
    success: function (data) {
      debug("data " + data);
    },
    async: false,
  });

  update1();
}

$(document).mouseup(function () {
  if (psycModeAnnotating) {
    $("#buttons #add-annotation").attr("src", "icons/add-annotation.png");
    psycModeAnnotating = false;
    saveAnnotation();
  }
});

function debug(msg) {
  //console.log(msg);
}

function makeSearchableBySingleWord(str) {
  var returnStr = "....";
  if (str != null) {
    str = str.replace(/<a/g, "___LINK_TOKEN___<a");
    str = str.replace(/<\/a>/g, "</a>___LINK_TOKEN___");
    strList = str.split("___LINK_TOKEN___");
    outputStrList = new Array();

    for (var i = 0; i < strList.length; i++) {
      if (strList[i].indexOf("<a") >= 0) {
        outputStrList.push(
          "<span class='searchable_word'>" + strList[i] + "</span>"
        );
      } else {
        outputStrList.push(makeSearchableBySingleWordHelper(strList[i]));
      }
    }

    returnStr = outputStrList.join(" ");
  }
  return returnStr;
}

function makeSearchableBySingleWordHelper(str) {
  var returnString = " .. ";
  if (str != null) {
    var wordList = str.split(" ");
    var returnList = new Array();

    for (var i = 0; i < wordList.length; i++) {
      returnList.push(
        "<span class='searchable_word'>" + wordList[i] + "</span>"
      );
    }

    returnString = returnList.join(" ");
  }
  return returnString;
}

function findMatches(searchTerm) {
  if (searchTerm == null) return;

  // make allowance for acronyms
  if (searchTerm.length > 1 && searchTerm.toUpperCase() == searchTerm) {
    var SEARCH_LENGTH_THRESHOLD = 0;
  } else {
    var SEARCH_LENGTH_THRESHOLD = 2;
  }

  searchTerm = $.trim(searchTerm).toLowerCase();

  var matchFoundInAnnotations = 0;
  var isSearchingByAuthor = $("#search_by_author").attr("checked");
  var isSearchingByContent = $("#search_by_content").attr("checked");
  var isSearchingByTag = $("#search_by_tag").attr("checked");

  // LOOK IN ANNOTATIONS - FORMAT ANY ENTRIES FOUND
  $.each(annotations, function (index, value) {
    var userName = value["userName"].toLowerCase();
    var description = value["description"].toLowerCase();
    var tags = value["tags"].toLowerCase();
    var id = value["id"];
    var target = "#annotation-list > ul > li > #" + id;

    if (
      ((isSearchingByAuthor && userName.indexOf(searchTerm) >= 0) ||
        (isSearchingByContent && description.indexOf(searchTerm) >= 0) ||
        (isSearchingByTag && tags.indexOf(searchTerm) >= 0)) &&
      searchTerm.length > SEARCH_LENGTH_THRESHOLD
    ) {
      // FOUND MATCH: add highlight property to annotation
      // highlight partial matches lighter than full matches
      var highlightColor =
        userName.indexOf(searchTerm + " ") >= 0 ||
        description.indexOf(searchTerm + " ") >= 0 ||
        tags.indexOf(searchTerm + " ") >= 0
          ? "#090"
          : "#4e4";
      $(target).css(
        "border-left",
        LIST_ITEM_BORDER_LEFT_BIG + "px groove " + highlightColor
      );
      matchFoundInAnnotations++;
    } else {
      // NOT MATCHED: remove highlight property from annotation
      var viewMode = value["viewMode"];
      value =
        LIST_ITEM_BORDER_LEFT_MEDIUM +
        "px solid " +
        getAnnotationColor(viewMode);
      $(target).css("border-left", value);
    }
  });

  // LOOK AGAIN IN ANNOTATIONS - MAKE NON ENTRIES SEMI-TRANSPARENT
  $.each(annotations, function (index, value) {
    var userName = value["userName"].toLowerCase();
    var description = value["description"].toLowerCase();
    var tags = value["tags"].toLowerCase();
    var id = value["id"];
    var target = "#annotation-list > ul > li > #" + id;

    if (
      ((isSearchingByAuthor && userName.indexOf(searchTerm) >= 0) ||
        (isSearchingByContent && description.indexOf(searchTerm) >= 0) ||
        (isSearchingByTag && tags.indexOf(searchTerm) >= 0)) &&
      searchTerm.length > SEARCH_LENGTH_THRESHOLD
    ) {
      // FOUND MATCH IN 2ND PASS, DON'T MESS WITH OPACITY OF MATCHES
      $(target).css("opacity", 1.0);
    } else {
      // NOT MATCHED IN 2ND PASS, CHANGE OPACITY
      if (matchFoundInAnnotations > 0) {
        $(target).css("opacity", 0.4);
      } else {
        $(target).css("opacity", 1.0);
      }
    }
  });

  // LOOK IN COMMENTS
  $.each(comments, function (index, value) {
    var userName = value["userName"].toLowerCase();
    var description = value["description"].toLowerCase();
    var tags = value["tags"].toLowerCase();
    var id = value["id"];

    var target = "#comments ul > #" + id;

    // Highlight the comment blocks
    if (
      ((isSearchingByAuthor && userName.indexOf(searchTerm) >= 0) ||
        (isSearchingByContent && description.indexOf(searchTerm) >= 0) ||
        (isSearchingByTag && tags.indexOf(searchTerm) >= 0)) &&
      searchTerm.length > SEARCH_LENGTH_THRESHOLD
    ) {
      // FOUND MATCH: add highlight property to annotation
      $(target).css("border-left", "8px groove #0c0");
    } else {
      // NOT MATCHED: remove highlight
      $(target).css("border-left", "8px solid transparent");
    }

    // Deep search to highlight the words within the comments
    $(".searchable_word").each(function (index) {
      if (
        $(this).text().toLowerCase().indexOf(searchTerm) >= 0 &&
        searchTerm.length > SEARCH_LENGTH_THRESHOLD
      ) {
        var highlightColor =
          $.trim($(this).text()).length == searchTerm.length
            ? "rgba(0,128,0,0.5)"
            : "rgba(0,255,0,0.3)";
        $(this).css("background-color", highlightColor);
      } else {
        $(this).css("background-color", "transparent");
      }
    });
  });
}

$(document).ready(function () {
  // show annotations once document ready
  getAnnotations();

  $("*").delegate("", "mouseup", function (event) {
    // this event is fired multiple times so record it just once
    if (!playheadMouseup) {
      var sliderHandle = $("div.play_head > a.ui-slider-handle");
      //debug("playhead mouseup");

      var playheadPosition = sliderHandle.css("left");
      var currTime = parseInt(
        (parseFloat(playheadPosition) / 100) * getDuration()
      );
      //debug("property:left: " + $(this).css('left') + " playerPaused:" + playerPaused);

      if (!playerPaused()) {
        recordEvent(getCurrentYouTime(), 0);
        recordEvent(currTime, 1);
      }
      playheadMouseup = true;
    }
  });

  $("*").delegate(
    "div.play_head > a.ui-slider-handle, div.play_head",
    "mousedown",
    function (event) {
      event.stopPropagation();
      playheadMouseup = false;
    }
  );

  $("#record-again").live("click", function () {
    showRecorder();
  });

  $("#annotation-type").change(function () {
    if ("video" == $("#annotation-type").val()) {
      showRecorder();
    } else {
      $("#webcam").css("display", "none"); // WEBCAM ANNOTATION:
    }
  });

  $("#message-dialog").bind("dialogclose", function (event, ui) {
    closeMessageDialog();
  });

  $("#search-annotations > input").keyup(function () {
    findMatches($("#search-annotations input").val());
  });

  $("#search-annotations").submit(function (e) {
    findMatches($("#search-annotations input").val());
    e.preventDefault();
  });

  $(".search_criteria").change(function () {
    findMatches($("#search-annotations input").val());
  });

  $("#auto_hover_search").change(function () {
    findMatches("");
  });

  if (annotationsEnabled) {
    $("#add-annotation, #add-comment").click(function () {
      "add-annotation" == $(this).attr("id")
        ? (annotationMode = true)
        : (annotationMode = false);
      if (!psycMode) showAnnotationWindow();
    });
  }

  $("#trends").click(function (e) {
    // seek to corresponding point in video
    var parentOffset = $(this).parent().offset();

    var relX = e.pageX - parentOffset.left;
    var percent = relX / sliderWidth;
    percent.toFixed(5);

    var player = $j("#player").get(0);
    player.play();
    player.doSeek(percent);
    player.play();
  });

  $("#annotation-view").toggle(
    function () {
      //TODO: look into this query param stuff
      //TODO: is "flag_mode" actually used anywhere at all? It looks like it's not since the db entry for every user is "annotation_mode = annotation"
      //		and following its use in the code leads to annotations->getAnnotations and it is commented out there.
      queryParam = "flag_mode=0";
      $("#annotation-view").html(
        'view: <span style="cursor:pointer;">mine</span> / <strong>all</strong>'
      );
      $("#buttons a").attr(
        "href",
        "ajax/download_annotations.php?video_id=" +
          videoID +
          "&viewAll=1&" +
          queryParam
      );
      viewAllAnnotations = true;
      getAnnotations();
    },
    function () {
      queryParam = "flag_mode=0";
      $("#annotation-view").html(
        'view: <strong>mine</strong> / <span style="cursor:pointer;">all</span>'
      );
      $("#buttons a").attr(
        "href",
        "ajax/download_annotations.php?video_id=" +
          videoID +
          "&viewAll=0&" +
          queryParam
      );
      viewAllAnnotations = false;
      getAnnotations();
    }
  );

  $("#close-annotation").click(function () {
    closeAnnotationDialog();
  });

  $("#close-annotation1").click(function () {
    closeAnnotationDialog1();
  });

  $("#submit").click(function (e) {
    //alert(($('input[name=choice]:radio:checked')).val());
    //alert($(this).is(':checked'));
    //alert($('input:radio:checked').val());
    if (
      !(
        $('input[name="choice"]').is(":checked") &&
        $('input[name="choice1"]').is(":checked") &&
        $('input[name="choice2"]').is(":checked")
      )
    ) {
      e.preventDefault();
      alert("You must answer to each question!");
    }
  });

  function getAnnotationIndex(ID) {
    var match;
    $.each(annotations, function (index, value) {
      if (ID == value["id"]) {
        match = index;
        // break loop by returning false to callback function
        return false;
      }
    });
    return match;
  }

  // preview annotations
  function showPreview(event) {
    var tPosX = event.pageX + previewOffsetX + "px";
    var tPosY = event.pageY + previewOffsetY + "px";
    $("#preview").css({ position: "absolute", top: tPosY, left: tPosX });
  }

  $("#annotation-list .annotation-list-item").live(
    "mouseover",
    function (event) {
      // safeguard, if there somehow was a preview before, remove it
      $("#preview").remove();

      var ID = $(this).attr("id");
      var index = getAnnotationIndex(ID);

      var startTime = annotations[index]["startTime"];

      var hours = parseInt(startTime / 3600);
      var minutes = parseInt(startTime / 60);
      var seconds = startTime % 60;

      // display format is 0:00:00 so pad output if necessry
      if (minutes < 9) minutes = "0" + minutes;
      if (seconds < 9) seconds = "0" + seconds;

      var userName = annotations[index]["userName"];
      var displayTime = hours + ":" + minutes + ":" + seconds;
      var tags = annotations[index]["tags"];
      var description = annotations[index]["description"];
      var description_with_html = annotations[index]["description_with_html"];
      var videoAnnotationID = annotations[index]["videoAnnotationID"];
      var annotationType;
      "null" == videoAnnotationID
        ? (annotationType = "text")
        : (annotationType = "video");

      // the "z-index" is not moved to style.css because it confers logic, so it is "code", not look
      $(
        '<div id="preview" style="z-index:100;" title="click anywhere in the preview to edit">' +
          '<span class="label" >User:</span> ' +
          "<span class='searchable_word'>" +
          userName +
          "</span>" +
          '&nbsp;-&nbsp;<span class="label" >Time:</span> ' +
          displayTime +
          '<br /><span class="label">Tags:</span><span style="font-style:italic;white-space:pre-wrap;word-wrap:break-word"> ' +
          (tags
            ? makeSearchableBySingleWord(tags)
            : "<span style='color:#C0C0C0'>N/A</span>") +
          '</span><br /><span class="label">Description: </span><span style="font-style:italic;white-space:pre-wrap;word-wrap:break-word"> ' +
          makeSearchableBySingleWord(description_with_html) +
          "</span>" +
          "</div>"
      ).appendTo($("body"));

      currentPreviewItem = $(this);

      showPreview(event);
      findMatches($("#search-annotations input").val());
    }
  );

  $(".searchable_word").live("mouseover", function (event) {
    if ($("#auto_hover_search").attr("checked")) {
      // Apparently getting the value out of a span in a jQuery event requires using normal
      // javascript syntax, i.e. this.innerHTML.
      $("#search-annotations input").val(
        this.textContent || this.innerText || this.innerHTML
      );
      $(this).css("background-color", "rgba(0,255,0,0.3)");
      findMatches($("#search-annotations input").val());
    }
  });

  $(".searchable_word").live("mouseout", function (event) {
    $(this).css("background-color", "transparent");
  });

  $("#preview").live("mouseleave", function (event) {
    $("#preview").remove();
    currentPreviewItem = null;
  });

  $("#preview").live("click", function (event) {
    $("#preview").remove();
    if (currentPreviewItem != null) {
      currentPreviewItem.trigger("click");
    }
    currentPreviewItem = null;
  });

  $("#start-time-rwd")
    .mouseover()
    .mousedown(function () {
      //intervalID = setTimeout("playerSeek(" + -seekSpeed + ", true)", 100);
      playerSeek(seekSpeed * -1, true);
      debug("start time - rewind " + intervalID);
    });
  $("#start-time-fwd")
    .mouseover()
    .mousedown(function () {
      //intervalID = setTimeout("playerSeek(" + seekSpeed + ", true)", 100);
      intervalID = setTimeout("playerSeek(" + seekSpeed + ", true)", 100);
    });
  $("#start-time-rwd, #start-time-fwd").mouseout(function () {
    // look into this approach http://www.electrictoolbox.com/using-settimeout-javascript/
    clearTimeout(intervalID);
  });
  $("#add-annotation").mousedown(function () {
    if (psycMode) {
      $("#add-annotation").attr("src", "icons/annotating.png");
      psycModeAnnotating = true;
      createAnnotationStartTime = getCurrentYouTime();
    }
  });

  if (!annotationsEnabled) {
    $("#add-annotation").css("opacity", "0.3");
    $("#add-annotation").css("cursor", "default");
    disableDownloadAndCommentButtons();
  }

  if (psycMode) disableDownloadAndCommentButtons();

  function disableDownloadAndCommentButtons() {
    $("#download-annotations").css("opacity", "0.3");
    $("#download-annotations").css("cursor", "default");
    $("#download-annotations").click(function (e) {
      e.preventDefault();
    });

    $("#add-comment").css("opacity", "0.3");
    $("#add-comment").css("cursor", "default");
  }

  // prevent images from being dragged
  $("img").bind("dragstart", function (event) {
    event.preventDefault();
  });
});
