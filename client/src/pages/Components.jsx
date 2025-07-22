import React, { useState } from 'react';

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
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className='flex flex-col w-full'>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="w-full overflow-auto pr-5">
        
        <ul className='py-3'>
          {items.length === 0 ? (
            <li className="text-center text-gray-500 italic">No items available.</li>
          ) : (
            items.map((item, index) => (
                <CollapsibleItem key={index} item={item.title} index={index}>
                    {item.description}
                </CollapsibleItem>
            ))
          )}
        </ul>
      </div>
        </div>
      
    );
};

export function CollapsibleItem({ item, index, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      key={index}
      onClick={() => setIsOpen(!isOpen)}
      className="bg-blue-50 mb-3 py-3 px-5 rounded-lg text-gray-900 font-medium drop-shadow-md transition-colors hover:bg-gray-100 cursor-pointer"
    >
      <div
        className="flex justify-between items-center"
      >
        {item}
        <span className="text-lg text-gray-400">{isOpen ? '↑' : '↓'}</span>
      </div>

      {isOpen && (
        <div className="w-full mt-3 text-sm italic text-gray-500 p-3">
          {children}
        </div>
      )}
    </li>
  );
}

export function LabeledInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  width = 'w-[200px]',
}) {
  return (
    <div className='flex w-full justify-between pr-1'>
      <label>{label}</label>
      <input
        className={width}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};


export default Input;