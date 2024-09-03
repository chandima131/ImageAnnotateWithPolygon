import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const HandleDeletePolygon = ({ handleDeletePolygon }) => {
  const handleDelete = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui' style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h1 style={{ color: 'red' }}>Confirm Delete</h1>
            <p>Are you sure you want to delete the selected polygon? This action cannot be undone.</p>
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
                  handleDeletePolygon();
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

  return <button onClick={handleDelete} style={{ margin: '10px' }}>Delete Polygon</button>;
};

export default HandleDeletePolygon;
