import React, { useState } from 'react';
import { closestCenter, DndContext, useDroppable, DragOverlay } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export const ViewMode = {
  STUDENTS: "students",
  CLASSES: "classes",
  DESCRIPTION: "description",
}

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

export function StylishList({ title, subtitle, items, activeID }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-row items-center justify-between w-full'>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="text-sm italic text-gray-500 mb-4">{subtitle}</div>
      </div>
      <div className="w-full overflow-y-auto overflow-x-hidden px-5">
        <ul className='py-3'>
          {items.length === 0 ? (
            <li className="text-sm text-center text-gray-500 italic">No items</li>
          ) : (
            items.map((item, index) => {
              const isDraggingCurrent = activeID === item.id;

              return (
                <Draggable id={item.id} key={item.id}>
                  <CollapsibleItem
                    item={item.title == null ? item.name : item.title}
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

export function ColumnsList({ title, subtitle, items = [], activeID, viewMode, onAction }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-row items-center justify-between w-full'>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="text-sm italic text-gray-500 mb-4">{subtitle}</div>
      </div>
      <div className="overflow-y-auto overflow-x-hidden px-5">
        <ul className='grid grid-cols-2 gap-x-5'>
          {items.length === 0 ? (
            <li className="text-sm text-center text-gray-500 italic">No items</li>
          ) : (
            items.map((item, index) => {
              const isDraggingCurrent = activeID === item.id;

              return (
                <Draggable id={item.id} key={item.id}>
                  <CollapsibleItem
                    item={item}
                    index={item.id}
                    isDragging={isDraggingCurrent}
                    viewMode={viewMode}
                    onAction={onAction}
                  >
                    {viewMode === ViewMode.STUDENTS ? (
                      item.students.map((student) => {
                        return <CollapsibleSubItem item={student.name} className='bg-blue-500 hover:bg-blue-400 rounded-2xl pt-2 text-white' onAction={onAction}>
                          <DeleteButton text="Unenroll Student" onClick={(e) => {e.stopPropagation(); onAction('UNENROLL_STUDENT', { userID: student.id, classID: item.id })}}></DeleteButton>
                        </CollapsibleSubItem>
                      })
                    ) : (
                      item.classes?.map((cls) => {
                        return <CollapsibleSubItem item={cls.title} className='bg-blue-500 hover:bg-blue-400 rounded-2xl pt-2 text-white' onAction={onAction}>
                          <DeleteButton text="Remove Class" onClick={(e) => {e.stopPropagation(); onAction('UNREGISTER_CLASS', { classID: cls.id, userID: item.id })}}></DeleteButton>
                        </CollapsibleSubItem>
                      })
                    )}
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

export function CollapsibleSubItem({ item, index, children, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      key={index}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen)
      }}
      className={`bg-blue-50 py-3 px-5 rounded-lg text-gray-900 font-medium drop-shadow-md transition-colors hover:bg-blue-400 cursor-pointer ${className}`}
    >
      <div
        className="flex justify-between items-center select-none"
      >
        {item}
        <span className={`text-xl transition-transform duration-200 ease-in-out text-white ${isOpen ? 'rotate-45' : 'rotate-0'}`}> + </span>
      </div>

      {isOpen && (
        <div className={`flex flex-col justify-start items-start w-full pt-3`}>
          {children}
        </div>
      )}
    </div>
  );
}

export function CollapsibleItem({ item, index, isDragging, viewMode = ViewMode.DESCRIPTION, onAction, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      key={index}
      onClick={() => setIsOpen(!isOpen)}
      className={`bg-blue-50 mb-3 py-3 px-5 rounded-lg text-gray-900 font-medium drop-shadow-md transition-colors hover:bg-gray-100 cursor-pointer ${isDragging ? 'opacity-0' : 'opacity-100'}`}
    >
      <div
        className="flex justify-between items-center select-none"
      >
        {viewMode === ViewMode.DESCRIPTION && item}
        {viewMode === ViewMode.STUDENTS && item.title}
        {viewMode === ViewMode.CLASSES && item.name}
        <span className={`text-xl transition-transform duration-200 ease-in-out text-gray-400 ${isOpen ? 'rotate-45' : 'rotate-0'}`}> + </span>
      </div>

      {isOpen && (
        <div className={`w-full mt-3 text-sm p-3 ${viewMode === ViewMode.DESCRIPTION ? 'italic text-gray-500' : ''}`}>
          {viewMode === ViewMode.STUDENTS && <span className="italic text-gray-500">Currently Enrolled Students:</span>}
          {viewMode === ViewMode.CLASSES && <span className="italic text-gray-500">Currently Enrolled Classes:</span>}
          <div className={`${viewMode !== ViewMode.DESCRIPTION ? 'grid grid-cols-2 items-start gap-2 pt-3 mb-10' : ''}`}>{children}</div>
          {viewMode === ViewMode.STUDENTS && <LabeledInput label={"Description:"} value={"null"} className='mb-1 px-0.5'></LabeledInput>}
          {viewMode === ViewMode.STUDENTS &&
            <div className='flex flex-row gap-2 items-center mt-8'>
              <DeleteButton text="Remove Class" onClick={(e) => {e.stopPropagation(); onAction('DELETE_CLASS', { classID: item.id})}}></DeleteButton>
              <SubmitButton text="Save Changes" onClick={(e) => {e.stopPropagation(); onAction('SAVE_CLASS_CHANGES', { classID: item.id})}}></SubmitButton>
            </div>}

          {viewMode === ViewMode.CLASSES &&
            <div className='flex flex-col gap-2'>
              <LabeledInput label={"Username"} value={"null"}></LabeledInput>
              <LabeledInput label={"Email"} value={"null"}></LabeledInput>
              <LabeledInput label={"First Name"} value={"null"}></LabeledInput>
              <LabeledInput label={"Last Name"} value={"null"}></LabeledInput>
              <LabeledInput label={"Address"} value={"null"}></LabeledInput>
              <LabeledInput label={<span>About Me <span className="italic text-gray-500">(optional)</span></span>} value={"null"} className='mb-1'></LabeledInput>
              <div className='flex flex-row gap-2 items-center mt-6'>
                <DeleteButton text="Remove User" onClick={(e) => {e.stopPropagation(); onAction('DELETE_USER', { userID: item.id})}}></DeleteButton>
                <SubmitButton text="Save Changes" onClick={(e) => {e.stopPropagation(); onAction('SAVE_USER_CHANGES', { userID: item.id})}}></SubmitButton>
              </div>
            </div>
          }
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
  width = 'w-[250px]',
  className = ''
}) {
  return (
    <div className={`flex w-full justify-between items-center ${className}`}>
      <label>{label}</label>
      <input
        className={`bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-1 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${width}`}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        onClick={(e) => {
          e.stopPropagation();
        }}
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

export function SubmitButton({ text, onClick, className = '' }) {
  return <button onClick={onClick} type="submit" className={`w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-3 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 focus:outline-none ${className}`}>{text}</button>
}

function DeleteButton({ text, onClick, className = '' }) {
  return (
    <button className={`bg-red-500 w-full py-2 hover:bg-red-600 rounded-md font-bold text-white ${className}`} onClick={onClick}>{text}</button>
  );
}

export function CoursesList({ title, subtitle, courses, className = '', activeId, children = null }) {
  return (
    <div className={`flex bg-white shadow-lg rounded-2xl p-8 ${className}`}>
      <StylishList title={title} subtitle={subtitle} items={courses} activeID={activeId}></StylishList>
      {children}
    </div>
  );
};

export function ColumnsCoursesList({ title, subtitle, items, className = '', viewMode, activeId, onAction, children = null }) {
  return (
    <div className={`flex bg-white shadow-lg rounded-2xl p-8 ${className}`}>
      <ColumnsList title={title} subtitle={subtitle} items={items} activeID={activeId} viewMode={viewMode} onAction={onAction}></ColumnsList>
      {children}
    </div>
  );
};

export function SearchBar({ searchText, placeholder, handleChange }) {
  return (
    <div className='flex w-full items-center bg-white p-4 rounded-3xl shadow-lg gap-5'>
      <svg style={{ color: 'gray' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
      </svg>
      <SearchInput placeholder={placeholder} name="search" value={searchText} onChange={handleChange} />
    </div>
  );
}