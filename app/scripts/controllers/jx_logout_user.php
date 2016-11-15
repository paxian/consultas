<?php  //https://forum.ionicframework.com/t/http-no-access-control-allow-origin-problem-on-post/5625/6

//http://stackoverflow.com/questions/18382740/cors-not-working-php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

$link = mysqli_connect('mysql.hostinger.mx', 'u161403768_gnrc', 'generico', 'u161403768_pryct'); 
if (!$link) {
    die('Could not connect: ' . mysqli_error($connection));
}

//get the posted values
//$username=htmlspecialchars($_POST['username'],ENT_QUOTES);
 //$pass=md5($_POST['password']);
//$pass=$_POST['password'];

//http://stackoverflow.com/questions/15485354/angular-http-post-to-php-and-undefined
$postdata = file_get_contents("php://input");
if( isset($postdata) ) {

	$request = json_decode($postdata);
	$userName = $request->userName;

	$sql = 'UPDATE users SET loggedin = 0 WHERE userName = "' . $userName . '"';
	$result = mysqli_query($link, $sql);

	if( $result ) {
		// if (mysqli_num_rows($result) == 1) {

		// 	echo json_encode(mysqli_fetch_assoc($result));
		// }
		echo json_encode(array('result' => '1'));
	} else {
		echo json_encode(array('result' => '0'));
	}

} else {
	echo json_encode(array('result' => $postdata));
}
	
?>