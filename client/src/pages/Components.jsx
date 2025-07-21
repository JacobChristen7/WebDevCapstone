import React from 'react';

// Simple reusable input component
const Input = ({ label, name, value, onChange, type = 'text' }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
  );

  export default Input;