import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import the default styles

const HandleDeletePolygon = ({ setPoints, setIsFinished }) => {
  const handleDeletePolygon = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui' style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h1 style={{ color: 'red' }}>Confirm Delete</h1>
            <p>Are you sure to delete the Polygon? This process cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button
                style={{
                  backgroundColor: 'red',
                  color: '#fff',
                  padding: '10px 20px',
                  margin: '0 10px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setPoints([]);
                  setIsFinished(false);
                  onClose();
                }}
              >
                Yes
              </button>
              <button
                style={{
                  backgroundColor: 'grey',
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
        );
      }
    });
  };

  return <button onClick={handleDeletePolygon} style={{ margin: '10px' }}>Delete Polygon</button>;
};

export default HandleDeletePolygon;
