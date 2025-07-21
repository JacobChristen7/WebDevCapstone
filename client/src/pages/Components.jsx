import React from 'react';

// Simple reusable input component
export function Input({ label, name, value, onChange, type = 'text' }) {
    return (
        <div className='w-full'>
        <label htmlFor={name} className="block text-sm font-medium text-gray-500 mb-1">
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
}

export function SearchInput({ placeholder, name, value, onChange, type = 'text' }) {
    return (
        <input
            placeholder={placeholder}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className='w-full focus:outline-none'
        />
    );
}

export function StylishList({ title, items }) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        <ul>
          {items.length === 0 ? (
            <li className="text-center text-gray-500 italic">No items available.</li>
          ) : (
            items.map((item, index) => (
              <li
                key={index}
                className="bg-gray-100 mb-3 py-3 px-5 rounded-lg text-gray-900 font-medium shadow-blue-200 shadow-sm cursor-default transition-colors hover:bg-gray-200"
              >
                {item}
              </li>
            ))
          )}
        </ul>
      </div>
    );
};

export default Input;