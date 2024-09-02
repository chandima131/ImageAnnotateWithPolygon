import React from 'react'

export const Navbar = () => {
  return (
    <nav className="navbar">
    <h1>Web Based Image Annotation</h1>
    <div className="links">
      <a href="/">Home</a>
      <a href="/drawpolygon" style={{ 
        color: 'white', 
        backgroundColor: '#f1356d',
        borderRadius: '8px' 
      }}>Draw Polygon</a>
    </div>
  </nav>
  )
}
