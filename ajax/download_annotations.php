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
require_once(dirname(__FILE__) . "/../database/annotations.php");


startSession();
$userID = $_SESSION['user_id'];
//print_r($userID);

$videoID = $_GET['video_id'];
//print_r($videoID);
$flagMode = $_GET['flag_mode'];
//print_r($flagMode);

$user = new users();

$annotationsDB = new annotationsDB();

// create file and write to it
$fname = "../downloads/annotations_$userID.csv";
$fp = fopen($fname, 'w+');

($user->isInstructorOrTA($userID)) ? $isStudent = false : $isStudent = true;

$annotations = (array) $annotationsDB->getMyAnnotations($videoID, $userID, $flagMode);
$instructorAndTAs = (array) $annotationsDB->getInstructorAndTAAnnotations($videoID, $userID, $flagMode);
$students = (array) $annotationsDB->getStudentAnnotations($videoID, $userID, $flagMode);

if (intval($_GET['viewAll'])) {
    $annotations = array_merge($annotations, $instructorAndTAs, $students);
}

$headings = array('start time', 'name', 'type', 'role', 'tags', 'description');
fputcsv($fp, $headings);

if (count($annotations) > 0) {
    foreach ($annotations as $annotation) {
        $name = $annotation['user_name'];

        if (is_null($annotation['start_time'])) {
            $type = "comment";
            $startTime = "----";
        } else {
            $type = "annotation";
            $startTime = formatISO(floor($annotation['start_time']));
        }

        // get role
        ($annotation['is_student']) ? $role = "student" : $role = "instructor/TA";

        // strip new line characters
        $description = preg_replace('~[\r\n]+~', '', $annotation['description']);
        //$description = "strlen(" . strlen($description) . ") " . $description; 
        $output = array($startTime, $name, $type, $role, $annotation['tags'], $description);
        fputcsv($fp, $output);
    }
}

function formatISO($seconds)
{
    $hours = floor($seconds / (60 * 60));
    $rest = floor($seconds % (60 * 60));
    $minutes = floor($rest / 60);
    $rest = floor($rest % 60);
    $seconds = floor($rest);
    $millis = floor($rest);
    //print "formatISO hours:$hours, minutes:$minutes, seconds:$seconds<br />";

    $time = doubleDigits($hours) . ":" . doubleDigits($minutes) . ":" . doubleDigits($seconds);
    //print "time: $time<br />";    
    return $time;
    /*+ "."
    + tripleDigits( millis );*/
}

function doubleDigits($value)
{
    //print "doubleDigits $value<br />";
    $value = (string) $value;

    if ($value <= 9) {
        $value = "0" . $value;
    }

    return $value;
}

fclose($fp);

header('Content-Description: Download File');
header('Content-type: text/csv');
header("Content-Disposition: inline; filename=" . $fname);
header("Pragma: no-cache");
header("Expires: 0");
readfile($fname);

?>