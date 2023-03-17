<?php
require_once("kaltura_client.php");
// this includes is for the confidential Kaltura partner configuration
require_once("/var/www/config/clas/kaltura_config.php");

// Design params:
$recorder_width = 350;
$recorder_height = 262;
//$recorder_width = 400;
//$recorder_height = 300;
$backgroundColor = '#ccc';

// Partner configuration:
$kshowid = "-1"; //keep this -1
$host = "www.kaltura.com";
$cdnHost = "cdn.kaltura.com";
$autoPreview = true;

$config = new KalturaConfiguration($pid, $spid);

$config->serviceUrl = $host;
$client = new KalturaClient($config);

$user = new KalturaSessionUser();
$user->userId = $uid;
$user->screenName = $uname;

$result = $client->startSession($user, $secret, false, "edit:*");
$ks = @$result["result"]["ks"];
?>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/swfobject/2.1/swfobject.js"></script>
<script type="text/javascript">
    if (swfobject.hasFlashPlayerVersion("9.0.0")) {
        var fn = function () {
            var att = {
                name: "krecorder",
                data: "Krecord.swf",
                width: "<?php echo ($recorder_width); ?>",
                height: "<?php echo ($recorder_height); ?>",
                wmode: "opaque"
            };
            var par = {
                flashvars: "host=<?php echo ($host); ?>" +
                    "&kshowId=<?php echo ($kshowid); ?>" +
                    "&autoPreview=<?php echo ($autoPreview); ?>" +
                    "&pid=<?php echo ($pid); ?>" +
                    "&subpid=<?php echo ($subpid); ?>" +
                    "&uid=<?php echo ($uid); ?>" +
                    "&ks=<?php echo ($ks); ?>",
                allowScriptAccess: "always",
                allowfullscreen: "true",
                bgcolor: "<?php echo ($backgroundColor); ?>",
                wmode: "opaque"
            };
            var id = "krecorder";
            var myObject = swfobject.createSWF(att, par, id);
        };
        swfobject.addDomLoadEvent(fn);
    }
</script>
</head>

<body>
    <div id="debuginfocontainer" style="display:none;float:right;margin-right:-175px;"> <!-- WEBCAM ANNOTATION -->
        <h2>Create Session Result:</h2>
        <pre>
        <?php var_dump($result); ?>
    </pre>
    </div>
    <div id="krecorder">
        This is where the KRecord will be embedded.
    </div>
    <div id="kdpcontainer" style="display:none;float:right;"> <!-- WEBCAM ANNOTATION -->
        KDP:
        <object name="kdp" id="kdp" type="application/x-shockwave-flash" allowScriptAccess="always"
            allowNetworking="all" allowFullScreen="true" height="332" width="400"
            data="http://www.kaltura.com/index.php/kwidget/wid/_0/uiconf_id/1000106">
            <param name="allowScriptAccess" value="always" />
            <param name="allowNetworking" value="all" />
            <param name="allowFullScreen" value="true" />
            <param name="bgcolor" value="#000000" />
            <param name="movie" value="http://www.kaltura.com/index.php/kwidget/wid/_0/uiconf_id/1000106" />
            <param name="flashVars" value="readyF=onKdpReady" />
            <param name="wmode" value="opaque" />
        </object>
    </div>
    <div>
    </div>
    <div id="currentStatus" style="padding:2px,5px,2px,5px;"></div> <!-- WEBCAM ANNOTATION: -->
    <div id="entryID" style="margin-left:10px;"></div>
    <script type="text/javascript">
        var entryId2Play = 0;
        var apptime = 0;
        var d = new Date();
        apptime = d.getTime();
        function writeToLog(msg, error) {
            $('#currentStatus').html(msg);
            if (error == true)
                $('#currentStatus').css("color", "red");
            else
                $('#currentStatus').css("color", "black");
            var d = new Date();
            var t = d.getTime() - apptime;
            $('#statusLog').append(t + ' :: ' + msg + '<br />');
        }
        function setEntryID(addedEntry) {
            //$('#entryID').html(addedEntry.entryId);
            parent.videoAnnotationEntryID = addedEntry.entryId;
        }
        function setCameraQuality() {
            var vidQ = $('#quality').val();
            var vidBW = $('#bandwidth').val();
            var vidW = $('#videoWidth').val();
            var vidH = $('#videoHeight').val();
            var vidFPS = $('#videoFPS').val();
            $('#krecorder').get(0).setQuality(vidQ, vidBW, vidW, vidH, vidFPS);
        }
        function addEntry() {
            var entryName = $('#entry_name').val();
            var entryTags = $('#entry_tags').val();
            var entryDescription = $('#entry_description').val();
            var screenName = $('#credits_screen_name').val();
            var siteUrl = $('#credits_site_url').val();
            var thumbOffset = $('#thumb_offset').val();
            if (thumbOffset == '')
                thumbOffset = -1;
            var adminTags = $('#admin_tags').val();
            var licenseType = $('#license_type').val();
            var userCredit = $('#credit').val();
            var groupId = $('#group_id').val();
            var partnerData = $('#partner_data').val();
            $('#krecorder').get(0).addEntry(entryName, entryTags, entryDescription, screenName, siteUrl,
                thumbOffset, adminTags, licenseType, userCredit, groupId, partnerData);
        }
        function addEntryComplete(addedEntry) {
            var thumbnailUrl = 'http://<?php echo $cdnHost ?>/p/<?php echo $pid ?>/sp/<?php echo $spid ?>/thumbnail/entry_id/' + addedEntry.entryId + '/width/120/height/90';
            writeToLog('your newly created entryId is: ' + addedEntry.entryId. "\n");
            writeToLog('video saved.');
            $('#currentStatus').css('display', 'inline-block');
            $('#currentStatus').css('background-color', 'yellow');
            $('#currentStatus').fadeOut(5000);
            writeToLog('recording saved');
            setEntryID(addedEntry);

            // TODO: at this point insert video data into OVAL db media table
            // - need to read position of playback of associated video
            // - it would be best if video can automatically be placed in a folder on Kaltura
            //
        }
        function playEntryInPlayer(entryId) {
            entryId2Play = entryId;
            if ($('#kdpcontainer').css("display") == "none") {
                $('#kdpcontainer').css('display', 'block');
            } else {
                kdpDoLoadVideo();
            }
        }
        function closeKdp() {
            $('#kdp').get(0).dispatchKdpEvent('doPause');
            $('#kdpcontainer').css('display', 'none');
        }
        function onKdpReady() {
            setTimeout(kdpDoLoadVideo(), 1000);
        }
        function kdpDoLoadVideo() {
            $('#kdp').get(0).insertMedia("-1", entryId2Play, 'true');
        }
        function addEntryFail(err) {
            writeToLog('failed to add entry:\n' + err, true);
        }
        function previewEnd() {
            writeToLog('preview finished', false);
        }
        function flushComplete() {
            writeToLog('finished recording, click \'Save\'', false);
            // writeToLog ('recorded time: ' + $('#krecorder').get(0).getRecordedTime());
        }
        function recordStart() {
            // writeToLog ('started sending recorded camera stream to server.', false);
            writeToLog('recording...');
        }
        function connected() {
            writeToLog('connected to server.', false);
        }
        function deviceDetected() {
            writeToLog('found recording devices on user computer.', false);
        }
        function resizeRecorder() {
            $('#krecorder').effect("size", { to: { width: 600, height: 500 } }, 2000);
        }
        function showDebugInfo() {
            $('#debuginfocontainer').toggle();
        }
    </script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.7.1/jquery-ui.min.js"></script>