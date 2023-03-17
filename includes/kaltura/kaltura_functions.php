<?php

include_once(dirname(__FILE__) . '/../../php5/KalturaClient.php');
include_once(dirname(__FILE__) . '/../../database/media.php');
include_once(dirname(__FILE__) . '/../../includes/common.inc.php');
include_once(dirname(__FILE__) . '/../../includes/global_deploy_config.php');
include_once('/var/www/config/clas/kaltura_config.php');

error_reporting(E_ALL);

function email($msg)
{
    $to = "an.zhao@unisa.edu.au";
    $subject = "Kaltura notification";

    $postVars = null;
    foreach ($_POST as $key => $val) {
        $postVars .= "$key: $val\n";
    }

    $body = "Hi,\n\nNotification received from Kaltura.\n$msg\n\n$postVars";
    mail($to, $subject, $body);
}

function getKalturaClient()
{
    $kConfig = new KalturaConfiguration(PARTNER_ID);
    $kConfig->serviceUrl = kalturaServiceURL;
    $client = new KalturaClient($kConfig);

    $userId = "SomeUser";
    $sessionType = KalturaSessionType::ADMIN;
    try {
        $ks = $client->generateSession(ADMIN_SECRET, $userId, $sessionType, PARTNER_ID);
        $client->setKs($ks);
    } catch (Exception $ex) {
        die("could not start session - check configurations in KalturaTestConfiguration class");
    }

    return $client;
}

function startKalturaSession()
{

    $kConfig = new KalturaConfiguration(PARTNER_ID);
    $kConfig->serviceUrl = kalturaServiceURL;
    $client = new KalturaClient($kConfig);

    writeToLog("startKalturaSession()");
    $userID = "OVALAutomatedUploads"; // If this user does not exist in your KMC, then it will be created.
    //$sessionType = ($isAdmin)? KalturaSessionType::ADMIN : KalturaSessionType::USER; 
    $sessionType = KalturaSessionType::ADMIN;
    try {
        $ks = $client->generateSession(ADMIN_SECRET, $userID, $sessionType, PARTNER_ID);
        $client->setKs($ks);
    } catch (Exception $ex) {
        writeToLog("could not start session - check configurations in KalturaTestConfiguration class");
    }

    //writeToLog("client: " . print_r($client, true));
    return $client;
}

function uploadToKaltura($filePath, $title, $description, $data, $uploadIteration = 0, $type = "VIDEO")
{
    writeToLog("--- in uploadToKaltura($filePath, $title, $description, $data, $uploadIteration, $type) ---");
    try {
        echo "\nin uploadToKaltura iteration $uploadIteration: Begin uploading (entering try catch block)...";
        writeToLog("\nin uploadToKaltura iteration $uploadIteration: Begin uploading (entering try catch block)...");
        $client = getKalturaClient();

        writeToLog("\nin uploadToKaltura iteration $uploadIteration: filePath:" . $filePath);
        $token = $client->baseEntry->upload($filePath);
        $entry = new KalturaMediaEntry();
        $entry->name = $title;
        $entry->description = $description;
        $entry->tags = $data;

        if ($type == "VIDEO") {
            $entry->mediaType = KalturaMediaType::VIDEO;
        } else if ($type == "AUDIO") {
            $entry->mediaType = KalturaMediaType::AUDIO;
        } else if ($type == "IMAGE") {
            $entry->mediaType = KalturaMediaType::IMAGE;
        } else {
            $entry->mediaType = KalturaMediaType::VIDEO;
        }

        $newEntry = $client->media->addFromUploadedFile($entry, $token);

        if (is_null($newEntry)) {
            throw new Exception("Kaltura Exception iteration $uploadIteration: addFromUploadedFile returned null");
        }

        echo "\nin uploadToKaltura iteration $uploadIteration: DONE! Uploaded a new Video entry " . $newEntry->id;
        writeToLog("in uploadToKaltura iteration $uploadIteration: DONE! Uploaded a new Video entry " . $newEntry->id);

    } catch (Exception $ex) {
        writeToLog("in uploadToKaltura: uploadError, iteration $uploadIteration: " . $ex->getMessage());
        $uploadIteration++;

        if ($uploadIteration >= KALTURA_UPLOAD_RETRY_TIMES) {
            die($ex->getMessage());
        } else {
            return uploadToKaltura($filePath, $title, $description, $data, $uploadIteration, $type);
        }
    }

    return $newEntry->id;
}

/*
 * always check video ownership before calling this function
 */
function deleteVideoOnKaltura($entryID)
{
    $client = startKalturaSession();
    try {
        $results = $client->media->delete($entryID);
    } catch (Exception $e) {
        echo "\nDeleting video on kaltura, exception: " . $e->getMessage() . "\n";
    }
}

function getFlavorsFromKMC($entryID)
{
    $kclient = startKalturaSession();

    try {
        $flavors = $kclient->flavorAsset->getByEntryId($entryID);
    } catch (Exception $e) {
        return null;
    }
    $data = null;

    // TODO: get ALL the flavor info! The database speed hit is worth it
    // for the more metadata that can be used for filtering / playback optimization
    // writeToLog("print flavors:\n\n");

    foreach ($flavors as $flavor) {
        // convert KalturaFlavorAsset Object to array
        $flavor = new ArrayObject($flavor);
        //writeToLog(print_r($flavor, true));
        //writeToLog("\n\n");
        $flavorID = $flavor['id'];
        $codecID = $flavor['videoCodecId'];
        $fileExt = $flavor['fileExt'];
        $status = $flavor['status'];

        if ($status > 0 && $codecID != "") {
            $data[] = array('flavor_id' => $flavorID, 'codec_id' => $codecID, 'file_ext' => $fileExt);
        }
    }

    // DEBUG:
    // die;
    return $data;
}

// processingTime is the number of seconds since entry has been uploaded
function areConversionsComplete($videos, $processingTime, $markComplete = false)
{
    $media = new media();

    foreach ($videos as $videoID => $videoData) {
        $date = strtotime($videoData['creation_date']);

        if (!intval($videoData['conversion_complete'])) {
            if (time() - $date >= $processingTime) {
                $flavorsFromKMC = getFlavorsFromKMC($videoID);

                foreach ($flavorsFromKMC as $flavor) {
                    if ("" != $flavor['codec_id']) {
                        $media->addFlavor(
                            $flavor['flavor_id'],
                            $videoID,
                            $flavor['codec_id'],
                            $flavor['file_ext']
                        );
                    }
                }

                // update database, don't mark as complete if the flavors actually aren't there yet
                // the reason for having a timer is because polling a web service (the KMC) is 
                // relatively slow, so we have a heuristic to call this less
                if (!empty($flavorsFromKMC)) {
                    if ($markComplete || count($flavorsFromKMC) >= MINIMUM_FLAVOR_COUNT) {
                        $media->conversionComplete($videoID);
                    }
                }
            }
        }
    }
}

?>