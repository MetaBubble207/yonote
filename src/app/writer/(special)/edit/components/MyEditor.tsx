"use client";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import React, { useState, useEffect, type ChangeEvent } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import {
  type IDomEditor,
  type IEditorConfig,
  type IToolbarConfig,
} from "@wangeditor/editor";
import Preview from "@/app/_components/writer/Preview";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import W100H50Modal from "@/app/_components/common/W100H50Modal";
import { Button } from "antd";
import { ossClient } from "@/app/_utils/oss";
import { EditorProps } from "@/app/writer/(special)/edit/types";
import TagInput from "./TagInput";

const MyEditor = ({
  initialPostData,
  initialDraftData,
  initialColumnId,
}: EditorProps) => {
  const router = useRouter();
  const columnId = initialColumnId;

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.push(`/writer/content-management?columnId=${columnId}`);
    },
  });

  const updatePost = api.post.updatePost.useMutation({
    onSuccess: () => {
      router.push(`/writer/content-management?columnId=${columnId}`);
    },
  });

  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState("");
  const draft = html;
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [publishModal, setPublishModal] = useState(false);

  // 使用服务端传入的初始数据
  useEffect(() => {
    if (initialPostData) {
      setTitle(initialPostData.name);
      setHtml(initialPostData.content);
      setTags(initialPostData.tag ? initialPostData.tag.split(",") : []);
    } else if (initialDraftData) {
      setTitle(initialDraftData.name);
      setHtml(initialDraftData.content);
      setTags(initialDraftData.tag ? initialDraftData.tag.split(",") : []);
    } else {
      setTitle("");
      setHtml("");
      setTags([]);
    }
  }, [initialPostData, initialDraftData]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value.slice(0, 64); // 限制标题长度为64个字符
    setTitle(newTitle);
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  const Modal = () => {
    return (
      <W100H50Modal>
        <div className={"text-6"}>是否确认要发布</div>
        <div className={"mt-5 space-x-10"}>
          <button
            className="w-22 b-1 b-rd-1 text-3.5 font-400 lh-5.5 ml-28 ml-4 mt-1 h-8 shrink-0 bg-[#eea1a1ff] text-[#eb172fff]"
            onClick={() => setPublishModal(false)}
          >
            取消
          </button>
          <button
            className="w-22 b-1 b-rd-1 font-Abel text-3.5 font-not-italic font-400 lh-5.5 ml-28 ml-4 mt-1 h-8 shrink-0 bg-[#e8e6a2ff] text-[#595508ff]"
            onClick={saveDraft}
          >
            保存草稿
          </button>
          <button
            className="w-22 bg-#DAF9F1 b-1 b-rd-1 font-Abel text-3.5 font-not-italic font-400 lh-5.5 ml-28 ml-4 mt-1 h-8 shrink-0 text-[#1DB48D]"
            onClick={publish}
          >
            确认发布
          </button>
        </div>
      </W100H50Modal>
    );
  };

  // 保存草稿的函数
  const saveDraft = () => {
    if (initialDraftData) {
      updatePost.mutate({
        id: initialDraftData.id,
        name: title,
        content: html,
        tag: tags.join(","),
        status: false,
        columnId: columnId,
      });
    } else {
      createPost.mutate({
        name: title,
        content: html,
        tag: tags.join(","),
        status: false,
        columnId: columnId,
      });
    }
  };

  const publish = () => {
    if (initialPostData || initialDraftData) {
      updatePost.mutate({
        id: initialPostData?.id ?? initialDraftData!.id,
        name: title,
        content: html,
        tag: tags.join(","),
        status: true,
        columnId: columnId,
      });
    } else {
      createPost.mutate({
        name: title,
        content: html,
        tag: tags.join(","),
        status: true,
        columnId: columnId,
      });
    }
  };

  // 发布的函数
  const handleClickPublish = () => {
    setPublishModal(true);
  };

  const toolbarConfig: Partial<IToolbarConfig> = {}; // 工具栏配置
  toolbarConfig.toolbarKeys = [
    // 菜单 key
    "headerSelect",

    // 分割线
    "|",

    // 菜单 key
    "undo",
    "redo",
    "fontFamily",
    {
      key: "group-justify",
      title: "对齐",
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
      menuKeys: [
        "justifyLeft",
        "justifyRight",
        "justifyCenter",
        "justifyJustify",
      ],
    },
    "color",
    "bold",
    "underline",
    "italic",
    "through",
    "code",
    "clearStyle",
    "bulletedList",
    "numberedList",
    "insertLink",
    {
      key: "group-image",
      title: "图片",
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
      menuKeys: ["insertImage", "uploadImage"],
    },
    "codeBlock",
    "blockquote",
    "divider",
  ];

  // 修改 ossClient 的使用方式，确保只在客户端使用
const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  maxLength: 1000,
  MENU_CONF: {
    uploadImage: {
      // 自定义上传
      async customUpload(file: File, insertFn: (url: string, alt: string, href: string, url_org?: string) => void) {
        // 确保在客户端环境中执行
        if (typeof window !== 'undefined') {
          const result = await ossClient.put(file.name, file);
          insertFn(result.url, result.name, result.url, result.url);
        }
      },
    },
  },
};

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <div className="m-auto h-full w-full bg-[#FFF] pl-14 pr-6 pt-9 pb-20">
      <div className="pt-6.375 flex items-center justify-between">
        {/* 工具栏 */}
        <div className={"flex items-center space-x-4"}>
          <Toolbar
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
            style={{ border: "1px solid #ccc" }}
          />
          <TagInput tags={tags} setTags={setTags} />
        </div>
        <div className="ml-2 flex items-center space-x-2">
          <Button
            style={{ width: "88px", height: "32px" }}
            type="primary"
            className="font-Abel text-3.5 font-400 text-[#1DB48D]"
            onClick={saveDraft}
          >
            保存草稿
          </Button>
          <Button
            style={{ width: "88px", height: "32px" }}
            className={`${preview ? "text-#ffffff" : "text-[rgba(0,0,0,0.65)]"
              } text-3.5 font-not-italic font-400`}
            onClick={togglePreview}
          >
            {preview ? "取消预览" : "预览"}
          </Button>
          <Button
            style={{ width: "65px", height: "32px" }}
            className="text-3.5 font-400 lh-5.5 ml-4"
            onClick={handleClickPublish}
          >
            发布
          </Button>
        </div>
      </div>

      <div className="w-340 fill-#FFF stroke-0.25 mt-16.625 relative flex shrink-0 stroke-[#D9D9D9]">
        <div className="relative">
          {!preview && (
            <div className={"w-335 b-1 b-solid b-#ccc relative pb-3"}>
              {/* 标题输入框 */}
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="在这里输入标题"
                maxLength={64}
                className="mt-7.5 pl-10 outline-none"
              />
              {/* 富文本编辑器 */}
              <Editor
                defaultConfig={editorConfig}
                onCreated={setEditor}
                onChange={(editor) => setHtml(editor.getHtml())}
                mode="default"
                value={draft}
                style={{ height: "28em", overflowY: "hidden" }}
                className="fill-#FFF"
              />
            </div>
          )}
          {preview && (
            <div className={"w-335 flex justify-between"}>
              <div className={"w-243.3755 b-1 b-solid b-#ccc relative mr-10"}>
                {/* 标题输入框 */}
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="在这里输入标题"
                  maxLength={64}
                  className="mt-7.5 pl-10 outline-none"
                />
                {/* 富文本编辑器 */}
                <Editor
                  defaultConfig={editorConfig}
                  onCreated={setEditor}
                  onChange={(editor) => setHtml(editor.getHtml())}
                  mode="default"
                  value={draft}
                  style={{ height: "28em", overflowY: "hidden" }}
                  className="fill-#FFF"
                />
              </div>
              <div className="w-93 bg-white">
                <Preview html={html} title={title} tags={tags} />
              </div>
            </div>
          )}
        </div>
      </div>
      {publishModal && <Modal />}
    </div>
  );
};

export default MyEditor;