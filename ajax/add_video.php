<!--
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
-->

<script>
alert("call the file add_video.php!!!");

</script>

<script src="code.jquery.com/jquery-latest.min.js"
        type="text/javascript"></script>


<script>
alert("before the jQuery call!");




var video_id='VA770wpLX-Q';
$jQuery.getJSON('http://gdata.youtube.com/feeds/api/videos/VA770wpLX-Q?v=2&alt=jsonc',function(data,status,xhr){
    alert(status);
    alert(data.data.title);
    // data contains the JSON-Object below
});






</script>

<?php
require_once(dirname(__FILE__) . "/../includes/common.inc.php");
require_once(dirname(__FILE__) . "/../includes/kaltura/kaltura_functions.php");
require_once(dirname(__FILE__) . "/../database/media.php");

session_start();
startSession();

// TODO: validate input
$videoID = $_POST['video_id'];
echo "videoID is: " . $videoID;
$userID = $_SESSION['user_id'];
echo "userID is: " . $userID;
$title = $_POST['title'];
echo "title is: " . $title;
$url = $_POST['url'];
echo "url is: " . $url;
$description = $_POST['description'];
echo "description is: " . $description;
$dur = "";
$point1 = $_POST['point_one'];
$point2 = $_POST['point_two'];
$point3 = $_POST['point_three'];


$media = new media();

// delete hosted video as well if the deleting user is the one uploaded
// the kaltura deletion must happen before the OVAL database deletion for owner check to work
if ($media->userOwnsMedia($videoID, $userID)) {
    // TODO: this was commented out so that OVAL deletions becomes "soft delete"
    // implement more comprehensive soft deletion later, where deleted videos are
    // marked as deleted within OVAL, and get reassigned to the system-admin group.
    //
    // The system admin group will then have a "hard delete" command in video
    // management. This arrangement allow departments who administer their own
    // OVAL instance to do their own video management.
    //
    // deleteVideoOnKaltura($videoID);
}
?>

<script>
alert("before the addMedia call!");

</script>



<?php

//To implement this method to make the embed method to work.
$media->addMedia($videoID, $userID, $title, $description, '180', $point1, $point2, $point3);

$media->close();


?>




