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


// tdang 2013
// An ZHAO 2014
// OVAL SYSTEM ADMINISTRATION TOOL (for tech-adept admin users only, 
// should be hidden from instructors and students)

$OVAL_ADM_TOOL_LAST_UPDATE = "Sept 07, 2013";

include_once(dirname(__FILE__) . "/includes/global_deploy_config.php");
include_once(dirname(__FILE__) . "/includes/common.inc.php");
include_once(dirname(__FILE__) . "/includes/auth.inc.php");
include_once(dirname(__FILE__) . "/database/users.php");

include_once("/var/www/config/clas/$configFolderName/db_config.php");

// TODO: refactor this authentication! It's quite ugly now.
$Jenny_hashed_id = "";
$Thomas_hashed_id = "";
$Joanna_hashed_id = "";
$Sharon_hashed_id = "";

// Extra students' hashed Id's
$yteststudent_hashed_id = "";

// Guess ID test - Using both the user name and the ID to hash is guaranteed to give uniqueness
$iteststu_guest_id = "";
$bteststu_basic_id = "";

// DEPLOY CONFIG: Who has access to the sysadmin tool
$hashedCurrentUser = getCurrentHashedUId();

if ($DEPLOYMENT_NAME == "prod") {
	if (
		$hashedCurrentUser != $Jenny_hashed_id &&
		$hashedCurrentUser != $Thomas_hashed_id
	) {
		notAuthorized();
	}
} else if ($DEPLOYMENT_NAME == "dev") {
	if (
		$hashedCurrentUser != $Thomas_hashed_id
	) {
		notAuthorized();
	}
} else if ($DEPLOYMENT_NAME == "demo") {
	if (
		$hashedCurrentUser != $Jenny_hashed_id &&
		$hashedCurrentUser != $Thomas_hashed_id
	) {
		//	notAuthorized();	
	}
} else if ($DEPLOYMENT_NAME == "medclas") {
	if (
		/* $hashedCurrentUser != $Joanna_hashed_id && */
		$hashedCurrentUser != $Jenny_hashed_id &&
		$hashedCurrentUser != $Thomas_hashed_id
	) {
		notAuthorized();
	}
} else if ($DEPLOYMENT_NAME == "educ") {
	if (
		$hashedCurrentUser != $Jenny_hashed_id &&
		$hashedCurrentUser != $Thomas_hashed_id &&
		$hashedCurrentUser != $Sharon_hashed_id
	) {
		notAuthorized();
	}
}

// Choose the theme color for the interface so that it's harder to confuse between instances
$themeColor = "#FFFFFF";
if ($DEPLOYMENT_NAME == "prod") {
	$themeColor = "rgb(50,50,50)";
} else if ($DEPLOYMENT_NAME == "dev") {
	$themeColor = "rgb(218,226,233)";
} else if ($DEPLOYMENT_NAME == "demo") {
	$themeColor = "rgb(255,226,233)";
} else if ($DEPLOYMENT_NAME == "medclas") {
	$themeColor = "rgb(150,150,255)";
} else if ($DEPLOYMENT_NAME == "educ") {
	$themeColor = "rgb(218,255,233)";
}

// SIS access is limited by departments to the course codes relevant to them only
$allowedCourseCode = array("EVERY");
if ($DEPLOYMENT_NAME == "prod") {
	$allowedCourseCode = array("EVERY");
} else if ($DEPLOYMENT_NAME == "dev") {
	$allowedCourseCode = array("EVERY");
} else if ($DEPLOYMENT_NAME == "demo") {
	$allowedCourseCode = array("EVERY");
} else if ($DEPLOYMENT_NAME == "medclas") {
	$allowedCourseCode = array("EVERY"); // limit access of tool to Arts LC only until has course list
} else if ($DEPLOYMENT_NAME == "educ") {
	$allowedCourseCode = array(
		"ADHE",
		"CCFI",
		"CNPS",
		"ECED",
		"EDCP",
		"EDST",
		"EDUC",
		"EPSE",
		"ETEC",
		"KIN",
		"LIBE",
		"LLED"
	);
}

// Default CSV/NSV text area content, contains instructions
$DEFAULT_TEXTAREA_CONTENT = "Paste student list from spreadsheet or Connect (which is normally comma or newline separated) here.";
$DEFAULT_TEXTAREA_CONTENT_DROP_NOTE = "\n\nNote: only for Drop, put \"EVERYONE\" or \"everyone\" to drop the whole class and resets all groups.";

// connect to db
$dbConnection = mysql_connect('localhost', $mysqlUser, $mysqlPassword);
if (!$dbConnection)
	die('could not connect: ' . mysql_error());
mysql_select_db($database) or die(mysql_error());

$classes = getCourses($dbConnection);
$className = "uninitialized";
$classID = "uninitialized";
$session = "uninitialized";
$department = "uninitialized";
$courseNo = "uninitialized";
$sectionNo = "uninitialized";
$season = "uninitialized";
$command = "uninitialized";
$commandState = "uninitialized";

class CommandStates
{
	const Preview = 0;
	const Execute = 1;
	const PreviewThenExecute = 2;
	const Error = 3;
}

class Commands
{
	// Imports replace the class list entirely with the new list
	const ImportFromSIS = 0; // DONE!
	const ImportFromCSV = 1; // DONE!

	// Add and drop are exactly what it says, adding and dropping users, skip if already enrolled
	const AddFromCSV = 2; // DONE!
	const DropFromCSV = 3; // DONE! 

	// Check enroll
	const CheckEnroll = 4; // NO NEED FOR NOW

	// Create Course merely creates a course shell, you must now run
	// import from SIS or import from CSV later to fill
	const CreateCourse = 5; // DONE!
	const RemoveCourse = 6; // DONE!

	const CleanAnnotations = 7; // DONE!
	const UnassignVideos = 8;
	const CheckLogin = 9; // NO NEED FOR NOW
	const CheckVideoQuota = 10; // NO NEED FOR NOW
	const ArchiveOldCourse = 11; // DONE
}

if (array_key_exists("bulkImportEnrollment", $_POST)) {
	if ($_POST['import_source'] == "sis") {
		handleImportFromSIS();
	} else if ($_POST['import_source'] == "csv") {
		handleImportFromCSVorNSV();
	}
} else if (array_key_exists("importFromCSV", $_POST)) {
	handleImportFromCSVorNSV();
} else if (array_key_exists("addFromCSV", $_POST)) {
	handleAddFromCSV();
} else if (array_key_exists("dropFromCSV", $_POST)) {
	handleDropFromCSV();
} else if (array_key_exists("checkEnroll", $_POST)) {
	handleCheckEnroll();
} else if (array_key_exists("createCourse", $_POST)) {
	handleCreateCourse();
} else if (array_key_exists("removeCourse", $_POST)) {
	handleRemoveCourse();
} else if (array_key_exists("cleanAnnotations", $_POST)) {
	handleCleanAnnotations();
} else if (array_key_exists("archiveOldCourse", $_POST)) {
	handleArchiveOldCourse();
} else {
	// shows the starting UI;
}

function populateCourseInfoFromPOST()
{
	global $classID, $className, $classes, $department, $courseNo, $sectionNo, $command, $commandState;
	global $session, $season;

	// Search for the className, and then figure out department, courseNo, and sectionNo from that
	if (array_key_exists('class', $_POST)) {
		$classID = $_POST['class'];

		// search for the ID of selected class, then get the name
		foreach ($classes as $ID => $name) {
			if ($ID == $classID)
				$className = $name;
		}

		// ARTH100_001_2013W
		// dept code is fixed to 4 chars
		$department = substr($className, 0, 4);
		$firstUnderscorePos = strpos($className, "_");

		// fetch up to '_'
		$courseNo = substr($className, 4, $firstUnderscorePos - 4);
		$secondUnderscorePos = strpos($className, "_", $firstUnderscorePos + 1);

		if ($secondUnderscorePos) {
			$sectionNo = substr($className, $firstUnderscorePos + 1, $secondUnderscorePos - ($firstUnderscorePos + 1));

			$sessionAndSeason = substr($className, $secondUnderscorePos + 1);
			$sessionInName = substr($sessionAndSeason, 0, 4);
			$seasonInName = substr($sessionAndSeason, 4);

			if ($sessionInName != $session || $seasonInName != $season) {
				if ($command == Commands::ImportFromSIS) {
					print("<br/><span style=\"color:blue;font-weight:bold\">
					WARNING! The Year or Season in the course name is different from the Year or Season of the command<br/>
					Is this intentional? Please doublecheck before proceeding.<br/>
					</span>
					<br/>");
				}
			}
		} else {
			$sectionNo = substr($className, $firstUnderscorePos + 1);
		}
	}

	// Override deparment, courseNo, and sectionNo if these are explicitly defined in the form submit
	if (array_key_exists('department', $_POST)) {
		$department = $_POST['department'];
	}

	if (array_key_exists('courseNo', $_POST)) {
		$courseNo = $_POST['courseNo'];
	}

	if (array_key_exists('sectionNo', $_POST)) {
		$sectionNo = $_POST['sectionNo'];
	}

	if ($className == "uninitialized") {
		$className = getCourseName($department, $courseNo, $sectionNo);
	}
}

// Take a textArea with comma or newline separated values, returning an array
function UTIL_textArea2Array($textAreaContent, $stripSpaces = true, $encryptionSafeParse = false)
{

	if ($encryptionSafeParse) {
		$stripSpaces = false;
	}

	// trim it or strip it
	if (!$stripSpaces) {
		$textAreaContent = trim($textAreaContent);
	} else {
		$textAreaContent = str_replace(' ', '', $textAreaContent);
	}

	// determine (in a semi-flexible way) whether to parse by newlines or by comma
	$newlinesCount = substr_count($textAreaContent, "\n");
	$commasCount = substr_count($textAreaContent, ",");

	if ($newlinesCount > $commasCount) {
		$csvArray = explode("\n", $textAreaContent);
	} else {
		$csvArray = explode(",", $textAreaContent);
	}

	// clean up the individual strings in this array
	$csvArrayCleaned = array();
	if (!empty($csvArray)) {
		$csvListCount = count($csvArray);
		for ($i = 0; $i < $csvListCount; $i++) {
			$csvArray[$i] = trim($csvArray[$i]);

			if (!$encryptionSafeParse) {
				$csvArray[$i] = trim($csvArray[$i], "\"\'");
			}

			if (!is_null($csvArray[$i]) && strlen($csvArray[$i]) > 0) {
				$csvArrayCleaned[] = $csvArray[$i];
			}
		}
	}

	return $csvArrayCleaned;
}

function handleImportFromCSVorNSV()
{
	global $classID, $className, $classes, $configFolderName, $dbConnection;
	global $session, $department, $courseNo, $sectionNo, $season, $yteststudent_hashed_id;
	global $command, $commandState;
	global $DEFAULT_TEXTAREA_CONTENT;

	// get the command itself
	$command = Commands::ImportFromCSV;

	// get the state of the command
	if (array_key_exists("execute", $_POST)) {
		$commandState = CommandStates::Execute;
	} else if (array_key_exists("previewThenExecute", $_POST)) {
		$commandState = CommandStates::PreviewThenExecute;
	} else {
		$commandState = CommandStates::Preview;
	}

	printOutputPageHeading($commandState);

	$fatalError = false;
	// session and season must be present for all update commands, complain bitterly if they aren't there.
	if (array_key_exists('session', $_POST) && array_key_exists('season', $_POST)) {

		$session = $_POST['session'];
		$season = $_POST['season'];

		populateCourseInfoFromPOST();

		printCourseInfo(
			$commandState,
			$className,
			$configFolderName,
			$session,
			$department,
			$courseNo,
			$sectionNo,
			$season
		);

		if (array_key_exists('csvStudentList', $_POST)) {
			$csvStudentList = $_POST['csvStudentList'];
		} else if (array_key_exists('import_source_csv_textarea', $_POST)) {
			$csvStudentList = $_POST['import_source_csv_textarea'];
		} else {
			print("<br/><span style=\"color:red;font-weight:bold\">
				FATAL ERROR! hidden or textarea CSV input missing. You have found a bug.<br/>
				Please email thomas.dang@ubc.ca with as much info as possible of the context when this error appears.<br/>
				</span>
				<br/>");
			$fatalError = true;
		}

		if (trim($csvStudentList) == trim($DEFAULT_TEXTAREA_CONTENT)) {
			$csvStudentList = "";
		}

		if (!$fatalError) {

			$csvStudentListArray = UTIL_textArea2Array($csvStudentList);

			// clean up the individual strings in this array
			if (!empty($csvStudentListArray)) {

				// Hand over to the next stage of the import!
				updateClassEnrollment($classID, $dbConnection, $command, $commandState, $csvStudentListArray);

			} else {
				print("<br/><span style=\"color:red;font-weight:bold\">
					FATAL ERROR! The student list being imported has no students.<br/>
					</span>
					<br/>");
			}
		}

	} else {
		print("<br/><span style=\"color:red;font-weight:bold\">
				FATAL ERROR! SessionYear or Season input missing. You have found a bug.<br/>
				Please email thomas.dang@ubc.ca with as much info as possible of the context when this error appears.<br/> 
				</span>
				<br/>");
	}

	printOutputPageFooting($commandState, $className);
}

function handleArchiveOldCourse()
{
	global $classID, $className, $classes, $configFolderName, $dbConnection;
	global $session, $department, $courseNo, $sectionNo, $season;
	global $yteststudent_hashed_id, $iteststu_guest_id, $bteststu_basic_id;
	global $command, $commandState;

	// get the command itself
	$command = Commands::ArchiveOldCourse;

	// get the state of the command
	if (array_key_exists("execute", $_POST)) {
		$commandState = CommandStates::Execute;
	} else if (array_key_exists("previewThenExecute", $_POST)) {
		$commandState = CommandStates::PreviewThenExecute;
	} else {
		$commandState = CommandStates::Preview;
	}

	printOutputPageHeading($commandState);

	if (!empty($_POST)) {

		// reading and checking params for the command
		if (!(array_key_exists('session', $_POST) && array_key_exists('season', $_POST))) {
			$errors .= "Fatal Error: Session Year or Season is empty. This may be a bug<br/><br/>";
		} else {
			$session = $_POST['session'];
			$season = $_POST['season'];
		}

		populateCourseInfoFromPOST();

		printCourseInfo(
			$commandState,
			$className,
			$configFolderName,
			$session,
			$department,
			$courseNo,
			$sectionNo,
			$season
		);

		$errors = array();
		$nothingToDo = false;



		if (empty($errors)) {
			if (!$nothingToDo) {
				if ($commandState == CommandStates::Execute || $commandState == CommandStates::PreviewThenExecute) {
					print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
					print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";

					UTIL_archivePreviousTermCourse($classID, $dbConnection);

					print "</div></div>";

					print("<br/><b>STOP! Please check the database query outputs to make sure that everything is
							<span style=\"color:green;\">green</span>
							before finishing.
							</b><br/>");

					print("<br/><span style=\"color:blue;font-weight:bold;\">
							If you are archiving a course as preparation for a new term, you might also want to recreate this course name.
							</span>
							<br/><br/>");

					printOutputPageFooting(CommandStates::Execute, $className);

				} else if ($commandState == CommandStates::Preview) {
					printExecuteArchiveOldCourseForm($classID, $session, $season, "Go Ahead and Execute the Course Archival");
					printOutputPageFooting(CommandStates::Preview, $className);
				}
			} else {
				printOutputPageFooting(CommandStates::Preview, $className);
			}
		} else {
			print "$errors";
			printOutputPageFooting(CommandStates::Error, $className);
		}

	} else {
		print("<br/><span style=\"color:red;font-weight:bold\">
				FATAL ERROR! POST parameter list empty. You may have found a bug.<br/>
				Please email thomas.dang@ubc.ca with as much info as possible of the context when this error appears.<br/>
				</span>
				<br/>");
		printOutputPageFooting(CommandStates::Error, $className);
	}
}

function handleCleanAnnotations()
{
	global $classID, $className, $classes, $configFolderName, $dbConnection;
	global $session, $department, $courseNo, $sectionNo, $season;
	global $yteststudent_hashed_id, $iteststu_guest_id, $bteststu_basic_id;
	global $command, $commandState;

	// get the command itself
	$command = Commands::CleanAnnotations;

	// get the state of the command
	if (array_key_exists("execute", $_POST)) {
		$commandState = CommandStates::Execute;
	} else if (array_key_exists("previewThenExecute", $_POST)) {
		$commandState = CommandStates::PreviewThenExecute;
	} else {
		$commandState = CommandStates::Preview;
	}

	printOutputPageHeading($commandState);

	if (!empty($_POST)) {

		// reading and checking params for the command
		if (!(array_key_exists('session', $_POST) && array_key_exists('season', $_POST))) {
			$errors .= "Fatal Error: Session Year or Season is empty. This may be a bug<br/><br/>";
		} else {
			$session = $_POST['session'];
			$season = $_POST['season'];
		}

		populateCourseInfoFromPOST();

		printCourseInfo(
			$commandState,
			$className,
			$configFolderName,
			$session,
			$department,
			$courseNo,
			$sectionNo,
			$season
		);

		$media = new media();
		$annotationsDB = new annotationsDB();
		$nothingToDo = false;
		$oldAnnotationsAndComments = array();

		$videosInCourse = $media->getVideosByClassID($classID);

		if (!empty($videosInCourse)) {
			$videosInCourseCount = count($videosInCourse);

			foreach ($videosInCourse as $video) {
				$videosInCourseText[] = "ID:" . $video['video_id'] . " Title:\"" . $video['title'] . "\" Length:" . $video['duration'] . "\n";
				$oldAnnotationCollections[] = $annotationsDB->getAnnotations($video['video_id'], null, true, ALL);
			}

			foreach ($oldAnnotationCollections as $annotationCollection) {
				if (!empty($annotationCollection)) {
					foreach ($annotationCollection as $annotation) {
						$oldAnnotationsAndComments[] = $annotation;
					}
				}
			}

			if ($commandState == CommandStates::Preview) {
				print "<br/><b>There are $videosInCourseCount videos in course $className.</b><br/>";
				DEBUG_printSimpleArray($videosInCourseText, 8, 70, "\n");
				print "<br/>";
			}

			print "<br/>";
			if (empty($oldAnnotationsAndComments)) {
				print "<b>There is no active annotations and general comments in this course. Nothing to do.</b><br/><br/>";
				$nothingToDo = true;
			} else {
				$oldAnnotationsAndCommentsCount = count($oldAnnotationsAndComments);
				if ($commandState == CommandStates::Preview) {
					print "<b>There are $oldAnnotationsAndCommentsCount annotations and general comments
					for $videosInCourseCount VIDEOs in course $className. Please verify before deleting.</b><br/>";

					print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
					print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";
					foreach ($oldAnnotationsAndComments as $annotation) {
						if (!is_null($annotation)) {
							if ($annotation['is_private'] == 0) {
								print "Annotation ID " . $annotation['annotation_id'] . " User " .
									$annotation['user_name'] . " Date " . $annotation['creation_date'] .
									" Content '" . $annotation['description'] . "' Tags '" .
									$annotation['tags']
									/* . " is_private " . $annotation['is_private'] */
								;
							}
						} else {
							print "<span style=\"color:red\">null entry. Could be a bug.</span>";
						}
						print "<br/>";
					}
					print "</div></div>";
				}
			}
		} else {
			print "<b>There is no videos in this course yet. Nothing to do.</b><br/><br/>";
			$nothingToDo = true;
		}


		if (empty($errors)) {
			if (!$nothingToDo) {
				if ($commandState == CommandStates::Execute || $commandState == CommandStates::PreviewThenExecute) {
					print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
					print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";
					foreach ($oldAnnotationsAndComments as $annotation) {
						$annotationID = $annotation['annotation_id'];
						$result = $annotationsDB->deleteAnnotation($annotationID);
						UTIL_printQueryResultNicely("delete annotation " . $annotationID, $result, $dbConnection);
					}
					if (empty($oldAnnotationsAndComments)) {
						print "???";
					}
					print "</div></div>";

					print("<br/><b>STOP! Please check the database query outputs to make sure that everything is
							<span style=\"color:green;\">green</span>
							before finishing.
							</b><br/>");

					print("<br/><span style=\"color:blue;font-weight:bold;\">
							If you are cleaning annotations for a new term (so that you can reuse the same videos in a course)<br/>
							You might also want to update the enrollment list afterward.
							</span>
							<br/><br/>");

					printOutputPageFooting(CommandStates::Execute, $className);

				} else if ($commandState == CommandStates::Preview) {
					printExecuteRemoveAnnotationsForm($classID, $session, $season, "Go Ahead and Execute the Annotations Removal");
					printOutputPageFooting(CommandStates::Preview, $className);
				}
			} else {
				printOutputPageFooting(CommandStates::Preview, $className);
			}
		} else {
			print "$errors";
			printOutputPageFooting(CommandStates::Error, $className);
		}

		$media->close();
		$annotationsDB->close();

	} else {
		print("<br/><span style=\"color:red;font-weight:bold\">
				FATAL ERROR! POST parameter list empty. You may have found a bug.<br/>
				Please email thomas.dang@ubc.ca with as much info as possible of the context when this error appears.<br/>
				</span>
				<br/>");
		printOutputPageFooting(CommandStates::Error, $className);
	}
}

function handleAddFromCSV()
{
	global $classID, $className, $classes, $configFolderName, $dbConnection;
	global $session, $department, $courseNo, $sectionNo, $season;
	global $yteststudent_hashed_id, $iteststu_guest_id, $bteststu_basic_id;
	global $command, $commandState;
	global $DEFAULT_TEXTAREA_CONTENT;

	// get the command itself
	$command = Commands::AddFromCSV;

	// get the state of the command
	if (array_key_exists("execute", $_POST)) {
		$commandState = CommandStates::Execute;
	} else if (array_key_exists("previewThenExecute", $_POST)) {
		$commandState = CommandStates::PreviewThenExecute;
	} else {
		$commandState = CommandStates::Preview;
	}

	printOutputPageHeading($commandState);

	if (!empty($_POST)) {

		// session and season must always be there
		if (!(array_key_exists('session', $_POST) && array_key_exists('season', $_POST))) {
			$errors .= "Fatal Error: Session Year or Season is empty. This may be a bug<br/><br/>";
		} else {
			$session = $_POST['session'];
			$season = $_POST['season'];
		}

		populateCourseInfoFromPOST();

		printCourseInfo(
			$commandState,
			$className,
			$configFolderName,
			$session,
			$department,
			$courseNo,
			$sectionNo,
			$season
		);

		$instructorIDs = $_POST['instructor_id'];
		$taIDs = $_POST['TA_ids'];
		$csvStudentList = $_POST['add_users_textarea'];

		if (trim($csvStudentList) == trim($DEFAULT_TEXTAREA_CONTENT)) {
			$csvStudentList = "";
		}

		$encryptionSafeParse = ($commandState != CommandStates::Preview) ? true : false;

		// validate inputs
		if (!empty($instructorIDs)) {
			$instructorIDs = UTIL_textArea2Array($instructorIDs, true, $encryptionSafeParse);
		}

		if (!empty($taIDs)) {
			$taIDs = UTIL_textArea2Array($taIDs, true, $encryptionSafeParse);
		}

		if (!empty($csvStudentList)) {
			$csvStudentListArray = UTIL_textArea2Array($csvStudentList, true, $encryptionSafeParse);
		}

		if ($commandState == CommandStates::Preview) {
			print "<br/>";
			print "<b>Original Input Lists (unencrypted)</b><br/>";
			print "<div style=\"min-width:790px;text-align:center;font-size:75%\">";
			print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:100px;width:800px;white-space:pre-wrap;overflow:scroll;\">";

			print "Instructors: " . implode(", ", $instructorIDs) .
				"<br/>TA's: " . implode(", ", $taIDs) .
				"<br/>Students: " . implode(", ", $csvStudentListArray);

			print "</div></div><br/>";
		}

		if ($commandState == CommandStates::Preview) {

			foreach ($instructorIDs as $ID) {
				$hashedInstructorIDs[] = hashUserID($ID);
			}

			foreach ($taIDs as $ID) {
				$hashedTAIDs[] = hashUserID($ID);
			}

			$oldHashedInstructors = getInstructorsInClass_FROM_OVAL_DB($classID, $dbConnection);
			$oldHashedTAs = getTAsInClass_FROM_OVAL_DB($classID, $dbConnection);

			$alreadyExistingInstructors = array_intersect($hashedInstructorIDs, $oldHashedInstructors);
			$alreadyExistingTAs = array_intersect($hashedTAIDs, $oldHashedTAs);
			$alreadyExistingInstructorsCount = count($alreadyExistingInstructors);
			$alreadyExistingTAsCount = count($alreadyExistingTAs);

			foreach ($csvStudentListArray as $studentID) {
				$csvStudentListArrayHashed[] = hashUserID($studentID);
			}

			$oldHashedStudents = getStudentsInClass_FROM_OVAL_DB($classID, $dbConnection);

			$oldHashedStudents = (is_null($oldHashedStudents)) ? array() : $oldHashedStudents;
			$oldHashedInstructors = (is_null($oldHashedInstructors)) ? array() : $oldHashedInstructors;
			$oldHashedTAs = (is_null($oldHashedTAs)) ? array() : $oldHashedTAs;

			// Creating the final lists!
			$instructorsToAdd = array_diff($hashedInstructorIDs, $oldHashedInstructors);
			$tasToAdd = array_diff($hashedTAIDs, $oldHashedTAs);
			$studentsToAdd = array_diff($csvStudentListArrayHashed, $oldHashedStudents);
		} else {
			// In execute mode, the $_POST lists come pre-vetted and pre-hashed, so just use them!
			$instructorsToAdd = $instructorIDs;
			$tasToAdd = $taIDs;
			$studentsToAdd = $csvStudentListArray;
		}

		if ($commandState == CommandStates::Preview) {
			print "<b>There are $alreadyExistingInstructorsCount instructors in the new list that is already in the course.</b><br/>";
			print "<b>There are $alreadyExistingTAsCount TAs in the new list that is already in the course.</b><br/>";
		}

		if ($commandState == CommandStates::Preview) {
			print "<br/>";
			print "<b>Final (encrypted) list of instructors to be added:</b><br/>";
			DEBUG_printSimpleArray($instructorsToAdd);
			print "<br/><br/>";
			print "<b>Final (encrypted) list of TA's to be added:</b><br/>";
			DEBUG_printSimpleArray($tasToAdd);
			print "<br/><br/>";
		}

		if ($commandState == CommandStates::Preview) {
			if (empty($oldHashedStudents)) {
				print "<b>Existing Student Check: This is a course shell without any students. Safe to add!</b><br/><br/>";
			} else {
				$alreadyEnrolled = array_intersect($csvStudentListArrayHashed, $oldHashedStudents);
				$alreadyEnrolledCount = count($alreadyEnrolled);

				print "<b>There are $alreadyEnrolledCount students in the new list that is already in the course.</b><br/>";
				if ($alreadyEnrolledCount != 0) {
					DEBUG_printSimpleArray($alreadyEnrolled);
					print "<br/>";
				}
				print "<br/>";
			}
		}

		if ($commandState == CommandStates::Preview) {
			$studentsToAddCount = count($studentsToAdd);

			print "<b>Final (encrypted) list of students to be added: $studentsToAddCount students.</b><br/>";
			DEBUG_printSimpleArray($studentsToAdd);
			print "<br/>";
		}

		if (empty($errors)) {
			if ($commandState == CommandStates::Execute || $commandState == CommandStates::PreviewThenExecute) {
				print "<b>Adding Instructors and TA's</b><br/>";
				print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
				print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";

				$instructorsOVALIDs = array();
				$tasOVALIDs = array();
				if (!empty($instructorsToAdd)) {
					$instructorsOVALIDs = createUsers($instructorsToAdd, INSTRUCTOR, $dbConnection, true);
					UTIL_setDefaultUISettings($instructorsOVALIDs);
				}

				if (!empty($tasToAdd)) {
					$tasOVALIDs = createUsers($tasToAdd, TA, $dbConnection, true);
					UTIL_setDefaultUISettings($tasOVALIDs);
				}

				addInstructorAndTAs($classID, $instructorsOVALIDs, $tasOVALIDs, $dbConnection);
				UTIL_addToEveryoneGroup($instructorsOVALIDs, $classID, $dbConnection, INSTRUCTOR);
				UTIL_addToInstructorAndTAGroup($instructorsOVALIDs, $classID, $dbConnection, INSTRUCTOR);
				UTIL_addToEveryoneGroup($tasOVALIDs, $classID, $dbConnection, TA);
				UTIL_addToInstructorAndTAGroup($tasOVALIDs, $classID, $dbConnection, TA);

				print "</div></div><br/><br/>";

				print "<b>Adding Students</b><br/>";
				print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
				print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";

				$studentsOVALIDs = array();
				if (!empty($studentsToAdd)) {
					$studentsOVALIDs = createUsers($studentsToAdd, STUDENT, $dbConnection, true);
					UTIL_setDefaultUISettings($studentsOVALIDs);
				}

				addStudents($classID, $studentsOVALIDs, $dbConnection);
				UTIL_addToEveryoneGroup($studentsOVALIDs, $classID, $dbConnection);

				print "</div></div><br/><br/>";

				print("<b>STOP! Please check the database query outputs to make sure that everything is
						<span style=\"color:green;\">green</span>
						before finishing.
						</b><br/><br/>");

				printOutputPageFooting(CommandStates::Execute, $className);

			} else if ($commandState == CommandStates::Preview) {
				if (!empty($instructorsToAdd) || !empty($tasToAdd) || !empty($studentsToAdd)) {
					printExecuteAddFromCSVForm(
						$classID,
						$session,
						$season,
						"Go Ahead and Execute the User Additions",
						$instructorsToAdd,
						$tasToAdd,
						$studentsToAdd
					);
				} else {
					print("<br/><span style=\"color:blue;font-weight:bold\">
							STOP! All drop lists seem to be empty. There appears to be nothing to do.
							</span>
							<br/>");
				}
				printOutputPageFooting(CommandStates::Preview);
			}
		} else {
			print "$errors";
			printOutputPageFooting(CommandStates::Error, $className);
		}
	} else {
		print("<br/><span style=\"color:red;font-weight:bold\">
				FATAL ERROR! POST parameter list empty. You may have found a bug.<br/>
				Please email thomas.dang@ubc.ca with as much info as possible of the context when this error appears.<br/>
				</span>
				<br/>");
		printOutputPageFooting(CommandStates::Error);
	}
}

function handleDropFromCSV()
{
	global $classID, $className, $classes, $configFolderName, $dbConnection;
	global $session, $department, $courseNo, $sectionNo, $season;
	global $yteststudent_hashed_id, $iteststu_guest_id, $bteststu_basic_id;
	global $command, $commandState;
	global $DEFAULT_TEXTAREA_CONTENT;
	global $DEFAULT_TEXTAREA_CONTENT_DROP_NOTE;

	// get the command itself
	$command = Commands::DropFromCSV;

	// get the state of the command
	if (array_key_exists("execute", $_POST)) {
		$commandState = CommandStates::Execute;
	} else if (array_key_exists("previewThenExecute", $_POST)) {
		$commandState = CommandStates::PreviewThenExecute;
	} else {
		$commandState = CommandStates::Preview;
	}

	printOutputPageHeading($commandState);

	if (!empty($_POST)) {

		// session and season must always be there
		if (!(array_key_exists('session', $_POST) && array_key_exists('season', $_POST))) {
			$errors .= "Fatal Error: Session Year or Season is empty. This may be a bug<br/><br/>";
		} else {
			$session = $_POST['session'];
			$season = $_POST['season'];
		}

		populateCourseInfoFromPOST();

		printCourseInfo(
			$commandState,
			$className,
			$configFolderName,
			$session,
			$department,
			$courseNo,
			$sectionNo,
			$season
		);

		$instructorIDs = $_POST['instructor_id'];
		$taIDs = $_POST['TA_ids'];
		$csvStudentList = $_POST['drop_users_textarea'];

		// Handle special cases
		if (strpos(trim($csvStudentList), trim($DEFAULT_TEXTAREA_CONTENT)) != false) {
			$csvStudentList = "";
		}

		$dropAllStudents = false;
		if (strtoupper(trim($csvStudentList)) == "EVERYONE") {
			$dropAllStudents = true;
		}

		$encryptionSafeParse = ($commandState != CommandStates::Preview) ? true : false;

		// validate inputs
		if (!empty($instructorIDs)) {
			$instructorIDs = UTIL_textArea2Array($instructorIDs, true, $encryptionSafeParse);
		}

		if (!empty($taIDs)) {
			$taIDs = UTIL_textArea2Array($taIDs, true, $encryptionSafeParse);
		}

		if (!empty($csvStudentList)) {
			$csvStudentListArray = UTIL_textArea2Array($csvStudentList, true, $encryptionSafeParse);
		}

		if ($commandState == CommandStates::Preview) {
			print "<br/>";
			print "<b>Original Input Lists (unencrypted)</b><br/>";
			print "<div style=\"min-width:790px;text-align:center;font-size:75%\">";
			print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:100px;width:800px;white-space:pre-wrap;overflow:scroll;\">";

			print "Instructors: " . implode(", ", $instructorIDs) .
				"<br/>TA's: " . implode(", ", $taIDs) .
				"<br/>Students: " . implode(", ", $csvStudentListArray);

			print "</div></div><br/>";
		}

		if ($commandState == CommandStates::Preview) {

			foreach ($instructorIDs as $ID) {
				$hashedInstructorIDs[] = hashUserID($ID);
			}

			foreach ($taIDs as $ID) {
				$hashedTAIDs[] = hashUserID($ID);
			}

			$oldHashedInstructors = getInstructorsInClass_FROM_OVAL_DB($classID, $dbConnection);
			$oldHashedTAs = getTAsInClass_FROM_OVAL_DB($classID, $dbConnection);
			$oldHashedInstructors = (is_null($oldHashedInstructors)) ? array() : $oldHashedInstructors;
			$oldHashedTAs = (is_null($oldHashedTAs)) ? array() : $oldHashedTAs;

			$alreadyExistingInstructors = array_intersect($hashedInstructorIDs, $oldHashedInstructors);
			$alreadyExistingTAs = array_intersect($hashedTAIDs, $oldHashedTAs);
			$alreadyExistingInstructorsCount = count($alreadyExistingInstructors);
			$alreadyExistingTAsCount = count($alreadyExistingTAs);

			foreach ($csvStudentListArray as $studentID) {
				$csvStudentListArrayHashed[] = hashUserID($studentID);
			}

			$oldHashedStudents = getStudentsInClass_FROM_OVAL_DB($classID, $dbConnection);
			$oldHashedStudents = (is_null($oldHashedStudents)) ? array() : $oldHashedStudents;
			$alreadyExistingStudents = array_intersect($csvStudentListArrayHashed, $oldHashedStudents);

			$instructorsNotInCourse = array_diff($hashedInstructorIDs, $oldHashedInstructors);
			$tasNotInCourse = array_diff($hashedTAIDs, $oldHashedTAs);
			$studentsNotInCourse = array_diff($csvStudentListArrayHashed, $oldHashedStudents);

			/*print_r($studentsNotInCourse); 
			print "<br/>";
			print_r($oldHashedStudents);
			print "<br/>";*/

			$instructorsNotInCourseCount = count($instructorsNotInCourse);
			$tasNotInCourseCount = count($tasNotInCourse);
			$studentsNotInCourseCount = count($studentsNotInCourse);

			// Creating the final lists! For dropping, the "to Drop" list would be the alreadyExisting
			$instructorsToDrop = $alreadyExistingInstructors;
			$tasToDrop = $alreadyExistingTAs;
			$studentsToDrop = $alreadyExistingStudents;

			if ($dropAllStudents) {
				$studentsToDrop = $oldHashedStudents;
			}

		} else {
			// In execute mode, the $_POST lists come pre-vetted and pre-hashed, so just use them!
			$instructorsToDrop = $instructorIDs;
			$tasToDrop = $taIDs;
			$studentsToDrop = $csvStudentListArray;
		}

		if ($commandState == CommandStates::Preview) {
			print "<b>There are $instructorsNotInCourseCount instructors in the drop list that are NOT in the course. These will be ignored.</b><br/>";
			if ($instructorsNotInCourseCount != 0) {
				DEBUG_printSimpleArray($instructorsNotInCourse, 2);
				print "<br/><br/>";
			}
			print "<b>There are $tasNotInCourseCount TAs in the drop list that are NOT in the course. These will be ignored.</b><br/>";
			if ($tasNotInCourseCount != 0) {
				DEBUG_printSimpleArray($tasNotInCourse, 2);
				print "<br/>";
			}
		}

		if ($commandState == CommandStates::Preview) {
			print "<br/>";
			print "<b>Final (encrypted) list of instructors to be dropped:</b><br/>";
			DEBUG_printSimpleArray($instructorsToDrop, 2);
			print "<br/><br/>";
			print "<b>Final (encrypted) list of TA's to be dropped:</b><br/>";
			DEBUG_printSimpleArray($tasToDrop, 2);
			print "<br/><br/>";
		}

		if ($commandState == CommandStates::Preview) {
			if (empty($oldHashedStudents)) {
				print "<b>Existing Student Check: This is a course shell without any students to drop!</b><br/><br/>";
			} else {
				if (!$dropAllStudents) {
					print "<b>There are $studentsNotInCourseCount students in the drop list that are NOT in the course. These will be ignored</b><br/>";
					if ($studentsNotInCourseCount != 0) {
						DEBUG_printSimpleArray($studentsNotInCourse);
						print "<br/>";
					}
				} else {
					print "<b>Dropping ALL students in the course...</b><br/>";
				}
				print "<br/>";
			}
		}

		if ($commandState == CommandStates::Preview) {
			$studentsToDropCount = count($studentsToDrop);

			print "<b>Final (encrypted) list of students to be dropped: $studentsToDropCount students.</b><br/>";
			DEBUG_printSimpleArray($studentsToDrop);
			print "<br/>";
		}

		if (empty($errors)) {
			if ($commandState == CommandStates::Execute || $commandState == CommandStates::PreviewThenExecute) {
				print "<b>Dropping Instructors and TA's</b><br/>";
				print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
				print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";


				print "<h3><span style=\"color:red\">Dropping Instructors and TA's Not Yet Implemented! Contact thomas.dang@ubc.ca if Needed.</span></h3>";

				print "</div></div><br/><br/>";

				print "<b>Dropping Students</b><br/>";
				print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
				print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";

				if (!empty($studentsToDrop)) {
					UTIL_dropHashedStudentsFromCourse($studentsToDrop, $classID, $dbConnection);
				}

				print "</div></div><br/><br/>";

				print("<b>STOP! Please check the database query outputs to make sure that everything is
						<span style=\"color:green;\">green</span>
						before finishing.
						</b><br/><br/>");

				printOutputPageFooting(CommandStates::Execute, $className);

			} else if ($commandState == CommandStates::Preview) {

				if (!empty($instructorsToDrop) || !empty($tasToDrop) || !empty($studentsToDrop)) {
					printExecuteDropFromCSVForm(
						$classID,
						$session,
						$season,
						"Go Ahead and Execute the User Drops",
						$instructorsToDrop,
						$tasToDrop,
						$studentsToDrop
					);
				} else {
					print("<br/><span style=\"color:blue;font-weight:bold\">
							STOP! All drop lists seem to be empty. There appears to be nothing to do.
							</span>
							<br/>");
				}
				printOutputPageFooting(CommandStates::Preview);
			}
		} else {
			print "$errors";
			printOutputPageFooting(CommandStates::Error, $className);
		}
	} else {
		print("<br/><span style=\"color:red;font-weight:bold\">
				FATAL ERROR! POST parameter list empty. You may have found a bug.<br/>
				Please email thomas.dang@ubc.ca with as much info as possible of the context when this error appears.<br/>
				</span>
				<br/>");
		printOutputPageFooting(CommandStates::Error);
	}
}

function handleCheckEnroll()
{
	// UNUSED, NOT HIGH PRIORITY IMPLEMENTATION BECAUSE THE RESULT PREVIEWS ARE
	// ALREADY AVAILABLE IN ALL OTHER COMMANDS INCLUDING ADD / DROP STUDENTS
}

function UTIL_excludeTestAccounts($enrollmentArray)
{
	// TODO: refactor to array
	global $yteststudent_hashed_id, $iteststu_guest_id, $bteststu_basic_id;

	if (($key = array_search($yteststudent_hashed_id, $enrollmentArray)) != false) {
		unset($enrollmentArray[$key]);
	}

	if (($key = array_search($iteststu_guest_id, $enrollmentArray)) != false) {
		unset($enrollmentArray[$key]);
	}

	if (($key = array_search($bteststu_basic_id, $enrollmentArray)) != false) {
		unset($enrollmentArray[$key]);
	}
}

function handleRemoveCourse()
{
	global $classID, $className, $classes, $configFolderName, $dbConnection;
	global $session, $department, $courseNo, $sectionNo, $season;
	global $yteststudent_hashed_id, $iteststu_guest_id, $bteststu_basic_id;
	global $command, $commandState;

	// get the command itself
	$command = Commands::RemoveCourse;

	// get the state of the command
	if (array_key_exists("execute", $_POST)) {
		$commandState = CommandStates::Execute;
	} else if (array_key_exists("previewThenExecute", $_POST)) {
		$commandState = CommandStates::PreviewThenExecute;
	} else {
		$commandState = CommandStates::Preview;
	}

	printOutputPageHeading($commandState);

	if (!empty($_POST)) {

		// reading and checking params for the command
		if (!(array_key_exists('session', $_POST) && array_key_exists('season', $_POST))) {
			$errors .= "Fatal Error: Session Year or Season is empty. This may be a bug<br/><br/>";
		} else {
			$session = $_POST['session'];
			$season = $_POST['season'];
		}

		populateCourseInfoFromPOST();

		printCourseInfo(
			$commandState,
			$className,
			$configFolderName,
			$session,
			$department,
			$courseNo,
			$sectionNo,
			$season
		);

		if ($commandState == CommandStates::Preview) {
			$oldEnrolled = getStudentsInClass_FROM_OVAL_DB($classID, $dbConnection);

			UTIL_excludeTestAccounts($oldEnrolled);

			print "<br/>";
			if (empty($oldEnrolled)) {
				print "<b>This is a course shell without any students (except test accounts). Safe to Remove.</b><br/><br/>";
			} else {
				$oldEnrolledCount = count($oldEnrolled);

				print "<b>There are $oldEnrolledCount students (other than test accounts). Please verify before deleting the course</b><br/>";
				DEBUG_printSimpleArray($oldEnrolled, 12, 90);
				print "<br/>";
			}
		}

		if (empty($errors)) {
			if ($commandState == CommandStates::Execute || $commandState == CommandStates::PreviewThenExecute) {
				print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
				print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";
				removeCourse_FROM_OVAL_DB($classID, $dbConnection);
				print "</div></div>";

				print("<br/><b>STOP! Please check the database query outputs to make sure that everything is
						<span style=\"color:green;\">green</span>
						before finishing.
						</b><br/><br/>");

				printOutputPageFooting(CommandStates::Execute, $className);

			} else if ($commandState == CommandStates::Preview) {
				printExecuteRemoveCourseForm($classID, $sessionYear, $season, "Go Ahead and Execute the Course Removal");
				printOutputPageFooting(CommandStates::Preview);
			}
		} else {
			print "$errors";
			printOutputPageFooting(CommandStates::Error, $className);
		}
	} else {
		print("<br/><span style=\"color:red;font-weight:bold\">
				FATAL ERROR! POST parameter list empty. You may have found a bug.<br/>
				Please email thomas.dang@ubc.ca with as much info as possible of the context when this error appears.<br/>
				</span>
				<br/>");
		printOutputPageFooting(CommandStates::Error);
	}
}

function handleCreateCourse()
{

	global $classID, $className, $classes, $configFolderName, $dbConnection;
	global $session, $department, $courseNo, $sectionNo, $season;
	global $yteststudent_hashed_id, $iteststu_guest_id, $bteststu_basic_id;
	global $command, $commandState;
	global $Jenny_hashed_id, $Thomas_hashed_id;

	// get the command itself
	$command = Commands::CreateCourse;

	// get the state of the command
	$commandState = CommandStates::Execute;

	printOutputPageHeading($commandState);

	if (!empty($_POST)) {

		if (!(array_key_exists('session', $_POST) && array_key_exists('season', $_POST))) {
			$errors .= "Fatal Error: Session Year or Season is empty. This may be a bug<br/><br/>";
		} else {
			$session = $_POST['session'];
			$season = $_POST['season'];
		}

		$is_SIS_course = $_POST['is_SIS_course'];

		if ($is_SIS_course == "yes") {
			$department = $_POST['department'];
			$courseNo = $_POST['course_number'];
			$sectionNo = $_POST['section_number'];

			$department = strtoupper($department);
		} else {
			$className = $_POST['course_name'];

			if (is_null($className) || strlen($className) == 0) {
				$errors .= "Error: You must enter a class name<br/>";
			}
		}

		$instructorIDs = $_POST['instructor_id'];
		$taIDs = $_POST['TA_ids'];

		// validate inputs
		if (!empty($instructorIDs)) {
			$instructorIDs = UTIL_textArea2Array($instructorIDs);
		} else {
			$errors .= "Fatal Error: Instructor List is Empty!<br/><br/>";
		}

		if (!empty($taIDs)) {
			$taIDs = UTIL_textArea2Array($taIDs);
		}

		// Extra admin hash ids, TODO: factor into an array for neatness
		$extraAdminHashIDs = array();
		$extraAdminHashIDs[] = $Jenny_hashed_id;
		$extraAdminHashIDs[] = $Thomas_hashed_id;

		// Extra student hash ids
		$extraStudentHashIDs = array();
		$extraStudentHashIDs[] = $yteststudent_hashed_id;

		if ($is_SIS_course == "yes") {

			if (is_null($courseNo) || strlen($courseNo) == 0) {
				$errors .= "Error: you must enter a course number<br/>";
			} else {
				if (is_numeric(substr($courseNo, 0, 3))) {
					if (strlen($courseNo) == 4) {
						if (!is_alpha(substr($courseNo, 3, 1))) {
							$errors .= "Error: course number must be three digits plus an optional letter, ex. '300' or '300B'<br/><br/>";
						}
					}
				} else {
					$errors .= "Error: course number must be three digits plus an optional letter, ex. '301' or '301A'<br/><br/>";
				}
			}

			if (is_null($sectionNo) || strlen($sectionNo) == 0) {
				$errors .= "Error: you must enter a section number<br/>";
			} else {
				// pad section number to three digits
				while (strlen($sectionNo) < 3) {
					$sectionNo = "0" . $sectionNo;
				}
			}

			// Assemble the name
			$className = getCourseName($department, $courseNo, $sectionNo);
			$className = $className . "_$session$season";

			if (in_array($className, $classes)) {
				$errors .= "Error: $className already exists<br/><br/>";
			}
		} else {

			$className = $className . "_$session$season";

			if (in_array($className, $classes)) {
				$errors .= "Error: $className already exists<br/><br/>";
			}
		}

		if (empty($errors)) {

			print "<b>Course Name to be Created: $className</b><br/><br/>";
			print "<b>Instructors List:</b><br/>";
			DEBUG_printSimpleArray($instructorIDs, 1);
			print "<br/><br/>";
			print "<b>TA's List:</b><br/>";
			DEBUG_printSimpleArray($taIDs, 1);
			print "<br/><br/>";

			print "<b>Creating Instructor Account(s) if Not Yet Existed</b><br/>";

			if (!empty($instructorIDs)) {
				// The rest of the debug messages (SQL output) goes into a text area, for neatness
				print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
				print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";
				$instructorIDs = createUsers($instructorIDs, INSTRUCTOR, $dbConnection);
				print "</div></div><br/>";
			} else {
				print "Nothing To Do...<br/><br/>";
			}

			print "<b>";
			if (!empty($taIDs)) {
				print "Creating Teaching Assistant Account(s) if Not Yet Existed<br/>";
			} else {
				print "There are no TA's in the Course (for now)<br/><br/>";
			}
			print "</b>";

			if (!empty($taIDs)) {
				// The rest of the debug messages (SQL output) goes into a text area, for neatness
				print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
				print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";
				$taIDs = createUsers($taIDs, TA, $dbConnection);
				print "</div></div><br/>";
			}

			print "<b>";
			if (!empty($extraAdminHashIDs)) {
				print "Creating Extra Administrator Account(s) - Arts Helpdesk, LC, etc.<br/>";
			} else {
				print "There are no extra admin accounts in the course for now.<br/><br/>";
			}
			print "</b>";

			$extraAdminIDs = null;
			if (!empty($extraAdminHashIDs)) {
				// The rest of the debug messages (SQL output) goes into a text area, for neatness
				print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
				print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";
				$extraAdminIDs = createUsers($extraAdminHashIDs, INSTRUCTOR, $dbConnection, true);
				print "</div></div><br/>";
			}

			print "<b>";
			if (!empty($extraStudentHashIDs)) {
				print "Creating Extra Student Account(s) for Testing (yteststudent, iteststu, bteststu)<br/>";
			} else {
				print "There are no extra student accounts in the course for now.<br/><br/>";
			}
			print "</b>";

			$extraStudentIDs = null;
			if (!empty($extraStudentHashIDs)) {
				// The rest of the debug messages (SQL output) goes into a text area, for neatness
				print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
				print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";
				$extraStudentIDs = createUsers($extraStudentHashIDs, STUDENT, $dbConnection, true);
				print "</div></div><br/>";
			}

			// initial student list
			$studentIDs = $extraStudentIDs;

			// create and populate class
			$classID = createClass($className, $dbConnection);

			// merge admin lists
			$instructorIDs = array_merge($instructorIDs, $extraAdminIDs);

			addInstructorAndTAs($classID, $instructorIDs, $taIDs, $dbConnection);

			// create default groups
			$users = new users();

			print "<b>Create Default Group $className" . "_everyone</b><br/><br/>";
			$groupName = $className . "_everyone";

			// This can deal with a null userID list, only instructorID and classID is utterly necessary
			$users->createGroup($groupName, $studentIDs, $instructorIDs, $classID);

			// Instructors and TA
			print "<b>Create Default Group $className" . "_instructorAndTA</b><br/><br/>";
			$groupName = $className . "_instructorAndTA";
			$users->createGroup($groupName, null, $instructorIDs, $classID);

			// set default UI for each user, first, let's merge all the arrays created so far.
			if (empty($taIDs)) {
				$allIDs = array_merge($instructorIDs, $studentIDs);
			} else {
				$allIDs = array_merge($instructorIDs, $taIDs, $studentIDs);
			}

			UTIL_setDefaultUISettings($allIDs);

			$users->close();

			mysql_close($dbConnection);

			print "<h3>Course Creation Successful!</h3>";

			printOutputPageFooting($commandState, $className);
		} else {
			print "$errors";
			printOutputPageFooting(CommandStates::Error, $className);
		}
	} else {
		print("<br/><span style=\"color:red;font-weight:bold\">
				FATAL ERROR! POST parameter list empty. You may have found a bug.<br/>
				Please email thomas.dang@ubc.ca with as much info as possible of the context when this error appears.<br/>
				</span>
				<br/>");
		printOutputPageFooting(CommandStates::Error);
	}
}

function printOutputPageHeading($commandState)
{

	global $command;

	if ($command == Commands::ImportFromCSV || $command == Commands::ImportFromSIS) {
		$headingString = "<h2>Bulk Importing Enrollment List";
	} else if ($command == Commands::AddFromCSV) {
		$headingString = "<h2>Add Users";
	} else if ($command == Commands::DropFromCSV) {
		$headingString = "<h2>Drop Users";
	} else if ($command == Commands::CreateCourse) {
		$headingString = "<h2>Create Course";
	} else if ($command == Commands::RemoveCourse) {
		$headingString = "<h2>Remove Course";
	} else if ($command == Commands::CleanAnnotations) {
		$headingString = "<h2>Clean Annotations";
	} else if ($command == Commands::ArchiveOldCourse) {
		$headingString = "<h2>Archive Old Course";
	}

	// only print the source of data if you are still previewing, when execute, don't be verbose (and confusing)
	if ($commandState != CommandStates::Execute) {
		if ($command == Commands::ImportFromSIS) {
			$headingString = $headingString . " from SIS";
		} else if ($command == Commands::ImportFromCSV) {
			$headingString = $headingString . " from CSV";
		}
	}

	if ($commandState == CommandStates::Preview) {
		$headingString = $headingString . " - Previewing";
	} else {
		$headingString = $headingString . " - Executing";
	}

	$headingString = $headingString . "</h2>";

	print "<html>";
	print "<head></head>";
	print "<body style=\"text-align:center;font-family:'Lucida Sans Unicode';font-size:12px\">";
	print $headingString;
}

function printOutputPageFooting($commandState, $className = "ClassName Uninitialized")
{
	global $command;

	print "<br/>";

	$commandText = "Uninitialized";
	if ($command == Commands::CreateCourse) {
		$commandText = "Created";
	} else if ($command == Commands::RemoveCourse) {
		$commandText = "Removed";
	} else if ($command == Commands::CleanAnnotations) {
		$commandText = "Removed annotations and comments in ALL VIDEOS for";
	} else if ($command == Commands::ArchiveOldCourse) {
		$commandText = "Archived the course";
	} else {
		$commandText = "Updated";
	}

	if ($commandState == CommandStates::Execute || $commandState == CommandStates::PreviewThenExecute) {
		$exitMessage = "$commandText <b>$className</b>! Return to OVAL admin interface";
	} else if ($commandState == CommandStates::Error) {
		$exitMessage = "Errors Found: Please return and check your input parameters";
	} else {
		$exitMessage = "Cancel and return to OVAL admin interface";
	}

	print "<a href=\"clas_adm.php\" onclick=\"confirmation()\">$exitMessage</a>";

	print "<script type=\"text/javascript\">";
	setUpBackAndRefreshChecking();
	print "</script>";

	print "</body>";
	print "</html>";

	exit;
	// Exit here so that the rest of the page doesn't get displayed again (so that we can show a
	// dedicated "result" view before starting again.
}

function printCourseInfo(
	$commandState,
	$className,
	$configFolderName,
	$session,
	$department,
	$courseNo,
	$sectionNo,
	$season
)
{
	global $command, $classID;

	print "Debug Information: ClassID $classID, ClassName $className, ServerID: $configFolderName<br/><br/>";

	print "<br/>";
	if ($command == Commands::ImportFromSIS) {
		print("<b>Importing enrollment list via SIS for:</b>");
	} else if ($command == Commands::ImportFromCSV) {
		print("<b>Importing enrollment list via Comma-Separated-Values for:</b>");
	} else if ($command == Commands::RemoveCourse) {
		print("<b>Course to be Removed:</b>");
	} else if ($command == Commands::CleanAnnotations) {
		print("<b>Currently active annotations will be cleaned for:</b>");
	} else if ($command == Commands::ArchiveOldCourse) {
		print("<b>Archiving the following course:</b>");
	} else if ($command == Commands::AddFromCSV) {
		print("<b>Adding users (incremental update) into Course:</b>");
	} else if ($command == Commands::DropFromCSV) {
		print("<b>Dropping users (incremental update) out of Course:</b>");
	} else if ($command == Commands::CheckEnroll) {
		print("<b>Showing Enrollment Info (in OVAL) for Course:</b>");
	} else {
		print("<b>Course to be Updated:</b>");
	}
	print "<br/>";

	if ($command == Commands::ImportFromSIS) {
		print("&nbsp;Session Year: $session<br/>
				&nbsp;Season: $season<br/>
				&nbsp;Department: $department<br/>
				&nbsp;Course Number: $courseNo<br/>
				&nbsp;Section Number: $sectionNo<br/>");
	} else {
		print("&nbsp;Session Year: $session<br/>
				&nbsp;Season: $season<br/>
				&nbsp;Course Name: $className<br/>");
	}
}

function handleImportFromSIS()
{

	global $classID, $className, $classes, $configFolderName, $dbConnection;
	global $session, $department, $courseNo, $sectionNo, $season, $yteststudent_hashed_id;
	global $command, $commandState, $DEPLOYMENT_NAME;
	global $allowedCourseCode;

	// get the command itself
	$command = Commands::ImportFromSIS;

	// get the state of the command
	if (array_key_exists("execute", $_POST)) {
		$commandState = CommandStates::Execute;
	} else if (array_key_exists("previewThenExecute", $_POST)) {
		$commandState = CommandStates::PreviewThenExecute;
	} else {
		$commandState = CommandStates::Preview;
	}

	printOutputPageHeading($commandState);

	if (array_key_exists('session', $_POST) && array_key_exists('season', $_POST)) {

		$session = $_POST['session'];
		$season = $_POST['season'];

		populateCourseInfoFromPOST();

		printCourseInfo(
			$commandState,
			$className,
			$configFolderName,
			$session,
			$department,
			$courseNo,
			$sectionNo,
			$season
		);

		$canQueryFromSIS = true;
		if (!in_array("EVERY", $allowedCourseCode)) {
			if (!in_array($department, $allowedCourseCode)) {
				$canQueryFromSIS = false;
			}
		}

		if (in_array("NONE", $allowedCourseCode)) {
			$canQueryFromSIS = false;
		}

		if ($canQueryFromSIS) {
			// print "Debug Information: params from interface: $department, $courseNo, $sectionNo<br/><br/>";
			updateClassEnrollment($classID, $dbConnection, $command, $commandState);
		} else {
			print("<br/><span style=\"color:red;font-weight:bold\">
				FATAL ERROR! This deployment of OVAL - '" . strtoupper($DEPLOYMENT_NAME) .
				"' - may not query SIS for the course code '$department'.<br/>
				If this course code does belong to your department and we missed it during initial setup, please email 
					<a href='mailto:arts.helpdesk@ubc.ca'>arts.helpdesk@ubc.ca</a>
				</span>
				<br/>");
		}
	} else {
		print("<br/><span style=\"color:red;font-weight:bold\">
				FATAL ERROR! SessionYear and Season parameters missing. You have found a bug.<br/>
				Please email thomas.dang@ubc.ca with as much info as possible of the context when this error appears.<br/> 
				</span>
				<br/>");
	}

	printOutputPageFooting($commandState, $className);
}

function getCourseName($dept, $course, $section)
{
	return $dept . $course . "_" . $section;
}

function createUsers($IDs, $role, $dbConn, $isIDsHashed = false, $firstName = null, $lastName = null)
{
	global $AES_key, $DEPLOYMENT_NAME;

	$userIDs = null;

	// deal with null firstname & lastname, convert to "NULL" for SQL
	$firstName = ($firstName == null) ? "NULL" : $firstName;
	$lastName = ($lastName == null) ? "NULL" : $lastName;

	// convert to array
	if (!is_array($IDs))
		$IDs = (array) $IDs;

	foreach ($IDs as $ID) {
		//TODO: add DB contraint unique per user

		// This function can be called either with a pre-hashed ID or an unhashed userID
		// situations for calling with a pre-hashed ID include updating a class list, or
		// giving existing users permissions (student or instructor) to a new class
		($isIDsHashed) ? $hashUserID = $ID : $hashUserID = hashUserID($ID);

		// Check to see if the user already existed
		$query = "SELECT id FROM users WHERE hash_user_id LIKE '$hashUserID'";

		$result = mysql_query($query, $dbConn);
		$resultText = ($result == false) ? ("<div style=\"color:red;\">failed, error: " . mysql_error($dbConn) . "</div>") : ("<div style=\"color:green;\">ok, retVal: " . mysql_result($result, 0) . "</div>");
		print "<br/>Debug Info: $query - Result: $resultText<br/>";

		// get the OVAL userID of the last insert of this hashed university ID
		if (1 == mysql_num_rows($result)) {
			$userID = mysql_result($result, 0);
		} else {

			$saltedID = $ID . generateSalt($ID);

			if ($DEPLOYMENT_NAME === "dev") {
				$query = "INSERT INTO users VALUES (NULL, '$hashUserID', AES_ENCRYPT('$saltedID', '$AES_key'), '$firstName', '$lastName', $role, NULL)";
			} else {
				$query = "INSERT INTO users VALUES (NULL, '$hashUserID', '', '$firstName', '$lastName', $role, NULL)";
			}

			$result = mysql_query($query, $dbConn);
			$resultText = ($result == false) ? ("<div style=\"color:red;\">failed, error: " . mysql_error($dbConn) . "</div>") : ("<div style=\"color:green;\">ok, retVal: " . mysql_result($result, 0) . "</div>");

			$query = str_replace($AES_key, "", $query);
			print "<br/>Debug Info: $query - Result: $resultText<br/>";

			// user already exists so query id
			$userID = mysql_insert_id();
		}

		//print "userID:$userID<br />";
		// collect users.id
		$userIDs[] = $userID;
	}

	return $userIDs;
}

function UTIL_printQueryResultNicely($query = "Query Not Provided", $result, $dbConn)
{
	// TODO: refactor into util class, along with things in common.inc.php
	$resultText = ($result == false) ? ("<div style=\"color:red;\">failed, error: " . mysql_error($dbConn) . "</div>") : ("<div style=\"color:green;\">ok, retVal: " . mysql_result($result, 0) . "</div>");
	print "<br />query:$query<br />result: $resultText<br/>";
}

function getStudentsInClass_FROM_OVAL_DB($classID, $dbConn)
{
	$query = <<<EOT
SELECT DISTINCT u.hash_user_id 
FROM users u, classEnrollmentLists cEL 
WHERE
    cEL.class_id=$classID
AND 
    u.id = cEL.user_id;
EOT;
	$result = mysql_query($query, $dbConn);

	while ($row = mysql_fetch_assoc($result)) {
		$hashUserIDs[] = $row['hash_user_id'];
	}

	return $hashUserIDs;
}

function getInstructorsInClass_FROM_OVAL_DB($classID, $dbConn)
{
	$query = <<<EOT
SELECT DISTINCT u.hash_user_id
FROM users u, classInstructorsAndTAs cIAT
WHERE
    cIAT.class_id=$classID
AND
    u.id = cIAT.user_id
AND
    cIAT.is_instructor = 1;
EOT;
	$result = mysql_query($query, $dbConn);

	while ($row = mysql_fetch_assoc($result)) {
		$hashUserIDs[] = $row['hash_user_id'];
	}

	return $hashUserIDs;
}

function getTAsInClass_FROM_OVAL_DB($classID, $dbConn)
{
	$query = <<<EOT
SELECT DISTINCT u.hash_user_id
FROM users u, classInstructorsAndTAs cIAT
WHERE
    cIAT.class_id=$classID
AND
    u.id = cIAT.user_id
AND
    cIAT.is_instructor = 0;
EOT;
	$result = mysql_query($query, $dbConn);

	while ($row = mysql_fetch_assoc($result)) {
		$hashUserIDs[] = $row['hash_user_id'];
	}

	return $hashUserIDs;
}

function removeCourse_FROM_OVAL_DB($classID, $dbConn)
{
	$users = new users();
	$groupIDs = $users->getGroupsByClassID($classID);

	if (!empty($groupIDs)) {
		foreach ($groupIDs as $groupID => $groupName) {
			$result = $users->deleteGroup($groupID);
			UTIL_printQueryResultNicely("Delete Group ID $groupID Name $groupName", $result, $dbConn);
		}
	}
	$users->close();

	// remove course here
	$query = <<<EOT
	DELETE FROM class WHERE id='$classID'	
EOT;
	$result = mysql_query($query, $dbConn);
	UTIL_printQueryResultNicely($query, $result, $dbConn);
}

function getUserID($hashID, $dbConn)
{
	$query = "SELECT id FROM users WHERE hash_user_id LIKE '$hashID'";
	$result = mysql_query($query, $dbConn);

	$row = mysql_fetch_assoc($result);

	return $row['id'];
}


function createClass($className, $dbConn)
{
	$query = "INSERT INTO class VALUES (NULL, '$className')";
	$result = mysql_query($query, $dbConn);

	$query = "SELECT MAX(id) FROM class";
	$result = mysql_query($query, $dbConn);
	$classID = mysql_result($result, 0);
	//print "classID:$classID";
	return $classID;
}


function addStudents($classID, $userIDs, $dbConn)
{
	foreach ($userIDs as $userID) {
		$query = "INSERT IGNORE INTO classEnrollmentLists VALUES ($classID, $userID)";
		$result = mysql_query($query, $dbConn);
		UTIL_printQueryResultNicely($query, $result, $dbConn);
	}
}


function addInstructorAndTAs($classID, $instructorIDs, $taIDs, $dbConn)
{
	foreach ($instructorIDs as $ID) {
		$query = "INSERT IGNORE INTO classInstructorsAndTAs VALUES ($classID, $ID, 1)";
		$result = mysql_query($query, $dbConn);
		UTIL_printQueryResultNicely($query, $result, $dbConn);
	}

	foreach ($taIDs as $ID) {
		$query = "INSERT IGNORE INTO classInstructorsAndTAs VALUES ($classID, $ID, 0)";
		$result = mysql_query($query, $dbConn);
		UTIL_printQueryResultNicely($query, $result, $dbConn);
	}
}

function getStudentNumbers_FROM_SIS($sessionYear, $department, $courseNo, $sectionNo, $sessionCd)
{
	return getStudentNumbers($sessionYear, $department, $courseNo, $sectionNo, $sessionCd);
}

function printExecuteDropFromCSVForm(
	$classID,
	$sessionYear,
	$season,
	$message,
	$instructor_IDs,
	$ta_IDs,
	$drop_users_textarea
)
{

	$instructor_IDs = implode(",", $instructor_IDs);
	$ta_IDs = implode(",", $ta_IDs);
	$drop_users_textarea = implode(",", $drop_users_textarea);

	print "\n<form name=\"drop-users-execute\" method=\"post\" action=\"" .
		$_SERVER['PHP_SELF'] .
		"\">\n";

	print "<input type=\"hidden\" name=\"class\" value=\"$classID\"></input>\n";
	print "<input type=\"hidden\" name=\"session\" value=\"$sessionYear\"></input>\n";
	print "<input type=\"hidden\" name=\"season\" value=\"$season\"></input>\n";
	print "<input type=\"hidden\" name=\"execute\" value=\"unused\"></input>\n";
	print "<input type=\"hidden\" name=\"instructor_id\" value=\"$instructor_IDs\"></input>\n";
	print "<input type=\"hidden\" name=\"TA_ids\" value=\"$ta_IDs\"></input>\n";
	print "<input type=\"hidden\" name=\"drop_users_textarea\" value=\"$drop_users_textarea\"></input>\n";
	print "<input type=\"submit\" name=\"dropFromCSV\" value=\"$message\" onclick=\"confirmation()\"></input>\n";

	print "</form>\n";

}

function printExecuteAddFromCSVForm(
	$classID,
	$sessionYear,
	$season,
	$message,
	$instructor_IDs,
	$ta_IDs,
	$add_users_textarea
)
{

	$instructor_IDs = implode(",", $instructor_IDs);
	$ta_IDs = implode(",", $ta_IDs);
	$add_users_textarea = implode(",", $add_users_textarea);

	print "\n<form name=\"add-users-execute\" method=\"post\" action=\"" .
		$_SERVER['PHP_SELF'] .
		"\">\n";

	print "<input type=\"hidden\" name=\"class\" value=\"$classID\"></input>\n";
	print "<input type=\"hidden\" name=\"session\" value=\"$sessionYear\"></input>\n";
	print "<input type=\"hidden\" name=\"season\" value=\"$season\"></input>\n";
	print "<input type=\"hidden\" name=\"execute\" value=\"unused\"></input>\n";
	print "<input type=\"hidden\" name=\"instructor_id\" value=\"$instructor_IDs\"></input>\n";
	print "<input type=\"hidden\" name=\"TA_ids\" value=\"$ta_IDs\"></input>\n";
	print "<input type=\"hidden\" name=\"add_users_textarea\" value=\"$add_users_textarea\"></input>\n";
	print "<input type=\"submit\" name=\"addFromCSV\" value=\"$message\" onclick=\"confirmation()\"></input>\n";

	print "</form>\n";

}

function printExecuteRemoveCourseForm($classID, $sessionYear, $season, $message)
{
	print "\n<form name=\"remove-course-execute\" method=\"post\" action=\"" .
		$_SERVER['PHP_SELF'] .
		"\">\n";

	print "<input type=\"hidden\" name=\"class\" value=\"$classID\"></input>\n";
	print "<input type=\"hidden\" name=\"session\" value=\"$sessionYear\"></input>\n";
	print "<input type=\"hidden\" name=\"season\" value=\"$season\"></input>\n";
	print "<input type=\"hidden\" name=\"execute\" value=\"unused\"></input>\n";
	print "<input type=\"submit\" name=\"removeCourse\" value=\"$message\" onclick=\"confirmation()\"></input>\n";

	print "</form>\n";
}

function printExecuteArchiveOldCourseForm($classID, $sessionYear, $season, $message)
{
	print "\n<form name=\"archive-old-course-execute\" method=\"post\" action=\"" .
		$_SERVER['PHP_SELF'] .
		"\">\n";

	print "<input type=\"hidden\" name=\"class\" value=\"$classID\"></input>\n";
	print "<input type=\"hidden\" name=\"session\" value=\"$sessionYear\"></input>\n";
	print "<input type=\"hidden\" name=\"season\" value=\"$season\"></input>\n";
	print "<input type=\"hidden\" name=\"execute\" value=\"unused\"></input>\n";
	print "<input type=\"submit\" name=\"archiveOldCourse\" value=\"$message\" onclick=\"confirmation()\"></input>\n";

	print "</form>\n";
}


function printExecuteRemoveAnnotationsForm($classID, $sessionYear, $season, $message)
{
	print "\n<form name=\"remove-annotations-execute\" method=\"post\" action=\"" .
		$_SERVER['PHP_SELF'] .
		"\">\n";

	print "<input type=\"hidden\" name=\"class\" value=\"$classID\"></input>\n";
	print "<input type=\"hidden\" name=\"session\" value=\"$sessionYear\"></input>\n";
	print "<input type=\"hidden\" name=\"season\" value=\"$season\"></input>\n";
	print "<input type=\"hidden\" name=\"execute\" value=\"unused\"></input>\n";
	print "<input type=\"submit\" name=\"cleanAnnotations\" value=\"$message\" onclick=\"confirmation()\"></input>\n";

	print "</form>\n";
}

function printExecuteImportCSVForm(
	$classID,
	$sessionYear,
	$department,
	$courseNo,
	$sectionNo,
	$season,
	$message,
	$csvStudentList
)
{

	$csvStudentList = implode(", ", $csvStudentList);

	print "\n<form name=\"import-csv\" method=\"post\" action=\"" .
		$_SERVER['PHP_SELF'] .
		"\">\n";

	print "<input type=\"hidden\" name=\"class\" value=\"$classID\"></input>\n";
	print "<input type=\"hidden\" name=\"session\" value=\"$sessionYear\"></input>\n";
	print "<input type=\"hidden\" name=\"department\" value=\"$department\"></input>\n";
	print "<input type=\"hidden\" name=\"season\" value=\"$season\"></input>\n";
	print "<input type=\"hidden\" name=\"courseNo\" value=\"$courseNo\"></input>\n";
	print "<input type=\"hidden\" name=\"sectionNo\" value=\"$sectionNo\"></input>\n";
	print "<input type=\"hidden\" name=\"execute\" value=\"unused\"></input>\n";
	print "<input type=\"hidden\" name=\"csvStudentList\" value=\"$csvStudentList\"></input>\n";
	print "<input type=\"submit\" name=\"importFromCSV\" value=\"$message\" onclick=\"confirmation()\"></input>\n";

	print "</form>\n";
}

function UTIL_setDefaultUISettings($userIDs, $verbose = true)
{
	// Set the UI setting, put the "time to show annotation parameter here"
	$users = new users();
	foreach ($userIDs as $ID) {
		$users->setUI($ID, "annotation", "yes", "by-default", 0);
	}
	$users->close();

	if ($verbose) {
		print("<b>Set default UI settings for all users added so far</b><br/><br/>");
	}
}

function UTIL_getGroupByName($groupNameSuffixToFind, $classID, $dbConn)
{

	$groupNameSuffixToFind = trim($groupNameSuffixToFind, "_");

	$query = "SELECT MIN(id) FROM groups WHERE class_id='$classID' AND name LIKE '%_$groupNameSuffixToFind'";
	$result = mysql_query($query, $dbConn);
	$groupID = mysql_result($result, 0);
	UTIL_printQueryResultNicely("Fetching group $groupID:", $result, $dbConn);

	if ($result == false) {
		return null;
	}

	return $groupID;
}

function UTIL_addUsersToGroup($userIDs, $groupID, $dbConn, $role = STUDENT)
{
	if ($role == TA) {
		$groupTable = "groupOwners";
	} else if ($role == INSTRUCTOR) {
		$groupTable = "groupOwners";
	} else if ($role == SYSADMIN) {
		$groupTable = "groupOwners";
	} else if ($role == STUDENT) {
		$groupTable = "groupMembers";
	} else {
		print "<span style=\"font-weight:bold;color:red\">FATAL ERROR! Invalid role code $role supplied! Hard aborting now!<br/>
		Please refresh the page to reload the tool to use other functionalities.<br/>
		Please file a bug report to the developer (thomas.dang@ubc.ca).</span><br/><br/>";
		exit();
	}

	foreach ($userIDs as $userID) {
		$query = "INSERT IGNORE INTO $groupTable VALUES ('$groupID', '$userID')";
		$result = mysql_query($query, $dbConn);
		UTIL_printQueryResultNicely($query, $result, $dbConn);
	}
}

function UTIL_addToInstructorAndTAGroup($userIDs, $classID, $dbConn, $role = null)
{

	if (empty($userIDs)) {
		return;
	}

	if (is_null($role) || $role == STUDENT) {
		print "<span style=\"font-weight:bold;color:red\">FATAL ERROR! Invalid role code $role supplied! Hard aborting now!<br/>
		Please refresh the page to reload the tool to use other functionalities.<br/>
		Please file a bug report to the developer (thomas.dang@ubc.ca).</span><br/><br/>";
		exit();
	}

	$groupID = UTIL_getGroupByName(INSTRUCTOR_AND_TA_GROUP, $classID, $dbConn);

	if (!is_null($groupID)) {
		print "<b>Adding some new users to default INSTRUCTOR AND TA group in the course</b><br/><br/>";

		UTIL_addUsersToGroup($userIDs, $groupID, $dbConn, $role);
	}

}

function UTIL_archivePreviousTermCourse($classID, $dbConn, $verbose = true)
{

	if ($verbose) {
		print("<b>Append _ARCHIVED_ to the old class name</b><br/><br/>");
	}

	$query = "UPDATE class SET name=CONCAT('_ARCHIVED_', name) WHERE id = $classID";
	$result = mysql_query($query, $dbConn);
	UTIL_printQueryResultNicely($query, $result, $dbConn);

	if ($verbose) {
		print("<b>Look up all the groups in this course and append _ARCHIVED_ to their names</b><br/><br/>");
	}

	$query = <<<EOT
	UPDATE groups SET name=CONCAT('_ARCHIVED_',name) WHERE id IN
		(SELECT id FROM (SELECT * FROM groups) as tempTable WHERE class_id = $classID) AND class_id = $classID;
EOT;
	$result = mysql_query($query, $dbConn);
	UTIL_printQueryResultNicely($query, $result, $dbConn);
}

function UTIL_addToEveryoneGroup($userIDs, $classID, $dbConn, $role = STUDENT)
{

	if (empty($userIDs)) {
		return;
	}

	$groupID = UTIL_getGroupByName(EVERYONE_GROUP, $classID, $dbConn);

	if (!is_null($groupID)) {
		print "<b>Adding some new users to default EVERYONE group in the course</b><br/><br/>";

		UTIL_addUsersToGroup($userIDs, $groupID, $dbConn, $role);
	}

}

function UTIL_dropHashedStudentsFromCourse($usersToDrop, $classID, $dbConn)
{
	$groupID = UTIL_getGroupByName(EVERYONE_GROUP, $classID, $dbConn);

	// drop users that are no longer registered
	foreach ($usersToDrop as $hashUserID) {
		// TODO: DB triggers 'DELETE_classEnrollmentLists_trigger' and 'DELETE_classInstructorAndTAs'
		// cascading deletions in classEnrollmentLists to groupMembers and groupOwners tables

		$query = "SELECT id FROM users WHERE hash_user_id LIKE '$hashUserID'";
		$result = mysql_query($query, $dbConn);
		$userID = mysql_result($result, 0);
		$resultText = ($result == false) ? ("<div style=\"color:red;\">failed, error: " . mysql_error($dbConn) . "</div>") : ("<div style=\"color:green;\">ok, retVal: " . mysql_result($result, 0) . "</div>");
		print "<br />query:$query<br />result: $resultText<br/>userID returned:$userID<br/>";

		$query = "DELETE FROM classEnrollmentLists WHERE user_id='$userID' AND class_id='$classID'";
		$result = mysql_query($query, $dbConn);
		$resultText = ($result == false) ? ("<div style=\"color:red;\">failed, error: " . mysql_error($dbConn) . "</div>") : ("<div style=\"color:green;\">ok, retVal: " . mysql_result($result, 0) . "</div>");
		print "<br />query:$query<br />result: $resultText<br/>";

		$query = "DELETE FROM groupMembers WHERE group_id='$groupID' AND user_id='$userID'";
		$result = mysql_query($query, $dbConn);
		$resultText = ($result == false) ? ("<div style=\"color:red;\">failed, error: " . mysql_error($dbConn) . "</div>") : ("<div style=\"color:green;\">ok, retVal: " . mysql_result($result, 0) . "</div>");
		print "<br />query:$query<br />result: $resultText<br/>";
	}
}

function updateClassEnrollment($classID, $dbConn, $command, $commandState, $csvStudentListArray = null)
{
	global $session, $department, $courseNo, $sectionNo, $season, $yteststudent_hashed_id;

	$isCourseNo4Character = strlen($courseNo) == 4;

	$oldEnrolled = getStudentsInClass_FROM_OVAL_DB($classID, $dbConn);

	$oldEnrolled = (empty($oldEnrolled)) ? array() : $oldEnrolled;
	$oldEnrolledTotal = count($oldEnrolled);

	if ($command == Commands::ImportFromSIS) {
		if (
			(
				is_null($department) ||
				strlen($department) < 4
			) ||
			(
				is_null($courseNo) ||
				strlen($courseNo) < 3 ||
				strlen($courseNo) > 4 ||
				!(is_numeric(substr($courseNo, 0, strlen($courseNo - 1))))
			) ||
			(
				is_null($sectionNo) ||
				strlen($sectionNo) < 3 ||
				strlen($sectionNo) > 4
			)
		) {
			print("<br/><span style=\"color:red;font-weight:bold\">
					STOP! This OVAL course does not appear to be a standard UBC course!
					<br/>
					The enrollment list cannot be queried automatically from SIS.
					<br/>
					Please return to the main menu and import a CSV student list instead.
					</span>
					<br/>");
			return;
		}
	}

	if (empty($csvStudentListArray)) {
		$studentNos = getStudentNumbers_FROM_SIS($session, $department, $courseNo, $sectionNo, $season);
	} else {
		$studentNos = $csvStudentListArray;

		$totalEnrolled = ($studentNos == null) ? 0 : count($studentNos);

		print("<br/>New enrollment list (excluding the test account): $totalEnrolled students<br/>");

		if ($commandState != CommandStates::Execute) {
			DEBUG_printSimpleArray($studentNos);
			print("<br/>");
		}
		print "<br/>";
	}

	// Courses with letters at the end sometimes have problems, let's try again!
	if ($isCourseNo4Character && $command == Commands::ImportFromSIS) {
		$courseNoWoutLetter = substr($courseNo, 0, 3);
		if (empty($studentNos)) {
			print("<span style=\"color:blue;font-weight:bold\">
					Warning: Has zero students. Let's try again once.</span>
					<br/><br/>");
			$studentNos = getStudentNumbers_FROM_SIS($session, $department, $courseNoWoutLetter, $sectionNo, $season);
		}
	}

	if (!empty($studentNos)) {

		$EntriesToSkip = array();
		foreach ($studentNos as $key => $studentNo) {
			if (!is_null($studentNo) && strlen($studentNo) >= 2) {
				$newEnrolled[] = hashUserID($studentNo);
			} else {
				$EntriesToSkip[] = $key + 1;
			}
		}

		if (!empty($EntriesToSkip)) {
			print("<span style=\"color:blue;font-weight:bold\">
					Warning: Several input ID's were found to be corrupted (blank, too short, etc.) and skipped, at positions:<br/>
					</span>");
			DEBUG_printSimpleArray($EntriesToSkip, 1, 70);
			print "<br/><br/>";
		}

		// yteststudent account
		$newEnrolled[] = $yteststudent_hashed_id;
		print("Also include the test student account, hashed student ID: $yteststudent_hashed_id<br/>");

		$newEnrolledTotal = count($newEnrolled);

		$compareViewWidth = ($commandState == CommandStates::Preview) ? "1000px" : "800px";
		$compareViewMinWidth = $compareViewWidth - 10;
		print "<div style=\"min-width:$compareViewMinWidth" . "px;text-align:center;\">";
		print "<br/><fieldset style=\"border:0px;margin:0px;padding:0px;margin-left:auto;margin-right:auto;width:$compareViewWidth\">";
		print "<div style=\"float:left;\">Existing enrollment list in OVAL (hashed): <b>$oldEnrolledTotal students</b><br />";

		if ($commandState == CommandStates::Preview) {
			DEBUG_printSimpleArray($oldEnrolled);
		}

		print "</div>";
		print "<div style=\"float:right\">New enrollment list (hashed): <b>$newEnrolledTotal students</b><br />";

		if ($commandState == CommandStates::Preview) {
			DEBUG_printSimpleArray($newEnrolled);
		}

		print "</div>";
		print "</fieldset>";
		print "</div>";

		// get the difference
		$usersToAdd = array_diff($newEnrolled, $oldEnrolled);
		$usersToDrop = array_diff($oldEnrolled, $newEnrolled);

		$usersToAddTotal = count($usersToAdd);
		$usersToDropTotal = count($usersToDrop);

		print "<div style=\"min-width:$compareViewMinWidth" . "px;text-align:center;\">";
		print "<br/><fieldset style=\"border:0px;margin:0px;padding:0px;margin-left:auto;margin-right:auto;width:$compareViewWidth\">";
		print "<div style=\"float:left\">Users to add to $session$season $department $courseNo $sectionNo: <b>$usersToAddTotal students</b><br />";

		if ($commandState == CommandStates::Preview) {
			DEBUG_printSimpleArray($usersToAdd);
		}

		print "</div>";
		print "<div style=\"float:right\">Users to drop from $session$season $department $courseNo $sectionNo: <b>$usersToDropTotal students</b><br />";

		if ($commandState == CommandStates::Preview) {
			DEBUG_printSimpleArray($usersToDrop);
		}

		print "</div>";
		print "</fieldset>";
		print "</div>";
		print "<br/>";

		$nothingToDo = ($usersToAddTotal == 0 && $usersToDropTotal == 0);
		if ($nothingToDo) {
			print("<span style=\"color:blue;font-weight:bold\">
					Warning: apparently both the \"to add\" and \"to drop\" lists are empty.<br/>
					There is probably nothing to do for this command, or you should import another data source.
					</span>
					<br/><br/>");
		}

		if ($isCourseNo4Character && $command == Commands::ImportFromSIS) {
			print("<span style=\"color:blue;font-weight:bold\">
					Warning: SIS often doesn't return correct enrollment lists for courses ending with a letter.<br/>
					If the number of students is different from students.ubc.ca, please import an enrollment list (csv) manually.</span>
					<br/><br/>");
		}

		if ($nothingToDo) {
			return;
		}

		if ($commandState == CommandStates::Preview) {

			print("<span style=\"color:red;font-weight:bold\">
				STOP! Check the student numbers, or at least the total number enrolled, against students.ubc.ca to make sure!
				<br>
				Please also double check the year, season, etc. to ensure that you are updating the course that you intended!
				</span>
				<br/><br/>");

			printExecuteImportCSVForm($classID, $session, $department, $courseNo, $sectionNo, $season, "Go Ahead and Execute the Update(s)", $studentNos);

		} else {

			print("<span style=\"font-weight:bold\">
				STOP! Please check the results of the database updates to OVAL 
				<br>
				to make sure that all the results are <span style=\"color:green\">green</span>
				</span>
				<br/><br/>");

			// The rest of the debug messages (SQL output) goes into a text area, for neatness
			print "<div style=\"min-width:1024px;text-align:center;font-size:75%\">";
			print "<div style=\"margin-left:auto;margin-right:auto;border:1px solid gray;height:200px;width:1030px;white-space:pre-wrap;overflow:scroll;\">";

			// add new users to the course, creating new users if necessary.
			$userIDs = createUsers($usersToAdd, STUDENT, $dbConn, true);
			addStudents($classID, $userIDs, $dbConn);

			UTIL_setDefaultUISettings($userIDs);

			UTIL_addToEveryoneGroup($userIDs, $classID, $dbConn);

			// dropping old students from the course and the everyone_group
			UTIL_dropHashedStudentsFromCourse($usersToDrop, $classID, $dbConn);

			print "</div></div>";
		}
	} else {
		print("<span style=\"color:red;font-weight:bold\">
				STOP! SIS returns 0 students in the course for this term. Perhaps try again later or import a spreadsheet.
				<br>
				Also double check the year, season, etc. to ensure that you are updating the course that you intended!
				</span>
				<br/>");
	}
}

function is_alpha($someString)
{
	return (preg_match("/[A-Z\s_]/i", $someString) > 0) ? true : false;
}

function getCourses($dbConn)
{
	//list class that have already been created
	$query = "SELECT * FROM class ORDER BY name ASC";
	$result = mysql_query($query, $dbConn);

	while ($row = mysql_fetch_assoc($result)) {
		$ID = $row['id'];
		$classes[$ID] = $row['name'];
	}

	return $classes;
}
// try not to have <?php and <? tags in the middle of functions
?> 

<?php

function setUpBackAndRefreshChecking($notification)
{

	if ($notification == null || strlen($notification) <= 0) {
		$notification = "You are about to leave this page (via 'back' or 'reload' button). Please make sure that you don't lose any work in progress.";
	}

	print <<<EOT

var LeavingViaBackButton = true;

function confirmation() {
	LeavingViaBackButton = false;
}

window.onbeforeunload = function (e) {
    if (LeavingViaBackButton) {
		return "$notification";
    }
};
EOT;

}


?>

<?php
function bulkImportUI($msg, $dbConn)
{
	global $DEFAULT_TEXTAREA_CONTENT;
	$classes = getCourses($dbConn);

	if (!empty($classes)) {
		?>
		  <fieldset style="width:600px;border-radius:6px;"><div id="msg"><?= $msg ?></div>
		  <h4 id="detailed_ui_title_bulk_import" class="detailed_ui_title">Bulk import enrollment list for courses already in OVAL</h4>
  
		  <div style="margin:0px;padding:0px;border:0px" class="detailed_ui" id="detailed_ui_bulk_import">
		  <form name="import-enrollment-list" id="import-enrollment-list" method="post" action="<?= $_SERVER['PHP_SELF'] ?>">
		  <label for="session">Session</label>
		  <select name="session">
			  <option value="2012">2012</option>
			<option value="2013" selected>2013</option>
		  </select>
		  <label for="season">Season</label>
		  <select name="season">
			  <option value="W" selected>W</option>
			<option value="S">S</option>
		  </select>
		  <label for="class">Course</label>
		  <select name="class">
		<?php foreach ($classes as $ID => $name): ?>
				<option value="<?= $ID ?>"><?= $name ?></option>
		<?php endforeach; ?>
		  </select>
  
		  <br/>
		  <br/>
		  <label for="import_source">Importing from SIS (automatic) or manually provide a student list?</label>
		  <br/>
		  <input name="import_source" id="import_source_sis" type="radio" value="sis" checked/>
			  <label for="import_source_sis">&nbsp;From SIS</label>
			  &nbsp;&nbsp;&nbsp;
		  <input name="import_source" id="import_source_csv" type="radio" value="csv"/>
			  <label for="import_source_csv">&nbsp;Manual List (comma or newline separated)</label> 
		  <br />
		  <textarea cols="70" rows="8" style="white-space:pre-wrap" name="import_source_csv_textarea" id="import_source_csv_textarea" form="import-enrollment-list">
		<?php print "$DEFAULT_TEXTAREA_CONTENT"; ?>	
		  </textarea>
		  <br />
		  <input type="submit" name="bulkImportEnrollment" id="import-enrollment-list" value="Import" onClick="confirmation()" style="font-size:16px"/>
		  </form>
		  </div>
		  </fieldset>
		  <br/>
		<?php
	}
}
?>

<?php
function addUsersUI($msg, $dbConn)
{
	global $DEFAULT_TEXTAREA_CONTENT;
	$classes = getCourses($dbConn);

	if (!empty($classes)) {
		?>
		  <fieldset style="width:600px;border-radius:6px;"><div id="msg"><?= $msg ?></div>
		  <h4 id="detailed_ui_title_add_users" class="detailed_ui_title">Add instructors/TA's/students to a course in OVAL</h4>
  
		  <div style="margin:0px;padding:0px;border:0px" class="detailed_ui" id="detailed_ui_add_users">
		  <form name="add_users_form" id="add_users_form" method="post" action="<?= $_SERVER['PHP_SELF'] ?>">
		  <label for="session">Session</label>
		  <select name="session">
			  <option value="2012">2012</option>
			<option value="2013" selected>2013</option>
		  </select>
		  <label for="season">Season</label>
		  <select name="season">
			  <option value="W" selected>W</option>
			<option value="S">S</option>
		  </select>
		  <label for="class">Course</label>
		  <select name="class">
		<?php foreach ($classes as $ID => $name): ?>
				<option value="<?= $ID ?>"><?= $name ?></option>
		<?php endforeach; ?>
		  </select>
		  <br/>
		  <br />
		  <label for="instructor_id">Instructors' CWL Id, Employee No, or Student No (comma separated list)</label>
		  <br />
		  <input name="instructor_id" type="text" value="" size="60" maxlength="120" />
		  <br />
		  <br />
		  <label for="TA_ids">TA's CWL Id, Employee No, or Student No (comma separated list)</label>
		  <br />
		  <input name="TA_ids" type="text" value="" size="60" maxlength="120" />
		  <br />
		  <br />
		  <label for="add_users_textarea">Students' CWL Id, Employee No, or Student No (comma separated list)</label>
		  <br/>
		  <textarea cols="70" rows="8" style="white-space:pre-wrap" name="add_users_textarea" id="add_users_textarea" form="add_users_form">
		<?php print "$DEFAULT_TEXTAREA_CONTENT"; ?>
		  </textarea>
		  <br />
		  <input type="submit" name="addFromCSV" id="add_users_form" value="Add" onClick="confirmation()" style="font-size:16px"/>
		  </form>
		  </div>
		  </fieldset>
		  <br/>
		<?php
	}
}
?>

<?php
function dropUsersUI($msg, $dbConn)
{
	global $DEFAULT_TEXTAREA_CONTENT;
	global $DEFAULT_TEXTAREA_CONTENT_DROP_NOTE;
	$classes = getCourses($dbConn);

	if (!empty($classes)) {
		?>
		  <fieldset style="width:600px;border-radius:6px;"><div id="msg"><?= $msg ?></div>
		  <h4 id="detailed_ui_title_drop_users" class="detailed_ui_title">Drop instructors/TA's/students from a course in OVAL</h4>
  
		  <div style="margin:0px;padding:0px;border:0px" class="detailed_ui" id="detailed_ui_drop_users">
		  <form name="drop_users_form" id="drop_users_form" method="post" action="<?= $_SERVER['PHP_SELF'] ?>">
		  <label for="session">Session</label>
		  <select name="session">
			  <option value="2012">2012</option>
			<option value="2013" selected>2013</option>
		  </select>
		  <label for="season">Season</label>
		  <select name="season">
			  <option value="W" selected>W</option>
			<option value="S">S</option>
		  </select>
		  <label for="class">Course</label>
		  <select name="class">
		<?php foreach ($classes as $ID => $name): ?>
				<option value="<?= $ID ?>"><?= $name ?></option>
		<?php endforeach; ?>
		  </select>
		  <br/>
		  <br />
		  <label for="instructor_id">Instructors' CWL Id, Employee No, or Student No (comma separated list)</label>
		  <br />
		  <input name="instructor_id" disabled type="text" value="" size="60" maxlength="120" />
		  <br />
		  <br />
		  <label for="TA_ids">TA's CWL Id, Employee No, or Student No (comma separated list)</label>
		  <br />
		  <input name="TA_ids" type="text" disabled value="" size="60" maxlength="120" />
		  <br />
		  <br />
		  <label for="drop_users_textarea">Students' CWL Id, Employee No, or Student No (comma separated list)</label>
		  <br/>
		  <textarea cols="70" rows="8" style="white-space:pre-wrap" name="drop_users_textarea" id="drop_users_textarea" form="drop_users_form">
		<?php print "$DEFAULT_TEXTAREA_CONTENT" . "$DEFAULT_TEXTAREA_CONTENT_DROP_NOTE"; ?>	
		  </textarea>
		  <br />
		  <input type="submit" name="dropFromCSV" id="drop_users_form" value="Drop" onClick="confirmation()" style="font-size:16px"/>
		  </form>
		  </div>
		  </fieldset>
		  <br/>
		<?php
	}
}
?>

<?php
function dropCourseUI($msg, $dbConn)
{
	$classes = getCourses($dbConn);

	if (!empty($classes)) {
		?>
		  <fieldset style="width:600px;border-radius:6px;"><div id="msg"><?= $msg ?></div>
		  <h4 id="detailed_ui_title_drop_course" class="detailed_ui_title">Remove course (created by mistake, wrong name, etc.) from OVAL</h4>
  
		  <div style="margin:0px;padding:0px;border:0px" class="detailed_ui" id="detailed_ui_drop_course">
		  <form name="drop_course_form" method="post" action="<?= $_SERVER['PHP_SELF'] ?>">
		  <label for="session">Session</label>
		  <select name="session">
			  <option value="2012">2012</option>
			<option value="2013" selected>2013</option>
		  </select>
		  <label for="season">Season</label>
		  <select name="season">
			  <option value="W" selected>W</option>
			<option value="S">S</option>
		  </select>
		  <label for="class">Course</label>
		  <select name="class">
		<?php foreach ($classes as $ID => $name): ?>
				<option value="<?= $ID ?>"><?= $name ?></option>
		<?php endforeach; ?>
		  </select>
		  <br/>
		  <br/>
		  <!-- <span>Feature not implemented yet! Email the developer or DB admin to drop course.</span> -->
		  <input type="submit" name="removeCourse" id="drop_course_form" value="Remove Course" onClick="confirmation()" style="font-size:16px"/>
		  </form>
		  </div>
		  </fieldset>
		  <br/>
		<?php
	}
}
?>

<?php
function lifeCycleManagementUI($msg, $dbConn)
{
	$classes = getCourses($dbConn);

	if (!empty($classes)) {
		?>
		  <fieldset style="width:600px;border-radius:6px;"><div id="msg"><?= $msg ?></div>
		  <h4 id="detailed_ui_title_clean_annotations" class="detailed_ui_title">Course Life Cycle Management (eg. from term to term)</h4>
  
		  <div style="margin:0px;padding:0px;border:0px" class="detailed_ui" id="detailed_ui_clean_annotations">
		  <form name="clean_annotations_form" method="post" action="<?= $_SERVER['PHP_SELF'] ?>">
		  <label for="session">Session</label>
		  <select name="session">
			  <option value="2012">2012</option>
			<option value="2013" selected>2013</option>
		  </select>
		  <label for="season">Season</label>
		  <select name="season">
			  <option value="W" selected>W</option>
			<option value="S">S</option>
		  </select>
		  <label for="class">Course</label>
		  <select name="class">
		<?php foreach ($classes as $ID => $name): ?>
				<option value="<?= $ID ?>"><?= $name ?></option>
		<?php endforeach; ?>
		  </select>
		  <br/>
		  <br/>
		  <input 
		  title="Use this if you want to reuse the videos in a course, only wiping out old annotations and then update the class list"
		  type="submit" name="cleanAnnotations" id="clean_annotations_form" value="Clean Annotations" onClick="confirmation()" style="font-size:16px"/>
		  <br/>
		  <br/>
		  <input 
		  title="This will archive an old course, so that there won't be conflicts when you create a new course of the same name."
		  type="submit" name="archiveOldCourse" id="clean_annotations_form" value="Archive Old Course" onClick="confirmation()" style="font-size:16px"/>
		  </form>
		  </div>
		  </fieldset>
		  <br/>
		<?php
	}
}
?>

<?php
$pageHeader = strtoupper($DEPLOYMENT_NAME) . " - OVAL admin tool (last updated $OVAL_ADM_TOOL_LAST_UPDATE)";
$pageTitle = strtoupper($DEPLOYMENT_NAME) . " - OVAL admin tool";

?>


<html xmlns="http://www.w3.org/1999/xhtml">
<div style="font-family:'Lucida Sans Unicode';min-width:600px;text-align:center;">
<div style="width:660px;margin-left:auto;margin-right:auto;">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?= $pageHeader ?></title>
<!-- <script src="http://code.jquery.com/jquery-latest.js"></script> --> <!-- chrome complains insecure -->
<script type="text/javascript" src="kaltura-html5player-widget/jquery-1.4.2.min.js"></script>
<script type="text/javascript">

$(document).ready(function() {
	if ($('#msg').html().length > 0) {
		$('#msg').css('background-color', 'yellow');
		$('#msg').css('padding', '2px');
		$('#msg').fadeOut(5000, 'swing', function() {
			$(this).css('display', 'none');
		});
	}

	courseNameInput_showSIS();

	$("#is_SIS_course_yes").click( function() {
		courseNameInput_showSIS();
	});

	$("#is_SIS_course_no").click( function() {
		courseNameInput_showCustom();
	});

	detailedUI_hideAll();

	$("#detailed_ui_title_bulk_import").click( function() {
		detailedUI_showBulkImport();
	});

	$("#detailed_ui_title_add_course").click( function() {
		detailedUI_showAddCourse();
	});

	$("#detailed_ui_title_add_users").click( function() {
		detailedUI_showAddUsers();
	});

	$("#detailed_ui_title_drop_users").click( function() {
		detailedUI_showDropUsers();
	});

	$("#detailed_ui_title_drop_course").click( function() {
		detailedUI_showDropCourse();
	});

	$("#detailed_ui_title_clean_annotations").click( function() {
		detailedUI_showCleanAnnotations();
	});
	
	csvTextarea_hide();

	$("#import_source_sis").click( function() {
		csvTextarea_hide();
	});

	$("#import_source_csv").click( function() {
		csvTextarea_show();
	});   

	$("#import_source_csv_textarea").click( function() {
		if (!import_source_csv_textarea_DEFAULT_ERASED) {
			$("#import_source_csv_textarea").text("");
			import_source_csv_textarea_DEFAULT_ERASED = true; 
		}
	});

	$("#add_users_textarea").click( function() {
		if (!add_users_textarea_DEFAULT_ERASED) {
			$("#add_users_textarea").text("");
			add_users_textarea_DEFAULT_ERASED = true; 
		}
	});  

	$("#drop_users_textarea").click( function() {
		if (!drop_users_textarea_DEFAULT_ERASED) {
			$("#drop_users_textarea").text("");
			drop_users_textarea_DEFAULT_ERASED = true; 
		}
	});

});

var import_source_csv_textarea_DEFAULT_ERASED = false;
var add_users_textarea_DEFAULT_ERASED = false;
var drop_users_textarea_DEFAULT_ERASED = false;

function courseNameInput_showCustom() {
	$(".course_input").css("display","none");

	$("#course_input_custom").css("display","inline");	
}

function courseNameInput_showSIS() {
	$(".course_input").css("display","none");

	$("#course_input_SIS").css("display","inline");
}

function detailedUI_hideAll() {
	$(".detailed_ui").css("display","none");
}

function detailedUI_showBulkImport() {
	showHideDetailedUI("detailed_ui_bulk_import");
}

function detailedUI_showAddCourse() {
	showHideDetailedUI("detailed_ui_add_course");
}

function detailedUI_showAddUsers() {
	showHideDetailedUI("detailed_ui_add_users");
}

function detailedUI_showDropUsers() {
	showHideDetailedUI("detailed_ui_drop_users");
}

function detailedUI_showDropCourse() {
	showHideDetailedUI("detailed_ui_drop_course");
}

function detailedUI_showCleanAnnotations() {
	showHideDetailedUI("detailed_ui_clean_annotations");
}

function showHideDetailedUI(elementID) {

	if ($("#" + elementID).css("display") == "none") {
		detailedUI_hideAll();

		$("#" + elementID).css("display","inline");
	} else {
		detailedUI_hideAll();
	}
}

function csvTextarea_show() {
	$("#import_source_csv_textarea").css("display", "inline");
}

function csvTextarea_hide() {
	$("#import_source_csv_textarea").css("display", "none");
}

</script>
<h3><?= $pageHeader ?></h3>

<!-- some CSS, refactor this out to a stylesheet if it gets big -->
<style>
.detailed_ui_title {text-decoration:underline;color:#003399;} 
.detailed_ui_title:hover {color:#0066FF;}
fieldset {
background-color:#dae2e9;
border-color:#B1BEC9;

/* GRADIENT STARTS */
background: <?= $themeColor ?>; /* Old browsers */
background: -moz-linear-gradient(45deg, <?= $themeColor ?> 0%, rgba(222,232,239,1) 35%, rgba(244,248,255,1) 70%); /* FF3.6+ */
background: -webkit-gradient(linear, left bottom, right top, color-stop(0%,<?= $themeColor ?>), color-stop(35%,rgba(222,232,239,1)), color-stop(70%,rgba(244,248,255,1))); /* Chrome,Safari4+ */
background: -webkit-linear-gradient(45deg, <?= $themeColor ?> 0%,rgba(222,232,239,1) 35%,rgba(244,248,255,1) 70%); /* Chrome10+,Safari5.1+ */
background: -o-linear-gradient(45deg, <?= $themeColor ?> 0%,rgba(222,232,239,1) 35%,rgba(244,248,255,1) 70%); /* Opera 11.10+ */
background: -ms-linear-gradient(45deg, <?= $themeColor ?> 0%,rgba(222,232,239,1) 35%,rgba(244,248,255,1) 70%); /* IE10+ */
background: linear-gradient(45deg, <?= $themeColor ?> 0%,rgba(222,232,239,1) 35%,rgba(244,248,255,1) 70%); /* W3C */
/* GRADIENT ENDS */

/* SHADOWS */
-moz-box-shadow:    -1px 1px 2px 1px #bbb;
-webkit-box-shadow: -1px 1px 2px 1px #bbb;
box-shadow:         -1px 1px 2px 1px #bbb;

} 
input[type="radio"]:checked + label {font-weight:bold;}

input[type="text"]:disabled {background-color:#E0E0E0;}
</style>

</head>
<body style="font-size:14px;">

<?php
print "<span style=\"color:red\">With great power comes great responsibility... (Uncle Ben to Spiderman)</span><br/>
			This tool gives you sysadmin power on OVAL server <b>\"$configFolderName\"</b>, and lets you update or delete<br/>
			class lists that may be in use. Please always <b>check every parameters</b> of your commands<br/>
			carefully before proceeding, and <b>stop to verify the result</b> preview at checkpoints<br/>
			as the commands are in progress.<br/><br/>";

?>

<?php
bulkImportUI($msg, $dbConnection);
addUsersUI($msg, $dbConnection);
dropUsersUI($msg, $dbConnection);
?>
  <fieldset style="width:600px;border-radius:6px;">
  <h4 id="detailed_ui_title_add_course" class="detailed_ui_title">Add a course to OVAL (and add instructor and TA accounts)</h4>
  
  <div style="margin:0px;padding:0px;border:0px" class="detailed_ui" id="detailed_ui_add_course">
  <? if (!empty($errors)): ?>
		Please fix the following errors:
		<ul>
	  	<?= $errors ?>
		</ul>
		<br/>
  <? else: ?>
		<!-- <strong>Note:</strong> double check employee numbers to make sure they are entered correctly.<br /> -->
  <? endif; ?>
  
  <form name="create-class" method="post" action="<?= $_SERVER['PHP_SELF'] ?>">
  <label for="session">Session</label>
  <select name="session">
	  <option value="2012">2012</option>
	<option value="2013" selected>2013</option>
  </select>
  <label for="season">Season</label>
  <select name="season">
	  <option value="W" selected>W</option>
	<option value="S">S</option>
  </select>
  <br/>
  <label for="is_SIS_course">Is this a standard SIS course or a custom OVAL deployment?</label>
  <br/>
  <input name="is_SIS_course" id="is_SIS_course_yes" type="radio" value="yes" checked/>
	  <label for="is_SIS_course_yes">&nbsp;SIS Course</label>
	  <br/>
  <input name="is_SIS_course" id="is_SIS_course_no" type="radio" value="no"/>
	  <label for="is_SIS_course_no">&nbsp;Custom Course in OVAL</label>
	  <br/> 
  <br />
  <fieldset style="margin-left:auto;margin-right:auto;width:400px;border-radius:6px" id="course_input_SIS" class="course_input">
	  <label for="department">Department (4 characters)</label>
	  <input name="department" type="text" value="" size="4" maxlength="4" style="text-transform:uppercase;" />
	  <br />
	  <label for="course">Course number (3 or 4 characters)</label>
	  <input name="course_number" type="text" value="" size="4" maxlength="4" />
	  <br />
	  <label for="section">Section number (3 or 4 characters)</label>
	  <input name="section_number"  type="text" value="" size="4" maxlength="4" />
  </fieldset>
  <fieldset style="margin-left:auto;margin-right:auto;width:400px;border-radius:6px" id="course_input_custom" class="course_input">
	  <label for="course_name">Course Name (no white spaces)</label><br/>
	  <input name="course_name" type="text" value="" size="32" maxlength="32" />
  </fieldset>
  <br />
  <br />
  <label for="instructor_id">Instructors' CWL Id, Employee No, or Student No (comma separated list)</label>
  <br />
  <input name="instructor_id" type="text" value="" size="60" maxlength="120" />
  <br />
  <br />
  <label for="TA_ids">TA's CWL Id, Employee No, or Student No (comma separated list)</label>
  <br />
  <input name="TA_ids" type="text" value="" size="60" maxlength="120" />
  <br />
  <br />
  <span style="font-size:10px;font-weight:bold">This creates a course shell without any students. Please import student list afterward.</span>
  <br/>
  <input type="submit" name="createCourse" id="create-class" value="create" onClick="confirmation()" style="font-size:16px"/>
  </form>
  </div>
  </fieldset>
  <br/>
  
<?php
dropCourseUI($msg, $dbConnection);
lifeCycleManagementUI($msg, $dbConnection);

?> 
 
  <script type="text/javascript">
<?php
setUpBackAndRefreshChecking();
?>  
  </script>
</body>
</div>
</div>
</html>
