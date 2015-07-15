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
    require_once(dirname(__FILE__) . "/../includes/auth.inc.php");
    require_once(dirname(__FILE__) . "/../database/media.php");
    require_once(dirname(__FILE__) . "/../database/users.php");

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

    // TODO: validate input
    $videoID = $_GET['video_id'];
    $groupID = $_GET['group_id'];
    $userID  = $_SESSION['user_id'];

    $media = new media();
    $users  = new users();
	print "msg: $videoID $groupID $userID ";

    // check ownership
    if ($users->userOwnsGroup($groupID, $userID)) {
        $media->setVideoGroup($videoID, $groupID);
    }

    $users->close();
    $media->close(); 
?>
