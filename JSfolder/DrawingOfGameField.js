
var PlayerRedBonusText = 'HalfSpeed';
var PlayerGreenBonusText = 'DoubleSpeed';

function DrawGameField() {

    UpdsteInfoAboutBonuses();

    if (LeftPlayerRect.XSpeed != 0) {
        ++LeftPlayerRect.AnimationCounter;
        if (LeftPlayerRect.AnimationCounter == PlayerAnimationCounter) {
            LeftPlayerRect.AnimationCounter = 0;
            if (LeftPlayerRect.XSpeed > 0) {
                if (LeftPlayerRect.WalkFrameNumber < LeftPlayerWalkingAnimationImages.length - 1) {
                    LeftPlayerRect.WalkFrameNumber += 1;
                }
                else {
                    LeftPlayerRect.WalkFrameNumber = 0;
                }
            }
            else if (LeftPlayerRect.XSpeed < 0) {
                if (LeftPlayerRect.WalkFrameNumber > 0) {
                    LeftPlayerRect.WalkFrameNumber -= 1;
                }
                else {
                    LeftPlayerRect.WalkFrameNumber = LeftPlayerWalkingAnimationImages.length - 1;
                }
            }
        }
    }
    else {
        LeftPlayerRect.AnimationCounter = 0;
        LeftPlayerRect.WalkFrameNumber = 0;
    }
    if (RightPlayerRect.XSpeed != 0) {
        ++RightPlayerRect.AnimationCounter;
        if (RightPlayerRect.AnimationCounter == PlayerAnimationCounter) {
            RightPlayerRect.AnimationCounter = 0;
            if (RightPlayerRect.XSpeed > 0) {
                if (RightPlayerRect.WalkFrameNumber > 0) {
                    RightPlayerRect.WalkFrameNumber -= 1;
                }
                else {
                    RightPlayerRect.WalkFrameNumber = RightPlayerWalkingAnimationImages.length - 1;
                }
            }
            else if (RightPlayerRect.XSpeed < 0) {
                if (RightPlayerRect.WalkFrameNumber < RightPlayerWalkingAnimationImages.length - 1) {
                    RightPlayerRect.WalkFrameNumber += 1;
                }
                else {
                    RightPlayerRect.WalkFrameNumber = 0;
                }
            }
        }
    }
    else {
        RightPlayerRect.AnimationCounter = 0;
        RightPlayerRect.WalkFrameNumber = 0;
    }

    if (RightPlayerRect.AnimationCounter == PlayerAnimationCounter) {
        RightPlayerRect.AnimationCounter = 0;
        if (RightPlayerRect.WalkFrameNumber < RightPlayerWalkingAnimationImages.length - 1) {
            RightPlayerRect.WalkFrameNumber += 1;
        }
        else {
            RightPlayerRect.WalkFrameNumber = 0;
        }
    }
    if (!AiOff) {
        AiDecision();
    }
    var IntersectionWithLeftPlayer = false;
    var IntersectionWithRightPlayer = false;

    //Проверяем мешает ли мяч движению игроков
    if ((GameBall.y >= LeftPlayerRect.y - GameBall.radius) || (GameBall.y >= RightPlayerRect.y - GameBall.radius)) {
        IntersectionWithLeftPlayer = Intersection(LeftPlayerRect);
        IntersectionWithRightPlayer = Intersection(RightPlayerRect);
        if (IntersectionWithLeftPlayer && (GameBall.x < LeftPlayerRect.x || GameBall.x > LeftPlayerRect.x + LeftPlayerRect.width)) {
            if (GameBall.x > LeftPlayerRect.x) {
                LeftPlayerRect.CanMoveRight = false;
                LeftPlayerRect.CanMoveLeft = true;
            }
            else if (GameBall.x < LeftPlayerRect.x) {
                LeftPlayerRect.CanMoveRight = true;
                LeftPlayerRect.CanMoveLeft = false;
            }
            if ((GameBall.x < LeftPlayerRect.x) && ((LeftPlayerRect.x - GameBall.x) < GameBall.radius)) {
                LeftPlayerRect.CanMoveUp = false;
            }
            else if ((GameBall.x > LeftPlayerRect.x) && ((GameBall.x - LeftPlayerRect.x) < (GameBall.radius + LeftPlayerRect.width))) {
                LeftPlayerRect.CanMoveUp = false;
            }
            else {
                LeftPlayerRect.CanMoveUp = true;
            }
        }
        else {
            LeftPlayerRect.CanMoveLeft = true;
            LeftPlayerRect.CanMoveRight = true;
            if (IntersectionWithLeftPlayer) {
                LeftPlayerRect.CanMoveUp = false;
            }
            else {
                LeftPlayerRect.CanMoveUp = true;
            }
        }
        if (IntersectionWithRightPlayer && (GameBall.x < RightPlayerRect.x || GameBall.x > RightPlayerRect.x + RightPlayerRect.width)) {
            if (GameBall.x > RightPlayerRect.x) {
                RightPlayerRect.CanMoveRight = false;
                RightPlayerRect.CanMoveLeft = true;
            }
            else if (GameBall.x < RightPlayerRect.x) {
                RightPlayerRect.CanMoveRight = true;
                RightPlayerRect.CanMoveLeft = false;
            }
            if ((GameBall.x < RightPlayerRect.x) && ((RightPlayerRect.x - GameBall.x) < GameBall.radius)) {
                RightPlayerRect.CanMoveUp = false;
            }
            else if ((GameBall.x > RightPlayerRect.x) && ((GameBall.x - RightPlayerRect.x) < (GameBall.radius + RightPlayerRect.width))) {
                RightPlayerRect.CanMoveUp = false;
            }
            else {
                RightPlayerRect.CanMoveUp = true;
            }
        }
        else {
            RightPlayerRect.CanMoveLeft = true;
            RightPlayerRect.CanMoveRight = true;
            if (IntersectionWithRightPlayer) {
                RightPlayerRect.CanMoveUp = false;
            }
            else {
                RightPlayerRect.CanMoveUp = true;
            }
        }
    }
    else {
        LeftPlayerRect.CanMoveLeft = true;
        LeftPlayerRect.CanMoveRight = true;
        LeftPlayerRect.CanMoveUp = true;
        RightPlayerRect.CanMoveLeft = true;
        RightPlayerRect.CanMoveRight = true;
        RightPlayerRect.CanMoveUp = true;
    }

    //Очищаем игровое поле
    GameFieldContext.beginPath();
    GameFieldContext.clearRect(0, 0, GameCanvas.width, GameCanvas.height);
    GameFieldContext.stroke();

    DrawingOfBonuses();

    //Рисуем мяч 
    if (GameBall.x <= GameBall.radius && !BallHitLeftWall) {
        BallWasThrownByLeftPlayer = false;
        BallWasThrownByRightPlayer = false;
        BallHitLeftWall = true;
        BallHitRightWall = false;
        BallHitRoof = false;
        if (GameBall.YSpeed < 0 && GameBall.RotateForward) {
            GameBall.RotateForward = false;
        }
        else if (GameBall.YSpeed > 0 && !GameBall.RotateForward) {
            GameBall.RotateForward = true;
        }
        GameBall.XSpeed = -GameBall.XSpeed * SlowingBallOnHit;
    }
    else if (GameBall.y <= GameBall.radius && !BallHitRoof) {
        BallWasThrownByLeftPlayer = false;
        BallWasThrownByRightPlayer = false;
        BallHitLeftWall = false;
        BallHitRightWall = false;
        BallHitRoof = true;
        if (GameBall.XSpeed > 0 && GameBall.RotateForward) {
            GameBall.RotateForward = false;
        }
        else if (GameBall.XSpeed < 0 && !GameBall.RotateForward) {
            GameBall.RotateForward = true;
        }
        GameBall.YSpeed = -GameBall.YSpeed * SlowingBallOnHit;
    }
    else if ((GameBall.x >= (GameCanvas.width - GameBall.radius)) && !BallHitRightWall) {
        BallWasThrownByLeftPlayer = false;
        BallWasThrownByRightPlayer = false;
        BallHitLeftWall = false;
        BallHitRightWall = true;
        BallHitRoof = false;
        if (GameBall.YSpeed > 0 && GameBall.RotateForward) {
            GameBall.RotateForward = false;
        }
        else if (GameBall.YSpeed < 0 && !GameBall.RotateForward) {
            GameBall.RotateForward = true;
        }
        GameBall.XSpeed = -GameBall.XSpeed * SlowingBallOnHit;
    }
    else if (GameBall.y >= GameCanvas.height - GameBall.radius) {
        if (GameBall.x < Grid.x) {
            RightPlayerRect.score += 1;
            RightPlayerScoreParagraph.Rotation = true;
        }
        else {
            LeftPlayerRect.score += 1;
            LeftPlayerScoreParagraph.Rotation = true;
        }
        clearInterval(IntervalForDrawing);
        IntervalForUpdateScoreInfo = setInterval(UpdateScoreInfo, 12);
        StartNewRound();
    }
    else {
        if (IntersectionWithLeftPlayer && !BallWasThrownByLeftPlayer) {
            BallWasThrownByLeftPlayer = true;
            BallWasThrownByRightPlayer = false;
            BallHitRightWall = false;
            BallHitLeftWall = false;
            BallHitRoof = false;
            ChangeSpeedOfGameBall(LeftPlayerRect);
            if (!LeftPlayerRect.CanMoveRight) {
                if (LeftPlayerRect.XSpeed > 0) {
                    LeftPlayerRect.XSpeed = 0;
                }
            }
            else if (!LeftPlayerRect.CanMoveLeft) {
                if (LeftPlayerRect.XSpeed < 0) {
                    LeftPlayerRect.XSpeed = 0;
                }
            }
        }
        else if (IntersectionWithRightPlayer && !BallWasThrownByRightPlayer) {
            BallWasThrownByLeftPlayer = false;
            BallWasThrownByRightPlayer = true;
            BallHitLeftWall = false;
            BallHitRightWall = false;
            BallHitRoof = false;
            ChangeSpeedOfGameBall(RightPlayerRect);
            if (!RightPlayerRect.CanMoveRight) {
                if (RightPlayerRect.XSpeed > 0) {
                    RightPlayerRect.XSpeed = 0;
                }
            }
            else if (!RightPlayerRect.CanMoveLeft) {
                if (RightPlayerRect.XSpeed < 0) {
                    RightPlayerRect.XSpeed = 0;
                }
            }
        }
        else if (Intersection(Grid)) {
            BallWasThrownByLeftPlayer = false;
            BallWasThrownByRightPlayer = false;
            BallHitLeftWall = false;
            BallHitRightWall = false;
            BallHitRoof = false;
            ChangeSpeedOfGameBall(Grid);
        }
        else {
            BallWasThrownByLeftPlayer = false;
            BallWasThrownByRightPlayer = false;
            BallHitLeftWall = false;
            BallHitRightWall = false;
            BallHitRoof = false;
        }
    }

    // величина являения
    var derivationMagnitude = 0.00001;
    // угол, на который повернём скрость
    var dAlpha = derivationMagnitude * GameBall.RotationSpeed * GameBall.RotationSpeed;

    GameBall.XSpeed = GameBall.XSpeed * Math.cos(dAlpha) + GameBall.YSpeed * Math.sin(dAlpha);
    GameBall.YSpeed = -GameBall.XSpeed * Math.sin(dAlpha) + GameBall.YSpeed * Math.cos(dAlpha);
    //*********************************************************************************************

    GameBall.YSpeed += AccelerationOfGravityForBall;
    GameBall.x += GameBall.XSpeed;
    GameBall.y += GameBall.YSpeed;

    //New drawing of ball
    GameFieldContext.beginPath();
    GameFieldContext.translate(GameBall.x, GameBall.y);
    GameFieldContext.rotate(GameBallRotationAngleDegrees * Math.PI / 180);
    DrawGameBallFromImage();
    GameFieldContext.stroke();

    if (GameBall.RotateForward) {
        if (GameBallRotationAngleDegrees < 360) {
            GameBallRotationAngleDegrees += GameBall.RotationSpeed;
        }
        else {
            GameBallRotationAngleDegrees = 0;
        }
    }
    else {
        console.log('rotation minus');
        if (GameBallRotationAngleDegrees > -360) {
            GameBallRotationAngleDegrees -= GameBall.RotationSpeed;
        }
        else {
            GameBallRotationAngleDegrees = 0;
        }
    }
    if (GameBall.RotationSpeed > GameBallMinRotationSpeed) {
        GameBall.RotationSpeed /= 1.001;
    }
    else {
        GameBall.RotationSpeed = GameBallMinRotationSpeed;
    }

    //Old game ball
    /*GameFieldContext.beginPath();
    GameFieldContext.arc(GameBall.x, GameBall.y, GameBall.radius, 0, 2 * Math.PI);
    GameFieldContext.fillStyle = GameBall.color;
    GameFieldContext.fill();
    GameFieldContext.lineWidth = 1;
    GameFieldContext.stroke();*/

    GameFieldContext.beginPath();
    GameFieldContext.fillStyle = Grid.color;
    GameFieldContext.fillRect(Grid.x, Grid.y, Grid.width, Grid.height);
    GameFieldContext.stroke();

    HandlerForJumpingAndDrawingOfPlayers();
}

function HandlerForJumpingAndDrawingOfPlayers()
{
    JumpingAndDrawingForLeftPlayer();
    JumpingAndDrawingForRightPlayer();
}

function JumpingAndDrawingForLeftPlayer()
{
    GameFieldContext.beginPath();
    GameFieldContext.fillStyle = LeftPlayerRect.color;
    //Обработка движения левого игрока при прыжке
    if (LeftPlayerRect.CanJump) {
        if (!LeftPlayerRect.Jumping) {
            if (!LeftPlayerRect.CanMoveUp) {
                LeftPlayerRect.y = GameCanvas.height - LeftPlayerRect.height;
                LeftPlayerRect.YSpeed = 0;
                LeftPlayerRect.CanJump = false;
            }
            else {
                LeftPlayerRect.YSpeed += AccelerationOfGravity;
                LeftPlayerRect.y += LeftPlayerRect.YSpeed;
                LeftPlayerRect.Jumping = true;
            }
        }
        else if (LeftPlayerRect.y >= (GameCanvas.height - LeftPlayerRect.height)) {
            LeftPlayerRect.y = GameCanvas.height - LeftPlayerRect.height;
            LeftPlayerRect.YSpeed = 0;
            LeftPlayerRect.Jumping = false;
            LeftPlayerRect.CanJump = false;
        }
        else {
            if (!LeftPlayerRect.CanMoveUp) {
                if (LeftPlayerRect.YSpeed < 0) {
                    LeftPlayerRect.YSpeed = -LeftPlayerRect.YSpeed;
                }
            }
            LeftPlayerRect.YSpeed += AccelerationOfGravity;
            LeftPlayerRect.y += LeftPlayerRect.YSpeed;
        }
    }
    if (LeftPlayerRect.x <= 0 && LeftPlayerRect.XSpeed > 0) {
        LeftPlayerRect.x += LeftPlayerRect.XSpeed;
    }
    else if (LeftPlayerRect.x >= BorderXforLeftPlayer && LeftPlayerRect.XSpeed < 0) {
        LeftPlayerRect.x += LeftPlayerRect.XSpeed;
    }
    else if ((LeftPlayerRect.x < BorderXforLeftPlayer) && LeftPlayerRect.x > 0) {
        LeftPlayerRect.x += LeftPlayerRect.XSpeed;
    }
    //New drawing of Left player
    if (LeftPlayerRect.YSpeed != 0) {
        LeftPlayerRect.ThrowBallImageTimer = 0;
        GameFieldContext.drawImage(LeftPlayerRect.JumpImage, LeftPlayerRect.x, LeftPlayerRect.y, LeftPlayerRect.width, LeftPlayerRect.height);
    }
    else if (LeftPlayerRect.ThrowBallImageTimer == 0) {
        GameFieldContext.drawImage(LeftPlayerWalkingAnimationImages[LeftPlayerRect.WalkFrameNumber], LeftPlayerRect.x, LeftPlayerRect.y, LeftPlayerRect.width, LeftPlayerRect.height);
    }
    else {
        --LeftPlayerRect.ThrowBallImageTimer;
        if (LeftPlayerRect.GameBallPosition == GameBallPositionsOnPlayerHit.OnLeftCorner) {
            GameFieldContext.drawImage(LeftPlayerRect.StandAnimationBallOnTheLeft, LeftPlayerRect.x, LeftPlayerRect.y, LeftPlayerRect.width, LeftPlayerRect.height);
        }
        else if (LeftPlayerRect.GameBallPosition == GameBallPositionsOnPlayerHit.OnRightCorner) {
            GameFieldContext.drawImage(LeftPlayerRect.StandAnimationBallOnTheRight, LeftPlayerRect.x, LeftPlayerRect.y, LeftPlayerRect.width, LeftPlayerRect.height);
        }
        else {
            GameFieldContext.drawImage(LeftPlayerRect.BallOnTheTopImage, LeftPlayerRect.x, LeftPlayerRect.y, LeftPlayerRect.width, LeftPlayerRect.height);
        }
    }
    //Old drawing of Left player
    //GameFieldContext.fillRect(LeftPlayerRect.x, LeftPlayerRect.y, LeftPlayerRect.width, LeftPlayerRect.height);
    GameFieldContext.stroke();
}

function JumpingAndDrawingForRightPlayer() {
    GameFieldContext.beginPath();
    GameFieldContext.fillStyle = RightPlayerRect.color;
    //Обработка движения правого игрока при прыжке
    if (RightPlayerRect.CanJump) {
        if (!RightPlayerRect.Jumping) {
            if (!RightPlayerRect.CanMoveUp) {
                RightPlayerRect.y = GameCanvas.height - RightPlayerRect.height;
                RightPlayerRect.YSpeed = 0;
                RightPlayerRect.CanJump = false;
            }
            else {
                RightPlayerRect.YSpeed += AccelerationOfGravity;
                RightPlayerRect.y += RightPlayerRect.YSpeed;
                RightPlayerRect.Jumping = true;
            }
        }
        else if (RightPlayerRect.y >= (GameCanvas.height - RightPlayerRect.height)) {
            RightPlayerRect.y = GameCanvas.height - RightPlayerRect.height;
            RightPlayerRect.YSpeed = 0;
            RightPlayerRect.Jumping = false;
            RightPlayerRect.CanJump = false;
        }
        else {
            if (!RightPlayerRect.CanMoveUp) {
                if (RightPlayerRect.YSpeed < 0) {
                    RightPlayerRect.YSpeed = -RightPlayerRect.YSpeed;
                }
            }
            RightPlayerRect.YSpeed += AccelerationOfGravity;
            RightPlayerRect.y += RightPlayerRect.YSpeed;
        }
    }
    if (RightPlayerRect.x <= BorderXForRightPlayer && RightPlayerRect.XSpeed > 0) {
        RightPlayerRect.x += RightPlayerRect.XSpeed;
    }
    else if (RightPlayerRect.x >= BorderMaxXForRightPlayer && RightPlayerRect.XSpeed < 0) {
        RightPlayerRect.x += RightPlayerRect.XSpeed;
    }
    else if ((RightPlayerRect.x > BorderXForRightPlayer) && (RightPlayerRect.x < BorderMaxXForRightPlayer)) {
        RightPlayerRect.x += RightPlayerRect.XSpeed;
    }

    //New drawing of Right player
    if (RightPlayerRect.YSpeed != 0) {
        RightPlayerRect.ThrowBallImageTimer = 0;
        GameFieldContext.drawImage(RightPlayerRect.JumpImage, RightPlayerRect.x, RightPlayerRect.y, RightPlayerRect.width, RightPlayerRect.height);
    }
    else if (RightPlayerRect.ThrowBallImageTimer == 0) {
        GameFieldContext.drawImage(RightPlayerWalkingAnimationImages[RightPlayerRect.WalkFrameNumber], RightPlayerRect.x, RightPlayerRect.y, RightPlayerRect.width, RightPlayerRect.height);
    }
    else {
        --RightPlayerRect.ThrowBallImageTimer;
        if (RightPlayerRect.GameBallPosition == GameBallPositionsOnPlayerHit.OnLeftCorner) {
            GameFieldContext.drawImage(RightPlayerRect.StandAnimationBallOnTheLeft, RightPlayerRect.x, RightPlayerRect.y, RightPlayerRect.width, RightPlayerRect.height);
        }
        else if (RightPlayerRect.GameBallPosition == GameBallPositionsOnPlayerHit.OnRightCorner) {
            GameFieldContext.drawImage(RightPlayerRect.StandAnimationBallOnTheRight, RightPlayerRect.x, RightPlayerRect.y, RightPlayerRect.width, RightPlayerRect.height);
        }
        else {
            GameFieldContext.drawImage(RightPlayerRect.BallOnTheTopImage, RightPlayerRect.x, RightPlayerRect.y, RightPlayerRect.width, RightPlayerRect.height);
        }
    }
    //Old drawing of Right player
    //GameFieldContext.fillRect(RightPlayerRect.x, RightPlayerRect.y, RightPlayerRect.width, RightPlayerRect.height);
    GameFieldContext.stroke();
}

function DrawingOfBonuses()
{
    //Drawing of bonus
    if (CurrentSpeedBonus.ItShouldBeDrawn) {
        if (IntersectionForBallAndBonus()) {
            CurrentSpeedBonus.ItShouldBeDrawn = false;
        }
    }
    if (CurrentSpeedBonus.ItShouldBeDrawn) {
        GameFieldContext.beginPath();
        --CurrentSpeedBonus.BonusTimerForSizeChanging;
        if (CurrentSpeedBonus.BonusSizeGrows) {
            CurrentSpeedBonus.x -= CurrentSpeedBonus.SpeedOfResizing / 2;
            CurrentSpeedBonus.y -= CurrentSpeedBonus.SpeedOfResizing / 2;
            CurrentSpeedBonus.width += CurrentSpeedBonus.SpeedOfResizing;
            CurrentSpeedBonus.height += CurrentSpeedBonus.SpeedOfResizing;
        }
        else {
            CurrentSpeedBonus.x += CurrentSpeedBonus.SpeedOfResizing / 2;
            CurrentSpeedBonus.y += CurrentSpeedBonus.SpeedOfResizing / 2;
            CurrentSpeedBonus.width -= CurrentSpeedBonus.SpeedOfResizing;
            CurrentSpeedBonus.height -= CurrentSpeedBonus.SpeedOfResizing;
        }
        if (CurrentSpeedBonus.BonusTimerForSizeChanging == 0) {
            CurrentSpeedBonus.BonusTimerForSizeChanging = MaxTimerValueForBonusAnimation;
            if (CurrentSpeedBonus.BonusSizeGrows) {
                CurrentSpeedBonus.BonusSizeGrows = false;
            }
            else {
                CurrentSpeedBonus.BonusSizeGrows = true;
            }
        }
        GameFieldContext.drawImage(CurrentSpeedBonus.BonusImage, CurrentSpeedBonus.x, CurrentSpeedBonus.y, CurrentSpeedBonus.width, CurrentSpeedBonus.height);
        GameFieldContext.stroke();
    }
}

function UpdsteInfoAboutBonuses()
{
    if (LeftPlayerRect.BonusTimer > 0) {
        --LeftPlayerRect.BonusTimer;
        if (LeftPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus) {
            ParagraphForLeftPlayerBonus.style.color = 'red';
            ParagraphForLeftPlayerBonus.innerText = PlayerRedBonusText + '  ' + Math.floor(LeftPlayerRect.BonusTimer / 100) + '  ';
        }
        else {
            ParagraphForLeftPlayerBonus.style.color = 'green';
            ParagraphForLeftPlayerBonus.innerText = PlayerGreenBonusText + '  ' + Math.floor(LeftPlayerRect.BonusTimer / 100) + '  ';
        }
    }
    else {
        ParagraphForLeftPlayerBonus.innerText = '';
    }
    if (RightPlayerRect.BonusTimer > 0) {
        --RightPlayerRect.BonusTimer;
        if (RightPlayerRect.CurrentBonus == BonucesForPlayers.RedSpeedBonus) {
            ParagraphForRightPlayerBonus.style.color = 'red';
            ParagraphForRightPlayerBonus.innerText = '  ' + PlayerRedBonusText + '  ' + Math.floor(RightPlayerRect.BonusTimer / 100);
        }
        else {
            ParagraphForRightPlayerBonus.style.color = 'green';
            ParagraphForRightPlayerBonus.innerText = '  ' + PlayerGreenBonusText + '  ' + Math.floor(RightPlayerRect.BonusTimer / 100);
        }
    }
    else {
        ParagraphForRightPlayerBonus.innerText = '';
    }
}