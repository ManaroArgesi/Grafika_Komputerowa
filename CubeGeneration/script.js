const vertexShaderTxt = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main()
    {
        fragColor = vertColor;
        gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }
`

const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`
//const mat4 = glMatrix.mat4;
const parseRGBColor = (colorString) => {
    return colorString.split(",").map(parseFloat);
};

//const Triangle = function () {
const createTriangle = (event) => {
    event.preventDefault();

    const canvas = document.getElementById("main-canvas");
    // console.log(canvas);
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert('no webgl');
        return;
    }

    gl.clearColor(0.5, 0.4, 0.7, 1.0);   // R,G,B, opacity
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertexShader));
    }
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.detachShader(program, vertexShader); //https://www.khronos.org/opengl/wiki/Shader_Compilation#Before_linking
    gl.detachShader(program, fragmentShader);
 
    gl.validateProgram(program);

    const sideLength = parseFloat(document.getElementById("side-length").value);

    var topColor = document.getElementById("color-top").value;
    var leftColor = document.getElementById("color-left").value;
    var rightColor = document.getElementById("color-right").value;
    var frontColor = document.getElementById("color-front").value;
    var backColor = document.getElementById("color-back").value;
    var bottomColor = document.getElementById("color-bottom").value;

    var convertToFloat = function(color) {
        return color.split(",").map(function(value) {
          var intValue = parseInt(value.trim(), 10);
          return intValue / 255; // we convert the value to a range from 0 to 1
        });
      };
  
      // We create an object with color data
      var colors = {
        top: convertToFloat(topColor),
        left: convertToFloat(leftColor),
        right: convertToFloat(rightColor),
        front: convertToFloat(frontColor),
        back: convertToFloat(backColor),
        bottom: convertToFloat(bottomColor)
      };

      const boxVertices = [
        // Top
        -sideLength, sideLength, -sideLength, colors.top, colors.top, colors.top,
        -sideLength, sideLength, sideLength, colors.top, colors.top, colors.top,
        sideLength, sideLength, sideLength, colors.top, colors.top, colors.top,
        sideLength, sideLength, -sideLength, colors.top, colors.top, colors.top,
        // Left
        -sideLength, sideLength, sideLength, colors.left, colors.left, colors.left,
        -sideLength, -sideLength, sideLength, colors.left, colors.left, colors.left,
        -sideLength, -sideLength, -sideLength, colors.left, colors.left, colors.left,
        -sideLength, sideLength, -sideLength, colors.left, colors.left, colors.left,
        // Right
        sideLength, sideLength, sideLength, colors.right, colors.right, colors.right,
        sideLength, -sideLength, sideLength, colors.right, colors.right, colors.right,
        sideLength, -sideLength, -sideLength, colors.right, colors.right, colors.right,
        sideLength, sideLength, -sideLength, colors.right, colors.right, colors.right,
        // Front
        sideLength, sideLength, sideLength, colors.front, colors.front, colors.front,
        sideLength, -sideLength, sideLength, colors.front, colors.front, colors.front,
        -sideLength, -sideLength, sideLength, colors.front, colors.front, colors.front,
        -sideLength, sideLength, sideLength, colors.front, colors.front, colors.front,
        // Back
        sideLength, sideLength, -sideLength, colors.back, colors.back, colors.back,
        sideLength, -sideLength, -sideLength, colors.back, colors.back, colors.back,
        -sideLength, -sideLength, -sideLength, colors.back, colors.back, colors.back,
        -sideLength, sideLength, -sideLength, colors.back, colors.back, colors.back,
        // Bottom
        -sideLength, -sideLength, -sideLength, colors.bottom, colors.bottom, colors.bottom,
        -sideLength, -sideLength, sideLength, colors.bottom, colors.bottom, colors.bottom,
        sideLength, -sideLength, sideLength, colors.bottom, colors.bottom, colors.bottom,
        sideLength, -sideLength, -sideLength, colors.bottom, colors.bottom, colors.bottom,
        ];


	const boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

    

    const boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW); // since everything in JS is 64 bit floating point we need to convert to 32 bits

    const boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW); 

    const posAttrLocation = gl.getAttribLocation(program, 'vertPosition');
    const colorAttrLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        posAttrLocation,
        3, // number of elements per attribute
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0,
    );

    gl.vertexAttribPointer(
        colorAttrLocation,    // attribute location
        3,// number of elements per attribute
        gl.FLOAT,// type of elements
        gl.FALSE,// if data is normalized
        6 * Float32Array.BYTES_PER_ELEMENT,// Size of individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT,// offset from the beginnning  of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(posAttrLocation);
    gl.enableVertexAttribArray(colorAttrLocation);

    gl.useProgram(program);

    const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    const worldMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const projMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0,0,-8], [0,0,0], [0,1,0]);
    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    const identityMatrix = mat4.create(); 
    let angle = 0;
    const loop = function () {
        angle = performance.now() / 1000 / 8 * 2 * Math.PI;

        mat4.rotate(worldMatrix, identityMatrix, angle, [2,1,0]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

} 
const generateCubeButton = document.getElementById("generate-button");
generateCubeButton.addEventListener("click", createTriangle);