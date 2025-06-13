import React from 'react';
import EditBook from './EditBook';

// Wrapper para que usuarios normales usen el mismo formulario de edición
export default function EditBookUser(props) {
  return <EditBook {...props} />;
}
