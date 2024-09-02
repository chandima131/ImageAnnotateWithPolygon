import React from 'react';

const ImageList = ({ images, onSelectImage }) => {
  return (
    <div style={styles.imageListContainer}>
      {images.map((image, index) => (
        <div
          key={index}
          style={styles.imageWrapper}
          onClick={() => onSelectImage(image)}
        >
          <img src={image.src} alt={`Image ${index}`} style={styles.image} />
        </div>
      ))}
    </div>
  );
};

const styles = {
  imageListContainer: {
    width: '150px',        // Fixed width for the sidebar
    height: '100vh',       // Full viewport height
    overflowY: 'auto',     // Enable vertical scrolling
    borderRight: '1px solid #ccc', // Border to separate the sidebar
    padding: '10px',       // Padding inside the container
    boxSizing: 'border-box',
    backgroundColor: '#f4f4f4', // Optional: background color
  },
  imageWrapper: {
    marginBottom: '10px',  // Space between images
    cursor: 'pointer',     // Change cursor to pointer (hand) on hover
  },
  image: {
    width: '100%',         // Full width of the container
    height: 'auto',        // Maintain aspect ratio
    maxHeight: '100px',    // Maximum height to standardize image sizes
    objectFit: 'cover',    // Fit the image within the given dimensions
    borderRadius: '5px',   // Optional: round the corners of the image
  },
};

export default ImageList;
