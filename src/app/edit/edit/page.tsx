"use client"
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig, DomEditor } from '@wangeditor/editor'
import Preview from "@/app/_components/writer/preview";
import TagInput from "../../_components/edit/tag";

function MyEditor() {

    const [editor, setEditor] = useState<IDomEditor | null>(null);
    const [html, setHtml] = useState('<p>hello</p>');
    const [title, setTitle] = useState('');
    const [preview, setPreview] = useState(true);
    const toolbar = DomEditor.getToolbar(editor!)
    const [tags, setTags] = useState([]);

    const curToolbarConfig = toolbar?.getConfig()
    console.log(curToolbarConfig?.toolbarKeys) // 当前菜单排序和分组

    useEffect(() => {
        setTimeout(() => {
            setHtml('<p>hello world</p>');
        }, 1500);
    }, []);

    const handleTitleChange = (event: any) => {
        const newTitle = event.target.value.slice(0, 64); // 限制标题长度为64个字符
        setTitle(newTitle);
    };

    const togglePreview = () => {
        setPreview(!preview);
    };

    const toolbarConfig: Partial<IToolbarConfig> = {

    }; // 工具栏配置
    toolbarConfig.toolbarKeys = [
        // 菜单 key
        'headerSelect',

        // 分割线
        '|',

        // 菜单 key
        'undo', 'redo', 'fontFamily',
        {
            key: "group-justify",
            title: "对齐",
            iconSvg: "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
            menuKeys: [
                "justifyLeft",
                "justifyRight",
                "justifyCenter",
                "justifyJustify"
            ]
        },
        'color', 'bold', 'underline', 'italic', 'through', 'code', 'clearStyle', 'bulletedList', 'numberedList', 'insertLink',
        {

            key: "group-image",
            title: "图片",
            iconSvg: "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
            menuKeys: [
                "insertImage",
                "uploadImage"
            ]
        },
        'codeBlock', 'blockquote', 'divider',

        // 菜单组，包含多个菜单

        // 继续配置其他菜单...
    ]
    // console.log("123",toolbarConfig)
    // console.log( toolbarConfig.toolbarKeys )
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: '请输入内容...',
        maxLength: 1000,
    }; // 编辑器配置

    useEffect(() => {
        return () => {
            if (editor == null) return;
            editor.destroy();
            setEditor(null);
        };
    }, [editor]);

    return (
        <div className="pt-21.5">
          <div className="w-360 h-197.824 shrink-0 border-rd-[0px_0px_10px_10px] bg-[#FFF] m-auto">
            <div style={{ zIndex: 100 }} className="w-340.36225 h-180 shrink-0 m-auto">
              <div className="flex pt-6.375">
                {/* 工具栏 */}
                <Toolbar
                  editor={editor}
                  defaultConfig={toolbarConfig}
                  mode="default"
                  style={{ border: '1px solid #ccc' }}
                />
                <div className="flex">
                  <TagInput tags={tags} setTags={setTags} />
                  <div className="w-22 h-8 shrink-0 bg-#DAF9F1 b-1 b-rd-1 ml-28 mt-1">
                    <button className="text-[#1DB48D] font-Abel text-3.5 font-not-italic font-400 lh-5.5 ml-4 mt-1">保存草稿</button>
                  </div>
                  <div className={`b-1 b-rd-1 w-22 h-8 shrink-0 fill-#FFF stroke-0.25 stroke-[#D9D9D9]  mt-1 ml-1.5 ${preview ? 'bg-#1db48d': ''}`}>
                        <button className={`${preview ? 'text-#ffffff' : 'text-[rgba(0,0,0,0.65)]' } text-3.5 font-not-italic font-400 lh-5.5 ml-4 mt-1`} onClick={togglePreview}>
                            {preview ? '取消预览' : '预览'}
                        </button>
                        </div>
                        <div className="b-1 b-rd-1 w-16.25 h-8 shrink-0 fill-#FFF stroke-0.25 stroke-[#D9D9D9] mt-1 ml-1.5">
                            <button className="text-[rgba(0,0,0,0.65)] font-Abel text-3.5 font-not-italic font-400 lh-5.5 ml-4 mt-1">发布</button>
                        </div>
                </div>
              </div>

              <div className="flex relative w-340.36225 h-154.18775 shrink-0 fill-#FFF stroke-0.25 stroke-[#D9D9D9] mt-16.625">
                <div className="relative">
                  {preview
                    ? (
                      <div className={'relative w-243.3755 mr-10 b-1 b-solid b-#ccc '}>
                        {/* 标题输入框 */}
                        <input
                          type="text"
                          value={title}
                          onChange={handleTitleChange}
                          placeholder="在这里输入标题"
                          maxLength={64}
                          className="outline-none  mt-7.5 pl-10"
                          v-mode="title"
                        />
                        {/* 富文本编辑器 */}
                        <Editor
                          defaultConfig={editorConfig}
                          onCreated={setEditor}
                          onChange={editor => setHtml(editor.getHtml())}
                          mode="default"
                          v-model="html"
                          style={{ height: '500px', overflowY: 'hidden' }}
                          className="  shrink-0 fill-#FFF stroke-0.25 stroke-[#D9D9D9] mt-5 p-l-10"
                        />
                      </div>
                    )
                    : (
                      <div className={'relative w-335 b-1 b-solid b-#ccc '}>
                        {/* 标题输入框 */}
                        <input
                          type="text"
                          value={title}
                          onChange={handleTitleChange}
                          placeholder="在这里输入标题"
                          maxLength={64}
                          className="outline-none  mt-7.5 pl-10"
                        />
                        {/* 富文本编辑器 */}
                        <Editor
                          defaultConfig={editorConfig}
                          onCreated={setEditor}
                          onChange={editor => setHtml(editor.getHtml())}
                          mode="default"
                          v-model="html"
                          style={{ height: '500px', overflowY: 'hidden' }}
                          className="  shrink-0 fill-#FFF stroke-0.25 stroke-[#D9D9D9] mt-5 p-l-10"
                        />
                      </div>
                    )
                  }
                  {preview && (
                    <div className="absolute top-0 right--89 h-full w-93 bg-white">
                      <Preview html={html} title={title} tags={tags} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );

}

export default MyEditor;
