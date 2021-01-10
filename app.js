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

function loadProgressHander(loader, resource){
  console.log("loading: " + resource.url);
  console.log("progress: " + loader.progress + "%");

  let style = new TextStyle({
    fontFamily: "Futura",
    fontSize: 38,
    fill: "white",
    width: "100px",
    height: "50px"
  });
  
  let message = new Text("Loading...", style);
  message.x = 960/2 - 0.5*message.width;
  message.y = 535/2 - 0.5*message.height;

  app.stage.addChild(message);
}

function setup(){
  console.log("All files loaded");

  let id = resources["images/game.json"].textures;

  let BG = new Sprite(id["BG.png"]);
  app.stage.addChild(BG);

  let BTN = new Sprite(id["BTN_Spin.png"]);
  app.stage.addChild(BTN);
  BTN.x = app.stage.width - BTN.width - 38;
  BTN.y = app.stage.height / 2 - BTN.height / 2;

  let BTNd = new Sprite(id["BTN_Spin_d.png"]);
  app.stage.addChild(BTNd);
  BTNd.x = app.stage.width - BTN.width - 38;
  BTNd.y = app.stage.height / 2 - BTN.height / 2;
  BTNd.visible = false;

  let SYM1 = new Sprite(id["SYM1.png"]);
  app.stage.addChild(SYM1);
  SYM1.x = app.stage.width / 4 - ((app.stage.width / 4) / 3) * 2 - 11;
  SYM1.y = app.stage.height / 3 + 11;

  let SYM3 = new Sprite(id["SYM3.png"]);
  app.stage.addChild(SYM3);
  SYM3.x = app.stage.width / 4 - ((app.stage.width / 4) / 3) * 2 - 11;
  SYM3.y = app.stage.height / 3 + (app.stage.height / 3) + 11;

  let SYM4 = new Sprite(id["SYM4.png"]);
  app.stage.addChild(SYM4);
  SYM4.x = app.stage.width / 4 - ((app.stage.width / 4) / 3) * 2 - 11;
  SYM4.y = app.stage.height / 3 - (app.stage.height / 3) + 11;

  let SYM5 = new Sprite(id["SYM5.png"]);
  app.stage.addChild(SYM5);
  SYM5.x = app.stage.width / 4 + ((app.stage.width / 4) / 3) - 11;
  SYM5.y = app.stage.height / 3 + 11;

  let SYM6 = new Sprite(id["SYM6.png"]);
  app.stage.addChild(SYM6);
  SYM6.x = app.stage.width / 4 + ((app.stage.width / 4) / 3) - 11;
  SYM6.y = app.stage.height / 3 + (app.stage.height / 3) + 11;

  let SYM7 = new Sprite(id["SYM7.png"]);
  app.stage.addChild(SYM7);
  SYM7.x = app.stage.width / 4 + ((app.stage.width / 4) / 3) - 11;
  SYM7.y = app.stage.height / 3 - (app.stage.height / 3) + 11;



  gameScene = new Container();
  app.stage.addChild(gameScene);

  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);

  gameOverScene.visible = false;

  //set the game state to `play`
  state = play;

  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  //Runs the current game `state` in a loop and renders the sprites
}

function play(delta) {
  //All the game logic goes here
}

function end() {
  //All the code that should run at the end of the game
}