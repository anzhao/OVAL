<?php

//error_reporting(E_ALL ^ E_NOTICE);

require_once(dirname(__FILE__) . "/global_deploy_config.php");

require_once(dirname(__FILE__) . '/../database/annotations.php');

$logFile = dirname(__FILE__) . '/../logs/log.txt';

$uploadPath = "/var/www/uploads/clas/";

$notAuthorizedURL = $applicationURL . "not_authorized.php";

$adminPrivRequiredMsg = "<h3>You must have admin privileges to access this page.</h3>";

// ------------------ SOME CONSTANTS TODO: Refactor into classes with const members ---------------- //
define("DEV", "dev");
define("DEMO", "demo");
define("PROD", "prod");

// Annotation Behaviors
define("FLAG", "flag"); // put annotations down first, then can edit later
define("ANNOTATION", "annotation"); // must put content first before placing annotations

// View Mode (for access control purpose) 
define("STUDENT", 1);
define("TA", 2);
define("INSTRUCTOR", 3);
define("ALL", 4);
define("SYSADMIN", -1);

// Show annotations after
define("BY_DEFAULT", "by-default");
define("AFTER_N_DAYS", "after-n-days");

// Special Group Name Suffices
define("EVERYONE_GROUP", "everyone");
define("INSTRUCTOR_AND_TA_GROUP", "instructorAndTA");

// Conversion Status
define("CONVERSION_COMPLETED", 1);
define("CONVERSION_IN_PROGRESS", 0);
define("CONVERSION_ERROR", -1);

// This must be one less than the number of flavours
// in all conversion profiles on the KMC!
define("MINIMUM_FLAVOR_COUNT", 4);
// ----------------------------------------- //

// TUNING VARIABLES (defined this way so they cross over into javascript using a function below)
$tuningVariables = array("previewLen" => 200, "previewOffsetX" => -10, "previewOffsetY" => 3);

// more constants to be shared with JS
$constants = array("MINE" => 1, "INSTRUCTORS_AND_TAS" => 2, "STUDENTS" => 3);

$keys = array_keys($constants);
$values = array_values($constants);

define("$keys[0]", $values[0]);
define("$keys[1]", $values[1]);
define("$keys[2]", $values[2]);

define("KALTURA_UPLOAD_RETRY_TIMES", 3);

// this is used in the course creation step
$departments = array("ARTH", "EDUC", "LAST", "LIBR", "MUSC", "POLI", "LLED", "MED");

// TODO: refactor to a util package
function makeLinksClickable($text)
{
    // note: the cyrillic characters are removed, so that don't have to save source in UTF-8, see
    // http://stackoverflow.com/questions/2178348/should-source-code-be-saved-in-utf-8-format
    return preg_replace(
        '!(((f|ht)tp(s)?://)[-a-zA-Z()0-9@:%_+.~#?&;//=]+)!i',
        '<a href="$1" target="_blank">$1</a>',
        $text
    );
}

function printSharedClientServerConstants()
{
    global $constants, $tuningVariables;

    print "\n\t//shared client and server constants\n";
    foreach ($constants as $key => $val) {
        print "\tvar $key = $val;\n";
    }

    foreach ($tuningVariables as $key => $val) {
        print "\tvar $key = $val;\n";
    }
}

function DEBUG_printSimpleArray($arrayToPrint, $rowShown = 8, $colShown = 66, $glue = ", ")
{

    $arrayCount = count($arrayToPrint);

    print "<textarea cols=\"$colShown\" rows=\"$rowShown\" readonly style=\"font-size:12px;white-space:pre-wrap\">";
    foreach ($arrayToPrint as $key => $val) {
        print "$val";
        if ($key < ($arrayCount - 1)) {
            print $glue;
        }
    }
    print "</textarea>";
}

function sendEmail($msg, $subject)
{
    $to = "an.zhao@unisa.edu.au";

    $postVars = null;
    foreach ($_POST as $key => $val) {
        $postVars .= "$key: $val\n";
    }

    $body = "Hi,\n\nNotification received from Kaltura.\n$msg\n\n$postVars\n";
    mail($to, $subject, $body);
}

function getVideoURL($entryID, $assetID, $fileExt)
{

    global $kalturaCdnURL, $pid, $spid;

    $kalturaURL = $kalturaCdnURL . "p/$pid/sp/$spid/flvclipper/entry_id/$entryID/flavor/$assetID/a.$fileExt?novar=0";

    return $kalturaURL;
}

function getVideoDownloadURL($entryID)
{

    global $kalturaCdnURL, $pid, $spid;

    $kalturaURL = $kalturaCdnURL . "p/$pid/sp/$spid/raw/entry_id/$entryID";

    return $kalturaURL;
}

function getBrowserData()
{
    return get_browser(null, true);
}

// Use this instead of getBrowserData. This does not need browscap.ini so does not need any special setup in the php server
// and is faster. It's rudimentary but it is enough for what we need here.
function isBrowser($targetBrowserString)
{
    return (stripos($_SERVER['HTTP_USER_AGENT'], $targetBrowserString) !== false);
}

function compatibilityModeIE9()
{
    // IE 9 compatibility mode causes problems, this link describes how to detect it:
    // http://stackoverflow.com/questions/5825385/javascript-can-i-detect-ie9-if-its-in-ie7-or-ie8-compatibility-mode

    $browserData = getBrowserData();
    $browserName = $browserData['browser_name_pattern'];
    $browser = $browserData["browser"];

    // if "Trident/5.0" is found then we are in IE9 compatability mode
    if ("IE" == $browser) {
        return !(is_string(stristr($browserName, "Trident/5.0")));
    } else {
        return false;
    }
}

function browserSupported()
{
    $browserData = getBrowserData();

    $browser = $browserData["browser"];
    $version = intval($browserData["version"]);

    //print "browser:$browser version:" . intval($version);
    if ("IE" == $browser) {
        if ($version < 9) {
            if (compatibilityModeIE9()) {
                return true;
            } else {
                return false;
            }
        }
    } elseif ("Firefox" == $browser) {
        if ($version < 4)
            return false;
    } elseif ("Safari" == $browser) {
        if ($version < 5)
            return false; //{ print "version:$version<br />"; return false; } else { print "it's fine"; }
    } elseif ("Chrome" == $browser) {
        //        return false;
    } elseif ("Opera" == $browser) {
        //        return false;
    } else {
    }

    return true;
}

function getAnnotationList()
{
    $annotations = getAnnotations();

    $html .= "<ul>";
    foreach ($annotations as $annotation) {
        $html .= "<li style=\"\">{$annotation['start_time']}</li>";
    }
    $html .= "</ul>";
}

function writeToLog($msg)
{
    global $logFile;

    // write to log
    file_put_contents($logFile, $msg . "\n", FILE_APPEND);
}

function printAdminBar($studentView = true, $userName, $CID = null, $GID = null)
{ ?>
    <?php
    $courseAndGroupSuffix = "";
    if (!is_null($CID) && is_numeric($CID) && $CID >= 0) {
        $courseAndGroupSuffix .= "?cid=$CID";
    }

    if (!is_null($GID) && is_numeric($GID) && $GID >= 0) {
        $courseAndGroupSuffix .= "&gid=$GID";
    }

    ?>

    <div id="admin-bar">
        <a href="video_management.php?<?php echo "$courseAndGroupSuffix" ?>">video management</a>
        <?php if (!$studentView) { ?>
            <?php // <a href="configure_ui.php" style="padding-left:20px">UI configuration</a> ?>
        <?php } ?>
        <a href="index.php?<?php echo "$courseAndGroupSuffix" ?>" style="padding-left:20px">view videos</a>
        <a href="copyright.php" target="_blank" style="padding-left:20px">copyright</a>
        <span style="padding-left:21em;font-size:13px;\">user:
            <?php echo "\"$userName\"" ?>
        </span>

        <a href="logout.php" style="padding-left:20px;float:right;">log out</a>
    </div>
<?php
}

function formSubmitted()
{
    return ("" != $_POST['submit']);
}

function stripHTML($string)
{

    $config = HTMLPurifier_Config::createDefault();

    // configuration goes here:
    //    $config->set('Core.Encoding', 'UTF-8'); // replace with your encoding
    //    $config->set('HTML.Doctype', 'XHTML 1.0 Transitional'); // replace with your doctype
    $config->set('HTML.Allowed', '');

    $purifier = new HTMLPurifier($config);

    $sanitized = $purifier->purify($string);

    return htmlspecialchars($sanitized);

    return $string;
}

function getStudentNumbers($sessionYear, $department, $courseNo, $sectionNo, $sessionCd = "W")
{

    /* CUSTOMIZE_THIS:
     * This function was commented out entirely because it contained the code related to
     * the student database. This function should be reimplemented to your school's
     * student database, and should return an array of student number.
     */
}

function printWelcomePage($logout = false)
{
    global $webFolderName;
    ?>
    </head>

    <body style="text-align:center;min-width:600px">
        <script type="text/javascript">

            var currentVideoShown = "";
            function showOneDemoVideo(thisDemo, thisLink) {

                $(".feature_videos").css("display", "none");

                if (thisDemo == currentVideoShown) {
                    $("#" + thisDemo).css("display", "none");
                    currentVideoShown = "";
                } else {
                    $("#" + thisDemo).css("display", "inline");
                    currentVideoShown = thisDemo;
                }

                $("#" + thisLink).css("color", "#993366");

            }

            function linkClickHighlight(thisDemo) {
                $("#" + thisDemo).css("color", "#FF0000");
            }

            function linkHoverHighlight(thisDemo) {
                $("#" + thisDemo).css("font-weight", "bold");
            }

            function linkMouseOut(thisDemo) {
                $("#" + thisDemo).css("font-weight", "normal");
            }

            $(document).ready(function () {
                $(".feature_videos").css("display", "none");

            });
        </script>
        <div style="font-family:'Lucida Sans Unicode';
            margin-left:auto;margin-right:auto;width:660px;
            margin-top:20px;
            text-align:left;">
            <?php if ($logout): ?>
                <h3>Please close browser to end your session.</h3>
            <?php else: ?>
                <span style="font-size:14px;color:#e33">
                    <b>
                        The video hosting service used by OVAL is under maintenance.
                        <br>
                        The OVAL application may be slow or down intermittently during the weekends.
                        <br>
                        Service will resume as normal on Monday. Thanks, An ZHAO @ UniSA.
                        <br>
                        <br>
                    </b>
                </span>
                <span style="font-size:18px"><b>OVAL has been updated!</b></span>
                <br>
                &nbsp;&nbsp;&nbsp;
                <span id="clas_search_demo_in_1_minute_link" onMouseOut="linkMouseOut('clas_search_demo_in_1_minute_link')"
                    onMouseOver="linkHoverHighlight('clas_search_demo_in_1_minute_link')"
                    onMouseDown="linkClickHighlight('clas_search_demo_in_1_minute_link')"
                    onMouseUp="showOneDemoVideo('clas_search_demo_in_1_minute','clas_search_demo_in_1_minute_link')"
                    style="cursor:pointer;font-size:14px;text-decoration:underline;color:#003399;">
                    Links in Annotations and Many New Search Features - 1 Minute Video
                </span>
                <br>
                <!-- pull these classes into a style sheet for the login page! -->
                <iframe class="feature_videos" id="clas_search_demo_in_1_minute" width="600" height="337"
                    src="//www.youtube.com/embed/ocqwz183yf0?rel=0" frameborder="0" allowfullscreen style="
                    border-radius:6px;
                    margin-bottom:10px;
                    margin-top:4px;
                    margin-left:7px;
                    -moz-box-shadow:    -1px 1px 2px 1px #bbb;
                      -webkit-box-shadow: -1px 1px 2px 1px #bbb;
                     box-shadow:         -1px 1px 2px 1px #bbb;
                      ">
                </iframe>
                <br>
            <?php endif; ?>

            <fieldset style="width:610px;background-color:#dae2e9;padding:0px 0px 0px 0px;height:400px;
                    border:1px solid gray;border-radius:6px;
                     background-image:url('images/clas_bottom.jpg');
                     background-position:right bottom;background-repeat:no-repeat;
                     -moz-box-shadow:    -1px 1px 2px 1px #bbb;
                       -webkit-box-shadow: -1px 1px 2px 1px #bbb;
                      box-shadow:         -1px 1px 2px 1px #bbb;">
                <img src="images/clas_top.jpg" />

                <div style="font-size:90%;padding-left:30px;">
                    <div>Log in:
                        <a href="secure/<?= $webFolderName ?>/index.php">
                            <img style="vertical-align:middle;border:0px;" src="images/cwl_login.png"></img>
                        </a>
                    </div>
                    <div>
                        New to UBC? Create your CWL account
                        <a href="https://www.cwl.ubc.ca/SignUp">here</a>
                    </div>
                    <br />
                    Documentation:
                    <a href="docs/<?= $webFolderName ?>/CLAS_user_guide.pdf">student user guide</a>
                    &nbsp;
                    <a href="http://isit.arts.ubc.ca/support/clas/">support site</a>
                    <br />
                    <br />
                    For questions or access requests, please contact <a href="mailto:CUSTOMIZE_THIS">CUSTOMIZE_THIS</a>
                    <br />
                    None UBC users please contact your instructors instead of UBC Arts Helpdesk
                </div>
            </fieldset>
            <br />
            <div style='text-align:center;'><img src="images/UBClogodarkgrey.jpg"></img></div>
        </div>
        <?php
}

function printHeader($title = null)
{ ?>
        <!DOCTYPE html
            PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" style="background-color:#eee;">

        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>
                <?= $title ?>
            </title>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
            <?php
}

function printFooter()
{ ?>
    </body>

    </html>
<?php
}