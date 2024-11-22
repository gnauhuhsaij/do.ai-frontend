import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const InfiniteCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize PixiJS application
    const app = new PIXI.Application();
    (async () => {
        await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0xffffff,
        antialias: true,
        });
    })()

    // Append the PixiJS canvas to the DOM
    const canvasContainer = canvasRef.current;
    if (canvasContainer) {
      canvasContainer.append(app.canvas);
    }

    // Texts and Colors for the 9 Blocks
    const texts = [
      "Infinite", "Canvases", "Are",
      "Easy", "When", "You",
      "Know", "The", "Fundamentals",
    ];
    const colors = [0xff6b6b, 0x6bffb5, 0x6bc6ff, 0xffb66b, 0x9d6bff, 0xfff56b, 0x6bffec, 0xc76bff, 0x6bfff0];
    const blockSize = 200;

    // Create 9 blocks with text annotations
    texts.forEach((text, index) => {
      const block = new PIXI.Container();
      const background = new PIXI.Graphics();
      const textElement = new PIXI.Text({text: text, 
        style: {
        fontSize: 24,
        fill: 0x000000,
        align: 'center',
      }});

      // Calculate position based on index (3x3 grid)
      const x = (index % 3) * blockSize;
      const y = Math.floor(index / 3) * blockSize;

      // Draw the block background
      background.rect(x, y, blockSize, blockSize);
      background.fill(colors[index]);

      // Center the text inside the block
      textElement.anchor.set(0.5);
      textElement.position.set(x + blockSize / 2, y + blockSize / 2);

      // Add background and text to the block, and the block to the stage
      block.addChild(background);
      block.addChild(textElement);
      app.stage.addChild(block);
    });

    // Clean up PixiJS application on component unmount
    return () => {
      app.destroy(true);
    };
  }, []);

  return <div ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default InfiniteCanvas;
