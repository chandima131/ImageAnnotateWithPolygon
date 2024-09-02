import React from 'react';

const ContextMenu = ({ x, y, onDelete }) => {
  const style = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    backgroundColor: 'white',
    border: '1px solid black',
    borderRadius: '4px',
    padding: '8px',
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div style={style}>
      <button onClick={onDelete} style={{ display: 'block', width: '100%' }}>
        Delete Polygon
      </button>
    </div>
  );
};

export default ContextMenu;
