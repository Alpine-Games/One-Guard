import { init, Sprite, GameLoop, collides, degToRad, load, SpriteSheet, initPointer, Button  } from "./kontra.min.mjs";

(async () => {
  //Load assets
  var assets = await load('assets/tower.png', 'assets/arrow.png', 'assets/player.png', 'assets/bow.png', 'assets/enemy.png', 'assets/superfast.png', 'assets/life.png', 'assets/megafast.png')

  var { canvas } = init();

  var ctx = c.getContext('2d');

  var state = "start"; //start, round, upgrade, playing, loose, or win
  
  //Is muted?
  var muted = Boolean(localStorage.getItem("One Guard/Muted")) || false

  //All of the rounds
  var rounds = [
    {
      "enemies": 6,
      "minSpeed": 800,
      "maxSpeed": 2000,
      "superFastChance": 12,
      "megaFastChance": 0,
      "arrows": 50
    },
    {
      "enemies": 8,
      "minSpeed": 500,
      "maxSpeed": 2000,
      "superFastChance": 18,
      "megaFastChance": 3,
      "arrows": 20,
      "upgrade": true
    },
    {
      "enemies": 10,
      "minSpeed": 800,
      "maxSpeed": 3000,
      "superFastChance": 20,
      "megaFastChance": 5,
      "arrows": 18
    },
    {
      "enemies": 13,
      "minSpeed": 100,
      "maxSpeed": 4000,
      "superFastChance": 26,
      "megaFastChance": 8,
      "arrows": 20
    },
    {
      "enemies": 20,
      "minSpeed": 500,
      "maxSpeed": 3000,
      "superFastChance": 32,
      "megaFastChance": 10,
      "arrows": 25,
      "upgrade": true
    },
    {
      "enemies": 26,
      "minSpeed": 200,
      "maxSpeed": 2500,
      "superFastChance": 40,
      "megaFastChance": 12,
      "arrows": 30
    },
    {
      "enemies": 10,
      "minSpeed": 2000,
      "maxSpeed": 4000,
      "superFastChance": 100,
      "megaFastChance": 100,
      "arrows": 12,
      "upgrade": true
    },
    {
      "enemies": 40,
      "minSpeed": 2000,
      "maxSpeed": 2000,
      "superFastChance": 60,
      "megaFastChance": 18,
      "arrows": 43
    },
    {
      "enemies": 15,
      "minSpeed": 1000,
      "maxSpeed": 2000,
      "superFastChance": 100,
      "megaFastChance": 100,
      "arrows": 16,
      "upgrade": true
    },
    {
      "enemies": 13,
      "minSpeed": 100,
      "maxSpeed": 1000,
      "superFastChance": 50,
      "megaFastChance": 80,
      "arrows": 12
    },
  ]

  var tips = [
    "Make sure you dont run out of arrows",
    "You can use the same upgrade multiple times",
    "There are 10 rounds total",
    "The last round has only 13 enemies",
    "Choose your upgrades wisely",
    "Have fun!",
    "This game autosaves",
    "Press \"m\" to mute",
    "Like the music?",
    "The red enemies are called Megafast enemies",
    "Green shirt enemies are called Superfast enemies",
    "This text is using PixelFont by PaulBGD",
    "A submission to JS13kGames"
  ]

  var currentTip = tips[Math.floor(Math.random() * tips.length)]

  //Get current round from save
  var currentRound = Number(localStorage.getItem("One Guard/Round")) || 0
  if (isNaN(currentRound)) {
    currentRound = 0
  }

  //Enemies in the round
  var enemiesRound = rounds[currentRound].enemies
  //Speed they appear
  var enemySpawnSpeedMin = rounds[currentRound].minSpeed
  var enemySpawnSpeedMax = rounds[currentRound].maxSpeed
  //Chance of superfast
  var superFastChance = rounds[currentRound].superFastChance
  //Chance of megafast
  var megaFastChance = rounds[currentRound].megaFastChance
  //Current life
  var currentLife = Number(localStorage.getItem("One Guard/Life")) || 13
  if (isNaN(currentLife)) {
    currentLife = 13
  }
  //Make round screen run once
  var roundFirst = false
  //Bonus arrows for upgrade
  var bonusArrows = Number(localStorage.getItem("One Guard/Bonus Arrows")) || 0
  if (isNaN(bonusArrows)) {
    bonusArrows = 0
  }
  //Current Arrows
  var currentArrows = rounds[currentRound].arrows + bonusArrows
  //Speed of arrows
  var arrowspeed = Number(localStorage.getItem("One Guard/Arrow Speed")) || 3
  if (isNaN(arrowspeed)) {
    arrowspeed = 3
  }
  //Firing speed of arrows
  var arrowsTime = Number(localStorage.getItem("One Guard/Arrows Time")) || 800
  if (isNaN(arrowsTime)) {
    arrowsTime = 800
  }

  //p1 by curtastic https://github.com/curtastic/p1/
  !function(){var e,r,a,$,t,_={},n=[...Array(12).keys()].map(e=>new AudioContext),f=(e,r)=>Math.sin(6.28*e+r),p=e=>f(e,f(e,0)**2+.75*f(e,.25)+.1*f(e,.5)),o=(e,r,a)=>{var t=e+""+r,f=_[t];if(e>=0&&!f){e=65.406*1.06**e/a;var o,i=a*r|0,s=a*(r-.002);for(o=(f=_[t]=n[0].createBuffer(1,i,a)).getChannelData(0);i--;)o[i]=(i<88?i/88.2:(1-(i-88.2)/s)**(Math.log(1e4*e)/2)**2)*p(i*e);$||n.map(e=>c(f,e,$=1))}return f},c=(e,r,a)=>{var $=r.createBufferSource();$.buffer=e,$.connect(r.destination),$.start(),a&&$.stop()};window.p1=$=>{var _=125,f=.5;e=$[r=0].replace(/[\!\|]/g,"").split("\n").map(e=>e>0?(_=(e=e.split("."))[0],f=e[1]/100||f):e.split("").map((a,$)=>{var t=1,n=a.charCodeAt(0);for(n-=n>90?71:65;"-"==e[$+t];)t++;return r<$&&(r=$+1),o(n,t*f*_/125,44100)})),t=0,clearInterval(a),a=setInterval(a=>{e.map((e,r)=>{e[a=t%e.length]&&c(e[a],n[3*r+t%3])}),t++,t%=r},_)}}();

  //Custom version of PixelFont by PaulBGD https://github.com/PaulBGD/PixelFont
  var letters = letters = {
    'A': [
      [, 1],
      [1, , 1],
      [1, , 1],
      [1, 1, 1],
      [1, , 1]
    ],
    'B': [
      [1, 1],
      [1, , 1],
      [1, 1, 1],
      [1, , 1],
      [1, 1]
    ],
    'C': [
      [1, 1, 1],
      [1],
      [1],
      [1],
      [1, 1, 1]
    ],
    'D': [
      [1, 1],
      [1, , 1],
      [1, , 1],
      [1, , 1],
      [1, 1]
    ],
    'E': [
      [1, 1, 1],
      [1],
      [1, 1, 1],
      [1],
      [1, 1, 1]
    ],
    'F': [
      [1, 1, 1],
      [1],
      [1, 1],
      [1],
      [1]
    ],
    'G': [
      [, 1, 1],
      [1],
      [1, , 1, 1],
      [1, , , 1],
      [, 1, 1]
    ],
    'H': [
      [1, , 1],
      [1, , 1],
      [1, 1, 1],
      [1, , 1],
      [1, , 1]
    ],
    'I': [
      [1, 1, 1],
      [, 1],
      [, 1],
      [, 1],
      [1, 1, 1]
    ],
    'J': [
      [1, 1, 1],
      [, , 1],
      [, , 1],
      [1, , 1],
      [1, 1, 1]
    ],
    'K': [
      [1, , , 1],
      [1, , 1],
      [1, 1],
      [1, , 1],
      [1, , , 1]
    ],
    'L': [
      [1],
      [1],
      [1],
      [1],
      [1, 1, 1]
    ],
    'M': [
      [1, 1, 1, 1, 1],
      [1, , 1, , 1],
      [1, , 1, , 1],
      [1, , , , 1],
      [1, , , , 1]
    ],
    'N': [
      [1, , , 1],
      [1, 1, , 1],
      [1, , 1, 1],
      [1, , , 1],
      [1, , , 1]
    ],
    'O': [
      [1, 1, 1],
      [1, , 1],
      [1, , 1],
      [1, , 1],
      [1, 1, 1]
    ],
    'P': [
      [1, 1, 1],
      [1, , 1],
      [1, 1, 1],
      [1],
      [1]
    ],
    'Q': [
      [0, 1, 1],
      [1, , , 1],
      [1, , , 1],
      [1, , 1, 1],
      [1, 1, 1, 1]
    ],
    'R': [
      [1, 1],
      [1, , 1],
      [1, , 1],
      [1, 1],
      [1, , 1]
    ],
    'S': [
      [1, 1, 1],
      [1],
      [1, 1, 1],
      [, , 1],
      [1, 1, 1]
    ],
    'T': [
      [1, 1, 1],
      [, 1],
      [, 1],
      [, 1],
      [, 1]
    ],
    'U': [
      [1, , 1],
      [1, , 1],
      [1, , 1],
      [1, , 1],
      [1, 1, 1]
    ],
    'V': [
      [1, , , , 1],
      [1, , , , 1],
      [, 1, , 1],
      [, 1, , 1],
      [, , 1]
    ],
    'W': [
      [1, , , , 1],
      [1, , , , 1],
      [1, , , , 1],
      [1, , 1, , 1],
      [1, 1, 1, 1, 1]
    ],
    'X': [
      [1, , , , 1],
      [, 1, , 1],
      [, , 1],
      [, 1, , 1],
      [1, , , , 1]
    ],
    'Y': [
      [1, , 1],
      [1, , 1],
      [, 1],
      [, 1],
      [, 1]
    ],
    'Z': [
      [1, 1, 1, 1, 1],
      [, , , 1],
      [, , 1],
      [, 1],
      [1, 1, 1, 1, 1]
    ],
    '0': [
      [1, 1, 1],
      [1, , 1],
      [1, , 1],
      [1, , 1],
      [1, 1, 1]
    ],
    '1': [
      [, 1],
      [, 1],
      [, 1],
      [, 1],
      [, 1]
    ],
    '2': [
      [1, 1, 1],
      [, , 1],
      [1, 1, 1],
      [1, ,],
      [1, 1, 1]
    ],
    '3': [
      [1, 1, 1],
      [, , 1],
      [1, 1, 1],
      [, , 1],
      [1, 1, 1]
    ],
    '4': [
      [1, , 1],
      [1, , 1],
      [1, 1, 1],
      [, , 1],
      [, , 1]
    ],
    '5': [
      [1, 1, 1],
      [1, ,],
      [1, 1, 1],
      [, , 1],
      [1, 1, 1]
    ],
    '6': [
      [1, 1, 1],
      [1, ,],
      [1, 1, 1],
      [1, , 1],
      [1, 1, 1]
    ],
    '7': [
      [1, 1, 1],
      [, , 1],
      [, , 1],
      [, , 1],
      [, , 1]
    ],
    '8': [
      [1, 1, 1],
      [1, , 1],
      [1, 1, 1],
      [1, , 1],
      [1, 1, 1]
    ],
    '9': [
      [1, 1, 1],
      [1, , 1],
      [1, 1, 1],
      [, , 1],
      [1, 1, 1]
    ],
    ' ': [
      [, ,],
      [, ,],
      [, ,],
      [, ,],
      [, ,]
    ],
    '.': [
      [, ,],
      [, ,],
      [, ,],
      [, ,],
      [, 1,]
    ],
    ':': [
      [, ,],
      [, 1,],
      [, ,],
      [, ,],
      [, 1,]
    ],
    ',': [
      [, ,],
      [, ,],
      [, ,],
      [, 1,],
      [1, 1,]
    ],
    '!': [
      [, 1, ,],
      [, 1, ,],
      [, 1, ,],
      [, , ,],
      [, 1, ,]
    ],
    '(': [
      [, 1, 1,],
      [1, , ,],
      [1, , ,],
      [1, , ,],
      [, 1, 1,]
    ],
    ')': [
      [1, 1, ,],
      [, , 1,],
      [, , 1,],
      [, , 1,],
      [1, 1, ,]
    ],
    '?': [
      [, 1, 1,],
      [, , 1,],
      [, 1, ,],
      [, , ,],
      [, 1, ,]
    ]
  };

  function draw(string, size, customY = 0, customX = 0, customColor = "white") {
    //

    var needed = [];
    string = string.toUpperCase(); // because I only did uppercase letters
    for (var i = 0; i < string.length; i++) {
      var letter = letters[string.charAt(i)];
      if (letter) { // because there's letters I didn't do
        needed.push(letter);
      }
    }

    ctx.fillStyle = customColor;
    var currX = customX;
    for (i = 0; i < needed.length; i++) {
      letter = needed[i];
      var currY = customY;
      var addX = 0;
      for (var y = 0; y < letter.length; y++) {
        var row = letter[y];
        for (var x = 0; x < row.length; x++) {
          if (row[x]) {
            ctx.fillRect(currX + x * size, currY, size, size);
          }
        }
        addX = Math.max(addX, row.length * size);
        currY += size;
      }
      currX += size + addX;
    }
  }

  // ZzFX - Zuper Zmall Zound Zynth - Micro Edition
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

// This is a tiny build of zzfx with only a zzfx function to play sounds.
// You can use zzfxV to set volume.
// Feel free to minify it further for your own needs!

'use strict';let zzfx,zzfxV,zzfxX

// ZzFXMicro - Zuper Zmall Zound Zynth - v1.2.0 by Frank Force ~ 880 bytes
zzfxV=.3    // volume
zzfx=       // play sound
(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=
0,B=0,M=Math,R=44100,d=2*M.PI,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,g
=0,H=0,a=0,n=1,I=0,J=0,f=0,x,h)=>{e=R*e+9;m*=R;r*=R;t*=R;c*=R;y*=500*d/R**3;A*=d
/R;v*=d/R;z*=R;l=R*l|0;for(h=e+m+r+t+c|0;a<h;k[a++]=f)++J%(100*F|0)||(f=q?1<q?2<
q?3<q?M.sin((g%d)**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2)%2:1-4*M.abs(M.
round(g/d)-g/d):M.sin(g),f=(l?1-B+B*M.sin(d*a/l):1)*(0<f?1:-1)*M.abs(f)**D*zzfxV
*p*(a<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:
(a<h-c?1:(h-a)/c)*k[a-c|0]/2):f),x=(b+=u+=y)*M.cos(A*H++),g+=x-x*E*(1-1E9*(M.sin
(a)+1)%2),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n||=1);p=zzfxX.
createBuffer(1,h,R);p.getChannelData(0).set(k);b=zzfxX.createBufferSource();b.
buffer=p;b.connect(zzfxX.destination);b.start();return b};zzfxX=new AudioContext;

  //Pointer events
  initPointer()

  //Different screens with text
  var startScreen = () => {
    draw("One Guard", 8, 20, 55)
    draw("You are the one and only guard protecting the largest defense tower. Nothing much happens", 1, 80, 20)
    draw("here so you took the job. One day day you are attacked by another kingdom.", 1, 90, 20)
    draw("Click to shoot arrows.", 1, 105, 150)
    draw("Click to Start!", 2, 165, 140)
    draw("Mute (m)", 1, 185, 355)
  }

  var looseScreen = () => {
    draw("The Tower Was Taken", 4, 20, 40)
    draw("But you are just another guard, and two more are sent out to take your place.", 1, 50, 50)
    draw("Click to Retry!", 2, 165, 140)
  }

  var winScreen = () => {
    draw("You Defeated The Invasion", 3, 20, 45)
    draw("When you report the news to the castle, no one believes your story and you get fired.", 1, 50, 35)
    draw("Click to Restart!", 2, 165, 140)
  }

  function upgrade() {
    if (!muted) {
      zzfx(...[1.81,,27,.04,.17,.47,2,1.26,-3.1,,,.08,,,,,.14,.54,.2,.29]);
    }
    state = "round"
  }
  
  var upgradeScreen = () => {
    draw("Choose an upgrade", 3, 20, 100)

    let moreArrows = Button({
      x: 40,
      y: 160,
      height: 20,
      width: 100,
      color: "#485e6c",
      onDown() {
        bonusArrows = bonusArrows + 5
        localStorage.setItem("One Guard/Bonus Arrows", bonusArrows)
        upgrade()
      }
    });

    let fasterArrows = Button({
      x: 150,
      y: 160,
      height: 20,
      width: 100,
      color: "#485e6c",
      onDown() {
        arrowspeed = arrowspeed + 2
        localStorage.setItem("One Guard/Arrow Speed", arrowspeed)
        upgrade()
      }
    });

    let strongerBow = Button({
      x: 260,
      y: 160,
      height: 20,
      width: 100,
      color: "#485e6c",
      onDown() {
        arrowsTime = Math.max(arrowsTime - 200, 0)
        localStorage.setItem("One Guard/Arrows Time", arrowsTime)
        upgrade();
      }
    });

    moreArrows.render();
    fasterArrows.render();
    strongerBow.render();

    draw("More Arrows", 2, 165, 44)
    draw("Arrow Speed", 2, 165, 155)
    draw("Bow Speed", 2, 165, 275)
  }

  //A long story and lots of bugs but this works so I'm fine with it
  var roundScreenText = () => {
    draw("Round " + String(currentRound + 1), 2, 20, 20);
    draw("Tip: " + currentTip, 1, 40, 20)
  }

  var roundScreen = () => {
    if (roundFirst) {
      return;
    }

    setTimeout(() => {
      //Start new round
      if (!rounds[currentRound]) {
        return state = "win"
      }
      //Set new values
      enemiesRound = rounds[currentRound].enemies
      enemySpawnSpeedMin = rounds[currentRound].minSpeed
      enemySpawnSpeedMax = rounds[currentRound].maxSpeed
      superFastChance = rounds[currentRound].superFastChance
      megaFastChance = rounds[currentRound].megaFastChance
      currentArrows = rounds[currentRound].arrows + bonusArrows
      //Change tip
      currentTip = tips[Math.floor(Math.random() * tips.length)]
      state = "playing"
      roundFirst = false
    }, 2000)
    roundFirst = true
  }

  //keep track on enemies and arrows
  var enemies = []
  var arrows = [];

  //Player
  var player = Sprite({
    x: 193,
    y: 52,
    image: assets[2],
    scaleX: 1,
    scaleY: 1
  });

  //Bow
  var bow = Sprite({
    x: 200,
    y: 62,
    image: assets[3],
    scaleX: 1,
    scaleY: 1,
    anchor: { x: 0.5, y: 0.5 }
  });

  //The tower
  var tower = Sprite({
    x: 160,
    y: 60,
    image: assets[0],
    scaleX: 4,
    scaleY: 4
  });

  //Life image
  var life = Sprite({
    x: 385,
    y: 5,
    image: assets[6]
  });

  //Arrow image
  var arrowsImage = Sprite({
    x: 5,
    y: 7,
    image: assets[1]
  });

  //Change of getting enemy
  function getChance(percent) {
    var chance = Math.random() * 100;
    if (chance <= percent) {
      return true;
    } else {
      return false;
    }
  }

  //Create random enemies
  function createEnemy() {
    let enemySuperFastSpriteSheet = SpriteSheet({
      image: assets[5],
      frameWidth: 15,
      frameHeight: 21,
      animations: {
        walk: {
          frames: '0..1',
          frameRate: 5
        }
      }
    });

    let enemyMegaFastSpriteSheet = SpriteSheet({
      image: assets[7],
      frameWidth: 15,
      frameHeight: 21,
      animations: {
        walk: {
          frames: '0..1',
          frameRate: 5
        }
      }
    });
    
    //Superfast or megafast
    var betterEnemy;
    //Superfast
    if (getChance(50)) {
      if (getChance(superFastChance)) {
        betterEnemy = {
          animations: enemySuperFastSpriteSheet.animations,
          speed: 1
        }
      }
    //Megafast
    } else {
      if (getChance(megaFastChance)) {
        betterEnemy = {
          animations: enemyMegaFastSpriteSheet.animations,
          speed: 2
        }
      }
    }

    let enemySpriteSheet = SpriteSheet({
      image: assets[4],
      frameWidth: 15,
      frameHeight: 21,
      animations: {
        walk: {
          frames: '0..1',
          frameRate: 5
        }
      }
    });

    let leftEnemy = Sprite({
      type: "left",
      x: -10,
      y: 179,
      animations: betterEnemy ? betterEnemy.animations : enemySpriteSheet.animations,
      dx: betterEnemy ? betterEnemy.speed : Math.random() * (0.6 - 0.4) + 0.4,
      scaleX: -1
    });

    let rightEnemy = Sprite({
      type: "right",
      x: 400,
      y: 179,
      animations: betterEnemy ? betterEnemy.animations : enemySpriteSheet.animations,
      dx: betterEnemy ? -betterEnemy.speed : Math.random() * (-0.6 + 0.4) - 0.4
    });

    //Random from right or left
    if (!Math.round(Math.random())) {
      enemies.push(leftEnemy)
    } else {
      enemies.push(rightEnemy)
    }
  }

  //Spawn enemies using random time
  var spawnLoop = () => {
    if (state == "playing") {
      //Stops enemies from spawning when you click off the tab, creating a mob
      if (!document.hasFocus()) {
          return setTimeout(spawnLoop, Math.random() * (enemySpawnSpeedMax - enemySpawnSpeedMin) + enemySpawnSpeedMin);
      }
      
      if (enemiesRound > 0) {
        createEnemy()
        enemiesRound = enemiesRound - 1
      }
    }
    setTimeout(spawnLoop, Math.random() * (enemySpawnSpeedMax - enemySpawnSpeedMin) + enemySpawnSpeedMin)
  }

  spawnLoop()

  //Game loop
  var loop = GameLoop({
    update: function() {
      if (state == "playing") {
        if (currentLife <= 0) {
          arrows.map(arrow => arrow.ttl = 0)
          enemies.map(enemy => enemy.ttl = 0)
          //No life = loose
          

          //Reset current round
          localStorage.removeItem("One Guard/Round")
          localStorage.removeItem("One Guard/Life")
          localStorage.removeItem("One Guard/Bonus Arrows")
          localStorage.removeItem("One Guard/Arrow Speed")
          localStorage.removeItem("One Guard/Arrows Time")
          
          state = "loose"
          currentLife = 13
          currentRound = 0
          //This first
          arrowsTime = 800
          arrowspeed = 3
          bonusArrows = 0
          //Make sure to update these
          enemiesRound = rounds[currentRound].enemies
          enemySpawnSpeedMin = rounds[currentRound].minSpeed
          enemySpawnSpeedMax = rounds[currentRound].maxSpeed
          superFastChance = rounds[currentRound].superFastChance
          megaFastChance = rounds[currentRound].megaFastChance
          currentArrows = rounds[currentRound].arrows + bonusArrows
        } else {
          //Round over
          if (enemiesRound == 0 && enemies.length == 0) {
            arrows.map(arrow => arrow.ttl = 0)
            enemies.map(enemy => enemy.ttl = 0)
            currentRound = currentRound + 1
            //Save current round
            localStorage.setItem("One Guard/Round", currentRound)
            //Next round does not exist aka you win
            if (!rounds[currentRound]) {
              

              //Reset current round
              localStorage.removeItem("One Guard/Round")
              localStorage.removeItem("One Guard/Life")
              localStorage.removeItem("One Guard/Bonus Arrows")
              localStorage.removeItem("One Guard/Arrow Speed")
              localStorage.removeItem("One Guard/Arrows Time")
              
              state = "win"
              currentLife = 13
              currentRound = 0
              //This first
              arrowsTime = 800
              arrowspeed = 3
              bonusArrows = 0
              //Make sure to update these
              enemiesRound = rounds[currentRound].enemies
              enemySpawnSpeedMin = rounds[currentRound].minSpeed
              enemySpawnSpeedMax = rounds[currentRound].maxSpeed
              superFastChance = rounds[currentRound].superFastChance
              megaFastChance = rounds[currentRound].megaFastChance
              currentArrows = rounds[currentRound].arrows + bonusArrows
            } else {
              if (rounds[currentRound - 1].upgrade) {
                state = "upgrade"
              } else {
                state = "round"
              }
            }
          }
        }

        player.update();
        tower.update();
        bow.update();
        //Loose life
        enemies.map(enemy => {
          enemy.update();
          if (enemy.type == "left") {
            if (enemy.x >= 166) {
              enemy.ttl = 0
              currentLife = currentLife - 1
              localStorage.setItem("One Guard/Life", currentLife)
              if (!muted) {
                zzfx(...[1.25,,369,.02,.16,.52,2,2.46,.8,.9,,,.13,.7,-25,.3,,.25,.13]);
              }
            }
          } else if (enemy.type == "right") {
            if (enemy.x <= 224) {
              enemy.ttl = 0
              currentLife = currentLife - 1
              localStorage.setItem("One Guard/Life", currentLife)
              if (!muted) {
                zzfx(...[1.25,,369,.02,.16,.52,2,2.46,.8,.9,,,.13,.7,-25,.3,,.25,.13]);
              }
            }
          }
        })
        arrows.map(arrow => {
          arrow.update();
        })

        //Check if arrow hit enemy
        arrows.map(arrow => {
          enemies.map(enemy => {
            if (collides(arrow, enemy)) {
              enemy.ttl = 0
              if (!muted) {
                zzfx(...[2.01,,288,.03,.06,.09,4,1.78,,1.2,,,,1.5,,.5,.18,.54,.06,.16]);
              }
            }
          })
        })

        //Delete arrows after a bit
        arrows = arrows.filter(arrow => arrow.isAlive());
        //When enemies dead
        enemies = enemies.filter(enemy => enemy.isAlive());
        life.update();
        arrowsImage.update()
        //Update life count
        draw(String(currentLife), 1, 7, 375)
        //Update arrow count
        draw(String(currentArrows), 1, 7, 22)
      }
    },
    render: function() {
      //Change current screen
      if (state == "start") {
        startScreen()
      } else if (state == "win") {
        winScreen()
      } else if (state == "round") {
        roundScreenText()
        roundScreen()
      } else if (state == "upgrade") {
        upgradeScreen()
      } else if (state == "loose") {
        looseScreen()
      } else if (state == "playing") {
        player.render();
        tower.render();
        bow.render();
        enemies.map(enemy => {
          enemy.render();
        })
        arrows.map(arrow => arrow.render());
        life.render();
        arrowsImage.render()
        //Life Text
        draw(String(currentLife), 1, 7, 375)
        //Arrows Text
        draw(String(currentArrows), 1, 7, 22)
      }
    }
  });

  loop.start();
  
//Cant play music onload :(
window.addEventListener('click', () => {
//Background music (made by me!)
  if (!muted) {
  p1`240.40
a-Z---|a-X---|a-c---|a-Z-a-a--|c-Z---|Z-a---|Z-c--|c--c--e---a-|a-Z---|X-a-a-X-|X-----|
L------|O------|Q------
`
}
}, { once: true })

//Toggle mute
window.addEventListener('keyup', (e) => {
  if (e.key == "m") {
    if (!muted) {
      muted = true
      localStorage.setItem("One Guard/Muted", "true")
      p1``
    } else {
      muted = false
      localStorage.removeItem("One Guard/Muted")
      p1`240.40
a-Z---|a-X---|a-c---|a-Z-a-a--|c-Z---|Z-a---|Z-c--|c--c--e---a-|a-Z---|X-a-a-X-|X-----|
L------|O------|Q------
`
    }
  }
})
  
  var shot = false
  var shotTimeout = false

  //On click on canvas
  c.addEventListener('mousedown', (e) => {
    if (state == "start") {
      state = "round"
    } else if (state == "loose") {
      state = "round"
    } else if (state == "win") {
      state = "round"
    } else if (state == "playing") {
      //Shoot arrow
      let y1 = 80
      let y2 = e.offsetY
      let x1 = 197.5
      let x2 = e.offsetX
      let dirx = x2 - x1
      let diry = y2 - y1
      let dist = Math.sqrt(dirx * dirx + diry * diry)
      let velocityX = (dirx / dist) * arrowspeed
      let velocityY = (diry / dist) * arrowspeed

      if (!shot && currentArrows > 0) {
        let arrow = Sprite({
          x: 202.5,
          y: 64,
          image: assets[1],
          ttl: 150,
          dx: velocityX,
          dy: velocityY,
          rotation: degToRad(Math.atan2(diry, dirx) * (180 / Math.PI))
        });

        arrows.push(arrow)

        if (!muted) {
          zzfx(...[2.01,,326,.02,.04,.02,,1.72,-0.9,-0.6,,,,1.2,,,.18,.68,.04]);
        }
        
        currentArrows = currentArrows - 1
        shot = true
      }
    }
  })

  //Rotate bow
  c.addEventListener('mousemove', (e) => {
    if (state == "playing") {
      let y1 = 80
      let y2 = e.offsetY
      let x1 = 197.5
      let x2 = e.offsetX
      let dirx = x2 - x1
      let diry = y2 - y1

      bow.rotation = degToRad(Math.atan2(diry, dirx) * (180 / Math.PI))
    }
  })

  //Timeout before next arrow
  c.addEventListener('mouseup', (e) => {
    if (state == "playing") {
      if (!shotTimeout) {
        shotTimeout = true
        setTimeout(() => {
          shot = false
          shotTimeout = false
        }, arrowsTime)
      }
    }
  })
})();