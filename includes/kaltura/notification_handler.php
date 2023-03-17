<?php
/*
 * Kaltura sends notifications for media related events (entry_added, entry_updated, entry_deleted, etc.).
 * When an "entry_updated" event occurs we can create the media entry in our database but we have to determine 
 * which one. This is done by reading and parsing the 'tags' meta-data of the uploaded video to determine
 * which version of OVAL "live" or "dev" uploaded the video that triggered the notification. 
 */

require_once(dirname(__FILE__) . "/kaltura_notification_client.php");
require_once(dirname(__FILE__) . "/kaltura_functions.php");
require_once('/var/www/config/clas/kaltura_config.php');


$params = $_POST;

$noti = new KalturaNotificationClient($params, ADMIN_SECRET);

if ($noti->valid_signature === NULL) {
    writeToLog('ERROR: kaltura notification params empty');
    return FALSE;
} elseif ($noti->valid_signature === FALSE) {
    writeToLog('ERROR: kaltura notification signature not valid');
    return FALSE;
} else {
    // assert: valid notification
    $data = array_shift($noti->data);
    $notiType = $data['notification_type'];
    writeToLog("Notifications type: $notiType\n");
    $msg = "kaltura notification (" . date("H:i:s") . ") $notiType\n";

    // check notification type
    if ("entry_update" == $notiType) {
        writeToLog("in Entry update\n");
        // on "entry_update" notification is fired then addMedia to appropriated database
        addMedia($data);
    }
}

/* 
 * add row to media table for the appropriate database by reading 'tags' of uploaded video
 * to determine the version of OVAL ie. 'clas_dev_server' or 'clas_prod_server'
 */
function addMedia($data)
{
    global $kalturaUploadsUser, $kalturaUploadsPassword;

    $tags = $data['tags'];
    $tags = json_decode($tags, true);
    $userID = $tags['userid'];
    $serverVersion = $tags['version'];
    writeToLog("tags: $tags\n");
    writeToLog("userID: $userID\n");
    writeToLog("serverVersion: $serverVersion\n");
    //writeToLog(print_r($data, true));

    // TODO: read this in from a config file
    $link = mysql_connect('localhost', $kalturaUploadsUser, $kalturaUploadsPassword);
    //if (!$link) die('Not connected : ' . mysql_error());
    if (!$link)
        writeToLog('Not connected : ' . mysql_error());

    if ("clas_demo_server" == $serverVersion) {
        $db = "dev_annotation_tool";
    } elseif ("clas_prod_server" == $serverVersion) {
        $db = "annotation_tool";
    } elseif ("clas_prod2_server" == $serverVersion) {
        // TODO: switch name when music finishes using OVAL 
        $db = "prod_annotation_tool";
        // ("clas_demo_server" == $tags) 
    } else {
    }

    $db_selected = mysql_select_db($db, $link);
    //if (!$db_selected) die ("Can't use $db: " . mysql_error(); writeToLog("\nCan't use $db: " . mysql_error());); 
    writeToLog("u:$kalturaUploadsUser p:$kalturaUploadsPassword\n");
    if (!$db_selected)
        writeToLog("\nCan't use $db: " . mysql_error());

    // get description, it's not available in notification
    $kclient = startKalturaSession();
    $result = $kclient->media->get($data['entry_id'], null);
    $arrayObj = new ArrayObject($result);
    $description = $arrayObj['description'];

    $duration = $data['length_in_msecs'] / 1000;
    $query = "INSERT INTO media VALUES ('{$data['entry_id']}', '$userID', '{$data['name']}', '$description', $duration, '{$data['thumbnail_url']}', 0, 0, NULL)";
    writeToLog("insertIntoDatabase() query: $query\n");
    $result = mysql_query($query, $link);
    //if (!$result) die('Invalid query (insertIntoDatabase): ' . mysql_error(); writeToLog("Invalid query"););
    if (!$result)
        writeToLog("Invalid query");

    mysql_close($link);
}

?>
