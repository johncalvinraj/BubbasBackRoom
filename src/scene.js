function scene_init() {
  sceneCanvas = document.getElementById('sceneCanvas');
  sceneContext = sceneCanvas.getContext('webgl');
  
  webgl_setSize(sceneCanvas);

  shaderProgram = sceneContext.createProgram();
  webgl_setShaderProgram(shaderProgram, sceneContext, fragmentShader, vertexShader);
  
  scene_initUniforms();

  // init depth test
  sceneContext.enable(sceneContext.DEPTH_TEST);
};

function scene_initUniforms() {
  webgl_setAttribLocation(shaderProgram, sceneContext, 'aVertexPosition');
  webgl_setAttribLocation(shaderProgram, sceneContext, 'aVertexNormal');
  webgl_setAttribLocation(shaderProgram, sceneContext, 'aTextureCoord');

  webgl_setUniformLocation(shaderProgram, sceneContext, 'uPMatrix');
  webgl_setUniformLocation(shaderProgram, sceneContext, 'uMVMatrix');
  webgl_setUniformLocation(shaderProgram, sceneContext, 'uSampler');
  webgl_setUniformLocation(shaderProgram, sceneContext, 'uNMatrix');
  webgl_setUniformLocation(shaderProgram, sceneContext, 'isFlashing');
};

function scene_setUniforms() {
  sceneContext.uniform1i(shaderProgram.uSampler, 0);
  sceneContext.uniformMatrix4fv(shaderProgram.uPMatrix, false, pMatrix);
  sceneContext.uniformMatrix4fv(shaderProgram.uMVMatrix, false, mvMatrix);
  
  let normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  sceneContext.uniformMatrix3fv(shaderProgram.uNMatrix, false, normalMatrix);

  sceneContext.uniform1i(shaderProgram.isFlashing, flashTimeRemaining > 0);
};

function scene_render(buffers, texture) {
  // position buffers
  sceneContext.bindBuffer(sceneContext.ARRAY_BUFFER, buffers.position);
  sceneContext.vertexAttribPointer(shaderProgram.aVertexPosition, 3, sceneContext.FLOAT, false, 0, 0);

  // texture buffers
  sceneContext.bindBuffer(sceneContext.ARRAY_BUFFER, buffers.texture);
  sceneContext.vertexAttribPointer(shaderProgram.aTextureCoord, 2, sceneContext.FLOAT, false, 0, 0);
  sceneContext.activeTexture(sceneContext.TEXTURE0);
  sceneContext.bindTexture(sceneContext.TEXTURE_2D, texture);

  // index buffers
  sceneContext.bindBuffer(sceneContext.ELEMENT_ARRAY_BUFFER, buffers.index);

  // normal buffers
  sceneContext.bindBuffer(sceneContext.ARRAY_BUFFER, buffers.normal);
  sceneContext.vertexAttribPointer(shaderProgram.aVertexNormal, 3, sceneContext.FLOAT, false, 0, 0);

  // set uniforms
  scene_setUniforms();

  // draw elements
  sceneContext.drawElements(sceneContext.TRIANGLES, buffers.index.numElements, sceneContext.UNSIGNED_SHORT, 0);
};

function scene_initTexture(glTexture, image) {
  sceneContext.pixelStorei(sceneContext.UNPACK_FLIP_Y_WEBGL, true);
  sceneContext.bindTexture(sceneContext.TEXTURE_2D, glTexture);
  sceneContext.texImage2D(sceneContext.TEXTURE_2D, 0, sceneContext.RGBA, sceneContext.RGBA, sceneContext.UNSIGNED_BYTE, image);
  sceneContext.texParameteri(sceneContext.TEXTURE_2D, sceneContext.TEXTURE_MAG_FILTER, sceneContext.NEAREST);
  sceneContext.texParameteri(sceneContext.TEXTURE_2D, sceneContext.TEXTURE_MIN_FILTER, sceneContext.LINEAR_MIPMAP_NEAREST);
  sceneContext.generateMipmap(sceneContext.TEXTURE_2D);
  sceneContext.bindTexture(sceneContext.TEXTURE_2D, null);
};

