#version 300 es
precision mediump float;
uniform vec3 userColor;
in vec4 colorForFragment;
out vec4 color;
void main(){
  color=vec4(colorForFragment);
}
