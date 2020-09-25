// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

// setup wrap coordinates plugin
Matter.use('matter-wrap');


var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var trampolineA;
var trampolineB;
var ball;
var ground;

var canvas;

function setup() {
  canvas = createCanvas(800, 600);

  engine = Engine.create();

  // ball
  ball = Bodies.circle(300, 50, 40);
  ball.plugin.wrap = {
      min: { x: 0, y: 0 },
      max: { x: width, y: height }
  };

  // create two trampolines and a ground
  trampolineA = Bodies.rectangle(600, 500, 200, 50, {isStatic: true});
  trampolineA.restitution = 0.5;
  trampolineB = Bodies.rectangle(200, 500, 200, 50, {isStatic: true});
  trampolineB.restitution = 1;
  ground = Bodies.rectangle(400, height-25, 810, 25, {isStatic: true});
  World.add(engine.world, [trampolineA, trampolineB, ball, ground]);

  // setup mouse
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05, angularStiffness: 0 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(0);

  noStroke();
  fill(255);
  drawVertices(trampolineA.vertices);
  drawVertices(trampolineB.vertices);
  drawVertices(ball.vertices);

  fill(128);
  drawVertices(ground.vertices);

  drawMouse(mouseConstraint);
}

function drawMouse(mouseConstraint) {
  if (mouseConstraint.body) {
    var pos = mouseConstraint.body.position;
    var offset = mouseConstraint.constraint.pointB;
    var m = mouseConstraint.mouse.position;
    stroke(0, 255, 0);
    strokeWeight(2);
    line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
  }
}

function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
