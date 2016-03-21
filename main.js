/*******************************************************
* Setting up the touch and tap event listeners.
*******************************************************/
var getPointerEvent = function(event) {
    return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
};

var $touchArea = $('#touchArea'),
    touchStarted = false, // detect if a touch event is sarted
    currX = 0,
    currY = 0,
    cachedX = 0,
    cachedY = 0;

//setting the events listeners
$touchArea.on('touchstart mousedown', function(e) {
    e.preventDefault();
    var pointer = getPointerEvent(e);
    // caching the current x
    cachedX = currX = pointer.pageX;
    // caching the current y
    cachedY = currY = pointer.pageY;
    // a touch event is detected      
    touchStarted = true;
    $touchArea.html('<br><br>-'); //Touchstarted
    // detecting if after 200ms the finger is still in the same position
    setTimeout(function() {
        if ((cachedX === currX) && !touchStarted && (cachedY === currY)) {
            // Here you get the Tap event
            $touchArea.html('<br><br>- -'); //tap
        }
    }, 200);
});

$touchArea.on('touchend mouseup touchcancel', function(e) {
    e.preventDefault();
    // here we can consider finished the touch event
    touchStarted = false;
    $touchArea.html('<br><br>- - -'); //touchended

    $scoreCounter++;
    $touchArea.html('<br><br>' + $scoreCounter);
    $('#points').text($scoreCounter);

});

$touchArea.on('touchmove mousemove', function(e) {
    e.preventDefault();
    var pointer = getPointerEvent(e);
    currX = pointer.pageX;
    currY = pointer.pageY;
    if (touchStarted) {
        // here you are swiping
        $touchArea.html('<br><br>-'); //swiping
    }
});

var $scoreCounter = 0; // the counter for the amount of taps


/*******************************************************
* Loading all HIGHSCORE and PLAYER NAME from file.
*******************************************************/
$("#score").load("scoreboard.txt");
$("#top-player").load("topplayername.txt");
var $lastScore;
var $topscore;
jQuery.get('./scoreboard.txt', function(data) {
    $topscore = data;
});
jQuery.get('./topplayername.txt', function(data) {
    $topPlayer = data;
});


/*******************************************************
* What to do when they click the START button.
*******************************************************/
$(start).click(function(e) {
    $touchArea.html('<br><br>READY?<br>GO!<br>');
    $('#touchArea').fadeIn(0);
    startGame();
});


function startGame(){
    setTimeout(gameOver, 5000);
}


/*******************************************************
* What happens when the time is up and GAME OVER!
*******************************************************/
function gameOver() {
    navigator.vibrate([100, 200, 200]);
    // MIDIjs.play('./sound/sf-title-snes.mid');
    $('#touchArea').fadeOut('fast');
    // MIDIjs.stop('./sound/ryu.mid');
    document.getElementById("gameover").play();
    // alert("Congratulations! you scored " + ($scoreCounter) + " points");
    $lastScore = $scoreCounter;
    $('#touchArea-locked').fadeIn('fast');
    $("#yourscore").text("YOUR SCORE: " + $lastScore);
    $("#lastscore").text("YOUR SCORE: " + $lastScore);
    highScore();
    $scoreCounter = 0;
    $('#touchArea').fadeOut('fast', function() {});;
    // $touchArea.html('<br><br>READY.<br>GO!<br>'); //touchended
    $('#points').text("");
}


/*******************************************************
* Save the new top score to txt file using php.
*******************************************************/
function save() {
    var data = 'data=' + $topscore;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {}
    }
    xmlhttp.open("POST", "store.php", true);
    //Must add this request header to XMLHttpRequest request for POST
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(data);
}


/*******************************************************
* Save the player name  to txt file using php.
*******************************************************/
function savetp() {
    var $topPlayer = prompt("CONGRATULATION! \n\nYou've reached the top of the leaderboard!\n\nPlease enter your name.");
    var datatp = 'datatp=' + $topPlayer;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {}
    }
    xmlhttp.open("POST", "storeplayer.php", true);
    //Must add this request header to XMLHttpRequest request for POST
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(datatp);
    $("#topscore").text("TOP SCORE: " + $topscore + " by " + $topPlayer);
}


/*******************************************************
* If there is a new Highscore go and save score and player name to txt file.
*******************************************************/
function highScore() {
    if ($lastScore > $topscore) {
    alert('WOOOHOOO! NEW TOP SCORE!', 2000);
    $topscore = $lastScore;
    save();
    savetp();
    }
}