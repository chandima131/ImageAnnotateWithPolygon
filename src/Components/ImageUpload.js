import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Line, Circle, Group } from 'react-konva';
import useImage from 'use-image';
import HandleDeletePolygon from './HandleDeletePolygon';
import ImageList from './ImageList';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

// Import images from the assets folder
import testImage from '../assets/images/test.jpg';
import testImage2 from '../assets/images/test2.jpg';
import testImage3 from '../assets/images/test3.jpg';
import testImage4 from '../assets/images/test4.jpg';
import testImage5 from '../assets/images/test5.jpg';
import testImage6 from '../assets/images/test6.jpg';
import testImage7 from '../assets/images/test7.jpg';
import testImage8 from '../assets/images/test8.jpg';

const minMax = (arr) => [Math.min(...arr), Math.max(...arr)];

const dragBoundFunc = (width, height, radius, pos) => {
  let { x, y } = pos;
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > width - radius * 2) x = width - radius * 2;
  if (y > height - radius * 2) y = height - radius * 2;
  return { x, y };
};

const ImageUpload = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [points, setPoints] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const [loadedImage] = useImage(imageSrc);

  const vertexRadius = 6;
  const [minMaxX, setMinMaxX] = useState([0, 0]);
  const [minMaxY, setMinMaxY] = useState([0, 0]);

  // Use imported images in the array
  const images = [
    { src: testImage },
    { src: testImage2 },
    { src: testImage3 },
    { src: testImage4 },
    { src: testImage5 },
    { src: testImage6 },
    { src: testImage7 },
    { src: testImage8 },
  ];

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImageSrc(reader.result);
  //       setPoints([]);
  //       setIsFinished(false);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleSelectImage = (image) => {
    setImageSrc(image.src);
    setPoints([]);
    setIsFinished(false);
  };

  const handleMouseClick = (e) => {
    const stage = stageRef.current;
    const pointerPos = stage.getPointerPosition();
    const image = imageRef.current;

    if (image) {
      const imageScaleX = image.scaleX();
      const imageScaleY = image.scaleY();
      const imageX = image.x();
      const imageY = image.y();
      const x = (pointerPos.x - imageX) / imageScaleX;
      const y = (pointerPos.y - imageY) / imageScaleY;

      if (points.length > 0 && !isFinished) {
        const startPoint = points[0];
        const distance = Math.sqrt((x - startPoint.x) ** 2 + (y - startPoint.y) ** 2);
        if (distance < vertexRadius) {
          setIsFinished(true); // Close the polygon if clicked near the starting point
          return;
        }
      }

      if (isFinished) return;

      setPoints((prevPoints) => [...prevPoints, { x, y }]);
      if (points.length === 0) {
        setIsFinished(false);
      }
    }
  };

  const handlePointDragMove = (e) => {
    const newPoints = points.slice();
    newPoints[e.target.index] = e.target.position();
    setPoints(newPoints);
  };

  const handleGroupDragStart = () => {
    const arrX = points.map((p) => p.x);
    const arrY = points.map((p) => p.y);
    setMinMaxX(minMax(arrX));
    setMinMaxY(minMax(arrY));
  };

  const handleGroupDragEnd = (e) => {};

  const groupDragBound = (pos) => {
    let { x, y } = pos;
    const stage = stageRef.current;
    const sw = stage.width();
    const sh = stage.height();

    if (minMaxY[0] + y < 0) y = -minMaxY[0];
    if (minMaxX[0] + x < 0) x = -minMaxX[0];
    if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
    if (minMaxX[1] + x > sw) x = sw - minMaxX[1];

    return { x, y };
  };


  const saveImage = async () => {
    const stage = stageRef.current;

    try {
      // Capture the current stage as a canvas
      const canvas = await html2canvas(stage.container());

      // Convert canvas to a blob and save it as an image file
      canvas.toBlob((blob) => {
        saveAs(blob, 'annotated_image.png');
      });

      // Log the polygon's coordinates to the console
      console.log('Polygon Points:', points);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <ImageList images={images} onSelectImage={handleSelectImage} />
      <div style={{ flexGrow: 1 }}>

        <HandleDeletePolygon setPoints={setPoints}  setIsFinished={setIsFinished} />
        
        <button onClick={saveImage} style={{ margin: '10px' }}>
          Save Image with Polygon
        </button>
        
        <Stage
          width={window.innerWidth - 200} // Adjust width considering the sidebar
          height={window.innerHeight}
          ref={stageRef}
          onClick={handleMouseClick}
        >
          <Layer>
            {loadedImage && (
              <Image
                image={loadedImage}
                ref={imageRef}
                x={0}
                y={0}
                width={window.innerWidth - 200} // Adjust width considering the sidebar
                height={window.innerHeight}
              />
            )}
            <Group
              name="polygon"
              onDragStart={handleGroupDragStart}
              onDragEnd={handleGroupDragEnd}
              dragBoundFunc={groupDragBound}
            >
              <Line
                points={points.flatMap((p) => [p.x, p.y])}
                stroke="red"
                strokeWidth={2}
                closed={isFinished}
               // fill="rgba(0, 128, 0, 0.3)"
              />
              {points.map((point, index) => (
                <Circle
                  key={index}
                  x={point.x}
                  y={point.y}
                  radius={vertexRadius}
                  fill="white"
                  stroke="black"
                  strokeWidth={2}
                  draggable
                  onDragMove={handlePointDragMove}
                  dragBoundFunc={(pos) =>
                    dragBoundFunc(
                      stageRef.current.width(),
                      stageRef.current.height(),
                      vertexRadius,
                      pos
                    )
                  }
                />
              ))}
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default ImageUpload;
