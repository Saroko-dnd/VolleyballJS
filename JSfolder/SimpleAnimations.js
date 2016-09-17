
$(document).ready(function () {
    $('#PlayerVsPlayerButton').mouseenter(function () {
        $(this).animate({ width: '+=100px', height: '+=25px', marginTop: '-=20px', backgroundColor: "blue" }, 300);
    }).mouseleave(function () {
        $(this).animate({ width: '-=100px', height: '-=25px', marginTop: '+=20px', backgroundColor: "green" }, 300);
    });
    $('#PlayerVsAiButton').mouseenter(function () {
        $(this).animate({ width: '+=100px', height: '+=25px', marginTop: '-=20px', backgroundColor: "blue" }, 300);
    }).mouseleave(function () {
        $(this).animate({ width: '-=100px', height: '-=25px', marginTop: '+=20px', backgroundColor: "red" }, 300);
    });
    $('#GameFinishButton').mouseenter(function () {
        $(this).animate({ width: '+=100px', height: '+=30px', marginTop: '-=15px', backgroundColor: "green" }, 300);
    }).mouseleave(function () {
        $(this).animate({ width: '-=100px', height: '-=30px', marginTop: '+=15px', backgroundColor: "blue" }, 300);
    });
    $('#GamePauseButton').mouseenter(function () {
        $(this).animate({ width: '+=100px', height: '+=30px', marginTop: '-=15px', backgroundColor: "green" }, 300);
    }).mouseleave(function () {
        $(this).animate({ width: '-=100px', height: '-=30px', marginTop: '+=15px', backgroundColor: "red" }, 300);
    });
})