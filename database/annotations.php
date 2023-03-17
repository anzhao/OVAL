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

include_once(dirname(__FILE__) . "/../includes/global_deploy_config.php");
include_once(dirname(__FILE__) . '/../includes/common.inc.php');
include_once(dirname(__FILE__) . '/users.php');

include_once("/var/www/config/clas/$configFolderName/db_config.php");


class annotationsDB
{
	var $link;

	function annotationsDB()
	{
		global $mysqlUser, $mysqlPassword, $database;

		$this->link = mysql_connect('localhost', $mysqlUser, $mysqlPassword);
		if (!$this->link)
			die('could not connect: ' . mysql_error());

		mysql_select_db($database) or die(mysql_error());
	}

	function addAnnotation($videoID = "video ID", $userID = "user ID", $userName = "NO NAME", $startTime, $endTime, $description, $tags = "no tags yet", $isPrivate = 0, $isDeleted = 0, $videoAnnotationID = "NULL", $confidence_type, $parent_id = "NULL", $child_id = "NULL", $creation_date = "NULL")
	{
		//TODO: format query like this
		/*
		$query = sprintf("SELECT * FROM users WHERE user='%s' AND password='%s'",
		mysql_real_escape_string($user),
		mysql_real_escape_string($password));
		*/
		if (get_magic_quotes_gpc()) {
			$description = stripslashes($description);
			$tags = stripslashes($tags);
		}

		$description = trim(mysql_real_escape_string($description));
		$tags = trim(mysql_real_escape_string($tags));

		//print "description: $description";
		//writeToLog("description: $description");
		//print "tags: $tags";
		//writeToLog("tags: $tags");
		//print "startTime:$startTime<br />endTime:$endTime<br />";
		//print "parent_id:$parent_id, child_id:$child_id<br />";

		//$result = mysql_query("SELECT MAX(annotation_id) as max_id FROM annotations");
		//$data   = mysql_fetch_array($result);

		//        $data = print_r($data, true);
		//writeToLog("\ndata: $data");
		//        $maxID  = $data[0];
		//        if ($maxID % 2) ? $sleep = 0 : $sleep = 10;

		//writeToLog("\nmaxID: $maxID");
		//writeToLog("sleep: " . $sleep);

		$query = "INSERT INTO annotations VALUES (NULL, '$videoID', '$userID', '$userName', $startTime, $endTime, '$description', '$tags', $isPrivate, $isDeleted, '$videoAnnotationID', $parent_id, $child_id, $creation_date, '$confidence_type')";

		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query (addAnnotation): ' . mysql_error());

		$insertID = mysql_insert_id($this->link);

		return $insertID;
	}

	function addFeedback()
	{

	}



	function updateAnnotationViewCount($annotationID, $userID)
	{
		$query = "INSERT INTO annotationViewedBy VALUES (NULL, $annotationID, $userID, NULL)";
		$result = mysql_query($query, $this->link);

		//print "query: $query";
		if (!$result)
			die('Invalid query (updateAnnotationViewCount): ' . mysql_error());
	}

	function updateAnnotation($annotationID, $videoID = "0", $userID = "0", $userName = "bob", $startTime, $endTime, $description, $tags = "no tags yet", $isPrivate = 0, $isDeleted = 0, $videoAnnotationID = "NULL", $parentID)
	{
		// check ownership
		if (!$this->userOwnsAnnotation($annotationID, $userID))
			return ("user does not own this annotation? userID " . $userID . " annotationID " . $annotationID);

		if (get_magic_quotes_gpc() != 0) {
			$description = stripslashes($description);
			$tags = stripslashes($tags);
		}

		$description = trim(mysql_real_escape_string($description));
		$tags = trim(mysql_real_escape_string($tags));

		//$query = "UPDATE annotations SET description='$description', tags='$tags' WHERE annotation_id = $annotationID";
		// create a new annotation and this->link it to it's ancestor
		//        $parent_id = $annotationID;
		//print "startTime:$startTime<br />endTime:$endTime<br />";

		$newAnnotationID = $this->addAnnotation($videoID, $userID, $userName, $startTime, $endTime, $description, $tags, $isPrivate, $isDeleted, $videoAnnotationID, $annotationID);

		$query = "UPDATE annotations SET is_deleted=1, child_id=$newAnnotationID WHERE annotation_id=$annotationID";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query (updateAnnotation): ' . mysql_error());

		//return $description;
	}

	function userOwnsAnnotation($annotationID, $userID)
	{
		$query = "SELECT user_id FROM annotations WHERE annotation_id=$annotationID AND user_id=$userID";
		$result = mysql_query($query, $this->link);
		$rowCnt = mysql_num_rows($result);

		// if no rows returned then user does not own annotation
		if (0 == $rowCnt) {
			return false;
		} else {
			return true;
		}
	}

	function deleteAnnotation($annotationID, $userID = SYSADMIN)
	{
		// this does not really delete an annotation as we need to keep them
		// in order to do analysis

		// check ownership, skip but only for the admin tool
		if ($userID != SYSADMIN) {
			if (!$this->userOwnsAnnotation($annotationID, $userID))
				return;
		}

		$query = "UPDATE annotations SET is_deleted=1 WHERE annotation_id=$annotationID";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query (deleteAnnotation): ' . mysql_error());
		return $result;
	}

	function getStudentAnnotations($videoID = null, $userID, $flagMode = false)
	{
		return $this->getAnnotations($videoID, $userID, $flagMode, STUDENTS);
	}

	function getInstructorAndTAAnnotations($videoID = null, $userID, $flagMode = false)
	{
		return $this->getAnnotations($videoID, $userID, $flagMode, INSTRUCTORS_AND_TAS);
	}

	function getMyAnnotations($videoID = null, $userID, $flagMode = false)
	{
		return $this->getAnnotations($videoID, $userID, $flagMode, MINE);
	}

	function getAnnotations($videoID = null, $userID = null, $annotationMode = true, $viewMode)
	{
		$videoID = (string) $videoID;

		switch ($viewMode) {
			case MINE:
				$query = "SELECT * FROM annotations WHERE is_deleted=0 AND video_id like '" . $videoID . "' AND user_id=$userID";
				break;
			case INSTRUCTORS_AND_TAS:
				// print "CASE INSTRUCTORS<br />";
				$query = "SELECT * FROM annotations WHERE is_deleted=0 AND video_id like '" . $videoID . "' AND user_id!=$userID AND is_private=0";
				break;
			case STUDENTS:
				// print "CASE students<br />";
				$query = "SELECT * FROM annotations WHERE is_deleted=0 AND video_id like '" . $videoID . "' AND user_id!=$userID AND is_private=0";
				break;
			case ALL:
				// print "CASE all<br />;
				$query = "SELECT * FROM annotations WHERE is_deleted=0 AND video_id like '" . $videoID . "'";
				break;
		}
		/*
		if ($annotationMode) {
		$query .= " AND start_time is NOT NULL";
		} else {
		$query .= " AND start_time is NULL";
		}
		*/
		$query .= " ORDER BY creation_date ASC";

		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getAnnotations() ) ' . mysql_error());

		while ($row = mysql_fetch_assoc($result)) {

			$lineBreakRestoredDescription = str_replace(array("\\r\\n", "\\n"), PHP_EOL, trim($row['description']));
			$lineBreakRestoredTags = str_replace(array("\\r\\n", "\\n"), PHP_EOL, trim($row['tags']));

			$row['description'] = htmlentities(stripslashes($lineBreakRestoredDescription), ENT_NOQUOTES, "UTF-8");
			$row['tags'] = htmlentities(stripslashes($lineBreakRestoredTags), ENT_NOQUOTES, "UTF-8");

			users::isInstructorOrTA($row['user_id']) ? $isInstructorTA = true : $isInstructorTA = false;

			if ($viewMode == INSTRUCTORS_AND_TAS) {
				//print "query(INSTRUCTORS): $query<br />";
				if ($isInstructorTA) {
					$row['is_student'] = 0;
					$annotations[] = $row;
				}
			} elseif ($viewMode == STUDENTS) {
				//print "query(STUDENTS): $query<br />";
				if (!$isInstructorTA) {
					$row['is_student'] = 1;
					$annotations[] = $row;
				}
			} else {
				//print "query(MINE): $query<br />";
				$row['is_student'] = (int) !$isInstructorTA;
				// $viewMode == MINE
				$annotations[] = $row;
			}
			//print_r($row);
		}
		//print "count(annotations): " . count($annotations) . "<br />";
		//print_r($annotations);
		return $annotations;
	}

	function countAnnotations()
	{
		$result = mysql_query("SELECT * FROM annotations", $this->link);
		$numRows = mysql_num_rows($result);

		return $numRows;
	}

	function close()
	{
		//print 'connected successfully';
		//        mysql_close($this->link);
	}
}


/*
// test driver
$annotationIDs = array();
$annotations = new annotationsDB();
$annotations->truncateTable();
$annotationsCount = $annotations->countAnnotations();
print "There are $annotationsCount annotation(s) in total.<br /><br />";
$startTime = 12.823;
$endTime   = $startTime + rand(1, 15);
$description = "this vid sucks!";
print '$annotations->addAnnotation()<br />';
$annotations->addAnnotation($videoID=0, $userID=0, $userName="bob", $startTime, $endTime, $description, $tags="no tags yet");
$annotationIDs[] = mysql_insert_id();
$endTime   = $startTime + rand(1, 15);
$description = "I found this part interesting.";
print '$annotations->addAnnotation()<br />';
$annotations->addAnnotation($videoID=0, $userID=0, $userName="bob", $startTime, $endTime, $description, $tags="no tags yet");
print '$annotations->updateAnnotation()<br />';
$parent_id = 44;
$annotations->updateAnnotation($parent_id, $videoID=0, $userID=0, $userName="bob", $startTime, $endTime, $description, $tags="no tags");
$annotationIDs[] = mysql_insert_id();
$annotation_id = array_pop($annotationIDs);
$data = $annotations->getAnnotations("0", "0");
print '$annotations->getAnnotations("0", "0")<br />';
print_r($data);
print "<br /><br />There are " . $annotations->countAnnotations() . " annotations in total.<br />";
print '$annotations->deleteAnnotation($annotation_id)<br />';
$annotations->deleteAnnotation($annotation_id);
print "There are " . $annotations->countAnnotations() . " annotations in total.<br />";
$annotations->close();
*/
?>