import Canvas from './canvas';

export function createScene() {
let frag;
fetch(require("../../frag/raymarching.frag"))
  .then(t => t.text())
  .then(t => {frag = t; onLoaded()})

  // Handle the load completed
  function onLoaded(loader, res) {
    const canvas = new Canvas();

    canvas.createShader(
      `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
      `
      , frag);

    canvas.draw();
  }
}
