var $counter = 0;

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
    $touchArea.text('-'); //Touchstarted
    // detecting if after 200ms the finger is still in the same position
    setTimeout(function() {
        if ((cachedX === currX) && !touchStarted && (cachedY === currY)) {
            // Here you get the Tap event
            $touchArea.text('- -'); //tap
        }
    }, 200);
    // $counter++;
});


$touchArea.on('touchend mouseup touchcancel', function(e) {
    e.preventDefault();
    // here we can consider finished the touch event
    touchStarted = false;
    $touchArea.text('- - -'); //touchended
    $counter++;
});


$touchArea.on('touchmove mousemove', function(e) {
    e.preventDefault();
    var pointer = getPointerEvent(e);
    currX = pointer.pageX;
    currY = pointer.pageY;
    if (touchStarted) {
        // here you are swiping
        $touchArea.text('-'); //swiping
    }
});


$("#score").load("score.txt");
$("#top-player").load("topplayer.txt");
var $lastScore;
var $topscore;
jQuery.get('./score.txt', function(data) {
    $topscore = data;
});
jQuery.get('./topplayer.txt', function(data) {
    $topPlayer = data;
});


function gameOver() {
    navigator.vibrate([100, 200, 200]);
    // MIDIjs.play('./sound/sf-title-snes.mid');
    $('#touchArea').fadeOut('fast');
    // MIDIjs.stop('./sound/ryu.mid');
    document.getElementById("gameover").play();
    // alert("Congratulations! you scored " + ($counter) + " points");
    $lastScore = $counter;
    $('#touchArea-locked').fadeIn('fast');
    $("#yourscore").text("YOUR SCORE: " + $lastScore);
    

        if ($lastScore > $topscore) {
            document.getElementById("1up").play();
            alert('WOOOHOOO! NEW TOP SCORE!');
            $topscore = $lastScore;
            save();
            savetp();

        }

    $("#lastscore").text("YOUR SCORE: " + $lastScore);
    $counter = 0;
    $('#touchArea').fadeOut('fast', function() {});;
    $('#touchArea-locked').delay(4000).hide(0);

    // MIDIjs.play('./sound/sf-title-snes.mid');
    // $( "#again" ).click(function() {
    //     $('#touchArea-locked').fadeOut('fast');
    //     $('#touchArea').fadeIn();
    //     setTimeout(gameOver, 5000);
        
    // });
    // $( "#quit" ).click(function() {
    //     $('#touchArea-locked').fadeOut('fast');
        
    // });
}


$(start).click(function(e) {
    $('#touchArea').fadeIn(0, function() {
        // MIDIjs.play('./sound/ryu.mid');
    });;
    setTimeout(gameOver, 5000);
});


function save() {
    var data = 'data=' + $topscore;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {}
    }
    xmlhttp.open("POST", "save.php", true);
    //Must add this request header to XMLHttpRequest request for POST
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(data);
}

function savetp() {
    var $topPlayer = prompt("CONGRATULATION! \nYou've reached the top of the leaderboard!\nPlease enter your name.");
    var datatp = 'datatp=' + $topPlayer;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {}
    }
    xmlhttp.open("POST", "saveplayer.php", true);
    //Must add this request header to XMLHttpRequest request for POST
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(datatp);
    $("#topscore").text("TOP SCORE: " + $topscore + " by " + $topPlayer);
}