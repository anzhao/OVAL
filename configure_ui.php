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


include_once(dirname(__FILE__) . '/database/media.php');
include_once(dirname(__FILE__) . '/database/users.php');
include_once(dirname(__FILE__) . "/includes/common.inc.php");


startSession();

$userName = $_SESSION['name'];
$userID = $_SESSION['user_id'];
$isAdmin = $_SESSION['role'];

if (!isAdmin($_SESSION['role']))
    die($adminPrivRequiredMsg);


$user = new users();
$classes = $user->getClassesUserBelongsTo($userID);
$user->close();
//print_r($classes);

if (empty($classes)) {
    print "There are no classes associated with your account";
    exit;
} else {
    (isset($_GET['class_id'])) ? $classID = $_GET['class_id'] : $classID = $classes[0]['ID'];
}


if (formSubmitted()) {
    //print "<b>formSubmitted()</b>";    
    // TODO validate form
    // processForm();
    $keys = array_keys($_POST);
    //print_r($_POST);
    $users = new users();
    //$users->truncateTable();
    $users->close();
    //print_r($_POST);
    $inputsPerUser = 4;
    // minus one because last $_POST var is submission button
    for ($i = 0; $i < sizeof($_POST) - 1; $i++) {
        $key = $keys[$i];
        $value = $_POST[$keys[$i]];
        //print "sizeof(\$_POST):" . sizeof($_POST);        
//print "value:$value<br />";

        if (0 == $i % $inputsPerUser) {
            $userID = substr($key, 0, strpos($key, "_annotation_mode"));
            $annotationMode = $value;
            //print "annotationMode:$annotationMode<br />";
        }
        if (1 == $i % $inputsPerUser) {
            $annotationsEnabled = $value;
            //print "trendlineVisibility: $trendlineVisibility<br />";
        }
        if (2 == $i % $inputsPerUser) {
            $trendlineVisibility = $value;
            //print "trendlineVisibility: $trendlineVisibility<br />";
        }
        if (3 == $i % $inputsPerUser) {
            $N = $value;
            //print "setUI($userID, $annotationMode, $trendlineVisibility, $N)<br />";
//print "N: $N<br />";        
            setUI($userID, $annotationMode, $annotationsEnabled, $trendlineVisibility, $N);
        }
    }
}

displayForm();

function setUI($userID, $annotationMode, $annotationEnabled, $trendlineVisibility, $N)
{
    $users = new users();
    $userUI = $users->setUI($userID, $annotationMode, $annotationEnabled, $trendlineVisibility, $N);
    $users->close();
    //print_r($users);
}

function getUI($userID)
{
    $users = new users();
    $userUI = $users->getUI($userID);
    $users->close();
    //print_r($users);
    return $userUI;
}

function getClassList($classID)
{
    //print "classID: $classID";
    $users = new users();
    $classList = $users->getClassList($classID, false);
    $users->close();
    //print_r($classList);

    return $classList;
}

function displayForm()
{
    global $userID, $userName, $videoID, $authorizedUsers, $classes, $classID; ?>
    <!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <title>User Interface Configuration</title>
        <script type="text/javascript" src="kaltura-html5player-widget/jquery-1.4.2.min.js"></script>
        <script type="text/javascript">
            function jumpBoxClass(list) {
                var url = "configure_ui.php?class_id=" + $('#class').val();
                //alert(list.options[list.selectedIndex].value);
                console.log("jumpBoxClass " + url);
                location.href = url;
            }
            $(document).ready(function () {
                $('#update-conversion-status').click(function () {
                    //alert('Handler for .click() called.');
                    window.location.reload()
                });
            });
            function updateN(id) {
                var trendlineID = '#' + id + '_trendline_visibility';
                console.log("target " + trendlineID);
                console.log($(trendlineID).val());

                var numberID = '#' + id + '_number';
                if ("by-default" == $(trendlineID).val()) {
                    // if option value is BY_DEFAULT then set text input to zero and readonly
                    console.log("target match");
                    $(numberID).attr('readonly', 'readonly');
                    $(numberID).attr('value', 0);
                } else {
                    $(numberID).attr('readonly', '');
                }
            }
        </script>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <link rel="stylesheet" type="text/css" href="admin-page.css" />
    </head>

    <body>
        <div id="wrapper">
            <?php printAdminBar(false, $userName) ?>
            <div style="clear:both"></div>
            <strong>User Interface Configuration</strong>
            <br />
            <br />
            <label style="font-size:100%">select class
                <select name="class" id="class" onchange="jumpBoxClass()">
                    <?php
                    //print "classID: $classID";
                    foreach ($classes as $class) {
                        //print_r($class);        
                        $ID = $class['ID'];
                        $name = $class['name'];
                        ($classID == $ID) ? $selected = "selected=\"selected\"" : $selected = "";
                        print "\t<option value=\"$ID\" $selected>$name</option>\n";
                    }
                    ?>
                </select>
            </label>

            <form id="form1" name="form1" method="post" action="">
                <table style="width:800px;height:auto;">
                    <thead>
                        <tr style="border-bottom:1px solid black">
                            <th>user name</th>
                            <th>annotation mode</th>
                            <th>annotations enabled</th>
                            <th>group annotations visible</th>
                            <th>N days</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $users = getClassList($classID);
                        //print_r($users);        
                        foreach ($users as $user) {
                            //print_r($user);        
                            // if the userName is not initialized
                            (" " == ($user['name'])) ? $userName = "-- UNINITIALIZED --" : $userName = $user['name'];
                            $userID = $user['ID'];
                            //        $email      = $user['Email'];
                            $userUI = getUI($userID);
                            print '<div style="width:900px;"></div>';
                            //print_r($userUI); print "<br />";        
//        (in_array($userID, $authorizedUsers)) ? $selected="selected=\"selected\"" : $selected="";
                    
                            $annotationMode = array(
                                "annotation",
                                "PSYC"
                            );

                            $annotationsEnabled = array(
                                "yes",
                                "no"
                            );

                            $trendlineVisSettings = array(
                                "by-default",
                                "after-n-days"
                            );
                            ?>
                            <tr style="border-bottom:1px solid black">
                                <td>
                                    <?php echo "$userName" ?>
                                </td>
                                <td>
                                    <select name="<?php echo $userID ?>_annotation_mode" size="1"
                                        id="<?php echo $userID ?>_annotation_mode">
                                        <?php foreach ($annotationMode as $mode) {
                                            //print "mode: {$userUI['annotation_mode']}<br />";    
                                            ($mode == $userUI['annotation_mode']) ? $selected = " selected " : $selected = "";
                                            ?>
                                            <option value="<?php echo $mode ?>" <?php echo $selected ?>><?php echo $mode ?></option>
                                        <?php } ?>
                                    </select>
                                </td>
                                <td>
                                    <select name="<?php echo $userID ?>_annotations_enabled" size="1"
                                        id="<?php echo $userID ?>_annotations_enabled">
                                        <?php foreach ($annotationsEnabled as $enabled) {
                                            //print "enabled: {$userUI['annotations_enabled']}<br />";    
                                            ($enabled == $userUI['annotations_enabled']) ? $selected = " selected " : $selected = "";
                                            ?>
                                            <option value="<?php echo $enabled ?>" <?php echo $selected ?>><?php echo $enabled ?>
                                            </option>
                                        <?php } ?>
                                    </select>
                                </td>
                                <td>
                                    <select name="<?php echo $userID ?>_trendline_visibility" size="1"
                                        id="<?php echo $userID ?>_trendline_visibility" onChange="updateN(<?php echo $userID ?>)">
                                        <?php foreach ($trendlineVisSettings as $setting) {
                                            ($setting == $userUI['trendline_visibility']) ? $selected = " selected " : $selected = "";
                                            (BY_DEFAULT == $userUI['trendline_visibility']) ? $readonly = "readonly" : $readonly = "";
                                            ?>
                                            <option value="<?php echo $setting ?>" <?php echo $selected ?>><?php echo $setting ?>
                                            </option>
                                        <?php } ?>
                                    </select>
                                </td>
                                <td>
                                    <input name="<?php echo $userID ?>_number" type="text" id="<?php echo $userID ?>_number"
                                        value="<?php echo $userUI['n'] ?>" size="2" <?php echo $readonly ?> />
                                </td>
                            </tr>
                            <?php
                        }
                        ?>
                        <br />
                    </tbody>
                </table>
                <input type="submit" name="submit" id="submit" style="margin-left:720px;margin-top:10px;" value="update" />
            </form>
        </div> <!-- wrapper for centering -->
        <div id="univbranding"><img src="icons/UBClogodarkgrey.jpg"></img></div>
    </body>

    </html>
<?php } ?>