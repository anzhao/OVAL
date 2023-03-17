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

require_once(dirname(__FILE__) . "/includes/global_deploy_config.php");
require_once(dirname(__FILE__) . '/includes/kaltura/kaltura_functions.php');
require_once(dirname(__FILE__) . "/includes/common.inc.php");

// override max_execution_time for this script because uploads to Kaltura can take a very long time
$max_execution_time = 60 * 60;
set_time_limit($max_execution_time);
writeToLog("\n-------------- Starting clas_dir/upload_to_kaltura.php -----------------\n");

// restrict this script to run from command line only
$sapi_type = php_sapi_name();

if ('cli' != substr($sapi_type, 0, 3)) {
	exit;
} else {
}

$title = stripslashes($argv[1]);
$description = stripslashes($argv[2]);
$userID = $argv[3];
$file = $argv[4];
$CopyrightTerm1 = $argv[5];
$CopyrightTerm2 = $argv[6];
$CopyrightTerm3 = $argv[7];
$CopyrightTerm4 = $argv[8];

writeToLog("$file: title $title -> upload started at " . date("H:i:s") . "\n");

// store custom data in 'tags' field since we aren't using the tags field
$data = "$serverVersion,$userID" .
	",$CopyrightTerm1" .
	",$CopyrightTerm2" .
	",$CopyrightTerm3" .
	",$CopyrightTerm4" .
	"";

$fileToUpload = $uploadPath . $file;

writeToLog("calling uploadToKaltura($fileToUpload, $title, $description, $data)" . "\n");
// die;

$entryID = uploadToKaltura($fileToUpload, $title, $description, $data);
writeToLog("$file: title $title -> upload finished at " . date("H:i:s") . ", result entry_id $entryID\n");
?>