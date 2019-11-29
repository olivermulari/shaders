export default class Canvas {
  constructor() {
    this.canvas;
    this.gl;
    this.createCanvas();

    //program
    this.program;
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);
    // gl settings
    this.setupGL();
    // styles
    this.addStyles();
  }

  setupGL() {
    this.gl = this.canvas.getContext('webgl');
  }

  createShader(vertContent, fragContent) {
    const gl = this.gl;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertContent);
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragContent);

    // compile and check
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
      return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(fragmentShader));
      return;
    }
    
    // create program and attach shaders
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link program
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    }

    this.backgroundBuffer(gl);

    // look up where the vertex data needs to go.
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(positionLocation);

    this.program = program;
  }

  standardUniforms() {
    this.program
  }

  // adds a single uniform
  addUniform() {
    const gl = this.gl;
  }

  backgroundBuffer(gl) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER, 
      new Float32Array([
        -1.0, -1.0, 
        1.0, -1.0, 
        -1.0,  1.0, 
        -1.0,  1.0, 
        1.0, -1.0, 
        1.0,  1.0]), 
      gl.STATIC_DRAW
    );
    return buffer;
  }

  addStyles() {
    this.canvas.style.margin = 0;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
  }

  draw() {
    const gl = this.gl;
    const program = this.program;

    let previousTime = 0.0;
    let resolution = [window.innerWidth, window.innerHeight];

    const inner = () => {
      // resize
      //this.resize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

      // clear
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // uniform locations
      const uTime = gl.getUniformLocation(program, "u_time");
      const uResolution = gl.getUniformLocation(program, "u_resolution");

      gl.uniform1f(uTime, previousTime / 1000);
      gl.uniform2fv(uResolution, resolution);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      window.requestAnimationFrame((currentTime) => {
        previousTime = currentTime;
        resolution = [window.innerWidth, window.innerHeight];
        inner();
      });
    }

    // starts looping
    inner();
  }

  resize(canvas) {
    var realToCSSPixels = window.devicePixelRatio;
  
    // Lookup the size the browser is displaying the canvas in CSS pixels
    // and compute a size needed to make our drawingbuffer match it in
    // device pixels.
    var displayWidth  = Math.floor(canvas.clientWidth  * realToCSSPixels);
    var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);
  
    // Check if the canvas is not the same size.
    if (canvas.width  !== displayWidth ||
        canvas.height !== displayHeight) {
  
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
  }
}