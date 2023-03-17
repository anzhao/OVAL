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


require_once(dirname(__FILE__) . "/../includes/common.inc.php");
require_once(dirname(__FILE__) . "/../database/annotations.php");

/*
if(isUserLoggedIn()) {
$userID     = $loggedInUser->user_id;
$userName   = $loggedInUser->display_username;
} else {
header("Location: $applicationLoginURL");
exit;
//    print "user NOT logged in";
}
*/

startSession();
$userID = $_SESSION['user_id'];
$userName = $_SESSION['name'];


print_r($_POST);
$annotationIDs = array();
$annotationDB = new annotationsDB();

//$annotations->truncateTable();
//$annotationsCount = $annotations->countAnnotations();
//print "There are $annotationsCount annotation(s) in total.<br /><br />";

$videoID = $_POST['video_id'];
$startTime = $_POST['start_time'];
$endTime = $_POST['end_time'];
$tags = $_POST['tags'];
$description = $_POST['description'];
$isPrivate = $_POST['is_private'];
$isDeleted = "0";
$videoAnnotationID = $_POST['video_annotation_id'];
$confidence_type = $_POST['confidence_level'];

//print "private: $private";
("true" == $isPrivate) ? $isPrivate = 1 : $isPrivate = 0;

/* When adding annotations, the start time and end time needs to be moved back a few seconds 
to take into account the delay that a user would need to recognize of a part of the video 
is important. The "attentional delay" constant is currently set as 3 seconds.
*/
$attentionalDelay = 3; // seconds
$startTime = ($startTime > $attentionalDelay) ? ($startTime - $attentionalDelay) : $startTime;
$endTime = ($endTime > $attentionalDelay) ? ($endTime - $attentionalDelay) : $endTime;

//$annotationDB->addAnnotation($videoID="ptr_to_vid_table", $studentID="ptr_to_student_table", $startTime, $endTime, $description, $tags);
$annotationDB->addAnnotation($videoID, $userID, $userName, $startTime, $endTime, $description, $tags, $isPrivate, $isDeleted, $videoAnnotationID, $confidence_type);
$annotationID = mysql_insert_id();

$annotationDB->close();

?>
