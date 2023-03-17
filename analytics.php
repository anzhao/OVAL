<?php

//Author: An ZHAO
//Organization: LTU, UniSA
//Date: May - July 2015

require_once(dirname(__FILE__) . '/database/media.php');
require_once(dirname(__FILE__) . '/database/users.php');
//require_once(dirname(__FILE__) . "/userCake/models/config.php");
require_once(dirname(__FILE__) . "/includes/common.inc.php");

//if (isUserLoggedIn() && $loggedInUser->isGroupMember(2)) {
$userID = "1001";
$userName = "An Zhao";
//$userID     = $loggedInUser->user_id;
//$userName   = $loggedInUser->display_username;
//} else {
//    header("Location: $applicationLoginURL");
//    exit;
//}

$users = new users();
//$classes = array("id"=>"UniSA","name"=>"UniSA");
$classes = $users->getClassesUserBelongsTo($userID);
//print_r($classes);

if (empty($classes)) {
    print "There are no classes associated with your account";
    exit;
} else {
    (isset($_GET['class_id'])) ? $classID = $_GET['class_id'] : $classID = $classes[0]['ID'];
}

displayAnalytics();

function getClassList($classID)
{
    global $users;
    return $users->getClassList($classID, false);
    print_r($users);
}

function displayAnalytics()
{
    global $users, $userID, $userName, $videoID, $authorizedUsers, $classes, $classID; ?>
    <!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <title>Video Usage Analytics</title>
        <script type="text/javascript" src="kaltura-html5player-widget/jquery-1.4.2.min.js"></script>
        <script type="text/javascript">
            $(document).ready(function () {
                $('#date-heatmap .day').mouseover(function (event) {
                    // the date and number of views (delineated by an underscore) are stored in the class tag
                    var classTag = $(this).attr('class');
                    underscorePos = classTag.indexOf("_");
                    viewDate = classTag.substring(0, underscorePos);
                    viewCount = classTag.substring(underscorePos + 1, classTag.indexOf(" "));
                    if ("" == viewCount) viewCount = 0;

                    $('<div id="date" style="border:1px solid gray;background-color:#fff;padding:2px 4px 2px 4px;width:auto;z-index:100;">' + viewDate + ' (' + viewCount + ' views)<br style="margin-bottom:10px;"/></div>').appendTo('body');

                    showDate(event);
                });

                function showDate(event) {
                    var tPosX = event.pageX + 15 + 'px';
                    var tPosY = event.pageY + 15 + 'px';
                    $('#date').css({ 'position': 'absolute', 'top': tPosY, 'left': tPosX });
                }

                $('#date-heatmap .day').mouseout(function (event) {
                    $('#date').remove();
                });

            });
        </script>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <link rel="stylesheet" type="text/css" href="admin-page.css" />
    </head>

    <body>
        <?php printAdminBar(false, $userName) ?>
        <div style="clear:both"></div>
        <strong>Video Usage Analytics</strong>
        <br />
        <br />
        <label align="left">select course <select name="class" id="class" onchange="jumpBoxClass()">
                <?php
                //print "classID: $classID";
                foreach ($classes as $class) {
                    //print_r($class);        
                    $ID = $class['ID'];
                    $name = $class['name'];
                    ($classID == $ID) ? $selected = "selected=\"selected\"" : $selected = "";
                    print "\t<option value=\"$ID\" $selected>$name</option>\n";
                }
                ?>
            </select>
        </label>


        <label style="font-size:100%">select video
            <select>
                <option>All</option>



                <?php


                mysql_connect('localhost', 'root', 'Adelaide160');
                mysql_select_db('prod_annotation_tool');
                // $query="select title from media where video_id IN (SELECT video_id FROM videoGroup)";
                // $query="SELECT m.title FROM videoGroup v, media m WHERE v.group_id=$groupID AND m.video_id LIKE v.video_id ORDER BY m.title";
                $media = new media();
                print_r($groupIDs);
                //for ($i=0; $i<count($groupIDs); $i++):
                //$videoIDs = array_keys($media->getVideosByGroupID($userID,$groupIDs[$i]));
                //print_r($videoIDs);print "<br />";
                $result = mysql_query($query);
                while ($row = mysql_fetch_array($result)) {

                    echo "<option>";

                    echo $row['title'];

                    echo "</option>";

                }


                ?>
            </select>


            </select>
        </label>


        <form id="form1" name="form1" method="post" action="">
            <table style="width:800px;height:auto;">
                <thead>
                    <tr style="border-bottom:1px solid black">
                        <th>Video(s)</th>
                        <th>Unique Users</th>
                        <th>% of class</th>
                        <th>Total of Annotations</th>
                        <th>Total of Summaries</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $groupIDs = array_keys($users->getGroupsByClassID($classID));
                    //print_r($groupIDs);print "<br />";
                
                    $userInfo = null;
                    $media = new media();
                    for ($i = 0; $i < count($groupIDs); $i++):
                        // fetch videos for given group
                        $videoIDs = array_keys($media->getVideosByGroupID($userID, $groupIDs[$i]));
                        //print_r($videoIDs);print "<br />";
                        for ($j = 0; $j < count($videoIDs); $j++):
                            $groupMembers = $users->getGroupMembers($groupIDs[$i]);
                            // TODO: cache this info
                            $userInfo = $users->getUserInfo($groupMembers);
                            //print_r($groupMembers);print "<br />";
//print "userInfo: "; print_r($userInfo);print "<br />";
                            $thumbnail = $media->getProperty($videoIDs[$j], 'thumbnail_url');
                            $title = $media->getProperty($videoIDs[$j], 'title');
                            ?>
                            <div style="width:900px;"></div>
                            <?php

                            for ($k = 0; $k < count($groupMembers); $k++):
                                //array_push($viewerStats, $media->getViewerStatistics($userInfo[$k]['User_ID'], $videoIDs[$j]));
                                //$viewerStats[$k] = $media->getViewerStatistics($userInfo[$k]['User_ID'], $videoIDs[$j]);
                                $playStatus[$k] = $media->getPlayStatistics($videoIDs[$j]);
                                //print_r($viewerStats[$k]);
                
                            endfor;
                            // find first timestamp and last time stamp
                            $dates = getDateRange($viewerStats);

                            // calculate range and convert it to days
                            $range = intval((strtotime($dates['last_view']) - strtotime($dates['first_view'])) / (60 * 60 * 24)) + 1;

                            $maxDailyViews;
                            $dailyViews = getDailyViews($viewerStats, $maxDailyViews);
                            for ($k = 0; $k < count($groupMembers); $k++):
                                //print "\$groupMembers[$k]: "; print_r($groupMembers);
//print_r($viewerStats); print "<br />";
                                ?>
                                <tr style="border-bottom:1px solid black">
                                    <?php
                                    if (0 == $k) {
                                        print "<td style=\"border-right:1px solid black;background-color:#eee;\" rowspan=\"" . count($groupMembers) . "\"><img src=\"$thumbnail\" alt=\"video thumbnail\" /><br />$title<br /></td>";
                                        echo "<td>";
                                        echo $media->getUniqueUsers($videoIDs[$j]);
                                        echo "</td>";

                                        echo "<td>";
                                        echo round((($media->getUniqueUsers($videoIDs[$j]) / $media->getNumAnnotations($videoIDs[$j])) * 100) / 2, 2);
                                        echo "</td>";


                                        echo "<td>" . $media->getNumAnnotations($videoIDs[$j]) . "</td>";

                                        echo "<td>" . $media->getNumSummaries($videoIDs[$j]) . "</td>";


                                    }


                                    ?>

                                <?php
                            endfor;
                        endfor;
                    endfor;
                    $media->close();
                    ?>

                    </tr>



                    <br />
                </tbody>
            </table>
        </form>
    </body>

    </html>
<?php
}

$users->close();

/* 
 * find oldest and most recent timestamp from $viewerStats (aggregate of user's views)
 */
function getDateRange($viewerStats)
{
    $initialized = false;

    for ($i = 0; $i < count($viewerStats); $i++) {
        // there are no views so skip to next one
        if (is_null($viewerStats[$i]['individual_views']))
            continue;

        if (!$initialized) {
            $firstView = $viewerStats[$i]['individual_views'][0]['timestamp'];
            $lastIndex = count($viewerStats[$i]['individual_views'][0]) - 1;
            $lastView = $viewerStats[$i]['individual_views'][$lastIndex]['timestamp'];

            $initialized = true;
        }

        if ($firstView > $viewerStats[$i]['individual_views'][0]['timestamp']) {
            $firstView = $viewerStats[$i]['individual_views'][0]['timestamp'];
        }

        $lastIndex = count($viewerStats[$i]['individual_views']) - 1;
        //print "lastIndex:$lastIndex<br />";
        if ($lastView < $viewerStats[$i]['individual_views'][$lastIndex]['timestamp']) {
            $lastView = $viewerStats[$i]['individual_views'][$lastIndex]['timestamp'];
        }
    }

    return array("first_view" => $firstView, "last_view" => $lastView);
}

/* 
 *
 */
function getDailyViews($viewerStats, &$maxDailyViews)
{
    $maxDailyViews = 0;

    for ($j = 0; $j < count($viewerStats); $j++) {
        $viewCount = count($viewerStats[$j]['individual_views']);
        for ($i = 0; $i < $viewCount; $i++) {
            $day = date("j-M-Y", strtotime($viewerStats[$j]['individual_views'][$i]['timestamp']));
            $views[$j][$day] += 1;

            if ($views[$j][$day] > $maxDailyViews) {
                $maxDailyViews = $views[$j][$day];
            }
        }
    }
    //print_r($views);
    return $views;
}

/*
 * shows density of views (greater density means higher R channel value in the RGB setting)
 */
function displayDateHeatmap($views, $firstView, $range, $maxDailyViews)
{
    //    $heatmapWidth = max(150, $range);
    $heatmapWidth = 150;
    /*
    $viewCount  = count($viewerStats['individual_views']);
    for ($i=0; $i<$viewCount; $i++) {
    // TODO: truncate to nearest day
    $day           = date("j-M-Y", strtotime($viewerStats['individual_views'][$i]['timestamp']));
    $views[$day]  += 1;
    }
    */

    // put into buckets with granularity of 1 day
    for ($i = 0; $i <= $range; $i++) {
        $timestamp = strtotime($firstView) + ($i * 60 * 60 * 24);
        $dayWidth = intval($heatmapWidth / $range);

        $date = date("j-M-Y", $timestamp);
        $percentOfMax = $views[$date] / $maxDailyViews;

        if (0 < $percentOfMax) {
            // non-linear calculation aids visibility of low values 
            // (low values are scaled up otherwise they are hardly detectible) 
            $redChannel = dechex(($percentOfMax + ((1 - $percentOfMax) * 0.2)) * 255);
        } else {
            $redChannel = 0;
        }

        // make sure hex value is two digits
        if (1 == strlen($redChannel))
            $redChannel = "0" . $redChannel;

        $color = "#" . $redChannel . "0000";
        $html .= "<div class=\"{$date}_{$views[$date]} day\" style=\"display:inline-block;background-color:$color;height:12px;width:" . $dayWidth . "px\"></div>";

        // special case if the range is only one day
        if (1 == $range)
            break;
    }

    print "<div id=\"date-heatmap\">$html</div>";
}
?>