#version 300 es
precision mediump float;
out vec4 color;
uniform vec3 userColor;
void main(){
  color=vec4(userColor,1.0);
}