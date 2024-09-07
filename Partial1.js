var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_FragColor;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  void main(){
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_FragColor = a_Color;
    gl_PointSize = 10.0;
  }
`;

var FSHADER_SOURCE =`
  precision mediump float;
  varying vec4 v_FragColor;
  void main(){
    gl_FragColor = v_FragColor;
  }
`;

class vectorThree{
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  printVector(){
    console.log("X: " + this.x + " Y: " + this.y + " Z: " + this.z);
  }
}

class figure{
  constructor(vertices, indices, colors) {
    this.vertices = vertices;
    this.indices = indices;
    this.colors = colors;

    this.pos = new vectorThree(0, 0, 0);
    this.rot = new vectorThree(0, 0, 0);
    this.scale = new vectorThree(1, 1, 1);
  }
}

var posX = 0;
var posY = 0;
var posZ = 0;

var rotX = 0;
var rotY = 0;
var rotZ = 0;

var scaleX = 1;
var scaleY = 1;
var scaleZ = 1;

var currentFigure;
var figures = [];
var currentFigIndex;

function main(){
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  if(!gl){
    console.log('Failed to get the WebGL context');
    return;
  }

  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
    console.log('Failed to initalize shaders');
    return;
  }

  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //Set button functions
  document.getElementById("cube").onclick = function (){createCube(gl);};
  document.getElementById("plane").onclick = function () {createPlane(gl);};
  document.getElementById("pyramid").onclick = function () {createPyramid(gl);};

  //Set position sliders
  var sliderPosX = document.getElementById("posX");
  sliderPosX.oninput = function (){
    posX = -this.value/100;
    currentFigure.pos.x = posX;
    document.getElementById("posXLabel").innerHTML = "Pos X: " + posX;
    draw(gl)
    currentFigure.pos.printVector()
  }

  var sliderPosY = document.getElementById("posY");
  sliderPosY.oninput = function (){
    posY = this.value/100;
    currentFigure.pos.y = posY;
    document.getElementById("posYLabel").innerHTML = "Pos Y: " + posY;
    draw(gl)
  }

  var sliderPosZ = document.getElementById("posZ");
  sliderPosZ.oninput = function (){
    posZ = this.value/100;
    currentFigure.pos.z = posZ;
    document.getElementById("posZLabel").innerHTML = "Pos Z: " + posZ;
    draw(gl)
  }

  //Set rotation sliders
  var sliderRotX = document.getElementById("rotX");
  sliderRotX.oninput = function (){
    rotX = this.value;
    currentFigure.rot.x = rotX;
    document.getElementById("rotXLabel").innerHTML = "Rotation X: " + rotX;
    draw(gl)
  }

  var sliderRotY = document.getElementById("rotY");
  sliderRotY.oninput = function (){
    rotY = this.value;
    currentFigure.rot.y = rotY;
    document.getElementById("rotYLabel").innerHTML = "Rotation Y: " + rotY;
    draw(gl)
  }

  var sliderRotZ = document.getElementById("rotZ");
  sliderRotZ.oninput = function (){
    rotZ = this.value;
    currentFigure.rot.z = rotZ;
    document.getElementById("rotZLabel").innerHTML = "Rotation Z: " + rotZ;
    draw(gl)
  }

  //Set scale sliders
  var sliderScaleX = document.getElementById("scaleX");
  sliderScaleX.oninput = function (){
    scaleX = this.value/100;
    currentFigure.scale.x = scaleX;
    document.getElementById("scaleXLabel").innerHTML = "Scale X: " + scaleX;
    draw(gl)
  }

  var sliderScaleY = document.getElementById("scaleY");
  sliderScaleY.oninput = function (){
    scaleY = this.value/100;
    currentFigure.scale.y = scaleY;
    document.getElementById("scaleYLabel").innerHTML = "Scale Y: " + scaleY;
    draw(gl)
  }

  var sliderScaleZ = document.getElementById("scaleZ");
  sliderScaleZ.oninput = function (){
    scaleZ = this.value/100;
    currentFigure.scale.z = scaleZ;
    document.getElementById("scaleZLabel").innerHTML = "Scale Z: " + scaleZ;
    draw(gl)
  }

}

function createCube(gl){
  //Creating cubes with help from ChatGPT
  var cubeVertices = [
    - 0.1,  - 0.1,  + 0.1,
    + 0.1,  - 0.1,  + 0.1,
    + 0.1,  + 0.1,  + 0.1,
    - 0.1,  + 0.1,  + 0.1,
    - 0.1,  - 0.1,  - 0.1,
    + 0.1,  - 0.1,  - 0.1,
    + 0.1,  + 0.1,  - 0.1,
    - 0.1,  + 0.1,  - 0.1,
  ];

  var cubeIndices = [
    0, 1, 2,  0, 2, 3,
    4, 5, 6,  4, 6, 7,
    4, 5, 1,  4, 1, 0,
    7, 6, 2,  7, 2, 3,
    4, 7, 3,  4, 3, 0,
    1, 5, 6,  1, 6, 2
  ];

  var cubeColors = [
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
  ];

  var cube = new figure(cubeVertices, cubeIndices, cubeColors);
  currentFigure = cube;
  figures.push(cube);
  console.log(figures.length);

  draw(gl);
}

function createPlane(gl){
  var planeVertices = [
    - 0.1,  0,  + 0.1,
    + 0.1,  0,  + 0.1,
    + 0.1,  0,  - 0.1,
    - 0.1,  0,  - 0.1
  ];

  var planeIndices = [
      0, 1, 2,  0, 2, 3
  ];

  var planeColors = [
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random()
  ];

  var plane = new figure(planeVertices, planeIndices, planeColors);
  currentFigure = plane;
  figures.push(plane);
  console.log(figures.length);

  draw(gl);
}

function createPyramid(gl){
  var pyramidVertices = [
    - 0.1,  - 0.1,  + 0.1,
    + 0.1,  - 0.1,  + 0.1,
    + 0.1,  - 0.1,  - 0.1,
    - 0.1,  - 0.1,  - 0.1,
    0.0, + 0.1,  0.0
  ];

  var pyramidIndices = [
      0, 1, 2,  0, 2, 3,
      0, 1, 4,
      0, 3, 4,
      1, 2, 4,
      2, 3, 4

  ];

  var pyramidColors = [
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(),
  ];

  var pyramid = new figure(pyramidVertices, pyramidIndices, pyramidColors);
  currentFigure = pyramid;
  figures.push(pyramid);
  console.log(figures.length);

  draw(gl);
}

function initVertexBuffers(gl, vertices, colors, fig){
  var n = vertices.length;
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW); //Static= for when you want to draw something that you are not going to modify, dynamic= you can make occasional modifications, stream=constant modification
  
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0){
    console.log('Failed to get location of a_Position');
    return;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0,0);
  gl.enableVertexAttribArray(a_Position);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var modelMatrix = new Matrix4();

  var currentPos = fig.pos;
  modelMatrix.translate(currentPos.x, currentPos.y, currentPos.z);

  var currentRot = fig.rot;
  modelMatrix.rotate(currentRot.x, 1, 0, 0);
  modelMatrix.rotate(currentRot.y, 0, 1, 0);
  modelMatrix.rotate(currentRot.z, 0, 0, 1)

  var currentScale = fig.scale;
  modelMatrix.scale(currentScale.x, currentScale.y, currentScale.z)

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){ console.log('Failed to get location of u_ModelMatrix'); }
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.0, 0.2, -1,   0.0, 0.0, 0.0,   0.0, 1.0, 0.0);
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){ console.log('Failed to get location of u_ViewMatrix'); }
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  var projMatrix = new Matrix4();
  projMatrix.setPerspective(60.0, 1, 0.1, 5.0);
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if(!u_ProjMatrix){ console.log('Failed to get location of u_ProjMatrix'); }
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(!a_Color<0){
    console.log('Failed to get the location for a_Color');
    return;
  }

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Color);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);

  return n;
}

function draw(gl){

  /*
  initVertexBuffers(gl, new Float32Array(currentFigure.vertices), new Float32Array(currentFigure.colors), currentFigure);

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(currentFigure.indices), gl.STATIC_DRAW);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, currentFigure.indices.length, gl.UNSIGNED_SHORT, 0);
  */

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for(var i = 0; i < figures.length; i++){
    var fig = figures[i];
    initVertexBuffers(gl, new Float32Array(fig.vertices), new Float32Array(fig.colors), fig);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(fig.indices), gl.STATIC_DRAW);

    gl.drawElements(gl.TRIANGLES, fig.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}
