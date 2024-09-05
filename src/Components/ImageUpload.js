import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Line, Circle, Group } from 'react-konva';
import useImage from 'use-image';
import HandleDeletePolygon from './HandleDeletePolygon';
import ImageList from './ImageList';
import { saveAs } from 'file-saver';
import testImage from '../assets/images/test.jpg';
import testImage2 from '../assets/images/test2.jpg';
import testImage3 from '../assets/images/test3.jpg';
import testImage4 from '../assets/images/test4.jpg';
import testImage5 from '../assets/images/test5.jpg';
import testImage6 from '../assets/images/test6.jpg';
import testImage7 from '../assets/images/test7.jpg';
import testImage8 from '../assets/images/test8.jpg';

const minMax = (arr) => [Math.min(...arr), Math.max(...arr)];

const ImageUpload = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [polygons, setPolygons] = useState([[], []]); // Array to store up to two polygons
  const [currentPolygonIndex, setCurrentPolygonIndex] = useState(0); // Index of the current polygon being drawn
  const [isFinished, setIsFinished] = useState([false, false]); // Track the completion status of each polygon
  const [polygonHistory, setPolygonHistory] = useState([]); // History for undo
  const [redoStack, setRedoStack] = useState([]); // Stack for redo
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const [loadedImage] = useImage(imageSrc);
  const [scale, setScale] = useState(1); // Maintain the current zoom level (1 = default, no zoom)
  const [minMaxX, setMinMaxX] = useState([0, 0]);
  const [minMaxY, setMinMaxY] = useState([0, 0]);
  const [dragging, setDragging] = useState(false);
  const vertexRadius = 6;

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

  const handleSelectImage = (image) => {
    setImageSrc(image.src);
    setPolygons([[], []]);
    setCurrentPolygonIndex(0);
    setIsFinished([false, false]);
    setPolygonHistory([]);
    setRedoStack([]);
    setScale(1);
  };

  const handleMouseClick = (e) => {
    if (currentPolygonIndex >= 2) return; // Restrict to a maximum of two polygons
    const stage = stageRef.current;
    const pointerPos = stage.getPointerPosition();
    const image = imageRef.current;

    if (image) {
      const scaleX = stage.scaleX();
      const scaleY = stage.scaleY();
      const imageX = image.x();
      const imageY = image.y();
      const x = (pointerPos.x - imageX) / scaleX;
      const y = (pointerPos.y - imageY) / scaleY;

      const newPolygon = [...polygons[currentPolygonIndex]];

      if (newPolygon.length > 0 && !isFinished[currentPolygonIndex]) {
        const startPoint = newPolygon[0];
        const distance = Math.sqrt((x - startPoint.x) ** 2 + (y - startPoint.y) ** 2);
        if (distance < vertexRadius) {
          const newIsFinished = [...isFinished];
          newIsFinished[currentPolygonIndex] = true;
          setIsFinished(newIsFinished);
          const newPolygons = [...polygons];
          newPolygons[currentPolygonIndex] = newPolygon;
          setPolygons(newPolygons);
          setCurrentPolygonIndex(1);
          return;
        }
      }
      if (isFinished[currentPolygonIndex]) return;

      newPolygon.push({ x, y });
      setPolygonHistory([...polygonHistory, polygons]); // Save to history for undo
      setRedoStack([]);
      setPolygons((prevPolygons) => {
        const newPolygons = [...prevPolygons];
        newPolygons[currentPolygonIndex] = newPolygon;
        return newPolygons;
      });
    }
  };

  const handlePointDragMove = (e, polygonIndex) => {
    const newPolygons = polygons.slice();
    newPolygons[polygonIndex][e.target.index] = e.target.position();
    setPolygons(newPolygons);
  };

  const handleGroupDragStart = (polygon) => {
    const arrX = polygon.map((p) => p.x);
    const arrY = polygon.map((p) => p.y);
    setMinMaxX(minMax(arrX));
    setMinMaxY(minMax(arrY));
  };

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
      const dataURL = stage.toDataURL();
      saveAs(dataURL, 'polygon-image.png'); // Save as image
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const handleZoomIn = () => setScale((prevScale) => prevScale * 1.2);
  const handleZoomOut = () => setScale((prevScale) => prevScale / 1.2);

  const handleUndo = () => {
    if (polygonHistory.length === 0) return;
    setRedoStack([...redoStack, polygons]);
    setPolygons(polygonHistory.pop());
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    setPolygonHistory([...polygonHistory, polygons]);
    setPolygons(redoStack.pop());
  };

  const exportToJson = () => {
    const json = JSON.stringify(polygons);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'polygons.json');
  };

  const deletePolygon = (index) => {
    const newPolygons = [...polygons];
    newPolygons.splice(index, 1);
    setPolygons(newPolygons);
  };

  return (
    <div style={{ display: 'flex' }}>
      <ImageList images={images} onSelectImage={handleSelectImage} />
      <div style={{ flexGrow: 1 }}>
        <HandleDeletePolygon setPolygons={setPolygons} setIsFinished={setIsFinished} />
        <button onClick={saveImage} style={{ margin: '10px' }}>Save Image with Polygons</button>
        <button onClick={exportToJson} style={{ margin: '10px' }}>Export JSON</button>
        <button onClick={handleUndo} style={{ margin: '10px' }}>Undo</button>
        <button onClick={handleRedo} style={{ margin: '10px' }}>Redo</button>
        <button onClick={handleZoomIn} style={{ margin: '10px' }}> + </button>
        <button onClick={handleZoomOut} style={{ margin: '10px' }}> - </button>
        {polygons.map((polygon, index) => (
          <button key={index} onClick={() => deletePolygon(index)}>Delete Polygon {index + 1}</button>
        ))}

        <Stage
          width={window.innerWidth - 200}
          height={window.innerHeight}
          ref={stageRef}
          scaleX={scale}
          scaleY={scale}
          onClick={handleMouseClick}
        >
          <Layer>
            {loadedImage && (
              <Image
                image={loadedImage}
                ref={imageRef}
                x={0}
                y={0}
                width={window.innerWidth - 200}
                height={window.innerHeight}
              />
            )}
            {polygons.map((polygon, polygonIndex) => (
              <Group
                key={polygonIndex}
                name="polygon"
                onDragStart={() => handleGroupDragStart(polygon)}
                dragBoundFunc={groupDragBound}
                draggable
              >
                <Line
                  points={polygon.flatMap((p) => [p.x, p.y])}
                  stroke={polygonIndex === 0 ? 'red' : 'blue'}
                  strokeWidth={2}
                  closed={isFinished[polygonIndex]}
                />
                {polygon.map((point, index) => (
                  <Circle
                    key={index}
                    x={point.x}
                    y={point.y}
                    radius={vertexRadius}
                    fill="white"
                    stroke="black"
                    strokeWidth={2}
                    draggable
                    onDragMove={(e) => handlePointDragMove(e, polygonIndex)}
                    onMouseOver={(e) => {
                      e.target.stroke('yellow');
                      e.target.getLayer().batchDraw();
                    }}
                    onMouseOut={(e) => {
                      e.target.stroke('black');
                      e.target.getLayer().batchDraw();
                    }}
                  />
                ))}
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default ImageUpload;
