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

require_once(dirname(__FILE__) . '/../includes/common.inc.php');
require_once(dirname(__FILE__) . "/../includes/kaltura/kaltura_functions.php");
require_once(dirname(__FILE__) . "/../database/annotations.php");


startSession();
$userID     = $_SESSION['user_id'];
$userName   = $_SESSION['name'];


//print "hello";
$annotationIDs = array();
$annotationDB = new annotationsDB();

//$annotations->truncateTable();
//$annotationsCount = $annotations->countAnnotations();
//print "There are $annotationsCount annotation(s) in total.<br /><br />";

$id                 = $_POST['id'];
$videoAnnotationID  = $_POST['video_annotation_id'];
/*
print "POST vars:";
foreach ($_POST as $key=>$val) {
    print "$key:$val\n";
}
print "videoAnnotationID: $videoAnnotationID";
*/
$annotationDB->deleteAnnotation($id, $userID);

$annotationDB->close();

?>
