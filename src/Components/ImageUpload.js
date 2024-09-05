import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Line, Circle, Group, Text } from 'react-konva';
import useImage from 'use-image';
import { saveAs } from 'file-saver';
import ImageList from './ImageList';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome icons

import testImage from '../assets/images/test.jpg';
import testImage2 from '../assets/images/test2.jpg';
import testImage3 from '../assets/images/test3.jpg';
import testImage4 from '../assets/images/test4.jpg';
import testImage5 from '../assets/images/test5.jpg';
import testImage6 from '../assets/images/test6.jpg';
import testImage7 from '../assets/images/test7.jpg';
import testImage8 from '../assets/images/test8.jpg';

const ImageUpload = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [polygon, setPolygon] = useState([]); // Store the polygon (single polygon allowed)
  const [isFinished, setIsFinished] = useState(false); // Track if the polygon is finished
  const [scale, setScale] = useState(1); // Track zoom level
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Track position for panning
  const [isDragging, setIsDragging] = useState(false); // Track if the user is dragging the stage (for panning)
  const [hoveredPoint, setHoveredPoint] = useState(null); // Track if a polygon point is hovered
  const [zoomCount, setZoomCount] = useState(0); // Track how many times zoom-in has been applied
  const stageRef = useRef(null);
  const groupRef = useRef(null); // Ref for the Group (image + polygon)
  const [loadedImage] = useImage(imageSrc);
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

  // Select an image to work on
  const handleSelectImage = (image) => {
    setImageSrc(image.src);
    setPolygon([]); // Reset polygon
    setIsFinished(false); // Reset polygon completion status
    setPosition({ x: 0, y: 0 }); // Reset position
    setScale(1); // Reset zoom level
    setZoomCount(0); // Reset zoom count
  };

  // Handle mouse click to add points to the polygon
  const handleMouseClick = (e) => {
    if (isFinished || isDragging) return; // Prevent adding points if polygon is finished or the stage is being dragged

    const stage = stageRef.current;
    const pointerPos = stage.getPointerPosition();
    const group = groupRef.current;

    if (group) {
      const groupPos = group.getClientRect();
      const scaleX = stage.scaleX();
      const scaleY = stage.scaleY();

      // Adjust the pointer position based on the group's position and scale
      const x = (pointerPos.x - groupPos.x) / scaleX;
      const y = (pointerPos.y - groupPos.y) / scaleY;

      const newPolygon = [...polygon];

      // Close the polygon if near the starting point
      if (newPolygon.length > 0) {
        const startPoint = newPolygon[0];
        const distance = Math.sqrt((x - startPoint.x) ** 2 + (y - startPoint.y) ** 2);
        if (distance < vertexRadius) {
          setIsFinished(true); // Polygon is finished
          return;
        }
      }

      newPolygon.push({ x, y });
      setPolygon(newPolygon);
    }
  };

  // Handle polygon deletion with confirmation
  const handleDeletePolygon = () => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className='custom-ui' style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h1 style={{ color: '#ff6666' }}>Confirm Delete</h1>
          <p>Are you sure you want to delete the selected polygon? This action cannot be undone.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button
              style={{
                backgroundColor: '#ff6666',
                color: '#fff',
                padding: '10px 20px',
                margin: '0 10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setPolygon([]); // Clear the polygon
                setIsFinished(false); // Reset the finished status
                onClose();
              }}
            >
              Yes
            </button>
            <button
              style={{
                backgroundColor: '#666',
                color: '#fff',
                padding: '10px 20px',
                margin: '0 10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      ),
    });
  };

  // Save the image with the polygon
  const saveImage = async () => {
    const stage = stageRef.current;
    try {
      const dataURL = stage.toDataURL();
      console.log('dataURL:', dataURL);
      saveAs(dataURL, 'polygon-image.png');
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    setScale((prevScale) => prevScale * 1.2);
    setZoomCount((prevCount) => prevCount + 1); // Increment zoom count on zoom in
  };

  const handleZoomOut = () => {
    if (zoomCount > 0) {
      setScale((prevScale) => prevScale / 1.2);
      setZoomCount((prevCount) => prevCount - 1); // Decrement zoom count on zoom out
    }
  };

  // Handle image and polygon dragging (panning)
  const handleDragMove = (e) => {
    const newPos = e.target.position();
    const stage = stageRef.current;

    const minX = -stage.width() * (scale - 1);
    const minY = -stage.height() * (scale - 1);
    const maxX = 0;
    const maxY = 0;

    // Restrict the group position to not go out of bounds
    const x = Math.min(Math.max(newPos.x, minX), maxX);
    const y = Math.min(Math.max(newPos.y, minY), maxY);

    setPosition({ x, y });
  };

  return (
    <div style={styles.appContainer}>
      <ImageList images={images} onSelectImage={handleSelectImage} />

      <div style={styles.mainContent}>
        <div className="mb-3">
          {/* Bootstrap Buttons */}
          <button
            onClick={saveImage}
            className="btn btn-primary btn-lg me-2"
            aria-label="Save Image"
            disabled={!isFinished}
          >
            <i className="fas fa-save"></i> Save
          </button>

          <button
            onClick={handleZoomIn}
            className="btn btn-secondary btn-lg me-2"
            aria-label="Zoom In"
          >
            <i className="fas fa-search-plus"></i> Zoom In
          </button>

          <button
            onClick={handleZoomOut}
            className="btn btn-secondary btn-lg me-2"
            aria-label="Zoom Out"
            disabled={zoomCount === 0} // Disable zoom out if no zoom in has been applied
          >
            <i className="fas fa-search-minus"></i> Zoom Out
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDeletePolygon}
            className="btn btn-danger btn-lg"
            aria-label="Delete Polygon"
            disabled={!isFinished}
          >
            <i className="fas fa-trash"></i> Delete
          </button>
        </div>

        {/* Stage with the gray background */}
        <Stage
          width={window.innerWidth - 200} // Adjust for sidebar
          height={window.innerHeight - 100}
          ref={stageRef}
          scaleX={scale}
          scaleY={scale}
          style={{
            backgroundColor: '#f5f5f5', // Set the canvas background to a grayish color
          }}
          onClick={handleMouseClick} // Allow polygon drawing
        >
          <Layer>
            {!imageSrc && (
              <Text
                text="Please select an image from the list."
                fontSize={24}
                fontStyle="bold"
                fill="#333"
                align="center"
                verticalAlign="middle"
                x={50}
                y={window.innerHeight / 2 - 50}
                width={window.innerWidth - 300}
                height={50}
              />
            )}

            {loadedImage && (
              <Group
                draggable={scale > 1} // Allow dragging only if zoomed in
                onDragStart={() => setIsDragging(true)} // Detect when dragging starts
                onDragEnd={() => setIsDragging(false)} // Detect when dragging ends
                onDragMove={handleDragMove} // Handle dragging (panning)
                ref={groupRef} // Reference for the Group (image + polygon)
                x={position.x}
                y={position.y}
              >
                <Image
                  image={loadedImage}
                  width={window.innerWidth - 200}
                  height={window.innerHeight - 100}
                />
                {polygon.length > 0 && (
                  <Group>
                    <Line
                      points={polygon.flatMap((p) => [p.x, p.y])}
                      stroke="red"
                      strokeWidth={2}
                      closed={isFinished}
                    />
                    {polygon.map((point, index) => (
                      <Circle
                        key={index}
                        x={point.x}
                        y={point.y}
                        radius={hoveredPoint === index ? 8 : vertexRadius} // Increase size on hover
                        fill={hoveredPoint === index ? 'gray' : 'white'} // Change color on hover
                        stroke="black"
                        strokeWidth={2}
                        onMouseOver={() => setHoveredPoint(index)} // Set hover state
                        onMouseOut={() => setHoveredPoint(null)} // Reset hover state
                      />
                    ))}
                  </Group>
                )}
              </Group>
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    height: '100vh',
  },
  mainContent: {
    flexGrow: 1,
    padding: '10px',
  },
};

export default ImageUpload;
