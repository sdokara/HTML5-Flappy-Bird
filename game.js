window.onload = function () {
    const game = new Phaser.Game(320, 480, Phaser.CANVAS);
    let bird;
    // bird gravity, will make bird fall if you don't flap
    const birdGravity = 800;
    // horizontal bird speed
    const birdSpeed = 125;
    // flap thrust
    const birdFlapPower = 300;
    // milliseconds between the creation of two pipes
    const pipeInterval = 2000;
    // hole between pipes
    const pipeHole = 120;
    let pipeGroup;
    let score = 0;
    let scoreText;
    let topScore;

    const play = function (game) {
    };

    play.prototype = {
        preload: function () {
            game.load.image("bird", "img/bird.png");
            game.load.image("pipe", "img/pipe.png");
        },
        create: function () {
            pipeGroup = game.add.group();
            score = 0;
            topScore = parseInt(localStorage.getItem('topFlappyScore')) || 0;
            scoreText = game.add.text(10, 10, "-", {font: "bold 16px Arial"});
            updateScore();
            game.stage.backgroundColor = "#87CEEB";
            game.stage.disableVisibilityChange = true;
            game.physics.startSystem(Phaser.Physics.ARCADE);
            bird = game.add.sprite(80, 240, "bird");
            bird.anchor.set(0.5);
            game.physics.arcade.enable(bird);
            bird.body.gravity.y = birdGravity;
            game.input.onDown.add(flap, this);
            game.time.events.loop(pipeInterval, addPipe);320
            addPipe();
        },
        update: function () {
            game.physics.arcade.collide(bird, pipeGroup, die);
            if (bird.y > game.height) {
                die();
            }
        }
    }

    game.state.add("Play", play);
    game.state.start("Play");

    function updateScore() {
        scoreText.text = "Score: " + score + "\nBest: " + topScore;
    }

    function flap() {
        bird.body.velocity.y = -birdFlapPower;
    }

    function addPipe() {
        const pipeHolePosition = game.rnd.between(50, 430 - pipeHole);
        const upperPipe = new Pipe(game, 320, pipeHolePosition - 480, -birdSpeed);
        game.add.existing(upperPipe);
        pipeGroup.add(upperPipe);
        const lowerPipe = new Pipe(game, 320, pipeHolePosition + pipeHole, -birdSpeed);
        game.add.existing(lowerPipe);
        pipeGroup.add(lowerPipe);
    }

    function die() {
        localStorage.setItem("topFlappyScore", Math.max(score, topScore).toString());
        game.state.start("Play");
    }


    const Pipe = function (game, x, y, speed) {
        Phaser.Sprite.call(this, game, x, y, "pipe");
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.velocity.x = speed;
        this.giveScore = true;
    };

    Pipe.prototype = Object.create(Phaser.Sprite.prototype);
    Pipe.prototype.constructor = Pipe;

    Pipe.prototype.update = function () {
        if (this.x + this.width < bird.x && this.giveScore) {
            score += 0.5;
            updateScore();
            this.giveScore = false;
        }
        if (this.x < -this.width) {
            this.destroy();
        }
    };
}
