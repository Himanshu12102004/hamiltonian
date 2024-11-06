#version 300 es
precision mediump float;
in vec2 vertex; 
in vec4 color;
out vec4 colorForFragment;
void main() {
    gl_Position = vec4(vertex, 0.0, 1.0);
    colorForFragment=color;
}
