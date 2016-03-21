<?php
//error_reporting(E_ALL);
//var_dump($_SERVER);
$post_datatp = $_POST['datatp'];
if (!empty ($post_datatp)) {
    $dir1 = '/';
    $filename1 = 'topplayername.txt';
    $handle1 = fopen($filename1, "w");
    fwrite($handle1, $post_datatp);
    fclose($handle1);
}
?>