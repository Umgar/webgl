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
const mat4 = glMatrix.mat4;

let triangleVert = [
    // X, Y, Z              RGB
    -0.7, 0.0, 0.0, 1.0, 1.0, 1.0, // Centralny wierzchołek

    -0.5, 0.5, 0.0, 1.0, 0.0, 0.0, // Punkt 1

    0.5, 0.5, 0.0, 1.0, 0.0, 0.0, // Punkt 2
    0.7, 0.0, 0.0, .3, 1.0, 0.4, // Punkt 3

    0.5, -0.5, 0.0, 0.0, 0.0, 1.0, // Punkt 4


    -0.5, -0.5, 0.0, 0.0, 1.0, 0.0 // Punkt 5

];

const Triangle = function() {
    const canvas = document.getElementById("main-canvas");
    // console.log(canvas);
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert('no webgl');
    }

    gl.clearColor(0.5, 0.5, 0.9, 1.0); // R,G,B, opacity
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
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





    const triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVert), gl.STATIC_DRAW);

    const posAttrLocation = gl.getAttribLocation(program, 'vertPosition');
    const colorAttrLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer(
        posAttrLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.vertexAttribPointer(
        colorAttrLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(posAttrLocation);
    gl.enableVertexAttribArray(colorAttrLocation);

    gl.useProgram(program);

    const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    let worldMatrix = mat4.create();
    let viewMatrix = mat4.create();
    let projMatrix = mat4.create();

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    gl.clear(gl.COLOR_BUFFER_BIT);
    const size = 6;
    gl.drawArrays(gl.TRIANGLE_FAN, 0, size);

    const colorBtn = document.getElementById("colorInput");
    document.getElementById("send").addEventListener("click", function() {
        let hex = colorBtn.value.substring(1);
        let red = parseInt(hex.substring(0, 2), 16) / 255;
        let blue = parseInt(hex.substring(2, 4), 16) / 255;
        let green = parseInt(hex.substring(4, 6), 16) / 255;
        let i = 3;
        while (i < triangleVert.length) {
            triangleVert[i] = red;
            triangleVert[i + 1] = blue;
            triangleVert[i + 2] = green;
            i += 6;
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVert), gl.STATIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, size);
        console.log(triangleVert);
    })
}