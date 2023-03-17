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

require_once(dirname(__FILE__) . "/../includes/global_deploy_config.php");
require_once(dirname(__FILE__) . '/../includes/common.inc.php');
require_once(dirname(__FILE__) . '/users.php');

require_once("/var/www/config/clas/$configFolderName/db_config.php");

error_reporting(E_ALL);

class media
{
	private $link;

	function media()
	{
		global $mysqlUser, $mysqlPassword, $database;

		$this->link = mysql_connect('localhost', $mysqlUser, $mysqlPassword);
		if (!$this->link)
			die('could not connect: ' . mysql_error());

		mysql_select_db($database) or die(mysql_error());
	}

	function getVideosWithNoGroup($userID)
	{
		$query = <<<EOF
SELECT * FROM media
WHERE uploaded_by_user_id=$userID
AND video_id NOT IN (SELECT video_id FROM videoGroup)
EOF;
		$result = mysql_query($query, $this->link);

		while ($row = mysql_fetch_assoc($result)) {
			$row['description'] = stripslashes($row['description']);
			$row['title'] = stripslashes($row['title']);
			$row['thumbnail_url'] = stripslashes($row['thumbnail_url']);
			$row['duration'] = stripslashes($row['duration']);
			$ID = $row['video_id'];

			$media[$ID] = $row;
		}

		// for DEBUG or SUPPORT (retrying when kaltura fails)
		/*
		$query = <<<EOF
		SELECT * FROM media WHERE video_id IN (SELECT video_id FROM videoOwners WHERE user_id=$userID)
		AND video_id NOT IN (SELECT video_id FROM videoGroup)
		EOF;
		
		$result = mysql_query($query, $this->link);
		
		while ($row = mysql_fetch_assoc($result)) {
		$row['description']     = stripslashes($row['description']);
		$row['title']           = stripslashes($row['title']);
		$row['thumbnail_url']   = stripslashes($row['thumbnail_url']);
		$row['duration']        = stripslashes($row['duration']);
		$ID = $row['video_id'];
		
		$media[$ID] = $row;
		} 
		
		*/

		return $media;
	}

	// For admin reporting use only
	function getVideosByClassID($classID)
	{
		if (!is_numeric($classID))
			return;

		$query = <<<EOT
			SELECT videoGroup.video_id as 'video_id', 
					media.title as 'title', media.duration as 'duration' 
			FROM videoGroup, media 
			WHERE 
				videoGroup.group_id in (select id from groups where class_id = '$classID') 
			AND
				videoGroup.video_id = media.video_id			
			ORDER BY group_id asc
EOT;

		$result = mysql_query($query, $this->link);
		if (!$result)
			die('Invalid query (getVideoGroup): ' . mysql_error());

		$videos = array();
		while ($row = mysql_fetch_assoc($result)) {
			$row['title'] = stripslashes($row['title']);
			$row['duration'] = stripslashes($row['duration']);
			$videos[] = $row;
		}
		return $videos;
	}

	function getVideosByGroupID($userID, $groupID)
	{
		// validate input
		if (!is_numeric($groupID))
			return;

		// check that user belongs to group
		$query = "SELECT * FROM groupMembers WHERE user_id=$userID AND group_id=$groupID";
		$result = mysql_query($query, $this->link);
		$numRows = mysql_num_rows($result);

		$query = "SELECT * FROM groupOwners WHERE user_id=$userID AND group_id=$groupID";
		$result = mysql_query($query, $this->link);
		$numRows += mysql_num_rows($result);

		if (0 == $numRows) {
			// user is not authorized
			return;
		}

		$query = "SELECT * FROM videoGroup v, media m WHERE v.group_id=$groupID AND m.video_id LIKE v.video_id ORDER BY m.title";
		$result = mysql_query($query, $this->link);
		//print "query:$query";
		if (!$result)
			die('Invalid query (getVideoGroup): ' . mysql_error());

		while ($row = mysql_fetch_assoc($result)) {
			$row['description'] = stripslashes($row['description']);
			$row['title'] = stripslashes($row['title']);
			$row['thumbnail_url'] = stripslashes($row['thumbnail_url']);
			$row['duration'] = stripslashes($row['duration']);
			//$row['class_id']        = $this->getClassIDByVideoID($row['video_id']);
			$ID = $row['video_id'];

			$media[$ID] = $row;
		}

		return $media;
	}

	function updateVideoACL($groupID)
	{
		$videos = $this->getVideosByGroupID($groupID);

		if (!empty($videos)) {
			foreach ($videos as $videoID => $groupID) {
				$this->setVideoGroup($videoID, $groupID);
			}
		}
	}

	function getVideoGroup($videoID)
	{
		$query = "SELECT * FROM videoGroup WHERE video_id like '$videoID'";

		$result = mysql_query($query, $this->link);
		// print "query: $query<br />";
		if (!$result)
			die('Invalid query (getVideoGroup): ' . mysql_error());
		$row = mysql_fetch_assoc($result);

		return $row['group_id'];
	}

	function setVideoGroup($videoID, $groupID)
	{
		//print "setVideoGroup($videoID, $groupID)";

		// TODO: multiple groups per video is NOT yet possible! 
		// Does videoGroup need a to use both groupID and videoID as a primary key or can we
		// just use an ID? Currently we can't just insert more entries into videoGroup
		if (is_null($this->getVideoGroup($videoID))) {
			$query = "INSERT INTO videoGroup VALUES ('$videoID', $groupID)";
		} else {
			// this would return an error if more than one group in a video
			$query = "UPDATE videoGroup SET group_id=$groupID WHERE video_id LIKE '$videoID'";
		}

		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		if (!$result)
			die('Invalid query (setVideoGroup): ' . mysql_error());

		//$this->removeVideoGroup($videoID);

		$users = new users();
		$students = $users->getGroupMembers($groupID);
		$instructorsAndTAs = $users->getClassInstructorsAndTAs($groupID);
		$userIDs = array_merge($students, $instructorsAndTAs);

		// grant ownership of video to course instructor and TAs
		$groupOwners = $users->getClassInstructorsAndTAs($groupID);
		$users->close();

		// empty videoOwners before repopulating
		$this->removeVideoOwners($videoID);

		foreach ($groupOwners as $owner) {
			$query = "INSERT INTO videoOwners VALUES ('$videoID', $owner)";
			$result = mysql_query($query, $this->link);

			if (!$result)
				die('Invalid query (setVideoGroup - adding video owners): ' . mysql_error());
		}

		$this->removeAllUsersFromVideo($videoID);
		$this->addUsersToVideo($videoID, $groupID, $userIDs);
	}

	function removeVideoOwners($videoID)
	{
		$query = "DELETE FROM videoOwners WHERE video_id LIKE '$videoID'";

		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		if (!$result)
			die('Invalid query (removeVideoOwners): ' . mysql_error());
	}

	function removeVideoGroup($videoID)
	{
		$query = "DELETE FROM videoGroup WHERE video_id LIKE '$videoID'";

		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		if (!$result)
			die('Invalid query (removeVideoGroup): ' . mysql_error());

		$this->removeAllUsersFromVideo($videoID);
	}

	function addUsersToVideo($videoID, $groupID, $userIDs)
	{
		if (!is_null($userIDs)) {
			foreach ($userIDs as $userID) {
				$query = "INSERT INTO videoAccessControlLists VALUES ('$videoID', $userID, $groupID, 0, NULL, NULL)";
				$result = mysql_query($query, $this->link);
				//print "query: $query<br />";

				if (!$result)
					die('Invalid query (addUsersToVideo): ' . mysql_error());
			}
		}
	}

	function playbackStarted($userID, $videoID, $playbackStartTime)
	{
		//TODO: if there is already an entry with same videoViewedBy.playback_start_time and videoViewedBy.start_time
		// ADD a UNIQUE constraint on the fields (videoViewedBy.playback_start_time, videoViewedBy.start_time and videoViewedBy.viewed_by)
		// and then change the INSERT statement to INSERT IGNORE to ignore duplicates

		$query = "INSERT INTO videoViewedBy VALUES(NULL, '$videoID', $userID, $playbackStartTime, NULL, NULL, NULL)";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		if (!$result)
			die('Invalid query (playbackStarted): ' . mysql_error());
	}

	function playbackEnded($userID, $videoID, $playbackEndTime)
	{
		// get current login (lastest row)
		$query = "SELECT MAX(uid) AS uid FROM videoViewedBy WHERE viewed_by=$userID AND video_id LIKE '$videoID'";
		//print "query: $query<br />";

		$result = mysql_query($query, $this->link);
		if (!$result)
			die('Invalid query (recordLogout): ' . mysql_error());
		$row = mysql_fetch_assoc($result);
		$UID = $row['uid'];

		$currentTime = date("Y-m-d H:i:s");
		$query = "UPDATE videoViewedBy SET playback_end_time=$playbackEndTime, end_time='$currentTime' WHERE uid=$UID";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		if (!$result)
			die('Invalid query (playbackEnded): ' . mysql_error());
	}

	function updateTotalViews($userID, $videoID)
	{
		$query = "SELECT total_views FROM videoAccessControlLists WHERE user_id = $userID AND video_id like '$videoID'";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		$row = mysql_fetch_assoc($result);

		if (!$result)
			die('Invalid query (updateTotalViews): ' . mysql_error());

		$date = date("Y-m-d H:i:s");
		$totalViews = $row['total_views'];

		if (0 == $totalViews)
			$values = ", first_view='$date' ";

		$totalViews++;
		$values = "total_views=$totalViews" . $values;

		$query = "UPDATE videoAccessControlLists SET $values WHERE user_id = $userID AND video_id like '$videoID'";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		if (!$result)
			die('Invalid query (updateTotalViews): ' . mysql_error());
	}

	function getViewerStatistics($userID, $videoID)
	{
		$query = "SELECT * FROM videoViewedBy WHERE viewed_by = $userID AND video_id like '$videoID'";

		$result = mysql_query($query, $this->link);
		$totalViews = mysql_num_rows($result);
		//print "query: $query<br />";
		$viewerStats = null;
		$averageDuration = 0;
		$endTimeNullCnt = 0;

		while ($row = mysql_fetch_assoc($result)) {
			$startTime = $row['playback_start_time'];
			$endTime = $row['playback_end_time'];

			if (is_null($endTime) || is_null($startTime)) {
				$duration = 0;
				$endTimeNullCnt++;
			} else {
				// end time is unknown so don't include this result
				$duration = $endTime - $startTime;
			}
			$viewerStats[] = array("start_time" => $startTime, "duration" => $duration, "timestamp" => $row['start_time']);
			$averageDuration += (int) $duration;
		}

		$averageDuration = intval($averageDuration / ($totalViews - $endTimeNullCnt));

		// return aggregate result
		return array(
			"total_views" => $totalViews,
			"average_duration" => $averageDuration,
			"end_time_null_count" => $endTimeNullCnt,
			"individual_views" => $viewerStats
		);
	}

	function removeAllUsersFromVideo($videoID)
	{
		$query = "DELETE FROM videoAccessControlLists WHERE video_id like '$videoID'";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query (removeAllUsersFromVideo): ' . mysql_error());
	}

	function getAuthorizedViewers($videoID)
	{
		//print "getAnnotations() videoID:$videoID\n";
		$query = "SELECT * FROM videoAccessControlLists WHERE video_id like '$videoID'";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		if (!$result)
			die('Invalid query ( getAuthorizedViewers() ) ' . mysql_error());


		$userIDs = null;
		while ($row = mysql_fetch_assoc($result)) {
			$userIDs[] = $row['user_id'];
			//print_r($row);
		}
		//print_r($userIDs);

		return $userIDs;
	}

	function getClassIDByVideoID($videoID)
	{
		$query = "SELECT * FROM videoAccessControlLists WHERE video_id like '$videoID'";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		if (!$result)
			die('Invalid query ( getClassIDByVideoID() ) ' . mysql_error());

		$row = mysql_fetch_assoc($result);
		if (false == $row) {
			return null;
		} else {
			$groupID = $row['group_id'];
			$query = "SELECT * FROM groups WHERE id=$groupID";

			$result = mysql_query($query, $this->link);
			//print "query: $query<br />";
			if (!$result)
				die('Invalid query ( getClassIDByVideoID() ) ' . mysql_error());
			$row = mysql_fetch_assoc($result);

			return $row['classID'];
		}
	}

	function isViewerAuthorized($videoID, $userID)
	{
		$authorizedViewers = $this->getAuthorizedViewers($videoID);

		return in_array($userID, $authorizedViewers);
	}

	function getAuthorizedVideosByUserID($userID)
	{
		$query = "SELECT * FROM videoAccessControlLists WHERE user_id = $userID";
		$result = mysql_query($query, $this->link);
		// print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getAuthorizedVideosByUserID() ) ' . mysql_error());

		$videoIDs = null;
		while ($row = mysql_fetch_assoc($result)) {
			$videoIDs[] = "'" . $row['video_id'] . "'";
			// print_r($row);
		}

		$query = "SELECT * FROM videoAccessControlLists WHERE user_id = $userID";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		if (!$result)
			die('Invalid query ( getAuthorizedVideosByUserID() ) ' . mysql_error());
		while ($row = mysql_fetch_assoc($result)) {
			$videoIDs[] = "'" . $row['video_id'] . "'";
		}

		//print_r($videoIDs);
		return $videoIDs;
	}

	function conversionComplete($videoID, $conversion_complete = 1)
	{
		$query = "UPDATE media SET conversion_complete=$conversion_complete WHERE video_id like '$videoID'";

		mysql_query("LOCK TABLES media WRITE");
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		if (!$result)
			die('Invalid query (conversionComplete): ' . mysql_error());
		$insertID = mysql_insert_id($this->link);
		mysql_query("UNLOCK TABLES");

		return $insertID;
	}

	function addFlavor($flavorID, $entryID, $codecID, $fileExt)
	{
		$query = "INSERT IGNORE INTO flavors VALUES ('$flavorID', '$entryID', '$codecID', '$fileExt', NULL)";

		mysql_query("LOCK TABLES flavors WRITE");
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		if (!$result) {
			writeToLog('Invalid query (addFlavor): ' . mysql_error() . '\n');
		} else {
			$insertID = mysql_insert_id($this->link);
		}
		mysql_query("UNLOCK TABLES");

		return $insertID;

	}

	function updateMedia($videoID, $duration, $thumbnailURL, $uploadComplete, $conversionComplete)
	{
		// print "in updateAnnotation()<br />";
		$title = mysql_real_escape_string($title);
		$description = mysql_real_escape_string($description);

		$query = "UPDATE media SET duration=$duration, thumbnail_url='$thumbnailURL', upload_complete=$uploadComplete, conversion_complete=$conversionComplete WHERE video_id like '$videoID'";

		$result = mysql_query($query, $this->link);
		// print "query: $query<br />";

		if (!$result)
			die('Invalid query (updateAnnotation): ' . mysql_error());
	}

	function userOwnsMedia($videoID, $ownerID)
	{
		// check that user is in administrative group for video or is media owner
		$query = "SELECT user_id FROM groupOwners WHERE user_id=$ownerID AND group_id IN (SELECT group_id FROM videoAccessControlLists WHERE video_id LIKE '$videoID')";
		$result = mysql_query($query, $this->link);
		$rowCnt = mysql_num_rows($result);

		$query = "SELECT * FROM media WHERE uploaded_by_user_id=$ownerID AND video_id LIKE '$videoID'";
		$result = mysql_query($query, $this->link);
		$rowCnt += mysql_num_rows($result);

		// if no rows returned then user does not have access
		if (0 == $rowCnt) {
			return false;
		} else {
			return true;
		}
	}

	function deleteMedia($videoID, $ownerID = null)
	{
		// confirm ownership
		if (!$this->userOwnsMedia($videoID, $ownerID))
			return;

		$query = "DELETE FROM media WHERE video_id like '$videoID'";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query (deleteMedia): query: ' . $query . 'error: ' . mysql_error());

		// TODO: change DB schema to "ON DELETE CASCADE" for flavors
		$query = "DELETE FROM flavors WHERE video_id like '$videoID'";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query (deleteMedia): query: ' . $query . 'error: ' . mysql_error());

	}

	function addMedia($videoID, $userID, $title, $description, $duration, $point1, $point2, $point3)
	{
		$query = "INSERT INTO media values ('$videoID', '$userID', '$title', '$description', '$duration', 'https://img.youtube.com/vi/$videoID/default.jpg', '1', '1', current_timestamp, '$point1', '$point2', '$point3')";
		$result = mysql_query($query, $this->link);
		if (!$result)
			die('Invalid query (addMedia): ' . mysql_error());


	}




	function getMediaData($videoID)
	{
		//print "getMediaData(videoID)$videoID\n";
		//print_r($authorizedVideos);

		$query = "SELECT * FROM media WHERE video_id like '$videoID'";
		if (!is_null($authorizedVideos)) {
			$authorizedVideos = implode(",", $authorizedVideos);
			$query .= " OR video_id IN ($authorizedVideos)";
		}
		//print "query: $query<br />";

		$result = mysql_query($query, $this->link);
		if (!$result)
			die('Invalid query ( getMediaData() ) ' . mysql_error());

		$row = mysql_fetch_assoc($result);
		$row['description'] = stripslashes($row['description']);
		$row['title'] = stripslashes($row['title']);
		$row['thumbnail_url'] = stripslashes($row['thumbnail_url']);
		$row['duration'] = stripslashes($row['duration']);
		//print_r($row);
		//print_r($media);

		return $row;
	}

	function getProperty($videoID, $property)
	{
		// TODO: check that property exists
		$query = "SELECT * FROM media WHERE video_id like '$videoID'";
		$result = mysql_query($query, $this->link);
		if (!$result)
			die('Invalid query ( getMediaData() ) ' . mysql_error());

		$row = mysql_fetch_assoc($result);
		return stripslashes($row[$property]);

	}

	function getVideosOwnedBy($ownerID)
	{
		$videos = null;

		// get all the videos you own
		$query = "SELECT * FROM media WHERE uploaded_by_user_id = $ownerID ORDER BY creation_date";

		//print "query: $query<br />";
		$result = mysql_query($query, $this->link);
		if (!$result) {
			print('Invalid query ( getVideosOwnedBy() ) ' . mysql_error() . '<br/>');
		} else {
			while ($row = mysql_fetch_assoc($result)) {
				$row['description'] = stripslashes($row['description']);
				$row['title'] = stripslashes($row['title']);
				$row['thumbnail_url'] = stripslashes($row['thumbnail_url']);
				$row['duration'] = stripslashes($row['duration']);
				$ID = $row['video_id'];
				$videos[$ID] = $row;
				//print_r($row);
			}
			//print_r($media);
		}

		// get all videoIDs that are in the videoOwners table for given 'ownerID'
		// then query media for given videoIDs
		$query = "SELECT * FROM videoOwners WHERE user_id=$ownerID";
		//print "query:$query";
		$result = mysql_query($query, $this->link);
		if (!$result) {
			print('Invalid query ( getVideosOwnedBy() ) ' . mysql_error() . '<br/>');
		} else {
			while ($row = mysql_fetch_assoc($result)) {
				$videoIDs[] = $row['video_id'];
			}
			//print_r($videoIDs);

			if (!empty($videoIDs)) {
				foreach ($videoIDs as $videoID) {
					$query = "SELECT * FROM media WHERE video_id like '$videoID'";
					//print "query:$query";
					$result = mysql_query($query, $this->link);
					$row = mysql_fetch_assoc($result);
					//print_r($row);
					$row['description'] = stripslashes($row['description']);
					$row['title'] = stripslashes($row['title']);
					$row['thumbnail_url'] = stripslashes($row['thumbnail_url']);
					$row['duration'] = stripslashes($row['duration']);
					$ID = $row['video_id'];
					$videos[$ID] = $row;
				}
			}
		}

		return $videos;
	}

	function getMediaByUserID($userID)
	{
		//print "getAnnotations() videoID:$videoID\n";
		$authorizedVideos = $this->getAuthorizedVideosByUserID($userID);
		//print_r($authorizedVideos);

		$query = "SELECT * FROM media WHERE uploaded_by_user_id = $userID";
		if (!is_null($authorizedVideos)) {
			$authorizedVideos = implode(",", $authorizedVideos);
			$query .= " OR video_id IN ($authorizedVideos)";
		}
		$query .= " ORDER BY creation_date";
		//print "query: $query<br />";

		$result = mysql_query($query, $this->link);
		if (!$result)
			die('Invalid query ( getMediaByUserID() ) ' . mysql_error());

		$media = null;
		while ($row = mysql_fetch_assoc($result)) {
			$row['description'] = stripslashes($row['description']);
			$row['title'] = stripslashes($row['title']);
			$row['thumbnail_url'] = stripslashes($row['thumbnail_url']);
			$row['duration'] = stripslashes($row['duration']);
			$row['class_id'] = $this->getClassIDByVideoID($row['video_id']);
			$ID = $row['video_id'];
			$media[$ID] = $row;
			//print_r($row);
		}

		//print_r($media);
		return $media;
	}


	function getVideoStatus($videoID)
	{
		$query = "SELECT upload_complete, conversion_complete FROM media WHERE video_id like '$videoID'";

		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getMediaURL() ) ' . mysql_error());
		$row = mysql_fetch_assoc($result);
		$status = array('upload_complete' => $row['upload_complete'], 'conversion_complete' => $row['conversion_complete']);

		//print_r($media);
		return $status;
	}


	function getFlavors($videoID)
	{
		$query = "SELECT * FROM flavors WHERE video_id like '$videoID'";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getMediaURL() ) ' . mysql_error());

		while ($row = mysql_fetch_assoc($result)) {
			$fileExt = $row['file_ext'];
			if ("3gp" != $fileExt) {
				$flavors[$fileExt] = $row['flavor_id'];
			}
			//print_r($row);
		}

		//print_r($media);
		return $flavors;
	}

	function countMedia()
	{
		$result = mysql_query("SELECT * FROM media", $this->link);
		$numRows = mysql_num_rows($result);

		return $numRows;
	}

	function close()
	{
		// print 'connected successfully';
		// mysql_close($this->link);
	}

	function getAllVideoIDs()
	{
		$query = "SELECT video_id FROM media";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query (getAllVideoIDs): ' . mysql_error());

		$videoIDs = null;
		while ($row = mysql_fetch_assoc($result)) {
			$videoIDs[] = $row['video_id'];
		}

		return $videoIDs;
	}
}
?>