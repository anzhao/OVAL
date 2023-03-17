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
require_once(dirname(__FILE__) . "/includes/auth.inc.php");
require_once(dirname(__FILE__) . '/database/users.php');
require_once(dirname(__FILE__) . '/database/media.php');


startSession();

$userName = $_SESSION['name'];
$userID = $_SESSION['user_id'];

//print "role:{$_SESSION['role']}<br />";
if (!isAdmin($_SESSION['role']))
    die($adminPrivRequiredMsg);


$media = new media();

$msg = "<p id=\"message\" style=\"font-weight:bold;font-size:90%\">
		</p>";
if (isset($_POST['submit'])) {
    global $media;

    $count = 1;
    $msg = "<p id=\"message\" class=\"upload-complete\" style=\"font-weight:bold;font-size:90%\">";
    //   foreach ($_FILES as $key=>$fileInfo) {

    // if no file uploaded, get out of this loop and do nothing
    print_r($fileInfo);

    $file = date("H:i:s__") . basename($fileInfo['name']);
    $path = $uploadPath . $file; // this is the full file name & path

    //  if (move_uploaded_file($fileInfo['tmp_name'], $path)) {

    // Check for audio files and auto convert to video first
    $inFile = $path;
    $outFile = $path . ".mov";

    // Checking MIME type of infile
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $inFileType = finfo_file($finfo, $inFile);


    $index = "title$count";
    $title = addslashes($_POST[$index]);

    $index = "description$count";
    $description = addslashes($_POST[$index]);
    $summary = "";
    $duration = "";
    $userID = "$userID";

    print_r($_POST);


    $index = "Customdata$count";
    $CopyrightFormData = $_POST[$index];

    // Get the copyright variables
    $CopyrightWithThePermissionOfTheCopyrightHolders = $CopyrightFormData["WithThePermissionOfTheCopyrightHolders"];
    $CopyrightFairDealingException = $CopyrightFormData["FairDealingException"];
    $CopyrightPublicDomain = $CopyrightFormData["PublicDomain"];
    $CopyrightOther = $CopyrightFormData["Other"];

    // run command as background process and do not wait for return (immediately return control to script)
    $command = "nohup php upload_to_kaltura.php " .
        "\"$title\" \"$description\" \"$userID\" \"$file\" " .
        "\"CopyrightWithThePermissionOfTheCopyrightHolders_$CopyrightWithThePermissionOfTheCopyrightHolders\" " .
        "\"CopyrightFairDealingException_$CopyrightFairDealingException\" " .
        "\"CopyrightPublicDomain_$CopyrightPublicDomain\" " .
        "\"CopyrightOther_$CopyrightOther\" " .
        "> /dev/null 2> /dev/null &";

    writeToLog("Running script from CLI:\n\n$command\n\n--------------\n\n");

    //print "command<br><br>$command";
    //die;

    system($command);

    $count++;
    // }

    $msg = $msg . "You have successfully added your video(s). Your video(s) should be under the \"Videos Unassigned to Groups\" below. You need to assign your video(s) to a particular course and group.<br/><br/>";
    $msg = $msg . "</p>";

    $_SESSION['message'] = $msg;

    // TODO: refactor the GID / CID fetch code in display form to the top of the page
    // header("location:video_management.php");
    #  header("location: video_management.php?cid=1&gid=1");
    header("location: video_management.php?cid=$CID&gid=$GID");
    exit;

}

if (isset($_SESSION['message'])) {
    $msg = $_SESSION['message'];
    unset($_SESSION['message']);
}

displayForm($msg);


function displayConversionStatus($conversionStatus, $videoID)
{
    if ($conversionStatus) {
        $status = "<span style='color:green'>" . "READY" . ", <a href=\"javascript:confirmDelete('$videoID')\">delete</a>" . "</span>";
    } else {
        $status = "<span style='color:red'>" . "CONVERTING<img src=\"icons/spinning-wheel.gif\" alt=\"CONVERTING\" />" . "</span>";
    }
    return $status;
}


//function getYouTubeVideoDuration($id) {
// $xml = simplexml_load_file('http://gdata.youtube.com/feeds/api/videos/'.$id);
// return strval($xml->xpath('//yt:duration[@seconds]')->attributes()->seconds);
//}







function displayForm($msg)
{
    global $userID, $userName, $media;

    $users = new users();

    $classes = $users->getClassesUserBelongsTo($userID);
    foreach ($classes as $key => $row) {
        $id[$key] = $row['ID'];
        $name[$key] = $row['name'];
    }
    array_multisort($name, SORT_ASC, $id, SORT_DESC, $classes);

    if (isset($_GET['cid'])) {
        $CID = $_GET['cid'];
    } else {
        $CID = $classes[0]['ID'];
    }
    //print "CID: $CID<br/>

    $groupsByCourse = $users->getMyGroups($userID, $CID);

    if (isset($_GET['gid'])) {
        $GID = $_GET['gid'];
    } else {
        $groupIDs = array_keys($groupsByCourse);
        $GID = $groupIDs[0];
    }

    if (isset($_GET['anchor'])) {
        $anchor = $_GET['anchor'];
    }
    ?>









    <!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <title>Video &amp; User Management</title>






        <script type="text/javascript" src="kaltura-html5player-widget/jquery-1.4.2.min.js"></script>

        <script type="text/javascript"
            src="http://gdata.youtube.com/feeds/api/videos/<?php echo $description ?>?v=2&alt=jsonc&callback=youtubeFeedCallback&prettyprint=true"></script>

        <!-- 
    <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js"></script>
-->
        <script type="text/javascript">

            var points = [];

            function youtubeFeedCallback(json) {
                $duration = json["data"]["duration"];
                return $duration;
            }



            function confirmDelete(videoID) {
                if (confirm("Are you sure you want to delete the video?")) {
                    $.ajax({
                        type: "POST",
                        url: "ajax/delete_video.php",
                        data: { video_id: videoID },
                        dataType: "html",
                        success: function (msg) {
                            console.log("success deleting video" + msg);
                        },
                        error: function (request, status, error) {
                            console.log("failure deleting video" + error);
                        },
                        async: false
                    });
                    // reload page
                    location.href = "video_management.php?cid=<?php echo "$CID&gid=$GID" ?>&anchor=unassigned";
                }
            }



            function confirmAdd(videoID) {

                if (confirm("You are adding the YouTube video(s) to OVAL ...")) {
                    $.ajax({
                        type: "POST",
                        url: "ajax/add_video.php",
                        data: { video_id: videoID, title: $title, description: $summary, point_one: points[1], point_two: points[2], point_three: points[3] },
                        dataType: "html",
                        success: function (msg) {
                            console.log("success adding the video(s)" + msg);
                        },
                        error: function (request, status, error) {
                            console.log("failure adding the video(s)" + error);
                        },
                        async: false
                    });
                    // reload page
                    location.href = "video_management.php?cid=<?php echo "$CID&gid=$GID" ?>&anchor=unassigned";
                }
            }






            // Fade out the instruction box from yellow to white when there is a notice
            function highlightInstructions() {
                $('#instructions').css('background-color', '#ff9');
                $('#instructions').animate({ backgroundColor: '#fff' }, 3000);
            }

            function jumpBox(list) {
                location.href = list.options[list.selectedIndex].value
            }

            function generateCopyrightForm(fileCount) {
                var CopyrightForm = "<div class=\"copyright-form form\" id=\"copyright_form_fileCount" + fileCount + "\">";

                // term text (segment 0)
                CopyrightForm += "<div id=\"segment0_fileCount" + fileCount + "\" class=\"custom-statement\">" +
                    // "<hr>" + // "thematic break" or horizontal rule, doesn't look as nice on our layout




                    "<div>" +
                    "" +
                    "</div>" +
                    "<div>" +
                    "</div>" +
                    "<div id=\"privacy_content_fileCount" + fileCount + "\" class=\"hidden-content\">" +
                    "Lecturers and TAs are required to input the key points based on the content of the lecture video. " +
                    "</div>" +
                    "<div></div>" +
                    "<div id=\"copyright_content_fileCount" + fileCount + "\" class=\"hidden-content\">" +
                    "For evaluation purposes, students are required to answer \"Yes\" or \"No\" to the points addressed based on the video content. " +
                    "<br/><br/>**Note that if hold the opinon that Yes or No does not apply to the point, please leave as it is and raise the issue to the lecturers through the comments section.</div>" +
                    "<div></div>" +
                    "</div>";

                // term type 1
                CopyrightForm += "<div>" +
                    "<label for=\"Customdata-WithThePermissionOfTheCopyrightHolders\" class=\"required\">" +
                    "</label>" +
                    "</div>";

                // term text continued (segment 1)
                CopyrightForm += "";

                // term type 2
                CopyrightForm += "<div>" +
                    "<label for=\"Customdata-FairDealingException\" class=\"required\">" +
                    "</label>" +
                    "</div>";

                // term type 3
                CopyrightForm += "<div>" +
                    "<label for=\"Customdata-PublicDomain\" class=\"required\">" +
                    "</label>" +
                    "</div>";


                CopyrightForm += "</div>";


                //return CopyrightForm;
            }

            function expandCollapse(target, fileCount) {
                var button = document.getElementById(target + "_button" + "_fileCount" + fileCount);

                if (button == null) return;

                var content = document.getElementById(target + "_content" + "_fileCount" + fileCount);

                if (content.style.display == 'block') {
                    content.style.display = 'none';
                    button.innerHTML = "EXPAND +";
                } else {
                    content.style.display = "block";
                    button.innerHTML = "COLLAPSE -";
                }
            }

            fileCount = 0;
            $(document).ready(function () {

                <?php
                if (isset($anchor)):
                    ?>
                    anchor = '<?php echo "$anchor" ?>';
                    try {
                        $(document).scrollTop($("#" + anchor).offset().top + 300);
                    } catch (e) {
                        // ignore if error
                    }
                    <?php
                endif;
                ?>


                $('#first-file-fields').append(generateCopyrightForm(1));
                fileCount = 2;

                if ($('#message').hasClass('upload-complete')) {
                    console.log('hasClass');
                    highlightInstructions();
                }

                $('#update-conversion-status').click(function () {
                    //alert('Handler for .click() called.');
                    window.location.reload();
                });

                $("#upload-form").submit(function (e) {
                    formComplete = true;


                    // alert("YouTube Video Title is: " );
                    // alert("YouTube Video Summary is: " + "<?php echo $_POST['url'] ?>");



                    detailsMissing = false;
                    validationMessage = "";




                    $("textarea").each(function (i, item) {
                        var url = item.value;
                        var length = $("textarea").length;
                        if (i == 0) {
                            var n = url.indexOf("watch?v=");
                            $description = url.substring(n + 8, n + 19);
                            //alert("YouTube video ID is: " + $description);
                        }
                        else {
                            $summary = url
                            //alert("YouTube summary is: " + $summary);
                        }

                    });


                    $(":text").each(function (i, item) {
                        points[i] = item.value;
                        //alert("The value is: " + points[i]);

                    });







                    $("input").each(function (i, item) {
                        $title = item.value;
                        //  alert("YouTube video title is: " + item.value);
                        // alert("index" + i + " item:" + item.value);
                        // console.log("index" + i + " item:" + item.value);

                        // check if the file info part of the each file in the form is complete
                        if ("" == $.trim(item.value)) {
                            // if any of the input fields are empty disable form submission
                            detailsMissing = true;
                            formComplete = false;
                        }
                        return false;
                    });

                    if (detailsMissing) {
                        validationMessage += "Some details are missing!\n\nEach upload entry requires a TITLE, DESCRIPTION, and a chosen FILE.\n\n";
                    }

                    for (var i = 1; i < fileCount; i++) {
                        // check if the copyright part of each file in the form is complete
                        // make sure at least one copyright field is selected as Yes
                        if ($("#Customdata-WithThePermissionOfTheCopyrightHolders_fileCount" + i).val() != "Yes" &&
                            $("#Customdata-FairDealingException_fileCount" + i).val() != "Yes" &&
                            $("#Customdata-PublicDomain_fileCount" + i).val() != "Yes" &&
                            $("#Customdata-Other_fileCount" + i).val() != "Yes") {
                            fileChosen = $("input[name='upload" + i + "']").val();
                            fileChosen = (fileChosen == null || fileChosen == "") ? "\"No file chosen yet\"" : "\"" + fileChosen.replace(/^.*[\\\/]/, '') + "\"";

                            if (fileChosen != "\"No file chosen yet\"") {
                                validationMessage += "In file " + i + " " + fileChosen + ": \n\n" +
                                    "At least one of the copyright authorization options must be selected as \"Yes\"" +
                                    "\n\n";
                                formComplete = false;
                            }
                        }
                    }

                    if (formComplete) {
                        $('#spinner').show();
                        $('#message').text("Embed in progress... Please do not close the browser or press the back button until the embed is complete.");
                        highlightInstructions();
                        //use ajax method to insert a record into the media table.
                        // alert("Are you sure that you want to embed the video(s)?");
                        // alert("The value of description is: " + $description);
                        confirmAdd($description);


                    } else {
                        alert(validationMessage);
                        e.preventDefault();
                        return false;
                    }
                });

                $('input:radio[id="Yes"]').click(function () {

                    // add form fields for another file upload
                    var fields = '<br />' +
                        "<fieldset class=\"form rounded-box file-upload-box\" id=\"first-file-fields\">" +
                        "<h4>Points for the video " + "</h4>" +
                        "<fieldset style=\"border:none\">" +
                        "<div style=\"float:left;width:300px\">" +
                        '<label>Point 1:' +
                        '<input type="text" id="point1" name="point1" size="100"/>' +
                        '</label>' +
                        "<br/>" +
                        '<label>' +



                        '<label>Point 2:' +
                        '<input type="text" id="point2" name="point2" size="100">' +
                        '</label>' +


                        '' +
                        '</label>' +
                        '<label>Point 3:' +
                        '<input type="text" id="point3" name="point3" size="100">' +
                        '</label>' +
                        '</div>' +
                        "</fieldset>" +


                        "</fieldset>";

                    $('#additional-form-fields').append(fields)
                    fileCount++;
                });

                // $('#add-point').click(function() {
                //   alert("Add point function clicked!");



                //    var fields =  "<div style=\"float:left\">" +
                //                               '<label>Here is the place to add the points.<br />' +
                //                               '<textarea name="description' + fileCount + '" id="description" cols="43" rows="5"></textarea>' +
                //                               '</label>' + '</div>';
                //    $('#additional-form-fields').append(fields); 












                // var x;
                // var person = prompt("Please enter your points","Point 1 is about: ....");
                // if (person != null) {
                //     document.getElementById("demo").innerHTML =
                //     "Hello " + person + "! How are you today?";   
                // }



                // });


                $('.groups').change(function () {
                    alert("I have entered the group change function!");
                    selected = $(this).val();
                    parts = selected.split(",");

                    // video ID and group ID are passed as option value, separated with a comma
                    videoID = parts[0];
                    groupID = parts[1];

                    if ("no_group_selected" == groupID) {
                        $.ajax({
                            type: "GET",
                            url: "ajax/remove_video_group.php",
                            data: { video_id: videoID, group_id: groupID },
                            dataType: "html",
                            success: function (msg) {
                                console.log("removed group access" + msg);
                            },
                            error: function (request, status, error) {
                                console.log("failure removing group access");
                            },
                            async: false
                        });
                    } else {
                        console.log("setting group:" + groupID);
                        $.ajax({
                            type: "GET",
                            url: "ajax/set_video_group.php",
                            data: { video_id: videoID, group_id: groupID },
                            dataType: "html",
                            success: function (msg) {
                                console.log("success setting group:" + groupID);
                            },
                            error: function (request, status, error) {
                                console.log("failure setting group:" + groupID);
                            },
                            async: false
                        });
                    }

                    // reload page because the displaying list have changed
                    location.href = "video_management.php?cid=<?php echo "$CID&gid=$GID" ?>";
                    alert("Video group changed!\n\nYou can update the display by refreshing the page or continue working.");
                });
            });
        </script>

        <link rel="stylesheet" type="text/css" href="style.css" />
        <link rel="stylesheet" type="text/css" href="admin-page.css" />
    </head>

    <body>
        <div id="wrapper">
            <?php printAdminBar(false, $userName, $CID, $GID); ?>
            <div style="clear:both"></div>
            <!-- http://blog.oio.de/2010/11/08/how-to-create-a-loading-animation-spinner-using-jquery/ -->
            <div class="form">
                <h3>embed video
                    <span id="add-file">
                        <!-- <span style="text-decoration:none">[+] </span> -->
                        <!-- <span style="text-decoration:underline">embed another video</span>  -->
                    </span>
                </h3>

                <div id="instructions">
                    <img id="spinner" src="icons/spinning-wheel.gif" width="60" height="60"
                        style="display:none;float:left;padding-right:1em;" alt="file uploading" />
                    <?php echo "$msg"; ?>
                    <div style="clear:both"></div>
                </div>



                <form action="" method="post" enctype="multipart/form-data" name="upload-form" id="upload-form">
                    <fieldset class="form rounded-box file-upload-box" id="first-file-fields">
                        <h4>Details of the YouTube Video</h4>
                        <fieldset style="border:none">
                            <div style="float:left;width:300px;">
                                <label>Video Title<br />
                                    <input type="text" name="title" size="40" id="title" />
                                </label>


                                <label>YouTube Video URL<br />
                                    <textarea name="url" id="url" cols="32" rows="2"></textarea>
                                </label>

                                <br />
                                <br />
                                <label>
                                </label>
                            </div>
                            <div style="float:right">
                                <label>Video Summary<br />
                                    <textarea name="description" id="description" cols="43" rows="5"></textarea>
                                </label>
                            </div>

                            <div style="float:left">
                                <span id="add-point">
                                    <span style="text-decoration:underline">Do you want to add the points to your
                                        video?</span>
                                </span>
                                <input type="radio" name="choice" id="Yes">Yes</input>
                                <input type="radio" name="choice" id="No">No</input>
                            </div>

                        </fieldset>
                    </fieldset>

                    <span id="additional-form-fields">
                    </span>

                    <label>
                        <br />
                        <input type="submit" name="submit" id="submit" value="embed" />
                    </label>
                </form>
            </div>
            <br />
            <br />
            <?php
            // CHECKING ALL VIDEOS FOR CONVERSION STATUS
            global $DEPLOYMENT_NAME;

            // ------------ Check upload complete -------------
            $videosToCheckCompletion = $media->getVideosOwnedBy($userID);
            $videos = $videosToCheckCompletion;

            if (!is_null($videos)) {

                // estimate (in seconds) of the maximum amount of time it takes to convert a video on Kaltura
                $estimatedBestVideoProcessingTime = 60 * 15;
                $estimatedTypicalVideoProcessingTime = 60 * 30;

                if ($DEPLOYMENT_NAME === "dev") {
                    $estimatedMaxVideoProcessingTime = 60 * 5;
                } else {
                    $estimatedMaxVideoProcessingTime = 60 * 60;
                }

                areConversionsComplete($videos, $estimatedBestVideoProcessingTime, false);
                areConversionsComplete($videos, $estimatedTypicalVideoProcessingTime, false);
                areConversionsComplete($videos, $estimatedMaxVideoProcessingTime, true);

                // re-fetch media table as status' may have changed
                $videos = $media->getVideosOwnedBy($userID);
            }
            ?>
            <?php
            $videosWithNoGroup = $media->getVideosWithNoGroup($userID);
            ?>
            <?php
            if (!empty($videosWithNoGroup)):
                ?>
                <!-- UNASSIGNED TABLE STARTS! -->
                <a id="unassigned"></a>
                <table width="1000px" border="1" style="margin-bottom:35px;float:left;font-family:'Lucida Sans Unicode';">
                    <thead style="font-size:14px">
                        <tr>
                            <th colspan="7" style="text-align:center">Videos Unassigned to Groups</th>
                        </tr>
                    </thead>
                    <thead style="font-size:14px">
                        <tr>
                            <th scope="col">thumbnail</th>
                            <th scope="col" width="15%">title</th>
                            <th scope="col" width="15%">description</th>
                            <th scope="col" width="10%">duration</th>
                            <th scope="col">video status</th>
                            <th scope="col">
                                <div>grant access to group</div>
                                <div style="font-weight:normal;font-style:italic;font-size:12px;">
                                    <input type="checkbox" name="show_individual_users" id="show_individual_users1">show
                                    individual users</input>
                                </div>
                            </th>
                            <th scope="col">date uploaded</th>
                        </tr>
                    </thead>
                    <tbody style="font-size:12px">
                        <?php
                        global $DEPLOYMENT_NAME;

                        $groups = $users->getGroupsByOwner($userID);

                        $videos = $videosWithNoGroup;

                        if (!is_null($videos)) {
                            foreach ($videos as $video) {
                                $thumbnail = $video['thumbnail_url'];
                                $videoID = $video['video_id'];
                                if ($videoID && $videoID != "") {
                                    ?>
                                    <tr>
                                        <td style="text-align:center;">
                                            <!-- force thumbnail height and width to make the table uniform -->
                                            <img src="<?php echo $thumbnail ?>" alt=""
                                                style="height:64px;width:101px;margin-top:1px;margin-bottom:1px;" />
                                        </td>
                                        <td>
                                            <?php echo $video['title'] ?>
                                        </td>
                                        <td style="font-size:80%">
                                            <?php echo $video['description'] ?>
                                        </td>
                                        <td>
                                            <?php echo $video['duration'] ?> seconds
                                        </td>
                                        <td>
                                            <?php echo displayConversionStatus($video['conversion_complete'], $videoID) ?>
                                        </td>
                                        <td>
                                            <?php
                                            if (!empty($groups)) {
                                                print '<select name="groups[]" size="1" class="groups">';
                                                print "<option value=\"$videoID,no_group_selected\">--- no group selected ---</option>";
                                                $selectedGroup = $media->getVideoGroup($videoID);
                                                print "selectedGroup: $selectedGroup";

                                                foreach ($groups as $id => $name) {
                                                    ($selectedGroup == $name) ? $selected = "selected=\"selected\"" : $selected = "";
                                                    print "<option value=\"$videoID,$id\" $selected>$name</option>";
                                                }
                                                print '</select>';
                                            }
                                            (empty($groups)) ? $label = "create groups" : $label = "manage groups";
                                            ?>
                                            <br />
                                            <div style="cursor:pointer;color:blue;"><a
                                                    href="manage_groups.php?cid=<?php echo "$CID&gid=$GID" ?>" --------><?php echo "$label" ?></a></div>
                                        </td>
                                        <td>
                                            <?php echo $video['creation_date'] ?>
                                        </td>
                                    </tr>
                                    <?php
                                }
                            }
                        }
                        ?>
                    </tbody>
                </table>
                <br />
                <?php
            endif;
            ?>
            <!-- UNASSIGNED TABLE ENDS! -->

            <a id="filter_controls"></a>
            <fieldset style="width:770px;background-color:#dae2e9;padding:0px 0px 0px 0px;
                    border:1px solid gray;border-radius:6px;
                     background-image:url('images/clas_bottom.jpg');
                     background-position:right bottom;background-repeat:no-repeat;
                     /* -moz-box-shadow:    -1px 1px 2px 1px #bbb;
                       -webkit-box-shadow: -1px 1px 2px 1px #bbb;
                      box-shadow:         -1px 1px 2px 1px #bbb; */
                      font-family:'Lucida Sans Unicode';
                      font-size:14px">
                <span style="font-weight:bold;margin-left:20px;margin-top:10px;margin-bottom:20px;float:left;">Filter videos
                    by:&nbsp;&nbsp;</br></br></br></br></span></br></br>
                <form id="class" name="class" method="post" action=""
                    style="margin-left:-145px;margin-top:10px;margin-bottom:10px;float:left;">

                    &nbsp;&nbsp;&nbsp;Course:&nbsp;
                    <?php
                    $noCourses = (0 == count($classes)) ? "disabled" : "";
                    ?>
                    <select name="classJumpMenu" id="classJumpMenu" <?php echo $noCourses ?>
                        onchange="jumpBox(this.form.elements[0])" style="width:18em;">
                        <?php
                        if (0 == count($classes)) {
                            print "<option>-- NO COURSES</option>";
                        } else {

                            for ($i = 0; $i < count($classes); $i++): ?>
                                <?php
                                $ID = $classes[$i]['ID'];
                                $name = $classes[$i]['name'];
                                ($CID == $ID) ? $selected = "selected=\"selected\"" : $selected = "";
                                ?>
                                <option value="video_management.php?cid=<?php echo "$ID" ?>&anchor=filter_controls" <?php echo " $style $selected>$name" ?></option>
                                <?php endfor;
                        }
                        ?>
                    </select>
                </form>
                <form id="group" name="group" method="post" action=""
                    style="margin-left:5px;margin-top:10px;margin-bottom:10px;float:left;">
                    &nbsp;&nbsp;&nbsp;Group:&nbsp;
                    <?php
                    $noGroups = (0 == count($groupsByCourse)) ? "disabled" : "";
                    ?>
                    <select name="groupJumpMenu" id="groupJumpMenu" <?php echo $noGroups ?>
                        onchange="jumpBox(this.form.elements[0])" style="width:19em;">
                        <?php
                        if (0 == count($groupsByCourse)) {
                            print "<option>-- NO GROUPS</option>";
                        } else {
                            foreach ($groupsByCourse as $ID => $name): ?>
                                <?php
                                ($GID == $ID) ? $selected = "selected=\"selected\"" : $selected = "";
                                ?>
                                <option value="video_management.php?cid=<?php echo "$CID&gid=$ID" ?>&anchor=filter_controls" <?php echo " $style $selected>$name" ?></option>
                                <?php endforeach;
                        }
                        ?>
                    </select>
                </form>
            </fieldset>
            <br />
            <?php
            $videosByCurrentCourseAndGroup = $media->getVideosByGroupID($userID, $GID);
            ?>
            <a id="assigned"></a>
            <table width="1000px" border="1" style="float:left;font-family:'Lucida Sans Unicode';">

                <?php
                if (empty($videosByCurrentCourseAndGroup)):
                    ?>
                    <thead style="font-size:14px">
                        <tr>
                            <th colspan="7" style="text-align:center">No Videos in this Course and Group</th>
                        </tr>
                    </thead>
                <?php
                else:
                    ?>
                    <thead style="font-size:14px">
                        <tr>
                            <th colspan="7" style="text-align:center">Videos by Course and Group</th>
                        </tr>
                    </thead>
                    <thead style="font-size:14px">
                        <tr>
                            <th scope="col">thumbnail</th>
                            <th scope="col" width="15%">title</th>
                            <th scope="col" width="15%">description</th>
                            <th scope="col" width="10%">duration</th>
                            <th scope="col">video status</th>
                            <th scope="col">grant access to group</th>
                            <th scope="col">date uploaded</th>
                        </tr>
                    </thead>
                    <tbody style="font-size:12px">
                        <?php
                        global $DEPLOYMENT_NAME;

                        $groups = $users->getGroupsByOwner($userID);

                        $videos = $videosByCurrentCourseAndGroup;

                        if (!is_null($videos)) {
                            foreach ($videos as $video) {
                                $thumbnail = $video['thumbnail_url'];
                                $videoID = $video['video_id'];
                                if ($videoID && $videoID != "") {
                                    ?>
                                    <tr>
                                        <td style="text-align:center;">
                                            <!-- force thumbnail height and width to make the table uniform -->
                                            <img src="<?php echo "$thumbnail" ?>" alt=""
                                                style="height:64px;width:101px;margin-top:1px;margin-bottom:1px;" />
                                        </td>
                                        <td>
                                            <?php echo $video['title'] ?>
                                        </td>
                                        <td style="font-size:80%">
                                            <?php echo $video['description'] ?>
                                        </td>
                                        <td>
                                            <?php echo $video['duration'] ?> seconds
                                        </td>
                                        <td>
                                            <?php echo displayConversionStatus($video['conversion_complete'], $videoID) ?>
                                        </td>
                                        <td>
                                            <?php
                                            if (empty($groups)) {
                                                print '<select name="groups[]" size="1" class="groups">';
                                                print "<option value=\"$videoID,no_group_selected\">--- no group selected ---</option>";
                                                $selectedGroup = $media->getVideoGroup($videoID);
                                                //print "selectedGroup: $selectedGroup";
                        
                                                foreach ($groups as $id => $name) {
                                                    ($selectedGroup == $id) ? $selected = "selected=\"selected\"" : $selected = "";
                                                    print "<option value=\"$videoID,$id\" $selected>$name</option>";
                                                }
                                                print '</select>';
                                            }
                                            (!empty($groups)) ? $label = "create groups" : $label = "manage groups";
                                            ?>
                                            <br />
                                            <div style="cursor:pointer;color:blue;"><a
                                                    href="manage_groups.php?cid=<?php echo "$CID&gid=$GID" ?>"><?php echo "$label" ?></a>
                                            </div>
                                        </td>
                                        <td>
                                            <?php echo $video['creation_date'] ?>
                                        </td>
                                    </tr>
                                    <?php
                                }
                            }
                        }
                        ?>
                    </tbody>
                <?php
                endif;
                ?>
            </table>
            <div id="update-conversion-status" style="cursor:pointer;padding-top:20px;float:left;"><a href="">Update
                    Conversion Status</a></div>
            <div style="clear:both"></div>
        </div> <!-- wrapper for centering -->
        <!-- <div id="univbranding"><img src="icons/LearnngTchngUnt_12_01.png"></img></div>  -->



    </body>
    <script type="text/javascript">
        /*window.onbeforeunload = function (e) {
        
        };*/
    </script>

    </html>
<?php
}
$media->close();
?>