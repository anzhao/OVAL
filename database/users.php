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
include_once(dirname(__FILE__) . '/../includes/auth.inc.php');
include_once(dirname(__FILE__) . '/media.php');

require_once("/var/www/config/clas/$configFolderName/db_config.php");

//error_reporting(E_ALL);

class users
{
	private $link;

	function users()
	{
		global $mysqlUser, $mysqlPassword, $database;

		$this->link = mysql_connect('localhost', $mysqlUser, $mysqlPassword);
		if (!$this->link)
			die('could not connect: ' . mysql_error());

		mysql_select_db($database) or die(mysql_error());
	}

	function getAllUsers()
	{
		// print "getAnnotations() videoID:$videoID\n";
		$query = "SELECT * FROM users";
		$result = mysql_query($query, $this->link);
		// print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getAuthorizedViewers() ) ' . mysql_error());

		$users = null;
		while ($row = mysql_fetch_assoc($result)) {
			$users[] = $row;
			// print_r($row);
		}

		// print_r($userIDs);
		// print_r($users);
		return $users;
	}

	function getByID($ID)
	{
		// print "ID:$ID<br />";
		$hashUserID = hashUserID($ID);

		$query = "SELECT id FROM users WHERE hash_user_id LIKE '$hashUserID'";
		#$query = "SELECT id FROM users WHERE first_name LIKE 'shane'";
		// print "query:$query<br />";
		$result = mysql_query($query, $this->link);
		// echo mysql_errno($dbConn) . ": " . mysql_error($dbConn) . "<br />";
		if (false == $result)
			die("query failed");

		if (1 == mysql_num_rows($result)) {
			$userID = mysql_result($result, 0);
		} else {
			$userID = null;
		}

		return $userID;
	}

	function getByGN($givenName, $sn)
	{



		$query = "SELECT id FROM users WHERE first_name LIKE '$givenName' AND last_name LIKE '$sn'";
		// print "query:$query<br />";
		$result = mysql_query($query, $this->link);
		// echo mysql_errno($dbConn) . ": " . mysql_error($dbConn) . "<br />";
		if (false == $result)
			die("query failed");

		if (1 == mysql_num_rows($result)) {
			$userID = mysql_result($result, 0);
		} else {
			$userID = null;
		}

		return $userID;


	}



	function getByMail($mail)
	{
		$query = "SELECT id FROM users WHERE mail = '$mail'";
		$result = mysql_query($query, $this->link);
		if (false == $result)
			die("query failed");

		if (1 == mysql_num_rows($result)) {
			$userID = mysql_result($result, 0);
		} else {
			$userID = null;
		}

		return $userID;

	}








	function getUserInfo($users)
	{
		$users = "(" . implode(",", $users) . ")";
		// print_r($users);
		$query = "SELECT * FROM users WHERE id IN $users";
		$result = mysql_query($query, $this->link);
		// print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getAuthorizedViewers() ) ' . mysql_error());

		$users = null;
		while ($row = mysql_fetch_assoc($result)) {
			$users[] = $row;
			// print_r($row);
		}

		// print_r($userIDs);
		// print_r($users);
		return $users;
	}

	function getUI($userID)
	{
		$query = "SELECT * FROM userInterfaceConfigs WHERE user_id='$userID'";
		$result = mysql_query($query, $this->link);
		// print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getUI() ) ' . mysql_error());

		$row = mysql_fetch_assoc($result);

		$config = null;

		if (false == $row) {
			// no results, set params to default values
			$config['annotation_mode'] = "annotation";
			$config['annotations_enabled'] = "yes";
			$config['trendline_visility'] = "by-default";
			$config['n'] = 0;
		} else {
			$config['annotation_mode'] = $row['annotation_mode'];
			$config['annotations_enabled'] = $row['annotations_enabled'];
			$config['trendline_visibility'] = $row['trendline_visibility'];
			$config['n'] = $row['n'];
		}
		// print_r($config);
		return $config;
	}

	function setName($firstName, $lastName, $userID)
	{
		// name data comes from CWL/SHIB, but santize anyways
		$lastName = mysql_real_escape_string($lastName);
		$firstName = mysql_real_escape_string($firstName);

		$query = <<<EOT
UPDATE users SET first_name='$firstName', last_name='$lastName' WHERE id=$userID
EOT;
		// print "query:$query";

		$result = mysql_query($query, $this->link);
	}

	function setUI($userID, $annotationMode, $annotationsEnabled, $trendlineVisibility, $N = 0)
	{
		$query = "SELECT * FROM userInterfaceConfigs WHERE user_id=$userID";
		$result = mysql_query($query, $this->link);

		// if user configuration does not exist create one
		if (0 == mysql_num_rows($result)) {
			$query = "INSERT INTO userInterfaceConfigs VALUES ($userID, '$annotationMode', '$annotationsEnabled', '$trendlineVisibility', $N)";
		} else {
			// otherwise update existing config
			$query = "UPDATE userInterfaceConfigs SET annotation_mode='$annotationMode', annotations_enabled='$annotationsEnabled', trendline_visibility='$trendlineVisibility', n=$N WHERE user_id=$userID";
		}
		$result = mysql_query($query, $this->link);

		// print "query: $query<br />";
		if (!$result)
			die('Invalid query ( setUI() ) ' . mysql_error());
	}

	function trendlineVisible($userID, $videoID)
	{
		// print "trendlineVisible($userID, $videoID)<br />";
		$allowAccess = false;

		// $users = new users();
		$uiConfig = $this->getUI($userID);
		// $users->close();
		// print_r($uiConfig);

		$trendlineVisibility = $uiConfig['trendline_visibility'];
		$n = $uiConfig['n'];

		$media = new media();
		$stats = $media->getViewerStatistics($userID, $videoID);
		$media->close();

		switch ($trendlineVisibility) {
			case BY_DEFAULT:
				$allowAccess = true;
				break;
			case AFTER_N_DAYS:
				// check timestamp
				$firstViewTime = strtotime($stats['first_view']);
				$currentTime = time();
				$nDays = $n * (60 * 60 * 24);
				if ($currentTime <= $firstViewTime + $nDays)
					$allowAccess = true;
				sendEmail("stats: {$stats['first_view']}\nif ($currentTime <= $firstViewTime + $nDays)", "trendlineVis");
				break;
			case AFTER_N_VIEWS:
				// check number of views
				if ($stats['total_views'] >= $n)
					$allowAccess = true;
				sendEmail("({$stats['total_views']} >= $n)", "trendlineVis");
				break;
		}

		return $allowAccess;
	}

	function getGroupsByOwner($ownerID)
	{
		//TODO: format query like this
		$query = "SELECT * FROM groups, groupOwners WHERE groups.id=groupOwners.group_id AND user_id=$ownerID";
		$result = mysql_query($query, $this->link);
		// print "query: $query<br />";
		if (!$result)
			die('Invalid query (getGroupsByOwner): ' . mysql_error());

		$groups = array();

		while ($row = mysql_fetch_assoc($result)) {
			$groupID = $row['group_id'];
			$name = $row['name'];
			$groups[$groupID] = $name;
		}
		// print_r($userIDs);

		return $groups;

	}

	function getMyGroups($ID, $classID = NULL)
	{
		$query = "SELECT * FROM groupMembers WHERE user_id=$ID UNION SELECT * FROM groupOwners WHERE user_id=$ID";

		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query (getMyGroups): ' . mysql_error());

		while ($row = mysql_fetch_assoc($result))
			$groupIDs[] = $row['group_id'];

		$query = "SELECT * FROM groups WHERE id IN (" . implode(",", $groupIDs) . ")";
		if (!is_null($classID)) {
			$query .= " AND class_id=$classID";
		}
		//print "query: $query";
		$result = mysql_query($query, $this->link);

		while ($row = mysql_fetch_assoc($result)) {
			$groupID = $row['id'];
			$name = $row['name'];

			$groups[$groupID] = $name;
		}

		return $groups;
	}

	function getGroupsByClassAndOwner($classID, $ownerID)
	{
		$query = "SELECT * FROM groups, groupOwners WHERE groups.id=groupOwners.group_id AND user_id=$ownerID AND class_id=$classID";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query (getGroupsByClassAndOwner): ' . mysql_error());

		$groups = array();

		while ($row = mysql_fetch_assoc($result)) {
			$groupID = $row['group_id'];
			$name = $row['name'];

			$groups[$groupID] = $name;
		}
		// print_r($userIDs);

		return $groups;
	}

	function getGroupsByClassID($classID)
	{
		$query = "SELECT * FROM groups WHERE class_id=$classID";
		$result = mysql_query($query, $this->link);
		// print "query: $query<br />";
		if (!$result)
			die('Invalid query (getGroupsByClassID): ' . mysql_error());

		$groups = array();

		while ($row = mysql_fetch_assoc($result)) {
			$groupID = $row['id'];
			$name = $row['name'];

			$groups[$groupID] = $name;
		}
		// print_r($userIDs);

		return $groups;
	}

	// Precondition: userIDs can be null (will be ignored), ownerID and classID cannot be null
	// name also must be null because that's the course name that is used as a primary key in the table
	function createGroup($name, $userIDs, $ownerID, $classID)
	{
		$name = stripHTML(mysql_real_escape_string($name));

		$query = "INSERT INTO groups VALUES (NULL, '$name', $classID)";

		// print "query1: $query<br />";
		mysql_query("LOCK TABLES groups WRITE");
		$result = mysql_query($query, $this->link);
		if (!$result)
			die('Invalid query (createGroup): ' . mysql_error());
		// get 'id' of newly created group
		$groupID = mysql_insert_id();
		mysql_query("UNLOCK TABLES");

		$groupOwners = $this->getClassInstructorsAndTAs($groupID);

		// get TAs associated with section group belongs to
		// print_r($groupOwners);
		foreach ($groupOwners as $owner) {
			$query = "INSERT INTO groupOwners VALUES ($groupID, $owner)";
			$result = mysql_query($query, $this->link);

			//print "query2: $query<br />";
			if (!$result)
				die('Invalid query (createGroup): ' . mysql_error());
		}

		if (!is_null($userIDs)) {
			foreach ($userIDs as $userID) {
				$query = "INSERT INTO groupMembers VALUES ($groupID, $userID)";
				$result = mysql_query($query, $this->link);
				//print "query3: $query<br />";
				if (!$result)
					die('Invalid query (createUserGroup): ' . mysql_error());
			}
		}

		return $groupID;
	}

	function addMembersToGroup($ID, $userIDs)
	{
		//print "userIDs<br />";
		//print_r($userIDs);

		if (count($userIDs) > 0) {
			foreach ($userIDs as $userID) {
				$query = "INSERT INTO groupMembers VALUES ($ID, $userID)";
				$result = mysql_query($query, $this->link);
				//print "query: $query<br />";
				if (!$result)
					die('Invalid query (addMembersToGroup): ' . mysql_error());
			}
		}
	}

	function removeAllGroupMembers($ID)
	{
		//print "function removeAllGroupMembers($ID)";
		$query = "DELETE FROM groupMembers WHERE group_id=$ID";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";

		if (!$result)
			die('Invalid query (removeAllGroupMembers($ID)): ' . mysql_error());
	}

	function userOwnsGroup($groupID, $userID)
	{
		$query = "SELECT user_id FROM groupOwners WHERE user_id=$userID AND group_id=$groupID";
		$result = mysql_query($query, $this->link);
		// print $query . " results num rows: " . mysql_num_rows($result) . " ";
		// if no rows returned then user does not have access
		if (0 == mysql_num_rows($result)) {
			return false;
		} else {
			return true;
		}
	}

	function updateGroup($ID, $userIDs)
	{
		// print_r($userIDs);
		$this->removeAllGroupMembers($ID);
		$this->addMembersToGroup($ID, $userIDs);
	}

	function deleteGroup($ID)
	{
		// this query cascades deleting members of groupMembers and groupOwners
		$query = "DELETE FROM groups WHERE id=$ID";
		$result = mysql_query($query, $this->link);

		if (!$result)
			die('Invalid query (deleteGroup): ' . mysql_error());
		return $result;
	}

	function getGroupMembers($groupID)
	{
		//print "getAnnotations() videoID:$videoID\n";
		$query = "SELECT u.id FROM groupMembers gM, users u WHERE (gM.user_id = u.id) AND gM.group_id=$groupID";
		$result = mysql_query($query, $this->link);

		//print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getGroupMembers() ) ' . mysql_error());


		while ($row = mysql_fetch_assoc($result)) {
			// $groupMembers[] = array('Username'=>$row['Username'], 'User_ID'=>$row['User_ID'], 'Email'=>$row['Email']);
			$groupMembers[] = $row['id'];
			// print_r($row);
		}

		//print_r($groupMembers);
		return $groupMembers;
	}

	function getClassInstructorsAndTAs($groupID)
	{
		$query = "SELECT class_id FROM groups WHERE id=$groupID";
		// print "query: $query<br />";
		$result = mysql_query($query, $this->link);
		if (!$result)
			die('Invalid query ( getClassesInstructorsAndTAs() ) ' . mysql_error());

		$row = mysql_fetch_assoc($result);
		// print_r($row);
		$classID = $row['class_id'];
		// print "classID:$classID<br />";
		$query = "SELECT user_id FROM classInstructorsAndTAs WHERE class_id=$classID";
		$result = mysql_query($query, $this->link);
		// print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getClassesInstructorsAndTAs() ) ' . mysql_error());

		while ($row = mysql_fetch_assoc($result)) {
			$userIDs[] = $row['user_id'];
			//print_r($row);
		}

		return $userIDs;
	}

	function getClassesUserBelongsTo($userID)
	{
		$query = "SELECT DISTINCT(c.id), c.name FROM classEnrollmentLists cEL LEFT JOIN class c ON cEL.class_id=c.id WHERE cEL.user_id=$userID";
		//$query = "SELECT DISTINCT(class_id), name FROM class c, classEnrollmentLists cEL WHERE cEL.user_id=$userID";
		// join this with classInstructorsAndTAs
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getClassesUserBelongsTo() ) ' . mysql_error());

		while ($row = mysql_fetch_assoc($result)) {
			$classList[] = array("ID" => $row['id'], "name" => $row['name']);
			//$classList[] = array("ID"=>$row['id'], "name"=>$row['name']);
			//print_r($row);
		}

		// get all class IDs for given user
		// left join

		//$query = "SELECT DISTINCT(c.id), c.name FROM classInstructorsAndTAs cITA LEFT JOIN class c ON cITA.class_id=c.id WHERE cITA.user_id=$userID";


		//$query = "SELECT class_id FROM classInstructorsAndTAs WHERE user_id=$userID";
		// join this with classInstructorsAndTAs
		//$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		//if (!$result) die('Invalid query ( getClassesUserBelongsTo() ) ' . mysql_error());
		//while ($row = mysql_fetch_assoc($result)) {
		//	$classList[] = array("ID"=>$row['id'], "name"=>$row['name']);
		//print_r($row);
		//}

		//print_r($classList);
		return $classList;
	}

	function getClassIDs()
	{
		//print "getAnnotations() videoID:$videoID\n";
		$query = "SELECT * FROM class";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getClassIDs() ) ' . mysql_error());

		while ($row = mysql_fetch_assoc($result)) {
			$classIDs[] = $row['id'];
			//print_r($row);
		}
		//print_r($groupMembers);
		return $classIDs;
	}

	function getClassName($classID)
	{
		//print "getAnnotations() videoID:$videoID\n";
		$query = "SELECT * FROM class WHERE id=$classID";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getClassName() ) ' . mysql_error());

		$row = mysql_fetch_assoc($result);
		$name = $row['name'];
		//print_r($row);
		//print_r($groupMembers);

		return $name;
	}

	function isInstructorOrTA($userID)
	{
		$query = "SELECT * FROM classInstructorsAndTAs WHERE user_id=$userID";

		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query ( isClassInstructorOrTA() ) ' . mysql_error());
		$numRows = mysql_num_rows($result);

		// if user instructs or TAs any courses then that is his/her role
		// currently user<->role is a one-to-one relation
		if ($numRows > 0) {
			return true;
		} else {
			return false;
		}
	}

	function getClassList($classID, $studentsOnly = true)
	{
		//print "getAnnotations() videoID:$videoID\n";

		if (!$studentsOnly) {
			$query = "SELECT DISTINCT(cITA.user_id), u.first_name, u.last_name, is_instructor FROM classInstructorsAndTAs cITA, users u WHERE cITA.user_id=u.id AND cITA.class_id=$classID";
			//$query = "SELECT * FROM classInstructorsAndTAs WHERE class_id=$classID";
			// join this with classInstructorsAndTAs
			$result = mysql_query($query, $this->link);
			//print "query: $query<br />";
			if (!$result)
				die('Invalid query ( getClassList() ) ' . mysql_error());

			while ($row = mysql_fetch_assoc($result)) {
				$name = $row['first_name'] . " " . $row['last_name'];
				$isInstructor = $row['is_instructor'];

				if ($isInstructor) {
					$classList[] = array("ID" => $row['user_id'], "name" => $name, "is_instructor" => true);
				} else {
					$classList[] = array("ID" => $row['user_id'], "name" => $name, "is_ta" => true);

				}
				//print_r($row);
			}
		}

		$query = "SELECT DISTINCT(cEL.user_id), u.first_name, u.last_name FROM classEnrollmentLists cEL, users u WHERE cEL.user_id=u.id AND cEL.class_id=$classID";

		// join this with classInstructorsAndTAs
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query ( getClassList() ) ' . mysql_error());

		while ($row = mysql_fetch_assoc($result)) {
			$name = $row['first_name'] . " " . $row['last_name'];
			//            $groupMembers[] = array('Username'=>$row['Username'], 'User_ID'=>$row['User_ID'], 'Email'=>$row['Email']);
			$classList[] = array("ID" => $row['user_id'], "name" => $name, "is_student" => true);
			//print_r($row);
		}

		//print_r($classList);
		return $classList;
	}

	function setClassOwner($classID, $userID, $isInstructor)
	{
		//$isInstructor = intval($isInstructor);
		$query = "INSERT IGNORE INTO classInstructorsAndTAs VALUES ($classID, $userID, $isInstructor)";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query ( setClassOwner() ) ' . mysql_error());
	}

	function deleteClassOwner($userID, $classID)
	{
		$query = "DELETE FROM classInstructorsAndTAs WHERE user_id=$userID AND class_id=$classID";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query ( setClassOwner() ) ' . mysql_error());
	}

	function recordEvent()
	{
		if (event . data == YT . PlayerState . PLAYING) {

			$query = "INSERT INTO videos VALUES ('28', 'test', 'test', 'test')";
			$result = mysql_query($query, $this->link);
			if (!$result)
				die('Invalid query (recordEvent): ' . mysql_error());

		} else {

			$query = "INSERT INTO videos VALUES ('29', 'test1', 'test1', 'test1')";
			$result = mysql_query($query, $this->link);
			if (!$result)
				die('Invalid query (recordEvent): ' . mysql_error());


		}
	}


	function recordLogin($userID)
	{
		//        $currentTime = date("Y-m-d H:i:s");
		$query = "INSERT INTO loginSessions VALUES (NULL, $userID, NULL, NULL, NULL)";
		$result = mysql_query($query, $this->link);
		//print "query: $query<br />";
		if (!$result)
			die('Invalid query (recordLogin): ' . mysql_error());
	}

	function recordLogout($userID)
	{
		// get current login (lastest row) for given userID
		$query = "SELECT MAX(id) AS id, logout_time FROM loginSessions WHERE user_id=$userID";
		//print "query: $query<br />";
		$result = mysql_query($query, $this->link);
		if (!$result)
			die('Invalid query (recordLogout): ' . mysql_error());
		$row = mysql_fetch_assoc($result);
		$ID = $row['id'];

		// check that this row has not already been updated (this should not occur but check anyways)
		//if (! is_null($row['logout_time'])) print "ERROR: userID:$userID (row id:$ID) has already logged out.";

		$currentTime = date('Y-m-d H:i:s'); // $dateTime->format('Y-m-d H:i:s');
		//print "date: $currentTime<br />";
		$query = "UPDATE loginSessions SET logout_time='" . $currentTime . "' WHERE id=$ID AND user_id=$userID";
		//print "query: $query<br />";
		$result = mysql_query($query, $this->link);
		//exit();
		if (!$result)
			die('Invalid query (recordLogout): ' . mysql_error());
	}

	function close()
	{
		//print 'closing connection';
		//        mysql_close($this->link);
	}

}

/*
$annotationMode = array(
"flag",
"annotation"
);
$trendlineVisSettings = array(
"by-default",
"after-n-views",
"after-n-days"
);
// test driver
$userIDs = array(1, 2, 3, 5, 6, 7, 8, 10, 22, 42, 45);
$users = new users();
$users->truncateTable();
foreach($userIDs as $userID) {
$users->setUI($userID, $trendlineVisSettings[rand(0,2)], $annotationMode[rand(0,1)]);
}
foreach($userIDs as $userID) {
$userUISettings[] = $users->getUI($userID, array_rand($trendlineVisSettings), array_rand($annotationMode));
}
print_r($userUISettings);
$users->close();
*/


/*
print "<h3>test driver</h3>";
$users      = new users();
$classIDs   = $users->getClassIDs();
print "classIDs: (";
foreach ($classIDs as $classID) {
print "$classID, ";
//    $users->setClassOwner($classID, 1, 0);
}
//print ")<br /><br />classList:<br />";
foreach ($classIDs as $classID) {
//print_r($users->getClassList($classID));
print "<br />";
}
print_r($users->getClassesUserBelongsTo(4));
*/
?>