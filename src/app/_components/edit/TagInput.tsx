"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";

interface TagInputProps {
  tags: string[];
  setTags: any;
}

const TagInput = ({ tags, setTags }: TagInputProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAddOrEditTag = () => {
    if (editingIndex !== null) {
      setEditingIndex(null);
      setEditValue("");
    } else {
      setEditingIndex(tags.length); // 设置为新增状态
      setEditValue("");
    }
  };

  const handleConfirmEdit = () => {
    if (editingIndex !== null && editValue.trim() !== "") {
      setTags((prevTags) => {
        const newTags = [...prevTags];
        if (editingIndex === prevTags.length) {
          newTags.push(editValue);
        } else {
          newTags[editingIndex] = editValue;
        }
        setEditingIndex(null);
        setEditValue("");
        return newTags;
      });
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(tags[index]);
  };

  const handleDelete = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter") {
      handleConfirmEdit();
    } else if (e.key === "Delete" && editingIndex === null) {
      handleDelete(index);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editingIndex !== null &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        handleConfirmEdit(); // 保存当前编辑内容
        setEditingIndex(null);
        setEditValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingIndex, editValue]);

  useEffect(() => {
    if (editingIndex === tags.length) {
      inputRef.current?.focus(); // 自动聚焦输入框
    }
  }, [editingIndex]);

  return (
    <div className="flex items-center gap-4">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-md border bg-gray-100 p-2 dark:bg-gray-800"
        >
          {editingIndex === index ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full rounded-md border p-1 focus:outline-none"
            />
          ) : (
            <div className={"ml-2 flex items-center justify-between"}>
              <span
                className="text-#1DB48D cursor-pointer whitespace-nowrap"
                onClick={() => handleEdit(index)}
              >
                #{tag}
              </span>
              <button
                onClick={() => handleDelete(index)}
                className="text-#1DB48D ml-2"
              >
                x
              </button>
            </div>
          )}
        </div>
      ))}
      {editingIndex === tags.length && (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, tags.length)}
          className="w-full rounded-md border p-1 focus:outline-none"
        />
      )}
      {tags.length < 4 && (
        <Button onClick={handleAddOrEditTag}>
          {editingIndex !== null ? "确定" : "+ 添加标签"}
        </Button>
      )}
    </div>
  );
};

export default TagInput;
