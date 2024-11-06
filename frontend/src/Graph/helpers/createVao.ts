import { createBuffer } from './createBuffer';
interface BufferInfo {
  bufferArray: Float32Array;
  type: GLenum;
  location: GLuint;
  howToRead: GLint;
  normalized: GLboolean;
  startFrom: GLintptr;
}
function createVao(
  bufferInfoArray: BufferInfo[],
  gl: WebGL2RenderingContext
): WebGLVertexArrayObject | null {
  const vao = gl.createVertexArray();
  if (!vao) {
    console.error('Unable to create VAO');
    return null;
  }

  gl.bindVertexArray(vao);

  bufferInfoArray.forEach((bufferInfo) => {
    const bufferArray = bufferInfo.bufferArray;
    const gpuBuffer = createBuffer(bufferArray, bufferInfo.type, gl);
    if (!gpuBuffer) {
      console.error('Unable to create GPU buffer');
      return;
    }

    gl.enableVertexAttribArray(bufferInfo.location);
    gl.bindBuffer(bufferInfo.type, gpuBuffer);
    gl.vertexAttribPointer(
      bufferInfo.location,
      bufferInfo.howToRead,
      gl.FLOAT,
      bufferInfo.normalized,
      0,
      bufferInfo.startFrom
    );
  });

  return vao;
}

export default createVao;
