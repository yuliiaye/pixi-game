let Application = PIXI.Application,
  Container = PIXI.Container,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  TextureCache = PIXI.utils.TextureCache,
  Sprite = PIXI.Sprite;
  Text = PIXI.Text;
  TextStyle = PIXI.TextStyle;

let app = new Application({
  width: 960, 
  height: 535,
  antialias: true,
  transparent: false,
  resolution: 1
  }
);

document.body.appendChild(app.view);

loader
  .add("images/game.json")
  .on("progress", loadProgressHander)
  .load(setup);

let message, id, BG, BTN, BTNd;
let arrayOfSymbols = [];
let arrWithAlreadyExists = [];
let counter = 0;

let style = new TextStyle({
  fontFamily: "Futura",
  fontSize: 38,
  fill: "white",
  width: "100px",
  height: "50px"
});

function loadProgressHander(loader, resource){
  console.log("loading: " + resource.url);
  console.log("progress: " + loader.progress + "%");
  
  message = new Text("Loading...", style);
  message.x = 960/2 - 0.5*message.width;
  message.y = 535/2 - 0.5*message.height;

  app.stage.addChild(message);

}

function setup(){
  console.log("All files loaded");

  app.stage.removeChild(message);

  id = resources["images/game.json"].textures;

  BG = new Sprite(id["BG.png"]);
  app.stage.addChild(BG);
        
  BTN = new Sprite(id["BTN_Spin.png"]);
  BTN.name = "button";
  BTN.position.x = app.stage.width - BTN.width - 38;
  BTN.position.y = app.stage.height / 2 - BTN.height / 2;
  BTN.interactive = true;
  BTN.buttonMode = true;
  BTN.tap = onButtonClick;
  BTN.click = onButtonClick;

  app.stage.addChild(BTN);
  
  function onButtonClick() {
    if (this.name === "button") {
      startSpin();
    }
  }

  BTNd = new Sprite(id["BTN_Spin_d.png"]);
  app.stage.addChild(BTNd);
  BTNd.x = app.stage.width - BTN.width - 38;
  BTNd.y = app.stage.height / 2 - BTN.height / 2;
  BTNd.visible = false;


  function arrayRandElement(arr) {
    let rand = Math.floor(Math.random() * arr.length);
    arrWithAlreadyExists.push(arr[rand]);
    return arr[rand];
    }

  arrayOfSymbols = [id["SYM1.png"], id["SYM3.png"], id["SYM4.png"], id["SYM5.png"], id["SYM6.png"], id["SYM7.png"]]

  let reelWidth = 240;
  let symbolSize = 170;
  let reels = [];
  let reelContainer = new Container();
  for (let i = 0; i < 3; i++){

    let rc = new Container();
    rc.x = 110 + i * reelWidth;
    reelContainer.addChild(rc);

    let reel = {
      container: rc,
      symbols: [],
      position: 0,
      previousPosition: 0,
    }

    for (let j = 0; j < 4; j++) {
      const symbol = new Sprite(arrayRandElement(arrayOfSymbols));
      symbol.y = 55 + j * symbolSize;
      symbol.x = Math.round((symbolSize - symbol.width) / 2);
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    reels.push(reel);
  }

  app.stage.addChild(reelContainer);
  
  const margin = 10;
  reelContainer.y = margin;
  reelContainer.x = -margin;

  let running = false;

  function startSpin() {
    if (running) {
      return;
    };
    running = true;
    BTNd.visible = true;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra * 600;
      tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
    }
  }

  function reelsComplete() {
    running = false;
    BTNd.visible = false;
  }

  app.ticker.add(delta => {
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];

      // Update symbol positions on reel.
      for (let j = 0; j < r.symbols.length; j++) {
          const s = r.symbols[j];
          const prevy = s.y;
          s.y = ((r.position + j) % r.symbols.length) * symbolSize - symbolSize;
          if (s.y < 0 && prevy > symbolSize) {
              // This should in proper product be determined from some logical reel.
              s.texture = arrayOfSymbols[Math.floor(Math.random() * arrayOfSymbols.length)];
              s.x = Math.round((symbolSize - s.width) / 2);
          }
      }
  }
  });
}

const tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
}

app.ticker.add((delta) => {
  const now = Date.now();
  const remove = [];
  for (let i = 0; i < tweening.length; i++) {
      const t = tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
      if (t.change) t.change(t);
      if (phase === 1) {
          t.object[t.property] = t.target;
          if (t.complete) t.complete(t);
          remove.push(t);
      }
  }
  for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1);
  }
});

// Basic lerp funtion.
function lerp(a1, a2, t) {
  return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
function backout(amount) {
  return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
}
// function gameLoop(delta) {
//   //Runs the current game `state` in a loop and renders the sprites
// }

// function play(delta) {
//   //All the game logic goes here
// }

// function end() {
//   //All the code that should run at the end of the game
// }