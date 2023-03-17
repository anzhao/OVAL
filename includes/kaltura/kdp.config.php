<?php
//FOR REMOTE SERVER WIDGET: SET TO TRUE TO DISABLE BROWSER CACHING
define("DISABLE_BROWSER_CACHING", true);
//FOR REMOTE SERVER WIDGET: SET TO TRUE TO DISABLE KALTURA SERVER WIDGET CACHING
define("DISABLE_SERVER_CACHING", true);

//BASIC PLAYER CONFIGURATION
//THE WIDTH OF THE PLAYER
$player_width = 551;
//THE HEIGHT OF THE PLAYER
$player_height = 341;
//PLAYER WIDGET ID - represents a set of details about a specific player instance (default to '_'+partnerId)
$widgetid = '_133342';
//UICONF ID - A SPECIFIC PLAYER DESIGN TO USE (DEFAULT IS HOSTED EDITION CHROMELESS PLAYER)
$uiConfId = '1000106';
//		$uiConfId = '3761032';				

//ENTRY ID TO PLAYBACK OR STATIC PROGRESSIVE FILE URL	
//        $entryid = '0_ju95krz9';
$entryid = '0_uqtfez6i';
//THE URL TO THE KALTURA SERVER 
$host = 'www.kaltura.com';
//DEBUGGING OF PLUGINS - SHOULD NOT BE USED UNLESS DEBUGGING OF LOCAL TRANSITIONS/OVERLAYS/EFFECTS
$debugmode = 'false';
//BOOLEAN FOR AUTOPLAY
$autoPlay = 'false';
//TIME IN SECONDS TO BUFFER BEFORE PLAYBACK START
$bufferTime = 5;
//INSTRUCT THAT NO PLAYBACK SHOULD BE AVAILABLE BEFORE THE WHOLE FILE HAS BEEN DOWNLOADED
$fullbufferplayer = '';
//PERFORM SEEK WHEN PLAYER START PLAYBACK, IN MILLISECONDS
//$seekFromStart = 120000;			
//INDICATE THAT NO DYNAMIC SUB-DOMAINS SHOULD BE USED
$disableUrlHashing = 'false';
//(set to: getLocalUi) FOR DEBUGGING OF LOCAL (IN-PAGE) UICONF XML (edit xmldata element to edit the inline uiConf xml)
$localUiF = 'getLocalUi';
//THE NAME OF THE JAVASCRIPT FUNCTION THE KDP WILL CALL WHEN NO VALID MEDIA WAS PROVIDED
$emptyF = 'onKdpEmpty';
//THE NAME OF THE JAVASCRIPT FUNCTION THE KDP WILL CALL WHEN A VALID MEDIA WAS PROVIDED AND READY TO BE PLAYED
$readyF = 'onKdpReady';
//DEFINES THE URL TO WHICH THE BROWSER WILL BE DIRECTED WHEN CLICKING ON THE WATERMARK
$watermarkClickPath = 'http://corp.kaltura.com';
//DEFINES THE URL TO WHICH THE BROWSER WILL BE DIRECTED WHEN CLICKING ON THE BUMPER VIDEO
$bumperLandingUrl = 'http://www.kaltura.org';
//IF DEFINED, THIS JAVASCRIPT FUNCTION WILL BE CALLED TO TRACE THE KDP STATISTICS
$logStatsF = 'logKdpStats';
//USE TO FORCE GETTING A SPECIFIC CONVERSION PROFILE (MEDIA FLAVOR)
$flavor = '';

//ONLY APPLY FOR WHEN STREAMING VIA FMS/RED5/WOWZA...
//URL TO STREAMING SERVER AND APPLICATION 
$streamer = '';
//STREAMING FILE TYPE (MP4/FLV...)
$streamerType = '';
//DOES ENTRY ID INDICATES OF A STATIC STREAMING FILE URL OR KALTURA ENTRY ID 
$streamerFile = '';

//KDP PLUGINS (FLASHVARS LOADED FLASH PLUGINS)
//to pass any additional parameters to the plugin, concatenate the additional parameters preceding with the plugin position (see first plugin as example)
//url for a module that will be loaded in the background of the video screen (non visible)
$swfModule_background_url = 'http://www.kaltura.org/sites/default/themes/kdotorg/demos/kdp-flash-modules/KdpGoogleAnalyticsPlugin.swf';
$swfModule_background_url .= '&pd_swfModule_background_ga_id=UA-7714780-1&pd_swfModule_background_gadebug=false';
//url for a module that will be loaded on top of the video screen (overlay) with 100% width and height
$swfModule_overplayer_url = 'http://www.kaltura.org/sites/default/themes/kdotorg/demos/kdp-flash-modules/PlayPauseKdpFlashPlugin.swf';
//url for a module that will be loaded  on top of the video screen (overlay) with size of 0 (non visible)
$swfModule_nosizeover_url = '';

//AVOID CACHING OF PLAYER URL (For debugging and testing purposes)
//generate a pseudo random number to be used on the url, that way avoiding caching of player instances by the server
function genRandomString()
{
	$length = 10;
	$chars = '0123456789';
	$string = '';
	for ($p = 0; $p < $length; $p++) {
		$string .= $chars[mt_rand(0, strlen($chars))];
	}
	return $string;
}
$randcache = genRandomString();

//URL OF THE KDP WRAPPER SWF FOR LOCAL DEBUGGING OF KDP.SWF
$kdpwrapperUrl = 'kdpwrapper.swf';
//URL OF THE KDP.SWF FOR LOCAL DEBUGGING OF KDP.SWF
$kdpSwfUrl = 'kdp.swf';
//FLASHVARS TO REPLACE KALTURA SERVER DATA URL (ENTRYID AND WIDGETID TO LOAD MUST BE SPECIFIED IN FLASHVARS IF NOT IN DATA URL)
$contentVars = '';

// USE THIS URL FOR REMOTE PLAYER (LOADING A PUBLISHED PLAYER FROM A KALTURA SERVER)
$serverCache = (DISABLE_SERVER_CACHING == true) ? '/cache_st/' . genRandomString() : '';
$browserCache = (DISABLE_BROWSER_CACHING == true) ? '/randcache/' . $randcache : '';
$dataUrl = 'http://' . $host . '/index.php/kwidget' . $serverCache . '/wid/' . $widgetid . '/uiconf_id/' . $uiConfId . '/entry_id/' . $entryid . $browserCache;

?>