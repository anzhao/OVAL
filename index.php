

<?php
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

// John Bratlien and Thomas Dang, 2011-2012
// An ZHAO started to modify this page since Nov of 2013.

require_once(dirname(__FILE__) . "/includes/global_deploy_config.php");
require_once(dirname(__FILE__) . "/includes/common.inc.php");
require_once(dirname(__FILE__) . "/includes/auth.inc.php");
require_once(dirname(__FILE__) . "/database/media.php");
require_once(dirname(__FILE__) . "/database/users.php");
require_once(dirname(__FILE__) . '/includes/kaltura/kaltura_functions.php');
require_once(dirname(__FILE__) . "/MyVideo.php");


$isiPad = (bool) strpos($_SERVER['HTTP_USER_AGENT'],'iPad');


startSession();


$userName = $_SESSION['name'];
$userID   = $_SESSION['user_id'];


$isAdmin  = isAdmin($_SESSION['role']);



if (compatibilityModeIE9()) {
?>
	<html>
	<head>
	</head>
	<body>








	You are viewing this page in compatibility view. 
	Compatibility view causes layout problem, please disable it by 
	<a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie-9/features/compatibility-view">
		clicking the compatibility view button.
	</a>
	</body>
	</html>
<?php
    exit();
}
?>

<?php
if (! browserSupported()) {
    $browserData = getBrowserData();

    $browser    = $browserData["browser"];
    $version    = $browserData["version"];
?>
<html>
<h1>Browser version not supported</h1>
    <?php
    if ("IE" == $browser) {
        print "To use OVAL you must upgrade to IE 9.";    
    } else {
        print "<p>To use OVAL you must upgrade to the lastest version of <?php$browser?>.</p>";
        print "current version:$version<br />";
    }
 	?>
</html>
<?php
    
    exit();
}
?>



<?php
$media  = new media();

$users      = new users();
$uiConfig   = $users->getUI($userID);


$classes    = $users->getClassesUserBelongsTo($userID);
foreach ($classes as $key=>$row) {
	$id[$key] = $row['ID'];
	$name[$key] = $row['name'];
}
array_multisort($name, SORT_ASC, $id, SORT_DESC, $classes);


if (isset($_GET['cid'])) {
    $CID = $_GET['cid'];
} else {
    $CID = $classes[0]['ID'];
}


$groups     = $users->getMyGroups($userID, $CID);


$test = $media->getVideosByClassID($CID);
$globalVID = $test[0][video_id];


// Show Unassigned Video - Disabled for now, unwieldy interface in practice
// Has video previewing available in the video management page instead
if ($isAdmin) {
    if (0 != count($media->getVideosWithNoGroup($userID))) {
		 $groups['U'] = "-- UNASSIGNED VIDEOS";
    }
}

$users->close();

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Collaborative Lecture Annotation System: video annotation tool</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<!-- Debug version: If using the debug version you can remove all the below js / css references --> 
  <!--  <script type="text/javascript" src="../mwEmbed.js" ></script>  -->

  <script>var yesChecked = false;</script>

  <script src=”//code.jquery.com/jquery-1.7.2.js”></script>

  <script src="lunametrics-youtube-v6.js"></script>

 	 	
    <link rel="stylesheet" type="text/css" href="style.css" />
	
	<!--  Include jQuery, use a local jQuery to deal with Chrome's conservative same domain policy --> 	
 	<script type="text/javascript" src="kaltura-html5player-widget/jquery-1.4.2.min.js"></script>
 	
 	<!--  Include the local Open Source Kaltura player -->
 <!--	<script type="text/javascript" src="includes/kaltura/mwEmbedLoader.php"></script>   -->
	<style type="text/css">
    	@import url("kaltura-html5player-widget/skins/jquery.ui.themes/kaltura-dark/jquery-ui-1.7.2.css");
	</style>  
	<style type="text/css">
		@import url("kaltura-html5player-widget/mwEmbed-player-static.css");
	</style>	
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/themes/base/jquery-ui.css" rel="stylesheet" type="text/css"/>
	<script type="text/javascript" src="kaltura-html5player-widget/mwEmbed-player-static.js"></script>
	<script type="text/javascript">
		<!-- put mw.setConfig calls here -->
		<!-- mw.setConfig('EmbedPlayer.EnableRightClick', false); -->
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/jquery-ui.min.js"></script>
    <script type="text/javascript">
<?php
	// This part sets javascript variables from PHP based on user setting &/or access ctrl in DB 
    if ("yes" == $uiConfig['annotations_enabled']) {
        print "\tvar annotationsEnabled = true;\n";
    } else {
        print "\tvar annotationsEnabled = false;\n";
    }
    
    if ("PSYC" == $uiConfig['annotation_mode']) {
        print "\tvar psycMode = true;\n";
    } else {
        print "\tvar psycMode = false;\n";
    }

    printSharedClientServerConstants();

    if (isset($_GET['gid'])) {
        $GID = $_GET['gid'];
    } else {
        $groupIDs = array_keys($groups);
        $GID = $groupIDs[0];
    }
	//print "GID:$GID<br />";
    
	    
	    if (is_numeric($GID)) {
	        $videos = $media->getVideosByGroupID($userID, $GID);
	    } else {
			$videos = $media->getVideosWithNoGroup($userID);
	    }
	    
	
    // grab the first available video if none set
    (isset($_GET['vid'])) ? $VID = $_GET['vid'] : $VID = array_shift(array_keys($videos));
    
    // strip out hash
    $VID = (string) str_replace("#", "", $VID);
    $duration = $videos[$VID]['duration'];
    $conversionStatus = $videos[$VID]['conversion_complete'];
    $thumbnailURL = $videos[$VID]['thumbnail_url']; 
    if (is_null($duration)) $duration=0;

	$flavors = $media->getFlavors($VID);
	
	/* sanity check, there are multiple ways that kaltura conversion might fail
	 * silently, so do a client side, right-before-view check as a last line of defense
	 */
	if (
		empty($flavors) || 
		count($flavors) <= MINIMUM_FLAVOR_COUNT ||
		$conversionStatus != CONVERSION_COMPLETED
		) {
		$flavorsFromKMC = getFlavorsFromKMC($VID);
		
		if (!empty($flavorsFromKMC)) {
			foreach ($flavorsFromKMC as $flavor) {
				if ("" != $flavor['codec_id']) {
					$media->addFlavor($flavor['flavor_id'],
							$VID,
							$flavor['codec_id'], 
							$flavor['file_ext']);
				}
			}
			$flavors = $media->getFlavors($VID);
		}
	}
	
	// MIGRATION MODE
	if (kalturaCdnURL_INTERIM != null && kalturaCdnURL_INTERIM != "") {
		$flavorsFromKMC = getFlavorsFromKMC($VID);
	
		if (empty($flavorsFromKMC)) {
			$kalturaCdnURL = kalturaCdnURL_INTERIM;
		}
	}
	
	$media->close();

  print "\tvar mediaDuration = $duration;\n";

// print "\tvar mediaDuration = 678;\n";

    print "\tvar videoID       = \"$VID\";\n";
    print "\tvar userID        = \"$userID\";\n";
?>   

        $(document).ready(function() {
            
            $('#choose-class').change(function() {
                location.href = getPathFromURL(window.location.href) + "?class_id=" + $(this).val(); 
            });
            
            $('#span-video').click(function() {
                if ($(this).is(':checked')) {
                    $('#annotation-start-end-time');
                    $('#annotation-end-time');
                    $('#annotation-start-end-time').css('opacity', '0.5');
					//console.log("span video");
                } else {
                    $('#annotation-start-end-time').css('opacity', '1.0');
                }
            });
            
        });

        function getPathFromURL(url) {
            return url.split("?")[0];
        }

        function jumpBox(list) {
              location.href = list.options[list.selectedIndex].value;
        }
    </script>
    <!-- Annotations related JS are here -->
 	<script type="text/javascript" src="ui.js"></script>
 	<!-- Video players wrapper functions are here -->
 	<script type="text/javascript" src="video_functions.js"></script>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
</head>
<body>


	<div id="wrapper">
    <div id="comments">
        <h3>General Comments</h3>
        <ul>
            <li></li>
        </ul>
        <img src="icons/add-comment.png" id="add-comment" style="float:right;margin:8px 6px 8px 0px;cursor:pointer;" alt="add a comment"/>
    </div>

    <div id="admin-bar">
        <form id="class" name="class" method="post" action="" style="float:left;">
            Course:&nbsp&nbsp&nbsp;
            <?php 
				$noCourses = (0 == count($classes)) ? "disabled" : "";
            ?>
            <select name="classJumpMenu" id="classJumpMenu" <?php echo $noCourses?> onChange="jumpBox(this.form.elements[0])" style="width:19em;" >
            <?php 
            if (0 == count($classes)) {
            	print "<option>-- NO COURSES</option>";
            } else {
    
            	for ($i=0; $i<count($classes); $i++): ?>
                <?php
	                $ID     = $classes[$i]['ID'];
	                $name   = $classes[$i]['name'];
	                ($CID == $ID) ? $selected = "selected=\"selected\"" : $selected = "";
                ?>
                	<option value="index.php?cid=<?php echo "$CID&gid=$ID"; ?>"<?php echo"$style $selected>$name"?></option>
			<?php endfor; 
			}
			?>
            </select>
        </form>
        <form id="group" name="group" method="post" action="" style="float:left;clear:left;">
            Group:&nbsp&nbsp&nbsp&nbsp&nbsp;
            <?php 
				$noGroups = (0 == count($groups)) ? "disabled" : "";
            ?>
            <select name="groupJumpMenu" id="groupJumpMenu" <?php echo $noGroups?> onChange="jumpBox(this.form.elements[0])" style="width:19em;" >


            <?php 
            if (0 == count($groups)) {
				print "<option>-- NO GROUPS</option>";
			} else {
            	foreach ($groups as $ID=>$name): ?>
                <?php
	                ($GID == $ID) ? $selected = "selected=\"selected\"" : $selected = "";
	                
	                // Can't seem to apply style to an input option, what to do?
	                // ('U' == $ID) ? $style = "style=\"color:red\"" : $style = "";
                ?>
                	<option value="index.php?cid=<?php echo "$CID&gid=$ID"; ?>" <?php echo "$style $selected > $name"; ?></option>
            <?php endforeach; 
            }
            ?>
            </select>
        </form>
        <a href="logout.php" style="float:right;padding-left:20px;" onClick="onLogOutEvent()">log out</a>







        
        <form id="video" name="video" method="post" action="" style="float:left;clear:left;">
            Video:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp;    
            <?php if (0 == count($videos)) $videosDisabledStr='disabled="disabled"'; ?>
            <select name="jumpMenu" id="jumpMenu" onChange="jumpBox(this.form.elements[0])" style="width:19em;" <?php echo $videosDisabledStr?>>
<?php
("flag" == $uiConfig['annotation_mode']) ? $queryParam = "&flag_mode=1" : $queryParam = "";

if (0 == count($videos)) {
    print "<option>-- NO VIDEOS</option>";
} else {
    // fetch videos
    foreach ($videos as $video) {

		if ($isAdmin && sizeof($classes) > 1) {
            if ($classID != $video['class_id']) continue;
        }
        
        $videoID = $video['video_id'];
        ($VID == $videoID) ? $selected = "selected=\"selected\"" : $selected = "";

        $title = $video['title'];
        print "\t\t<option value=\"index.php?cid=$CID&gid=$GID&vid=$videoID$queryParam\" $selected>$title</option>\n";
    }
}
?>                    
            </select>
        </form>
<!--   <? span style="padding-left:2em;font-size:13px;">user: $userName</span>; ?>  --> 
<!--    <? echo "span style=\"padding-left:2em;font-size:13px;\">user: " . $userName . "</span>"; ?>  --> 
         <span style="padding-left:2em;font-size:13px;">user: <?php echo "\"$userName\""; ?> </span>  
        
        <?php if (count($groups) > 1): ?>
        <?php else: ?>
<?php endif; ?>
<?php if ($isAdmin): ?>
        <a href="video_management.php?cid=<?php echo "$CID"?>&gid=<?php echo "$GID"?>" style="float:right;padding-left:20px;">admin</a> 
        <!--  <a href="video_management.php" >admin</a> -->
        <?php endif; ?>            
    </div>

<?php




 //       if (0 == count($videos)) {
 //               print "<img id=\"vp\" src=\"icons/novideo.jpg\">";
 //       }
 //       else {
 //               if (empty($flavors)) {
 //                       print "<img id=\"vp\" src=\"icons/noflavors.jpg\">";
 //              } else {
 //                       $isChrome = (stripos($_SERVER['HTTP_USER_AGENT'], "Chrome") !== false);
 //                       $isSafari = (stripos($_SERVER['HTTP_USER_AGENT'], "Safari") !== false);

                        // Chrome and Safari does not preload some Kaltura videos properly, could be either a Kaltura problem or
                        // that Chrome and Safari does not follow the HTML5 <video> standard.
                        // note: we explicitly control whether the preload attribute is written out at all as well, since different browser
                        // handles omitting this differently
 //                       $preloadSetting = ($isChrome || $isSafari) ? "preload=\"none\"" : "";

 //                       $videoWidth = 640;
 //                       $videoHeight = 480;

 //                       global $pid, $spid;
 //                       $pid = 1591032;
 //                       $spid = 159103200;
 //                       echo "-----------This is: $kalturaCdnURL --------";
                         //$posterURL = "http://cdnbakmi.kaltura.com/p/1591032/sp/159103200/thumbnail/entry_id/0_sin91lmw/version/100000";
                         //$posterURL = $kalturaCdnURL . "/p/$pid/sp/$spid/thumbnail/entry_id/$VID/width/$videoWidth/height/$videoHeight";
                        //$posterURL = $kalturaCdnURL . "/p/$pid/sp/$spid/thumbnail/entry_id/$VID/width/$videoWidth/height/$videoHeight";

                      // $posterURL = $kalturaCdnURL . "p/$pid/sp/$spid/thumbnail/entry_id/$VID/width/$videoWidth/height/$videoHeight";
                       
                      // $posterURL = $kalturaCdnURL . "watch?v=$VID";
                        
 //                      $posterURL = MyVideo::load("1");   


                        //$posterURL = http://cdnbakmi.kaltura.com/p/1591032/sp/159103200/thumbnail/entry_id/0_sin91lmw/width/$videoWidth/height/$videoHeight;


?>



<?php


     //                   print "<video id=\"vp\" poster=\"$posterURL\" $preloadSetting>";
               // foreach ($flavors as $fileExt=>$flavorID) {

                              //  if ("flv" != $fileExt) {
                                       // $url = getVideoURL($VID, $flavorID, $fileExt);
     //                           print "\t<source src=\"$posterURL\" />\n";
                       // }

               // }
     //           print "</video>";
          //  }
     //  }




?>


<!--      </div>  -->



<div id="player"></div>

<script>
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://clas.unisa.edu.au/youtube_player_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);



      //Youtube video events tracking
     // var videoArray = new Array();
     // var playerArray = new Array(); 
    //  var videoTitle = new Array();
     // var showTitle = 3;
    //  var reloadFrames = 0;

/*      
      function trackYouTube()
{
//What am i, but nothing?
var i = 0;
//Harken to the iframes of the page
//thy loathesome demon gallavanting upon
//our innocent sweet html
jQuery('iframe').each(function() {
//but what is this?
//an iframe! Avast!
if($(this).attr('src')){
//it has a source!
//Lo we can see it's innards
//as Han was wont to slice the tauntaun
var video = $(this);
var vidSrc = video.attr('src');
//by default we shant do the following
//but if your tracking seems to suffer
//adjust they variable above
//and refresh the frames upon loading
if(reloadFrames){
//next some trickery
//has it the foul stench of the demon parameter
var regex1 = /(?:https?:)?\/\/www\.youtube\.com\/embed\/([\w-]{11})(\?)?/;
var SourceCheckA = vidSrc.match(regex1);
if(SourceCheckA[2]=="?"){
//it has the beast
//we must be cautious
//has it been thus gifted for jsapi magic?
var regex2 = /enablejsapi=1/;
var SourceCheckB = vidSrc.match(regex2);
if(SourceCheckB){
//it has the gift
//accept it and move on
}else{
//we shall embrace our foe
//and provide it with stardust
vidSrc = vidSrc + "&enablejsapi=1";
}
//but has the beast an origin
//where it pulled itself from its dank pit   */


//var regex2 = /origin=.*/;
//var SourceCheckC = vidSrc.match(regex2);
/*
if(SourceCheckC){
for (j=0; j<SourceCheckC.length; j++) {
//Ah but it has an origin and we shall change it
//waving our hands we create a new origin
//as there is no place like window.location.hostname
newOrigin = "origin=" + window.location.hostname;
var vidSrc = vidSrc.replace(regex2,newOrigin);
}
}else{
//but nay it was homeless
//sad and alone
//we shall embrace it and drape it
//in our warm cloth
vidSrc = vidSrc + "&origin=" + window.location.hostname;
}
}else{
//It is missing the mark of the parameter entirely
//this is not unexpected
//we shall garb it in the clothing of our homeland
//and provide it with it's magic for battle
vidSrc = vidSrc + "?enablejsapi=1&origin=" + window.location.hostname;
}
//We reaffirm the source unto itself
//tho it may cause a stutter
//silence the next line should you incorporate
//no magic or origins
video.attr('src', vidSrc);
}
//We shall check the source
//lo ere the response incorrect
//we shall ignore it.
//Once we did this brutally
//with the ham fist of strange logic
//until Nicole did deliver this
//upon the blog comments
//http://www.lunametrics.com/blog/2012/10/22/automatically-track-youtube-videos-events-google-analytics/
//the wonders of Reg Ex
var regex = /(?:https?:)?\/\/www\.youtube\.com\/embed\/([\w-]{11})(?:\?.*)?/;
var matches = vidSrc.match(regex);
//Should the former reg provide a match
//it shall appear in an array of matches
if(matches && matches.length > 1){
//we now place the beating heart of the youtube id
//in our first heavenly array
videoArray[i] = matches[1];
//and then mark the vile iframe beast
//with the id of this video so that all
//may know it, and reference it
video.attr('id', matches[1]);	
//And Then Alex Moore came forth
//and said 'lo this ID is a jumble
//we should provide a more meaningful title
//soas to tell the nobles from the brigands
//as we now can through my faithful
//json. Attend and be amazed!
getRealTitles(i);
//And for this, I am no longer nothing, I am more
i++;	
}
}
});	
}
//To obtain the real titles of our noble videos
//rather than the gibberish jumble
//as provided to by the wizard Alex Moore
function getRealTitles(j) {
if(showTitle==2){
playerArray[j] = new YT.Player(videoArray[j], {
videoId: videoArray[j],
events: {
'onStateChange': onPlayerStateChange
}
});	
}else{
//We pray into the ether
//harken oh monster of youtube
//tell us the truth of this noble video
var tempJSON = $.getJSON('http://gdata.youtube.com/feeds/api/videos/'+videoArray[j]+'?v=2&alt=json',function(data,status,xhr){
//and lo the monster repsonds
//it's whispers flowing as mist
//through the mountain crag
videoTitle[j] = data.entry.title.$t;
//and we now knowning it's truth
//the truth of it's birth
//we annoit it and place it on it's throne
//as is provided by the documentation
playerArray[j] = new YT.Player(videoArray[j], {
videoId: videoArray[j],
events: {
'onStateChange': onPlayerStateChange
}
});
});
}
}
//once we started our story with a document ready
//from the jquery
//but oft this caused problems
//as the youtube monster would instantiate too quickly
//in a rush, it would beat the jquery to completetion
//and instantiate it's elements prior to our array
//so we wait. for the page to load fully
//which may cause problems with thy pages
//should your other elements not comply and load quickly
//forsooth they are the problem not i
$(window).load(function() {
trackYouTube();
});
//Should one wish our monstrous video to play upon load
//we could set that here. But for us. We shall let it
//sleep. Sleep video. Await thy time.
function onPlayerReady(event) {
//event.target.playVideo();
}
//And lo did Chris Green say
//upon the blog comments
//http://www.lunametrics.com/blog/2012/10/22/automatically-track-youtube-videos-events-google-analytics/
//Why not a pause flag
//one to prevent the terrors of the spammy
//pause events when a visitor
//doth drag the slide bar
//cross't thy player
//and all said huzzah
//let us start by setting his flag to false
//so that we know it is not true
var pauseFlagArray = new Array();
//When our caged monster wishes to act
//we are ready to hold it's chains
//and enslave it to our will.
function onPlayerStateChange(event) {
//Let us accept the player which was massaged
//by the mousey hands of woman or man
var videoURL = event.target.getVideoUrl();
//We must strip from it, the true identity
var regex = /v=(.+)$/;
var matches = videoURL.match(regex);
videoID = matches[1];
//and prepare for it's true title
thisVideoTitle = "";
//we look through all the array
//which at first glance may seem unfocused
//but tis the off kilter response
//from the magical moore json
//which belies this approach
//Tis a hack? A kludge?
//These are fighting words, sir!
for (j=0; j<videoArray.length; j++) {
//tis the video a match?
if (videoArray[j]==videoID) {
//apply the true title!
thisVideoTitle = videoTitle[j]||"";
console.log(thisVideoTitle);
//should we have a title, alas naught else
if(thisVideoTitle.length>0){
if(showTitle==3){
thisVideoTitle = thisVideoTitle + " | " + videoID;
}else if(showTitle==2){
thisVideoTitle = videoID;
}
}else{
thisVideoTitle = videoID;
}
//Should the video rear it's head
if (event.data == YT.PlayerState.PLAYING) {
_gaq.push(['_trackEvent', 'Videos', 'Play', thisVideoTitle]);
//ga('send', 'event', 'Videos', 'Play', thisVideoTitle);
//thy video plays
//reaffirm the pausal beast is not with us
pauseFlagArray[j] = false;
}
//should the video tire out and cease
if (event.data == YT.PlayerState.ENDED){
_gaq.push(['_trackEvent', 'Videos', 'Watch to End', thisVideoTitle]);
ga('send', 'event', 'Videos', 'Watch to End', thisVideoTitle);
}
//and should we tell it to halt, cease, heal.
//confirm the pause has but one head and it flies not its flag
//lo the pause event will spawn a many headed monster
//with events overflowing
if (event.data == YT.PlayerState.PAUSED && pauseFlagArray[j] != true){
_gaq.push(['_trackEvent', 'Videos', 'Pause', thisVideoTitle]);
ga('send', 'event', 'Videos', 'Pause', thisVideoTitle);
//tell the monster it may have
//but one head
pauseFlagArray[j] = true;
}
//and should the monster think, before it doth play
//after we command it to move
if (event.data == YT.PlayerState.BUFFERING){
_gaq.push(['_trackEvent', 'Videos', 'Buffering', thisVideoTitle]);
ga('send', 'event', 'Videos', 'Buffering', thisVideoTitle);
}
//and should it cue
//for why not track this as well.
if (event.data == YT.PlayerState.CUED){
_gaq.push(['_trackEvent', 'Videos', 'Cueing', thisVideoTitle]);
ga('send', 'event', 'Videos', 'Cueing', thisVideoTitle);
}
}
}
} 



*/






      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var youtubeTime;
      var player1;
       window.onYouTubeIframeAPIReady = function() {
        player1 = new YT.Player('player', {

          height: '390',
          width: '550',
  videoId: '<?php echo $VID ?>',
  playerVars: {rel: 0, enablejsapi: 1},
  events: {
    'onReady': onPlayerReady,
    'onStateChange': onPlayerStateChange
  }
});
}


youtubeTime = player.getCurrentTime();

// 4. The API will call this function when the video player is ready.
window.onPlayerReady(event) = function() {
event.target.pauseVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event){
if (event.data == YT.PlayerState.PLAYING) {
//alert("video is playing now!");
insertPlay(player1.getCurrentTime());

//alert("The video re-play start at position: " + player1.getCurrentTime());
_gaq.push(['_trackEvent', 'Videos', 'Play', '<?php echo $title?>']);
ga('send', 'event', 'Videos', 'Play', '<?php echo $title?>');
// _gaq.push(['_trackEvent', 'User', 'Username', '<?php echo $userName?>']);
// ga('send', 'User', 'Username', 'Username', '<?php echo $userName?>']);
_gaq.push(['_setCustomVar', 1, 'Username', '<?php echo $userName?>']);
_gaq.push(['_setCustomVar', 2, 'UserID', '<?php echo $userID?>']);



 // setTimeout(stopVideo, 6000);
  done = true;
}

else if (event.data == YT.PlayerState.PAUSED) {
//alert("video is paused!");
//alert("The video pause at position: " + player1.getCurrentTime());
insertPause(player1.getCurrentTime());

_gaq.push(['_trackEvent', 'Videos', 'Pause', '<?php echo $title?>']);
ga('send', 'event', 'Videos', 'Pause', '<?php echo $title?>');

}

else if (event.data == YT.PlayerState.ENDED){
//alert("watch to end of the video!");
//alert("The video end position is: " + player1.getCurrentTime());
insertEnd(player1.getCurrentTime());
_gaq.push(['_trackEvent', 'Videos', 'Watch to End', '<?php echo $title?>']);
ga('send', 'event', 'Videos', 'Watch to End', '<?php echo $title?>');
} 

else if (event.data == YT.PlayerState.BUFFERING) {
//alert("video is buffering!");
//alert("The video buffering position is: " + player1.getCurrentTime());
insertBuffer(player1.getCurrentTime());
_gaq.push(['_trackEvent', 'Videos', 'Buffering', '<?php echo $title?>']);
ga('send', 'event', 'Videos', 'Buffering', '<?php echo $title?>');

}

else if (event.data == YT.PlayerState.CUED) {
 // alert("video is cued!");
insertCue(player1.getCurrentTime());
_gaq.push(['_trackEvent', 'Videos', 'Cueing', '<?php echo $title?>']);
ga('send', 'event', 'Videos', 'Cueing', '<?php echo $title?>');

}






}
window.stopVideo() = function() {
player1.stopVideo();

}

</script>

<script>

function insertPlay(t){
    console.log("insertPlay function called!");
     $.ajax({
        type: "POST",
        url: "ajax/event_record.php",
        data: {video_id: '<?php echo $VID ?>', play_start_position:t},
        success: function(data) {
        debug("data " + data);
        },
        async: false
    });

    }


    </script>


<script>

function insertPause(t){
    console.log("insertPause function called!");
     $.ajax({
        type: "POST",
        url: "ajax/pause_record.php",
        data: {video_id: '<?php echo $VID ?>', pause_position:t},
        success: function(data) {
        debug("data " + data);
        },
        async: false
    });

    }


    </script>

<script>

function insertEnd(t){
    console.log("insertEnd function called!");
     $.ajax({
        type: "POST",
        url: "ajax/end_record.php",
        data: {video_id: '<?php echo $VID ?>', end_position:t},
        success: function(data) {
        debug("data " + data);
        },
        async: false
    });

    }


    </script>


<script>

function insertBuffer(t){
    console.log("insertBuffer function called!");
     $.ajax({
        type: "POST",
        url: "ajax/buffer_record.php",
        data: {video_id: '<?php echo $VID ?>', buffer_position:t},
        success: function(data) {
        debug("data " + data);
        },
        async: false
    });

    }


    </script>


<script>

function insertCue(t){
    console.log("insertCue function called!");
     $.ajax({
        type: "POST",
        url: "ajax/cue_record.php",
        data: {video_id: '<?php echo $VID ?>', cue_position:t},
        success: function(data) {
        debug("data " + data);
        },
        async: false
    });

    }


    </script>





    <div id="message-dialog" title="Save changes" style="display:none;z-index:999;">text goes here...</div>
    <img id="recording-annotation" src="icons/annotating.png" alt="recording annotation" style="display:none;" height="19" width="120" />


    <div id="annotation-form">
        <div id="annotation-title-bar" style="background-color:#8EA9C2;color:white;border-bottom:1px solid #888;width:400px;margin-bottom:20px;margin-left:-20px;display:block;height:25px;" >
           <div id="annotation-title" style="float:left;padding:2px;">Add Annotation</div>
           <a href="#" id="close-annotation" style="float:right;padding:4px;margin:0;text-decoration:none;border:0;">
                <img src="icons/close-button.gif" style="padding:0;margin:0;border:0;" width="17" height="17" alt="close annotation dialog button" />
           </a>
        </div>
                <div id="annotation-start-time" class="annotation-label"></div>
		    <?php if (! $isiPad) { ?>
		                    <img id="start-time-rwd" src="icons/rwd-button.png" style="margin-left:5px;" alt="rewind start time" />
		                    <img id="start-time-fwd" src="icons/fwd-button.png" style="margin-left:8px;" alt="fast forward start time" />
		    <?php } ?>            
	            <form method="post" action="">
	                <div class="annotation-label">type:
	                <!--  <select id="annotation-type"> -->
	                  text
	                    <!-- <option>video</option> --> <!-- WEBCAM ANNOTATION -->
	                <!-- </select> -->
                        </div>
	                <div class="annotation-label">private
	                <input type="checkbox" name="annotation-privacy" id="annotation-privacy" style="" /><br /></div>
	                <br style="margin-bottom:10px" />
	                <div id="webcam" style="margin-bottom:1em;display:none;"></div> <!-- WEBCAM ANNOTATION, turn on and off "display:none;" -->
	                <div class="annotation-label" style="">tags</div>
	                <input type="text" name="annotation-tags" id="annotation-tags" size="30" value="" /><br />
	                <div class="annotation-label" style="float:left;">description</div><br />
	                <textarea id="annotation-description" name="annotation-description" rows="8" cols="40"></textarea>


<?php
                    $conn = mysql_connect('localhost', $mysqlUser, $mysqlPassword);
    if (!$conn) {
    die('Not connected : ' . mysql_error());
}
    $db_selected = mysql_select_db($database, $conn);
    mysql_set_charset("utf8",$conn);
    //print_r($videoID);

    $result = mysql_query("SELECT * FROM media WHERE video_id = '$VID'");
    $student = mysql_fetch_assoc($result);
?>





                        
                        <?php if($student['point_one']){ ?>
                        <script>var yesChecked = true; </script> 
                        <div class="annotation-label" style="display: inline-block;">Level of<br> confidence
                        <select name="confidence_type" id="confidence_type" selected="true">
                        <option>very high</option>
                        <option>high</option>
                        <option>medium</option>
                        <option>low</option>
                        <option>very low</option> 
                        
                        </select>

                         
                        </div>
                        <?php } ?>

 
	            </form>
            <div id="form-buttons">buttons go here...</div>
    </div>










<div id="annotation-form1">
        <div id="annotation-title-bar" style="background-color:#8EA9C2;color:white;border-bottom:1px solid #888;width:400px;margin-bottom:20px;margin-left:-20px;display:block;height:25px;" >
           <div id="annotation-title" style="float:left;padding:2px;">Feedback</div>
           <a href="#" id="close-annotation1" style="float:right;padding:4px;margin:0;text-decoration:none;border:0;">
                <img src="icons/close-button.gif" style="padding:0;margin:0;border:0;" width="17" height="17" alt="close annotation dialog button" />
           </a>
        </div>
                <div id="annotation-start-time" class="annotation-label"></div>
                    <?php if (! $isiPad) { ?>
                                    <img id="start-time-rwd" src="icons/rwd-button.png" style="margin-left:5px;" alt="rewind start time" />
                                    <img id="start-time-fwd" src="icons/fwd-button.png" style="margin-left:8px;" alt="fast forward start time" />
                    <?php } ?>




<?php
                    $conn = mysql_connect('localhost', $mysqlUser, $mysqlPassword);
    if (!$conn) {
    die('Not connected : ' . mysql_error());
}
    $db_selected = mysql_select_db('prod_annotation_tool', $conn);
    mysql_set_charset("utf8",$conn);
    //print_r($VID);

    $result = mysql_query("SELECT * FROM media WHERE video_id = '$VID'");
    $student = mysql_fetch_assoc($result);
    //print_r($student);

if ($student['point_one']){
?>




                    <form method="post" action="">
                       
                       <!--  <select id="annotation-type">  -->
                         
                            <!-- <option>video</option> --> <!-- WEBCAM ANNOTATION -->
                       <!-- </select> -->
		        <h4><u>Video Points:</u></h4>
                        <h5>Please select if your summary does/does not include the following points.</h5>
                        <table>                       
                         
                        <div class="annotation-label1" style="display: inline-block;"><font size="2">1.  <?php echo $student['point_one'];?></font></br>
                        <input type="radio" name="choice" value="YES"><font size="2">yes</font>                      
                        <input type="radio" name="choice" value="NO"><font size="2">no</font>
                        </div>
                        </br>
                        

                        
                         <div class="annotation-label1" style="display: inline-block;"><font size="2">2.  <?php echo $student['point_two'];?></font></br>
                        <input type="radio" name="choice1" value="YES"><font size="2">yes</font>
                        <input type="radio" name="choice1" value="NO"><font size="2">no</font>
                        </div>
                        </br>
                        
 
                        
                         <div class="annotation-label1" style="display: inline-block;"><font size="2">3.  <?php echo $student['point_three'];?></font></br>
                        <input type="radio" name="choice2" value="YES"><font size="2">yes</font>
                        <input type="radio" name="choice2" value="NO"><font size="2">no</font>
                         </div>
                        </br>
                        
                        
                        </table>

                        <p> 
    <input type="submit" name="submit" id="submit" value="submit" /> 
  </p>


                    </form>

           <?php             
           }
             $answer1 = $_POST['choice'];
             $answer2 = $_POST['choice1'];
             $answer3 = $_POST['choice2'];
             if(isset($_POST['submit'])){
                 $conn = mysql_connect('localhost', $mysqlUser, $mysqlPassword);
                 if (!$conn) {
                 die('Not connected : ' . mysql_error());
                 }
                 $db_selected = mysql_select_db($database, $conn);
                 mysql_set_charset("utf8",$conn); 
                $result = mysql_query("INSERT INTO feedback VALUES (NULL, '$VID', '$userID', '$userName', '$answer1', '$answer2', '$answer3'    )  "); 
             }

           ?>



    </div>





   




<?php
    if ($flagMode) {
        $src        = "icons/download-flags.png";
        $style      = "background-image:url('icons/tab-flag.png')";
        $queryStr   = "video_id=$VID&viewAll=1&flag_mode=1";
    } else {
        // annotation mode
        $src        = "icons/download-annotations.png";
        $queryStr   = "video_id=$VID&viewAll=1&flag_mode=0";
    } 
?>
    <div id="buttons">
    	<div style="float:left;display:inline;">
      <!--	<span class="video_download_label" style="font-size:14px;display:inline;">Video Download:</span>  -->   
<?php
		// TODO: add on off switch in video management page
	     //	if ($isAdmin == true) { 
             //			if ($flavors != null && !empty($flavors)) {
	     //	        print "<br><span class=\"video_download_link\" style=\"font-size:14px;\"><a href=\"" . getVideoDownloadURL($VID) . "\">Original Format</a></span>";
	     //		} else {
	     //			print "<br><span>Unavailable</span>";
            //			}
	     //	} else {
	     //		print "<br><span>Unavailable</span>";
	     //	}
 			
?>		
		</div>
        
        <a href="ajax/download_annotations.php?<?php echo $queryStr?>" target="_blank" style="border-style:none;outline-style:none;">
            <img id="download-annotations" src="<?php echo $src?>" style="border-style:none;outline-style:none;" alt="download annotations" /> 
          <!--  <img id="download-annotations" src="icons/download-annotations.png" style="border-style:none;outline-style:none;" alt="download annotations" /> -->
        </a>
        <img id="add-annotation" src="icons/add-annotation.png" alt="add an annotation" style="" />
<?php
    $users = new users();
    ($users->trendlineVisible($userID, $VID)) ? $style = "block" : $style = "none";
    $users->close();
?>
    </div>
    
    <div id="annotation-container">
        <h3 style="font-weight:normal;">
            <div id="annotation-view" style="display:<?php "$style;color:#fff;float:left;"?>">
                view: <span style="cursor:pointer;">mine</span> / <strong>all</strong> 
            </div>
            <img src="icons/annotation-legend.jpg" style="position:relative;top:-15px;left:190px;" />
        </h3>
        <div id="annotation-list"></div> <!-- Annotations go here -->
    </div>
    <div id="annotation-trends">
        <h3 style="float:left;width:auto;">Trends</h3>
        <form id="search-annotations" style="display:inline;float:right;padding-right:4px;">
        	<label style="color:#fff;font-size:14px;">&nbsp;search</label>
        	<input type="text" size="15em" name="search" style="height:inherit" />
        	<label style="color:#fff;font-size:11px;">&nbsp;by content</label>
        	<input type="checkbox" class="search_criteria" id="search_by_content" style="height:inherit" checked />
        	<label style="color:#fff;font-size:11px;">author</label>
        	<input type="checkbox" class="search_criteria" id="search_by_author" style="height:inherit" checked />
        	<label style="color:#fff;font-size:11px;">tag</label>
        	<input type="checkbox" class="search_criteria" id="search_by_tag" style="height:inherit" checked />
        	<label style="color:#fff;font-size:11px;">auto-search</label>
        	<input type="checkbox" id="auto_hover_search" style="height:inherit" />
        </form>
        <div style="clear:both"></div>
        <div id="trends" style="clear:left;height:100%;width:100%;overflow:display;cursor:pointer;">Annotation trends</div>
    </div>
    <div style="clear:both"></div>
    </div> <!-- the wrapper, for page centering -->
  <!--  <div id="univbranding"><img src="icons"></img></div>  -->


<div id="mydiv">
        <p><b>Please run OVAL in Firefox, Chrome and Safari. IE is NOT supported.</b></p>
</div>



    <!-- Put error messages here (after determine all error conditions in the rest of the page) -->
    <script type="text/javascript">
<?php 
		if (isset($noCourses) && $noCourses != "") {
?>
			alert("You are not currently enrolled in any course that uses OVAL.\n\nIf this is in error, please contact the An ZHAO at an.zhao@unisa.edu.au or your instructor.");
<?php 
		}
?>
    </script>
</body>
</html>
