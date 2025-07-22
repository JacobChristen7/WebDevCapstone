import React, { useState } from 'react';
import { closestCenter, DndContext, useDroppable, DragOverlay } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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

export function StylishList({ title, items, activeID }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex flex-col w-full'>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="w-full overflow-y-auto overflow-x-hidden px-5">


        <ul className='py-3'>
          {items.length === 0 ? (
            <li className="text-center text-gray-500 italic">No items available.</li>
          ) : (
            items.map((item, index) => {
              const isDraggingCurrent = activeID === item.id;

              return (
                <Draggable id={item.id} key={item.id}>
                  <CollapsibleItem
                    item={item.title}
                    index={item.id}
                    isDragging={isDraggingCurrent}
                  >
                    {item.description}
                  </CollapsibleItem>
                </Draggable>
              );
            })
          )}
        </ul>
      </div>
    </div>

  );
};

export function CollapsibleItem({ item, index, isDragging, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      key={index}
      onClick={() => setIsOpen(!isOpen)}
      className={`bg-blue-50 mb-3 py-3 px-5 rounded-lg text-gray-900 font-medium drop-shadow-md transition-colors hover:bg-gray-100 cursor-pointer ${isDragging ? 'opacity-0' : 'opacity-100'}`}
    >
      <div
        className="flex justify-between items-center"
      >
        {item}
        <span className={`text-xl transition-transform duration-200 ease-in-out text-gray-400 ${isOpen ? 'rotate-45' : 'rotate-0'}`}> + </span>
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

//Simple drag-and-drop components

export function Droppable({ id, className = '', children }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={`${className} ${isOver ? 'opacity-50' : 'opacity-100'}`}>
      {children}
    </div>
  );
}

export function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
    width: '100%',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}

export function DragOverlayWrapper({ course }) {
  return (
    <DragOverlay
      style={{
        zIndex: 5,
        pointerEvents: 'none', // avoids capturing hover/clicks
      }}
    >
      {course ? (
        <div className="bg-blue-50 mb-3 py-3 px-5 rounded-lg text-gray-900 font-medium drop-shadow-md">
          {course.title}
        </div>
      ) : null}
    </DragOverlay>
  );
}

export function SubmitButton({ text, onClick }) {
  return <button onClick={onClick} type="submit" className='w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-3 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none mt-5'>{text}</button>
}