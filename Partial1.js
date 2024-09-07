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
}

class figure{
  constructor(vertices, indices, colors, figType) {
    this.vertices = vertices;
    this.indices = indices;
    this.colors = colors;
    this.figType = figType;

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

var colorPicker;

var sliderPosX;
var fieldPosX;
var sliderPosY;
var fieldPosY;
var sliderPosZ;
var fieldPosZ;

var sliderRotX;
var fieldRotX;
var sliderRotY;
var fieldRotY;
var sliderRotZ;
var fieldRotZ;

var sliderScaleX;
var fieldScaleX;
var sliderScaleY;
var fieldScaleY;
var sliderScaleZ;
var fieldScaleZ;

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

  //Get document elements
  colorPicker = document.getElementById("colorPicker");

  //Set color picker function so that the current figure changes color with it
  colorPicker.oninput = function () {
    changeCurrentFigColor(gl);
  }

  //Set button functions
  document.getElementById("cube").onclick = function (){createCube(gl);};
  document.getElementById("plane").onclick = function () {createPlane(gl);};
  document.getElementById("pyramid").onclick = function () {createPyramid(gl);};
  document.getElementById("deleteBtn").onclick = function () {deleteFig(gl);};

  //Set position sliders
  sliderPosX = document.getElementById("posX");
  fieldPosX = document.getElementById("posXLabel");
  sliderPosX.oninput = function (){
    if(!currentFigure)
      return;
    posX = -this.value/100;
    currentFigure.pos.x = posX;
    fieldPosX.value = -posX;
    draw(gl)
  }
  fieldPosX.oninput = function (){
    if(!currentFigure)
      return;
    posX = -this.value;
    currentFigure.pos.x = posX;
    sliderPosX.value = -posX*100;
    draw(gl);
  }

  sliderPosY = document.getElementById("posY");
  fieldPosY = document.getElementById("posYLabel");
  sliderPosY.oninput = function (){
    if(!currentFigure)
      return;
    posY = this.value/100;
    currentFigure.pos.y = posY;
    fieldPosY.value = posY;
    draw(gl)
  }
  fieldPosY.oninput = function (){
    if(!currentFigure)
      return;
    posY = this.value;
    currentFigure.pos.y = posY;
    sliderPosY.value = posY*100;
    draw(gl);
  }

  sliderPosZ = document.getElementById("posZ");
  fieldPosZ = document.getElementById("posZLabel");
  sliderPosZ.oninput = function (){
    if(!currentFigure)
      return;
    posZ = this.value/100;
    currentFigure.pos.z = posZ;
    fieldPosZ.value = posZ;
    draw(gl)
  }
  fieldPosZ.oninput = function (){
    if(!currentFigure)
      return;
    posZ = this.value;
    currentFigure.pos.z = posZ;
    sliderPosY.value = posZ*100;
    draw(gl);
  }

  //Set rotation sliders
  sliderRotX = document.getElementById("rotX");
  fieldRotX = document.getElementById("rotXLabel");
  sliderRotX.oninput = function (){
    if(!currentFigure)
      return;
    rotX = this.value;
    currentFigure.rot.x = rotX;
    fieldRotX.value = rotX;
    draw(gl)
  }
  fieldRotX.oninput = function (){
    if(!currentFigure)
      return;
    rotX = this.value;
    currentFigure.rot.x = rotX;
    sliderRotX.value = rotX;
    draw(gl)
  }

  sliderRotY = document.getElementById("rotY");
  fieldRotY = document.getElementById("rotYLabel");
  sliderRotY.oninput = function (){
    if(!currentFigure)
      return;
    rotY = this.value;
    currentFigure.rot.y = rotY;
    fieldRotY.value = rotY;
    draw(gl)
  }
  fieldRotY.oninput = function (){
    if(!currentFigure)
      return;
    rotY = this.value;
    currentFigure.rot.y = rotY;
    sliderRotY.value = rotY;
    draw(gl)
  }

  sliderRotZ = document.getElementById("rotZ");
  fieldRotZ = document.getElementById("rotZLabel");
  sliderRotZ.oninput = function (){
    if(!currentFigure)
      return;
    rotZ = this.value;
    currentFigure.rot.z = rotZ;
    fieldRotZ.value = rotZ;
    draw(gl)
  }
  fieldRotZ.oninput = function (){
    if(!currentFigure)
      return;
    rotZ = this.value;
    currentFigure.rot.z = rotZ;
    sliderRotZ.value = rotZ;
    draw(gl)
  }

  //Set scale sliders
  sliderScaleX = document.getElementById("scaleX");
  fieldScaleX = document.getElementById("scaleXLabel");
  sliderScaleX.oninput = function (){
    if(!currentFigure)
      return;
    scaleX = this.value/100;
    currentFigure.scale.x = scaleX;
    fieldScaleX.value = scaleX;
    draw(gl)
  }
  fieldScaleX.oninput = function (){
    if(!currentFigure)
      return;
    scaleX = this.value;
    currentFigure.scale.x = scaleX;
    sliderScaleX.value = scaleX*100;
    draw(gl)
  }

  sliderScaleY = document.getElementById("scaleY");
  fieldScaleY = document.getElementById("scaleYLabel");
  sliderScaleY.oninput = function (){
    if(!currentFigure)
      return;
    scaleY = this.value/100;
    currentFigure.scale.y = scaleY;
    fieldScaleY.value =scaleY;
    draw(gl)
  }
  fieldScaleY.oninput = function (){
    if(!currentFigure)
      return;
    scaleY = this.value;
    currentFigure.scale.y = scaleY;
    sliderScaleY.value = scaleY*100;
    draw(gl)
  }

  sliderScaleZ = document.getElementById("scaleZ");
  fieldScaleZ = document.getElementById("scaleZLabel");
  sliderScaleZ.oninput = function (){
    if(!currentFigure)
      return;
    scaleZ = this.value/100;
    currentFigure.scale.z = scaleZ;
    fieldScaleZ.value = scaleZ;
    draw(gl)
  }
  fieldScaleZ.oninput = function (){
    if(!currentFigure)
      return;
    scaleZ = this.value;
    currentFigure.scale.z = scaleZ;
    sliderScaleZ.value = scaleZ*100;
    draw(gl)
  }
  resetParams();
}

function resetParams(){

  //Reset Position Sliders
  sliderPosX.value = 0;
  fieldPosX.value = 0;
  sliderPosY.value = 0;
  fieldPosY.value = 0;
  sliderPosZ.value = 0;
  fieldPosZ.value = 0;

  //Reset Rotation Sliders
  sliderRotX.value = 0;
  fieldRotX.value = 0;
  sliderRotY.value = 0;
  fieldRotY.value = 0;
  sliderRotZ.value = 0;
  fieldRotZ.value = 0;

  //Reset Scale Sliders
  sliderScaleX.value = 100;
  fieldScaleX.value = 1;
  sliderScaleY.value = 100;
  fieldScaleY.value = 1;
  sliderScaleZ.value = 100;
  fieldScaleZ.value = 1;
}

function setParams(){
  var fig = currentFigure;

  const pos = fig.pos;
  //Reset Position Sliders
  sliderPosX.value = pos.x;
  fieldPosX.value = pos.x;
  sliderPosY.value = pos.y;
  fieldPosY.value = pos.y;
  sliderPosZ.value = pos.z;
  fieldPosZ.value = pos.z;

  const rot = fig.rot;
  //Reset Rotation Sliders
  sliderRotX.value = rot.x;
  fieldRotX.value = rot.x;
  sliderRotY.value = rot.y;
  fieldRotY.value = rot.y;
  sliderRotZ.value = rot.z;
  fieldRotZ.value = rot.z;

  const scale = fig.scale;
  //Reset Scale Sliders
  sliderScaleX.value = scale.x * 100;
  fieldScaleX.value = scale.x;
  sliderScaleY.value = scale.y * 100;
  fieldScaleY.value = scale.y;
  sliderScaleZ.value = scale.z * 100;
  fieldScaleZ.value = scale.z;
}

function changeCurrentFigColor(gl){
  if(currentFigure){
    const hexColor = colorPicker.value;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    const figColor = new vectorThree(parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),);
    for(var i = 0; i < currentFigure.colors.length; i += 3){
      currentFigure.colors[i] = figColor.x / (255 + Math.floor(Math.random() * 100));
      currentFigure.colors[i + 1] = figColor.y / (255 + Math.floor(Math.random() * 100));
      currentFigure.colors[i + 2] = figColor.z / (255 + Math.floor(Math.random() * 100));
    }
    draw(gl);
  }
}

function addFig(fig){
  figures.push(fig);
  currentFigIndex = figures.length - 1;
  selectFig(currentFigIndex);
}

function selectFig(index){
  currentFigIndex = index;
  currentFigure = figures[currentFigIndex];
}

function generateFigBtns(){
  const container = document.getElementById("figContainer");
  container.textContent = "";
}

function deleteFig(gl){
  figures.splice(currentFigIndex, 1);
  generateFigBtns();
  draw(gl);
  if(figures.length > 0){
    selectFig(figures.length - 1);
    for(var i = 0; i < figures.length; i++){
      createFigBtn(i, figures[i].figType);
    }
  }
}

function createFigBtn(index, name){
  const figBtn = document.createElement("button");
  figBtn.type = "button"
  figBtn.innerHTML = index + ": " + name;
  figBtn.style = "width: 100%;";
  figBtn.onclick = function () {
    selectFig(index);
    setParams();
  }
  const container = document.getElementById("figContainer");
  container.appendChild(figBtn);
}

function createCube(gl){
  resetParams();

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

  const cube = new figure(cubeVertices, cubeIndices, cubeColors, "Cube");
  addFig(cube);
  createFigBtn(figures.length - 1, cube.figType);
  changeCurrentFigColor(gl);
}

function createPlane(gl){
  resetParams();
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

  var plane = new figure(planeVertices, planeIndices, planeColors, "Plane");
  addFig(plane);
  createFigBtn(figures.length - 1, plane.figType);
  changeCurrentFigColor(gl);
}

function createPyramid(gl){
  resetParams();
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

  var pyramid = new figure(pyramidVertices, pyramidIndices, pyramidColors, "Pyramid");
  addFig(pyramid);
  createFigBtn(figures.length - 1, pyramid.figType);
  changeCurrentFigColor(gl);
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
