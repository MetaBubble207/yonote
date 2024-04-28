import React, { useState } from 'react';
import { any } from 'zod';

interface TagInputProps{
  tags:any,
  setTags:any,
}

function TagInput(props:TagInputProps) {
  console.log(props);
  
  // const [tags, setTags] = useState<string[]>([]);
  const {tags,setTags} = props;
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddTag = () => {
    if (editIndex !== null) {
      const newTags = [...tags];
      newTags[editIndex] = editValue;
      setTags(newTags);
      setEditIndex(null);
      setEditValue('');
    } else {
      const newTag = prompt('请输入标签内容：');
      if (newTag !== null && newTag !== '') {
        setTags([...tags, newTag]);
      }
    }
  };

  const handleEdit = (index:number) => {
    setEditIndex(index);
    setEditValue(tags[index]!);
  };

  const handleConfirmEdit = () => {
    if(editIndex !== null){
        const newTags = [...tags];
        newTags[editIndex] = editValue;
        setTags(newTags);
        setEditIndex(null);
        setEditValue('');
    }
  };

  const handleDelete = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      handleConfirmEdit();
    } else if (e.key === 'Delete' && editIndex === null) {
      handleDelete(index);
    }
  };

  return (
    <div>
      <div>
        <button className="w-27.4995 h-8 shrink-0 b-1 b-rd-1 mt-1 ml-4" onClick={handleAddTag}>
          {editIndex !== null ? '确定' : '+ 添加标签'}
        </button>
      </div>
      {tags.map((tag:string, index:number)=> (
        <div key={index} className="w-22 h-8 shrink-0 b-1 b-rd-1 ml-4" >
          {editIndex === index ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ) : (
            <>
              <span className="text-[#1DB48D] text-3.5 font-not-italic font-400 lh-5.5 ml-1.5 mt-1" onClick={() => handleEdit(index)}>
                {tag}
              </span>
              <button onClick={() => handleDelete(index)} className=''>x</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TagInput;
