function textures_createRandom(colors) {
  for (let x=0; x<16; x++) {
    for (let y=0; y<16; y++) {
      textureContext.save();
      textureContext.fillStyle = '#' + utils_getRandomElement(colors);
      textureContext.fillRect(x, y, 1, 1);
      textureContext.restore();
    }
  }

  return textureCanvas.toDataURL();
}

function textures_createTile(colors) {
  textures_createRandom(colors);

  // tile outline
  textureContext.fillStyle = '#' + colors[0];
  textureContext.fillRect(0, 0, 16, 1);
  textureContext.fillRect(0, 0, 1, 15);

  textureContext.fillStyle = '#' + colors[colors.length-1];
  textureContext.fillRect(0, 15, 16, 1);
  textureContext.fillRect(15, 1, 1, 16);

  return textureCanvas.toDataURL();
}

function textures_createDoorKnob(colors) {
  textures_createRandom(colors);

  textureContext.fillStyle = '#' + colors[colors.length-1];
  textureContext.fillRect(5, 4, 6, 8);
  textureContext.fillRect(4, 5, 8, 6);
  
  return textureCanvas.toDataURL();
}

function textures_createBrick(colors) {
  let backgroundColors = colors.slice(0);
  backgroundColors.pop();
  backgroundColors.shift();
  textures_createRandom(backgroundColors);

  // lights
  textureContext.fillStyle = '#' + colors[0];
  textureContext.fillRect(0, 0, 16, 1);
  textureContext.fillRect(0, 8, 16, 1);
  textureContext.fillRect(1, 0, 1, 8);
  textureContext.fillRect(8, 7, 1, 8);

  // darks
  textureContext.fillStyle = '#' + colors[colors.length-1];
  textureContext.fillRect(0, 7, 16, 1);
  textureContext.fillRect(0, 15, 16, 1);
  textureContext.fillRect(0, 0, 1, 7);
  textureContext.fillRect(7, 7, 1, 8);

  return textureCanvas.toDataURL();
}

function textures_createHealth(colors) {
  let backgroundColors = colors.slice(0);
  backgroundColors.shift();
  textures_createRandom(backgroundColors);
  textureContext.fillStyle = '#' + colors[0];
  textureContext.fillRect(0, 0, 16, 1);

  return textureCanvas.toDataURL();
}

function textures_init(callback) {
  textures = [
    // 0 - dirt
    {
      encoding: textures_createRandom([
        '3d3527', 
        '4a493b', 
        '534e3e', 
        '524534', 
        '46433b', 
        '443e2b', 
        '271c10'
      ])
    },
    // 1 - mossy stone
    {
      encoding: textures_createTile([
        '464339',
        '282e26',
        '303e1a',
        '444b31',
        '393c2c',
        '33352f',
        '333435',
        '2c2e23',
        '3d3f36',
        '3d3a30',
        '514938',
        '6a6554',
        '2c2e20'
      ])
    },
    // 2 - mossy brick
    {
      encoding: textures_createBrick([
        '6a6554',
        '464339',
        '282e26',
        '303e1a',
        '444b31',
        '393c2c',
        '33352f',
        '333435',
        '2c2e23',
        '3d3f36',
        '3d3a30',
        '514938',
        '2c2e20'
      ])
    }, 
    // 3 - burned stone
    {
      encoding: textures_createRandom([
        '434343', 
        '2f2f2f', 
        '232323', 
        '131313', 
        '272727', 
        '1b1b1b', 
        '0b0b0b'
      ])
    },
    // 4 - blood stone
    {
      encoding: textures_createRandom([
        'f6a675', 
        '170503', 
        'a41800', 
        'ac300e', 
        'dbbaa7', 
        '7d1e18', 
        '621a0e'
      ])
    },
    // 5 - stone
    {
      encoding: textures_createTile([
        '6c6a69',
        '6a5a4b',
        '665f5f',
        '3b3534',
        '645444',
        '292322'  
      ])
    },
    // 6 - rotting wood
    {
      encoding: textures_createTile([
        '4f4131',
        '2c2822',
        '353636',
        '4a443a',
        '2d2d2c',
        '4a3c26',
        '31271f',
        '120c09'  
      ])
    },
    // 7 - dirty white
    {
      encoding: textures_createRandom([
        'c3c3c3',
        'bbbbbb',
        'bfbfbf',
        'c0c0c0',
        'b1b1b1'
      ])
    },
    // 8 - dirty gray
    {
      encoding: textures_createRandom([
        '6c6a69',
        '6a5a4b',
        '665f5f',
        '3b3534',
        '645444',
        '292322'  
      ])
    },
    // 9 - door knob
    {
      encoding: textures_createDoorKnob([
        '6c6a69',
        '6a5a4b',
        '665f5f',
        '3b3534',
        '645444',
        '292322'  
      ])
    },
    // 10 - health
    {
      encoding: textures_createHealth([
        'c0c0c0', 
        'c41c21', 
        '941618', 
        'a81a1a', 
        '7f1414'
      ])
    }
  ];

  let loadedImages = 0;
  let numImages = 0;
  textures.forEach(function(texture) {
    (function() {
      numImages++;
      let glTexture = texture.glTexture = sceneContext.createTexture();
      let image = texture.image = new Image();
      image.onload = function() {
        scene_initTexture(glTexture, image);
        if (++loadedImages >= numImages) {
          callback();
        }
      };
      
      image.src = texture.encoding;
    })();
  });
};

