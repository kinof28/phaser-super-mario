var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var score = 0;
var scoreText;
let gameOver=false;
let right=true;
let gright =true;
let bright =true;
let zright =true;
let mright =true;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', './assets/sky.png');
    this.load.image('ground', './assets/ground.png');
    this.load.image('star', './assets/star.png');
    this.load.image('bomb', './assets/bomb.png');
    this.load.spritesheet('dude', 
        './assets/luigi.png',
        { frameWidth: 29, frameHeight: 35 }
    );
    this.load.spritesheet('enemy','./assets/enemy.png',{ frameWidth :29 , frameHeight :28});
    this.load.spritesheet('bowser','./assets/bowser.png',{ frameWidth :39 , frameHeight :34});
    this.load.spritesheet('gomba','./assets/gomba.png',{ frameWidth :24 , frameHeight :22});
    this.load.spritesheet('zer','./assets/zer.png',{ frameWidth :27.6 , frameHeight :18});
    this.load.spritesheet('marto','./assets/marto.png',{ frameWidth :28 , frameHeight :27});
}

function create ()
{
    this.add.image(400, 300, 'sky');
    platforms = this.physics.add.staticGroup();

    //-------------Main Ground---------------------------------------
    platforms.create(88, 584, 'ground');
    platforms.create(264, 584, 'ground');
    platforms.create(440, 584, 'ground');
    platforms.create(616, 584, 'ground');
    platforms.create(792, 584, 'ground');
    //--------------------------------------------------------------
    platforms.create(600, 410, 'ground');//zer ground
    platforms.create(88, 250, 'ground');//gomba ground
    platforms.create(250, 420, 'ground');//bowser ground
    platforms.create(750, 230, 'ground');//marto ground
    //--------------------------------------------------------------
    player = this.physics.add.sprite(100, 450, 'dude');
    enemy= this.physics.add.sprite(150,500,'enemy');
    bowser= this.physics.add.sprite(300,300,'bowser');
    gomba= this.physics.add.sprite(50,100,'gomba');
    zer= this.physics.add.sprite(550,300,'zer');
    marto= this.physics.add.sprite(750,100,'marto');

    // enemy.setBounce(0.2);
    enemy.setCollideWorldBounds(true);
    bowser.setCollideWorldBounds(true);
    gomba.setCollideWorldBounds(true);
    zer.setCollideWorldBounds(true);
    marto.setCollideWorldBounds(true);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 6 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'dead',
        frames: [ { key: 'dude', frame: 0 } ],
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 10 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'jump',
        frames: [ { key: 'dude', frame: 1 } ],
        frameRate: 10,
        repeat: -1
    });
    //---------------enemy animation----------------
    this.anims.create({
        key: 'eleft',
        frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'eright',
        frames: this.anims.generateFrameNumbers('enemy', { start: 2, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    //-----------------Gomba animation--------------------
    this.anims.create({
        key: 'gmove',
        frames: this.anims.generateFrameNumbers('gomba', { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
    });
    //-------------Bowser animation ----------------------
    this.anims.create({
        key: 'bleft',
        frames: this.anims.generateFrameNumbers('bowser', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'bright',
        frames: this.anims.generateFrameNumbers('bowser', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    //------------Marto animation ------------------------
    this.anims.create({
        key: 'mleft',
        frames: this.anims.generateFrameNumbers('marto', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'mright',
        frames: this.anims.generateFrameNumbers('marto', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    //------------Zer animation ---------------------------
    this.anims.create({
        key: 'zleft',
        frames: this.anims.generateFrameNumbers('zer', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'zright',
        frames: this.anims.generateFrameNumbers('zer', { start: 3, end: 4 }),
        frameRate: 10,
        repeat: -1
    });
    //---------------------------------------------------------
    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    stars.children.iterate(function (child) {
    
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.collider(bowser, platforms);
    this.physics.add.collider(gomba, platforms);
    this.physics.add.collider(marto, platforms);
    this.physics.add.collider(zer, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(player, enemy, hitBomb, null, this);
    this.physics.add.collider(player, bowser, hitBomb, null, this);
    this.physics.add.collider(player, gomba, hitBomb, null, this);
    this.physics.add.collider(player, marto, hitBomb, null, this);
    this.physics.add.collider(player, zer, hitBomb, null, this);


}

function update ()
{   
    //------------------ Gomba Animation ----------------------
    gomba.anims.play('gmove',true);
    if(gomba.x>13&&!gright){
        gomba.setVelocityX(-60);
    }else{
        gright=!(gomba.x>163);
        gomba.setVelocityX(+60);
    }
    //------------------ Bowser Animation --------------------------
    if(bowser.x>182&&!bright){
        bowser.anims.play('bleft',true);
        bowser.setVelocityX(-60);
    }else{
        bright=!(bowser.x>318);
        bowser.anims.play('bright',true);
        bowser.setVelocityX(+60);
    }
    //------------------ Zer Animation ------------------
    if(zer.x>526&&!zright){
        zer.anims.play('zleft',true);
        zer.setVelocityX(-60);
    }else{
        zright=!(zer.x>674);
        zer.anims.play('zright',true);
        zer.setVelocityX(+60);
    }
    //--------------------- MArto Animation -----------750 ---- 28
    if(marto.x>676&&!mright){
        marto.anims.play('mleft',true);
        marto.setVelocityX(-60);
    }else{
        mright=!(marto.x>785);
        marto.anims.play('mright',true);
        marto.setVelocityX(+60);
    }
    //-------------------------------------------------------------
    if(enemy.x>15&&!right){
        enemy.anims.play('eleft',true);
        enemy.setVelocityX(-60);
    }else{
        right=!(enemy.x>785);
        enemy.anims.play('eright',true);
        enemy.setVelocityX(+60);
    }

    if (cursors.left.isDown &&!gameOver)
{
    player.setVelocityX(-160);

    player.anims.play('left', true);
}
else if (cursors.right.isDown &&!gameOver)
{   
    player.setVelocityX(160);

    player.anims.play('right', true);
}
else
{
    player.setVelocityX(0);
    if(player.body.touching.down &&!gameOver)
    player.anims.play('turn');
}

if (cursors.up.isDown && player.body.touching.down &&!gameOver)
{   
    player.anims.play('jump');
    player.setVelocityY(-330);
}
}

function collectStar (player, star)
{
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
    
}
function hitBomb (player, bomb)
{
    this.add.text(300, 250, 'Game Over', { fontSize: '64px', fill: '#f00' });
    player.setTint(0xff0000);
    player.anims.play('dead');
    gameOver = true;
    this.physics.pause();

}