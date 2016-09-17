
var GameBallPositionsOnPlayerHit = { OnLeftCorner: 0, OnTop: 1, OnRightCorner: 2 };
var XCenterOfRightArea;
var SpeedForOpacityAnimation = 1000;
var GameFieldDrawingFrequency = 10;
var PlayerWalkSpeed = 1;
var AiDecisions = { MoveRight: 1, MoveLeft: 2, Jump: 3, Stand: 4, ChangeNothing: 0 };
var Walls = {LeftWall: 1, RightWall: 2, Grid: 3};
var GameCanvas;
var GameFieldContext;
var LeftPlayerRect;
var RightPlayerRect;
var Grid;
var GameBall;
var BorderXforLeftPlayer = 375;
var BorderXForRightPlayer = 525;
var BorderMaxXForRightPlayer = 900;
var IntervalForDrawing;
var BallHitLeftWall = false;
var BallHitRightWall = false;
var BallHitRoof = false;
var BallWasThrownByLeftPlayer = false;
var BallWasThrownByRightPlayer = false;
var BallMoveDistance;
var ScoreInfoParagraph;
var GameBallYStartSpeed;
var BallStartSpeedFactor = 2;
var AccelerationOfGravity = 0.1;
var AccelerationOfGravityForBall = 0.010;
var PlayerJumpSpeed = -4.1;
var LeftPlayerJumpingWhenJumpKeyPressed = false;
var RightPlayerJumpingWhenJumpKeyPressed = false;
var SlowingBallOnHit = 0.8;
var AiOff = true;
var GamePauseOff = true;
var PauseButtonText = 'пауза';
var PauseButtonContinueText = 'продолжить';
var ScoreInfoParagraphXRotationDegree = 0;
var IntervalForUpdateScoreInfo = null;
var RotateScoreForward = true;
var LeftPlayerScoreParagraph;
var RightPlayerScoreParagraph;
var GameBallImage;
var GameBallRotationAngleDegrees = 0;
var GameBallImageShift;

//Min rotation speed for game ball
var GameBallMinRotationSpeed = 1;
//Max rotation speed for game ball
var GameBallMaxRotationSpeed = 31;

//Параметры ии
var MaxNRandomNumberForAi;
var MinRandomNumberForAi = 0;
var AiWithJumpJumpMin = 0;
var AiWithJumpJumpMax;
var AiWithJumpMoveLeftMin;
var AiWithJumpMoveLeftMax;
var AiWithJumpMoveRightMin;
var AiWithJumpMoveRightMax;
var AiMoveLeftMin = 0;
var AiMoveLeftMax;
var AiMoveRightMin;
var AiMoveRightMax;
var AiTryingToCatchBallByLeftCorner = false;

//Бонусы влияющие на скорость игроков
var TimeForBonus = 1500;
var BonucesForPlayers = {RedSpeedBonus: 0, GreenSpeedBonus: 1};
var OwnersOfBonuses = {LeftPlayer: 0, RightPlayer: 1, NoOne: 2};
var PlayerGreenMoveBonusSpeed = 2;
var PlayerRedMoveBonusSpeed = 0.5;
var RedBonusImage;
var GreenBonusImage;
var MaxTimerValueForBonusAnimation = 50;
var CurrentSpeedBonus = {
    Owner: OwnersOfBonuses.NoOne, ItShouldBeDrawn: true, SpeedOfResizing: 1, BonusSizeGrows: true, BonusTimerForSizeChanging: MaxTimerValueForBonusAnimation, BonusImage: null, x: -1, y: -1, width: 50,
    height: 50
};
var ParagraphForLeftPlayerBonus;
var ParagraphForRightPlayerBonus;

var RotationChangingPerFrame = 0.01;
var LeftPlayerWalkingAnimationImages = new Array();
var RightPlayerWalkingAnimationImages = new Array();
var LeftPlayerThrowBallImages = new Array();
var RightPlayerThrowBallImages = new Array();
var AmountOfWalkingImages = 11;
var PlayerAnimationCounter = 6;
var PlayerThrowBallImageTimerMax = 12;

window.onkeydown = KeyDownEventHandler;
window.onkeyup = KeyUpEventHandler;

$(document).ready(
    function ()
    {
        ParagraphForLeftPlayerBonus = document.getElementById('PLeftPlayerBonus');
        ParagraphForRightPlayerBonus = document.getElementById('PRightPlayerBonus');
        LeftPlayerRect = {
            BallOnTheTopImage: null, JumpImage: null, GameBallPosition: -1, StandAnimationBallOnTheRight: null, StandAnimationBallOnTheLeft: null, ThrowBallImageTimer: 0, StandImage: null, WalkFrameNumber: 0,
            AnimationCounter: 0, CurrentAnimationFrame: LeftPlayerWalkingAnimationImages[0], x: 0, y: 600, width: 100, height: 200, color: 'black', XSpeed: 0, YSpeed: 0, score: 0, CanMoveLeft: true, CanMoveUp: true,
            CanMoveRight: true, JumpKeyDown: false, Jumping: false, CanJump: false, CurrentBonus: null, BonusTimer: 0
        };
        RightPlayerRect = {
            BallOnTheTopImage: null, JumpImage: null, GameBallPosition: -1, StandAnimationBallOnTheRight: null, StandAnimationBallOnTheLeft: null, ThrowBallImageTimer: 0, StandImage: null, WalkFrameNumber: 0,
            AnimationCounter: 0, CurrentAnimationFrame: RightPlayerWalkingAnimationImages[0], x: 900, y: 600, width: 100, height: 200, color: 'blue', XSpeed: 0, YSpeed: 0, score: 0, CanMoveLeft: true, CanMoveUp: true,
            CanMoveRight: true, JumpKeyDown: false, Jumping: false, CanJump: false, CurrentBonus: null, BonusTimer: 0
        };

        LoadImages();
        GameBallImage = new Image();
        GameBallImage.src = 'Images/GameBall.png';
        LeftPlayerScoreParagraph = document.getElementById('PLeftPlayerScore');
        LeftPlayerScoreParagraph.Rotation = false;
        RightPlayerScoreParagraph = document.getElementById('PRightPlayerScore');
        RightPlayerScoreParagraph.Rotation = false;

        EventHandlersOnClickForButtons();
    });

function EventHandlersOnClickForButtons()
{
    $('#PlayerVsPlayerButton').click(function () {
        AiOff = true;
        $('#PGameModeSelection').animate({ opacity: '0.0' }, SpeedForOpacityAnimation);
        $('#PlayerVsPlayerButton').animate({ opacity: '0.0' }, SpeedForOpacityAnimation);
        $('#PlayerVsAiButton').animate({ opacity: '0.0' }, SpeedForOpacityAnimation, HideElementsForeModeSelection);
        StartNewGame();
    });
    $('#PlayerVsAiButton').click(function () {
        AiOff = false;
        $('#PGameModeSelection').animate({ opacity: '0.0' }, SpeedForOpacityAnimation);
        $('#PlayerVsPlayerButton').animate({ opacity: '0.0' }, SpeedForOpacityAnimation);
        $('#PlayerVsAiButton').animate({ opacity: '0.0' }, SpeedForOpacityAnimation, HideElementsForeModeSelection);
        StartNewGame();
    });
    $('#GameFinishButton').click(function () {
        FinishCurrentGame();
        ShowElementsForeModeSelection();
    });
    $('#GamePauseButton').click(function () {
        if (GamePauseOff) {
            GamePauseOff = false;
            $(this).val(PauseButtonContinueText);
            clearInterval(IntervalForDrawing);
        }
        else {
            GamePauseOff = true;
            $(this).val(PauseButtonText);
            IntervalForDrawing = setInterval(DrawGameField, GameFieldDrawingFrequency);
        }
    });
}

function StartNewGame()
{
    GameCanvas = document.getElementById("MainCanvasForGame");
    GameBall = { x: 500, y: 52, radius: 50, YSpeed: 2, XSpeed: GetRandomSpeedForBall(BallStartSpeedFactor), color: 'red', RotateForward: true, RotationSpeed: GameBallMinRotationSpeed };
    Grid = { x: 475, y: 400, width: 50, height: 400, color: 'green', XSpeed: 0, YSpeed: 0 };
    BallMoveDistance = Math.sqrt((Math.abs(GameBall.XSpeed) * Math.abs(GameBall.XSpeed)) + (GameBall.YSpeed * GameBall.YSpeed));
    GameBallYStartSpeed = GameBall.YSpeed;
    ScoreInfoParagraph = document.getElementById('ScoreInfoParagraph');
    ChangeScore();
    GameFieldContext = GameCanvas.getContext('2d');
    GameBallImageShift = Math.sqrt((GameBall.radius * GameBall.radius) + (GameBall.radius * GameBall.radius));
    MaxNRandomNumberForAi = GameCanvas.width / 2 - Grid.width / 2 - RightPlayerRect.width;
    AiWithJumpJumpMax = MaxNRandomNumberForAi / 100;
    AiWithJumpMoveLeftMin = (MaxNRandomNumberForAi / 100) + 1;
    AiWithJumpMoveLeftMax = ((MaxNRandomNumberForAi / 100) * 2) + 1;
    AiWithJumpMoveRightMin = ((MaxNRandomNumberForAi / 100) * 2) + 2;
    AiWithJumpMoveRightMax = ((MaxNRandomNumberForAi / 100) * 3) + 2;
    AiMoveLeftMax = MaxNRandomNumberForAi / 60;
    AiMoveRightMin = (MaxNRandomNumberForAi / 60) + 1;
    AiMoveRightMax = ((MaxNRandomNumberForAi / 60) * 2) + 1;
    XCenterOfRightArea = Math.floor((GameCanvas.width / 2 + Grid.width / 2) + ((GameCanvas.width - (GameCanvas.width / 2 + Grid.width / 2)) / 2));
    CreateNewBonusForPlayers();
    DrawGameField();
    IntervalForDrawing = setInterval(DrawGameField, GameFieldDrawingFrequency);
}

function FinishCurrentGame()
{
    clearInterval(IntervalForDrawing);
    GameBall.x = GameCanvas.width / 2;
    GameBall.y = GameBall.radius + 2;
    GameBall.YSpeed = GameBallYStartSpeed;
    GameBall.XSpeed = GetRandomSpeedForBall(BallStartSpeedFactor);
    LeftPlayerRect.score = 0;
    LeftPlayerRect.x = 0;
    LeftPlayerRect.y = GameCanvas.height - LeftPlayerRect.height;
    LeftPlayerRect.YSpeed = 0;
    LeftPlayerRect.JumpKeyDown = false;
    LeftPlayerRect.Jumping = false;
    LeftPlayerRect.CanJump = false;
    LeftPlayerRect.WalkFrameNumber = 0;
    LeftPlayerRect.ThrowBallImageTimer = 0;
    LeftPlayerRect.CurrentBonus = null;
    LeftPlayerRect.BonusTimer = 0;
    RightPlayerRect.score = 0;
    RightPlayerRect.x = GameCanvas.width - RightPlayerRect.width;
    RightPlayerRect.y = GameCanvas.height - RightPlayerRect.height;
    RightPlayerRect.YSpeed = 0;
    RightPlayerRect.JumpKeyDown = false;
    RightPlayerRect.Jumping = false;
    RightPlayerRect.CanJump = false;
    RightPlayerRect.WalkFrameNumber = 0;
    RightPlayerRect.ThrowBallImageTimer = 0;
    RightPlayerRect.CurrentBonus = null;
    RightPlayerRect.BonusTimer = 0;
    BallHitLeftWall = false;
    BallHitRightWall = false;
    BallHitRoof = false;
    BallWasThrownByLeftPlayer = false;
    BallWasThrownByRightPlayer = false;
    LeftPlayerJumpingWhenJumpKeyPressed = false;
    RightPlayerJumpingWhenJumpKeyPressed = false;
    UpdateScoreInfo();
    DrawGameField();
}

function HideElementsForeModeSelection()
{
    $('#PGameModeSelection').hide();
    $('#PlayerVsPlayerButton').hide();
    $('#PlayerVsAiButton').hide();
    $('#GameFinishButton').css('display', 'inline-block').animate({ opacity: '1.0' }, SpeedForOpacityAnimation);
    $('#GamePauseButton').css('display', 'inline-block').animate({ opacity: '1.0' }, SpeedForOpacityAnimation);
}

function ShowElementsForeModeSelection() {
    $('#GameFinishButton').animate({ opacity: '0.0' }, SpeedForOpacityAnimation);
    $('#GamePauseButton').animate({ opacity: '0.0' }, SpeedForOpacityAnimation, HideFinishGameButton);
}

function HideFinishGameButton()
{
    $('#GamePauseButton').css('display', 'none');
    $('#GameFinishButton').css('display', 'none');
    $('#PGameModeSelection').show().animate({ opacity: '1.0' }, SpeedForOpacityAnimation);
    $('#PlayerVsPlayerButton').show().animate({ opacity: '1.0' }, SpeedForOpacityAnimation);
    $('#PlayerVsAiButton').show().animate({ opacity: '1.0' }, SpeedForOpacityAnimation);
}

function KeyDownEventHandler(event)
{
    if (event.keyCode == 68)
    {
        if (LeftPlayerRect.CanMoveRight)
        {
            console.log('black left');
            if (LeftPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus && (LeftPlayerRect.BonusTimer > 0))
            {
                LeftPlayerRect.XSpeed = PlayerRedMoveBonusSpeed;
            }
            else if (LeftPlayerRect.CurrentBonus == BonucesForPlayers.GreenSpeedBonus && (LeftPlayerRect.BonusTimer > 0)) {
                LeftPlayerRect.XSpeed = PlayerGreenMoveBonusSpeed;
            }
            else
            {
                LeftPlayerRect.XSpeed = PlayerWalkSpeed;
            }
        }
        else
        {
            console.log('black left stop');
            LeftPlayerRect.XSpeed = 0;
        }
    }
    else if(event.keyCode == 65)
    {
        if (LeftPlayerRect.CanMoveLeft) {
            if (LeftPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus && (LeftPlayerRect.BonusTimer > 0)) {
                LeftPlayerRect.XSpeed = -PlayerRedMoveBonusSpeed;
            }
            else if (LeftPlayerRect.CurrentBonus == BonucesForPlayers.GreenSpeedBonus && (LeftPlayerRect.BonusTimer > 0)) {
                LeftPlayerRect.XSpeed = -PlayerGreenMoveBonusSpeed;
            }
            else {
                LeftPlayerRect.XSpeed = -PlayerWalkSpeed;
            }
        }
        else {
            LeftPlayerRect.XSpeed = 0;
        }
    }
    else if (event.keyCode == 39 && AiOff)
    {
        if (RightPlayerRect.CanMoveRight) {
            if (RightPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                RightPlayerRect.XSpeed = PlayerRedMoveBonusSpeed;
            }
            else if (RightPlayerRect.CurrentBonus == BonucesForPlayers.GreenSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                RightPlayerRect.XSpeed = PlayerGreenMoveBonusSpeed;
            }
            else {
                RightPlayerRect.XSpeed = PlayerWalkSpeed;
            }
        }
        else {
            RightPlayerRect.XSpeed = 0;
        }
    }
    else if (event.keyCode == 37 && AiOff)
    {
        if (RightPlayerRect.CanMoveLeft) {
            if (RightPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                RightPlayerRect.XSpeed = -PlayerRedMoveBonusSpeed;
            }
            else if (RightPlayerRect.CurrentBonus == BonucesForPlayers.GreenSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                RightPlayerRect.XSpeed = -PlayerGreenMoveBonusSpeed;
            }
            else {
                RightPlayerRect.XSpeed = -PlayerWalkSpeed;
            }
        }
        else {
            RightPlayerRect.XSpeed = 0;
        }
    }
    else if (event.keyCode == 87 && !LeftPlayerRect.JumpKeyDown && (LeftPlayerRect.y < (GameCanvas.height - LeftPlayerRect.height)))
    {
        LeftPlayerRect.JumpKeyDown = true;
        LeftPlayerJumpingWhenJumpKeyPressed = true;
    }
    else if ((event.keyCode == 87 && !LeftPlayerRect.JumpKeyDown) && (LeftPlayerRect.y == (GameCanvas.height - LeftPlayerRect.height)) && !LeftPlayerJumpingWhenJumpKeyPressed) {
        LeftPlayerRect.YSpeed = PlayerJumpSpeed;
        LeftPlayerRect.JumpKeyDown = true;
        LeftPlayerRect.CanJump = true;
    }
    else if (event.keyCode == 38 && !RightPlayerRect.JumpKeyDown && (RightPlayerRect.y < (GameCanvas.height - RightPlayerRect.height)) && AiOff) {
        RightPlayerRect.JumpKeyDown = true;
        RightPlayerJumpingWhenJumpKeyPressed = true;
    }
    else if ((event.keyCode == 38 && !RightPlayerRect.JumpKeyDown) && (RightPlayerRect.y == (GameCanvas.height - RightPlayerRect.height)) && !RightPlayerJumpingWhenJumpKeyPressed && AiOff) {
        RightPlayerRect.YSpeed = PlayerJumpSpeed;
        RightPlayerRect.JumpKeyDown = true;
        RightPlayerRect.CanJump = true;
    }
}

function KeyUpEventHandler(event)
{
    if (event.keyCode == 68 || event.keyCode == 65) {
        LeftPlayerRect.XSpeed = 0;
    }
    else if ((event.keyCode == 39 || event.keyCode == 37) && AiOff) {
        RightPlayerRect.XSpeed = 0;
    }
    else if (event.keyCode == 87)
    {
        LeftPlayerRect.JumpKeyDown = false;
        LeftPlayerJumpingWhenJumpKeyPressed = false;
    }
    else if (event.keyCode == 38 && AiOff) {
        RightPlayerRect.JumpKeyDown = false;
        RightPlayerJumpingWhenJumpKeyPressed = false;
    }
}

function DrawGameBallFromImage()
{
    GameFieldContext.drawImage(GameBallImage, -GameBall.radius, -GameBall.radius, GameBall.radius * 2, GameBall.radius * 2);
    GameFieldContext.rotate(-GameBallRotationAngleDegrees * Math.PI / 180);
    GameFieldContext.translate(-GameBall.x, -GameBall.y);
}

function GetRandomSpeedForBall(CurrentSpeedFactor)
{
    var RandomSpeed = 0;
    var min = -1;
    var max = 2;
    while (RandomSpeed == 0)
    {
        RandomSpeed = Math.floor(Math.random() * (max - min)) + min;
    }
    return RandomSpeed *= CurrentSpeedFactor;
}


//Проверка на столкновение мяча с прямоугольниками (игроками и сеткой)
function Intersection(CurrentRectangle)
{
    var distX = Math.abs(GameBall.x - CurrentRectangle.x - CurrentRectangle.width / 2);
    var distY = Math.abs(GameBall.y - CurrentRectangle.y - CurrentRectangle.height / 2);
    if (distX > (CurrentRectangle.width / 2 + GameBall.radius)) { return false; }
    if (distY > (CurrentRectangle.height / 2 + GameBall.radius)) { return false; }
    if (distX <= (CurrentRectangle.width / 2)) { return true; }
    if (distY <= (CurrentRectangle.height / 2)) { return true; }
    var dx = distX - CurrentRectangle.width / 2;
    var dy = distY - CurrentRectangle.height / 2;
    return (dx * dx + dy * dy <= (GameBall.radius * GameBall.radius));
}

function IntersectionForBallAndBonus()
{
    if (CurrentSpeedBonus.Owner == OwnersOfBonuses.NoOne)
    {
        return false;
    }
    var dx = GameBall.x - (CurrentSpeedBonus.x + (CurrentSpeedBonus.width/2));
    var dy = GameBall.y - (CurrentSpeedBonus.y + (CurrentSpeedBonus.height/2));
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < GameBall.radius + (CurrentSpeedBonus.width / 2)) {
        if ((CurrentSpeedBonus.Owner == OwnersOfBonuses.LeftPlayer) && (CurrentSpeedBonus.BonusImage == RedBonusImage))
        {
            LeftPlayerRect.CurrentBonus = BonucesForPlayers.RedSpeedBonus;
            LeftPlayerRect.BonusTimer = TimeForBonus;
        }
        else if ((CurrentSpeedBonus.Owner == OwnersOfBonuses.LeftPlayer) && (CurrentSpeedBonus.BonusImage == GreenBonusImage)) {
            LeftPlayerRect.CurrentBonus = BonucesForPlayers.GreenSpeedBonus;
            LeftPlayerRect.BonusTimer = TimeForBonus;
        }
        else if ((CurrentSpeedBonus.Owner == OwnersOfBonuses.RightPlayer) && (CurrentSpeedBonus.BonusImage == RedBonusImage)) {
            RightPlayerRect.CurrentBonus = BonucesForPlayers.RedSpeedBonus;
            RightPlayerRect.BonusTimer = TimeForBonus;
        }
        else if ((CurrentSpeedBonus.Owner == OwnersOfBonuses.RightPlayer) && (CurrentSpeedBonus.BonusImage == GreenBonusImage)) {
            RightPlayerRect.CurrentBonus = BonucesForPlayers.GreenSpeedBonus;
            RightPlayerRect.BonusTimer = TimeForBonus;
        }
        return true;
    }
    else
    {
        return false;
    }
}

function ChangeSpeedOfGameBall(CurrentRectangle)
{
    if (CurrentRectangle == RightPlayerRect)
    {
        CurrentSpeedBonus.Owner = OwnersOfBonuses.RightPlayer;
    }
    else if (CurrentRectangle == LeftPlayerRect)
    {
        CurrentSpeedBonus.Owner = OwnersOfBonuses.LeftPlayer;
    }
    if ((GameBall.x > CurrentRectangle.x + CurrentRectangle.width) && (GameBall.y < CurrentRectangle.y))
    {    
        var XDistanceFromRectangleCenter = GameBall.x - ((CurrentRectangle.width / 2) + CurrentRectangle.x);
        var YDistanceFromRectangleCenter = ((CurrentRectangle.height / 2) + CurrentRectangle.y) - GameBall.y;
        var RealDistanceFromRectangleCenter = Math.sqrt((XDistanceFromRectangleCenter * XDistanceFromRectangleCenter) + (YDistanceFromRectangleCenter * YDistanceFromRectangleCenter));
        var FactorForDistance = Math.sqrt((Math.abs(GameBall.XSpeed) * Math.abs(GameBall.XSpeed)) + (GameBall.YSpeed * GameBall.YSpeed)) / RealDistanceFromRectangleCenter;
        GameBall.RotationSpeed += Math.abs(GameBall.YSpeed) + Math.abs(GameBall.XSpeed);
        if (CurrentRectangle.XSpeed > 0)
        {
            GameBall.RotationSpeed += CurrentRectangle.XSpeed;
            GameBall.XSpeed = (XDistanceFromRectangleCenter * FactorForDistance) + CurrentRectangle.XSpeed;
        }
        else
        {
            GameBall.XSpeed = (XDistanceFromRectangleCenter * FactorForDistance) * SlowingBallOnHit;
        }
        if (CurrentRectangle.YSpeed < 0)
        {
            GameBall.RotationSpeed += Math.abs(CurrentRectangle.YSpeed);
            GameBall.YSpeed = (YDistanceFromRectangleCenter * FactorForDistance) + Math.abs(CurrentRectangle.YSpeed);
        }
        else
        {
            GameBall.YSpeed = (YDistanceFromRectangleCenter * FactorForDistance) * SlowingBallOnHit;
        }
        if (GameBall.YSpeed > 0)
        {
            GameBall.YSpeed = -GameBall.YSpeed;
        }
        if (GameBall.RotationSpeed > GameBallMaxRotationSpeed)
        {
            GameBall.RotationSpeed = GameBallMaxRotationSpeed;
        }
        if ( CurrentRectangle != Grid)
        {
            if (!AiOff) {
                ChooseRandomCornerForAi();
            }
            CurrentRectangle.ThrowBallImageTimer = PlayerThrowBallImageTimerMax;
            CurrentRectangle.GameBallPosition = GameBallPositionsOnPlayerHit.OnRightCorner;
        }
    }
    else if ((GameBall.x < CurrentRectangle.x) && (GameBall.y < CurrentRectangle.y)) {
        var XDistanceFromRectangleCenter = ((CurrentRectangle.width / 2) + CurrentRectangle.x) - GameBall.x;
        var YDistanceFromRectangleCenter = ((CurrentRectangle.height / 2) + CurrentRectangle.y) - GameBall.y;
        var RealDistanceFromRectangleCenter = Math.sqrt((XDistanceFromRectangleCenter * XDistanceFromRectangleCenter) + (YDistanceFromRectangleCenter * YDistanceFromRectangleCenter));
        var FactorForDistance = Math.sqrt((Math.abs(GameBall.XSpeed) * Math.abs(GameBall.XSpeed)) + (GameBall.YSpeed * GameBall.YSpeed)) / RealDistanceFromRectangleCenter;
        GameBall.RotationSpeed += Math.abs(GameBall.YSpeed) + Math.abs(GameBall.XSpeed);
        if (CurrentRectangle.XSpeed < 0) {
            GameBall.RotationSpeed += Math.abs(CurrentRectangle.XSpeed);
            GameBall.XSpeed = (XDistanceFromRectangleCenter * FactorForDistance) + Math.abs(CurrentRectangle.XSpeed);
        }
        else {
            GameBall.XSpeed = (XDistanceFromRectangleCenter * FactorForDistance) * SlowingBallOnHit;
        }
        if (CurrentRectangle.YSpeed < 0) {
            GameBall.RotationSpeed += Math.abs(CurrentRectangle.YSpeed);
            GameBall.YSpeed = (YDistanceFromRectangleCenter * FactorForDistance) + Math.abs(CurrentRectangle.YSpeed);
        }
        else {
            GameBall.YSpeed = (YDistanceFromRectangleCenter * FactorForDistance) * SlowingBallOnHit;
        }
        if (GameBall.XSpeed > 0)
        {
            GameBall.XSpeed = -GameBall.XSpeed;
        }
        if (GameBall.YSpeed > 0)
        {
            GameBall.YSpeed = -GameBall.YSpeed;
        }
        if (GameBall.RotationSpeed > GameBallMaxRotationSpeed) {
            GameBall.RotationSpeed = GameBallMaxRotationSpeed;
        }
        if (CurrentRectangle != Grid) {
            if (!AiOff) {
                ChooseRandomCornerForAi();
            }
            CurrentRectangle.ThrowBallImageTimer = PlayerThrowBallImageTimerMax;
            CurrentRectangle.GameBallPosition = GameBallPositionsOnPlayerHit.OnLeftCorner;
        }
    }
    else if (GameBall.y >= CurrentRectangle.y)
    {
        if (GameBall.XSpeed <= 0 && GameBall.x < CurrentRectangle.x)
        {
            var XDistanceFromRectangleCenter = ((CurrentRectangle.width / 2) + CurrentRectangle.x) - GameBall.x;
            var YDistanceFromRectangleCenter = ((CurrentRectangle.height / 2) + CurrentRectangle.y) - GameBall.y;
            var RealDistanceFromRectangleCenter = Math.sqrt((XDistanceFromRectangleCenter * XDistanceFromRectangleCenter) + (YDistanceFromRectangleCenter * YDistanceFromRectangleCenter));
            var FactorForDistance = Math.sqrt((Math.abs(GameBall.XSpeed) * Math.abs(GameBall.XSpeed)) + (GameBall.YSpeed * GameBall.YSpeed)) / RealDistanceFromRectangleCenter;
            //Защита от бесконечного движения мяча по горизонтали
            if (YDistanceFromRectangleCenter == 0)
            {
                YDistanceFromRectangleCenter = 1;
            }
            if (CurrentRectangle.XSpeed < 0)
            {
                GameBall.XSpeed = (XDistanceFromRectangleCenter * FactorForDistance) + Math.abs(CurrentRectangle.XSpeed);
            }
            else
            {
                GameBall.XSpeed = (XDistanceFromRectangleCenter * FactorForDistance) * SlowingBallOnHit;
            }
            GameBall.YSpeed = (YDistanceFromRectangleCenter * FactorForDistance) * SlowingBallOnHit;
            GameBall.XSpeed = -GameBall.XSpeed;
            GameBall.YSpeed = -GameBall.YSpeed;
            if (!AiOff && CurrentRectangle != Grid) {
                ChooseRandomCornerForAi();
            }
        }
        else if (GameBall.XSpeed >= 0 && GameBall.x > CurrentRectangle.x)
        {
            var XDistanceFromRectangleCenter = GameBall.x - ((CurrentRectangle.width / 2) + CurrentRectangle.x);
            var YDistanceFromRectangleCenter = ((CurrentRectangle.height / 2) + CurrentRectangle.y) - GameBall.y;
            var RealDistanceFromRectangleCenter = Math.sqrt((XDistanceFromRectangleCenter * XDistanceFromRectangleCenter) + (YDistanceFromRectangleCenter * YDistanceFromRectangleCenter));
            var FactorForDistance = Math.sqrt((Math.abs(GameBall.XSpeed) * Math.abs(GameBall.XSpeed)) + (GameBall.YSpeed * GameBall.YSpeed)) / RealDistanceFromRectangleCenter;
            //Защита от бесконечного движения мяча по горизонтали
            if (YDistanceFromRectangleCenter == 0)
            {
                YDistanceFromRectangleCenter = 1;
            }
            if (CurrentRectangle.XSpeed > 0) {
                GameBall.XSpeed = (XDistanceFromRectangleCenter * FactorForDistance) + Math.abs(CurrentRectangle.XSpeed);
            }
            else {
                GameBall.XSpeed = (XDistanceFromRectangleCenter * FactorForDistance) * SlowingBallOnHit;
            }
            GameBall.YSpeed = (YDistanceFromRectangleCenter * FactorForDistance) * SlowingBallOnHit;
            GameBall.YSpeed = -GameBall.YSpeed;
            if (!AiOff && CurrentRectangle != Grid) {
                ChooseRandomCornerForAi();
            }
        }
        else
        {
            if (GameBall.x < CurrentRectangle.x)
            {
                if (GameBall.YSpeed > 0 && GameBall.RotateForward) {
                    GameBall.RotateForward = false;
                }
                else if (GameBall.YSpeed < 0 && !GameBall.RotateForward) {
                    GameBall.RotateForward = true;
                }
            }
            else
            {
                if (GameBall.YSpeed < 0 && GameBall.RotateForward) {
                    GameBall.RotateForward = false;
                }
                else if (GameBall.YSpeed > 0 && !GameBall.RotateForward) {
                    GameBall.RotateForward = true;
                }
            }
            if (CurrentRectangle.XSpeed > 0 && GameBall.x > CurrentRectangle.x) {
                GameBall.XSpeed = Math.abs(GameBall.XSpeed) + Math.abs(CurrentRectangle.XSpeed);
            }
            else if (CurrentRectangle.XSpeed < 0 && GameBall.x < CurrentRectangle.x)
            {
                GameBall.XSpeed = -(Math.abs(GameBall.XSpeed) + Math.abs(CurrentRectangle.XSpeed));
            }
            else {
                GameBall.XSpeed = -GameBall.XSpeed * SlowingBallOnHit;
            }
            if (!AiOff && CurrentRectangle != Grid) {
                ChooseRandomCornerForAi();
            }
        }
    }
    else
    {
        if (GameBall.XSpeed < 0 && GameBall.RotateForward) {
            GameBall.RotateForward = false;
        }
        else if(GameBall.XSpeed > 0 && !GameBall.RotateForward)
        {
            GameBall.RotateForward = true;
        }
        if (CurrentRectangle.YSpeed < 0) {
            GameBall.YSpeed = -(Math.abs(GameBall.YSpeed) + Math.abs(CurrentRectangle.YSpeed));
        }
        else {
            GameBall.YSpeed = -GameBall.YSpeed * SlowingBallOnHit;
        }
        if (!AiOff && CurrentRectangle != Grid) {
            ChooseRandomCornerForAi();
        }
        if (CurrentRectangle != Grid)
        {
            CurrentRectangle.ThrowBallImageTimer = PlayerThrowBallImageTimerMax;
            CurrentRectangle.GameBallPosition = GameBallPositionsOnPlayerHit.OnTop;
        }
    }
}

function UpdateScoreInfo()
{
    if (ScoreInfoParagraphXRotationDegree < 90 && RotateScoreForward)
    {
        ++ScoreInfoParagraphXRotationDegree;
    }
    else
    {
        RotateScoreForward = false;
        --ScoreInfoParagraphXRotationDegree;
    }
    if (LeftPlayerScoreParagraph.Rotation) {
        $(LeftPlayerScoreParagraph).css('transform', 'rotatex(' + ScoreInfoParagraphXRotationDegree.toString() + 'deg)');
    }
    else
    {
        $(RightPlayerScoreParagraph).css('transform', 'rotatex(' + ScoreInfoParagraphXRotationDegree.toString() + 'deg)');
    }
    if (ScoreInfoParagraphXRotationDegree == 90)
    {
        ChangeScore();
    }
    if (ScoreInfoParagraphXRotationDegree == -1) {
        $('#ScoreInfoParagraph').css('transform', 'rotatex(' + 0 + 'deg)');
        clearInterval(IntervalForUpdateScoreInfo);
        RotateScoreForward = true;
        LeftPlayerScoreParagraph.Rotation = false;
        RightPlayerScoreParagraph.Rotation = false;
        ScoreInfoParagraphXRotationDegree = 0;
    }
}

function ChangeScore()
{
    LeftPlayerScoreParagraph.innerText = LeftPlayerRect.score.toString();
    RightPlayerScoreParagraph.innerText = RightPlayerRect.score.toString();
    ScoreInfoParagraph.innerText = " : ";
}

function StartNewRound()
{
    GameBall.x = GameCanvas.width / 2;
    GameBall.y = GameBall.radius + 2;
    GameBall.YSpeed = GameBallYStartSpeed;
    GameBall.XSpeed = GetRandomSpeedForBall(BallStartSpeedFactor);
    GameBall.RotationSpeed = GameBallMinRotationSpeed;
    LeftPlayerRect.x = 0;
    LeftPlayerRect.y = GameCanvas.height - LeftPlayerRect.height;
    LeftPlayerRect.YSpeed = 0;
    LeftPlayerRect.JumpKeyDown = false;
    LeftPlayerRect.Jumping = false;
    LeftPlayerRect.CanJump = false;
    LeftPlayerRect.ThrowBallImageTimer = 0;
    LeftPlayerRect.WalkFrameNumber = 0;
    LeftPlayerRect.CurrentBonus = null;
    LeftPlayerRect.BonusTimer = 0;
    RightPlayerRect.x = GameCanvas.width - RightPlayerRect.width;
    RightPlayerRect.y = GameCanvas.height - RightPlayerRect.height;
    RightPlayerRect.YSpeed = 0;
    RightPlayerRect.JumpKeyDown = false;
    RightPlayerRect.Jumping = false;
    RightPlayerRect.CanJump = false;
    RightPlayerRect.ThrowBallImageTimer = 0;
    RightPlayerRect.WalkFrameNumber = 0;
    RightPlayerRect.CurrentBonus = null;
    RightPlayerRect.BonusTimer = 0;
    BallHitLeftWall = false;
    BallHitRightWall = false;
    BallHitRoof = false;
    BallWasThrownByLeftPlayer = false;
    BallWasThrownByRightPlayer = false;
    LeftPlayerJumpingWhenJumpKeyPressed = false;
    RightPlayerJumpingWhenJumpKeyPressed = false;
    CreateNewBonusForPlayers();
    IntervalForDrawing = setInterval(DrawGameField, GameFieldDrawingFrequency);
}

function AiDecision()
{
    var CurrentDecision;
    if (RightPlayerRect.y == (GameCanvas.height - RightPlayerRect.height))
    {
        CurrentDecision = MakeDecisionForAi(true);
        if (CurrentDecision == AiDecisions.Stand) {
            RightPlayerRect.XSpeed = 0;
        }
        else if (CurrentDecision == AiDecisions.Jump)
        {
            RightPlayerRect.YSpeed = PlayerJumpSpeed;
            RightPlayerRect.CanJump = true;
        }
        else if (CurrentDecision == AiDecisions.MoveLeft) {
            if (RightPlayerRect.x == BorderXForRightPlayer)
            {
                if (RightPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = PlayerRedMoveBonusSpeed;
                }
                else if (RightPlayerRect.CurrentBonus == BonucesForPlayers.GreenSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = PlayerGreenMoveBonusSpeed;
                }
                else {
                    RightPlayerRect.XSpeed = PlayerWalkSpeed;
                }
            }
            else
            {
                if (RightPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = -PlayerRedMoveBonusSpeed;
                }
                else if (RightPlayerRect.CurrentBonus == BonucesForPlayers.GreenSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = -PlayerGreenMoveBonusSpeed;
                }
                else {
                    RightPlayerRect.XSpeed = -PlayerWalkSpeed;
                }
            }
        }
        else if (CurrentDecision == AiDecisions.MoveRight) {
            if (RightPlayerRect.x == BorderMaxXForRightPlayer) {
                if (RightPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = -PlayerRedMoveBonusSpeed;
                }
                else if (RightPlayerRect.CurrentBonus == BonucesForPlayers.GreenSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = -PlayerGreenMoveBonusSpeed;
                }
                else {
                    RightPlayerRect.XSpeed = -PlayerWalkSpeed;
                }
            }
            else {
                if (RightPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = PlayerRedMoveBonusSpeed;
                }
                else if (RightPlayerRect.CurrentBonus == BonucesForPlayers.GreenSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = PlayerGreenMoveBonusSpeed;
                }
                else {
                    RightPlayerRect.XSpeed = PlayerWalkSpeed;
                }
            }
        }
    }
    else
    {
        CurrentDecision = MakeDecisionForAi(false);
        if (CurrentDecision == AiDecisions.Stand) {
            RightPlayerRect.XSpeed = 0;
        }
        else if (CurrentDecision == AiDecisions.MoveLeft) {
            if (RightPlayerRect.x == BorderXForRightPlayer) {
                if (RightPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = PlayerRedMoveBonusSpeed;
                }
                else if (RightPlayerRect.CurrentBonus == BonucesForPlayers.GreenSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = PlayerGreenMoveBonusSpeed;
                }
                else {
                    RightPlayerRect.XSpeed = PlayerWalkSpeed;
                }
            }
            else {
                if (RightPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = -PlayerRedMoveBonusSpeed;
                }
                else if (RightPlayerRect.CurrentBonus == BonucesForPlayers.GreenSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = -PlayerGreenMoveBonusSpeed;
                }
                else {
                    RightPlayerRect.XSpeed = -PlayerWalkSpeed;
                }
            }
        }
        else if (CurrentDecision == AiDecisions.MoveRight) {
            if (RightPlayerRect.x == BorderMaxXForRightPlayer) {
                if (RightPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = -PlayerRedMoveBonusSpeed;
                }
                else if (RightPlayerRect.CurrentBonus == BonucesForPlayers.GreenSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = -PlayerGreenMoveBonusSpeed;
                }
                else {
                    RightPlayerRect.XSpeed = -PlayerWalkSpeed;
                }
            }
            else {
                if (RightPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = PlayerRedMoveBonusSpeed;
                }
                else if (RightPlayerRect.CurrentBonus == BonucesForPlayers.GreenSpeedBonus && (RightPlayerRect.BonusTimer > 0)) {
                    RightPlayerRect.XSpeed = PlayerGreenMoveBonusSpeed;
                }
                else {
                    RightPlayerRect.XSpeed = PlayerWalkSpeed;
                }
            }
        }
    }
}

function MakeDecisionForAi(CanReturnJumpAsAResult)
{
    if (GameBall.x <= GameCanvas.width/2)
    {
        if (RightPlayerRect.x < XCenterOfRightArea - RightPlayerRect.width / 2)
        {
            return AiDecisions.MoveRight;
        }
        else if (RightPlayerRect.x > XCenterOfRightArea - RightPlayerRect.width / 2) {
            return AiDecisions.MoveLeft;
        }
        else
        {
            return AiDecisions.Stand;
        }
    }
    else
    {
        if (GameBall.y > RightPlayerRect.y - RightPlayerRect.height/2 - GameBall.radius)
        {
            var CurrentRandomNumber = Math.floor(Math.random() * (100 - 0)) + 0;
            if (CurrentRandomNumber == 0)
            {
                return AiDecisions.Jump;
            }
            else if (AiTryingToCatchBallByLeftCorner) {
                if (GameBall.x < RightPlayerRect.x - (GameBall.radius / 2))
                {
                    return AiDecisions.MoveLeft;
                }
                else {
                    return AiDecisions.MoveRight;
                }
            }         
            else {
                if (GameBall.x < RightPlayerRect.x + RightPlayerRect.width + (GameBall.radius / 2)) {
                    return AiDecisions.MoveLeft;
                }
                else {
                    return AiDecisions.MoveRight;
                }
            }
        }
        else if (AiTryingToCatchBallByLeftCorner)
            {
                if (GameBall.x < RightPlayerRect.x - GameBall.radius / 2) {
                    return AiDecisions.MoveLeft;
                }
                else {
                    return AiDecisions.MoveRight;
                }
        }
        else
        {
            if (GameBall.x < RightPlayerRect.x + RightPlayerRect.width + (GameBall.radius / 2)) {
                return AiDecisions.MoveLeft;
            }
            else {
                return AiDecisions.MoveRight;
            }
        }

    }
}

function LoadImages()
{
    var SomeImage;
    //Loading of walk images
    for (var FrameNumber = 0; FrameNumber <= AmountOfWalkingImages; ++FrameNumber)
    {
        SomeImage = new Image();
        SomeImage.src = 'Images/Walking/Black/frame_' + FrameNumber.toString() + '_delay-0.06s.png';
        LeftPlayerWalkingAnimationImages.push(SomeImage);
        SomeImage = new Image();
        SomeImage.src = 'Images/Walking/Blue/frame_' + FrameNumber.toString() + '_delay-0.06s.png';
        RightPlayerWalkingAnimationImages.push(SomeImage);
    }

    //Loading of stand images
    LeftPlayerRect.StandAnimationBallOnTheRight = new Image();
    LeftPlayerRect.StandAnimationBallOnTheRight.src = 'Images/StandAnimations/Black/BallOnTheRight.png';
    LeftPlayerRect.StandAnimationBallOnTheLeft = new Image();
    LeftPlayerRect.StandAnimationBallOnTheLeft.src = 'Images/StandAnimations/Black/BallOnTheLeft.png';
    LeftPlayerRect.JumpImage = new Image();
    LeftPlayerRect.JumpImage.src = 'Images/Jumping/Black/OnJump.png';
    LeftPlayerRect.BallOnTheTopImage = new Image();
    LeftPlayerRect.BallOnTheTopImage.src = 'Images/StandAnimations/Black/BallOnTheTop.png';

    RightPlayerRect.StandAnimationBallOnTheRight = new Image();
    RightPlayerRect.StandAnimationBallOnTheRight.src = 'Images/StandAnimations/Blue/BallOnTheRight.png';
    RightPlayerRect.StandAnimationBallOnTheLeft = new Image();
    RightPlayerRect.StandAnimationBallOnTheLeft.src = 'Images/StandAnimations/Blue/BallOnTheLeft.png';
    RightPlayerRect.JumpImage = new Image();
    RightPlayerRect.JumpImage.src = 'Images/Jumping/Blue/OnJump.png';
    RightPlayerRect.BallOnTheTopImage = new Image();
    RightPlayerRect.BallOnTheTopImage.src = 'Images/StandAnimations/Blue/BallOnTheTop.png';

    RedBonusImage = new Image();
    RedBonusImage.src = 'Images/Bonuses/RedBonus.png';
    GreenBonusImage = new Image();
    GreenBonusImage.src = 'Images/Bonuses/GreenBonus.png';
}

function ChooseRandomCornerForAi()
{
    var CurrentRandomNumber = GetRandomNumber(1, 2);
    if (CurrentRandomNumber == 1)
    {
        AiTryingToCatchBallByLeftCorner = true;
    }
    else
    {
        AiTryingToCatchBallByLeftCorner = false;
    }
}

function GetRandomNumber(MinNumber, MaxNumber)
{
    return Math.floor(Math.random() * ((MaxNumber + 1) - MinNumber)) + MinNumber;
}

function CreateNewBonusForPlayers()
{
    CurrentSpeedBonus.ItShouldBeDrawn = true;
    CurrentSpeedBonus.y = GetRandomNumber(0, (GameCanvas.height - Grid.height) - CurrentSpeedBonus.height);
    CurrentSpeedBonus.x = GetRandomNumber(0, (GameCanvas.width - CurrentSpeedBonus.width));
    CurrentSpeedBonus.Owner = OwnersOfBonuses.NoOne;
    if (GetRandomNumber(0, 1) == 0)
    {
        CurrentSpeedBonus.BonusImage = GreenBonusImage;
    }
    else
    {
        CurrentSpeedBonus.BonusImage = RedBonusImage;
    }
}

