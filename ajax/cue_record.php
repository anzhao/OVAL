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

startSession();
$userName = $_SESSION['name'];

$videoID = $_POST['video_id'];
$cuePosition = $_POST['cue_position'];


$conn = mysql_connect('localhost', $mysqlUser, $mysqlPassword);
if (!$conn) {
  die('Not connected : ' . mysql_error());
}
$db_selected = mysql_select_db($database, $conn);
mysql_set_charset("utf8", $conn);
$result = mysql_query("INSERT INTO cueEvent VALUES ('$userName', 'CUE', '$videoID', '$cuePosition', NULL)");
?>;