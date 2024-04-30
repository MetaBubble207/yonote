"use client"
import React from 'react';
import MyPagination from '@/app/_components/pagination/page';
import Image from "next/image";

const ArticleRow = ({ title, isTop, isFree, label, updatedAt, publishedAt }: { title: string, isTop: boolean, isFree: boolean, label: string, updatedAt: string, publishedAt: string }) => {
    const statusClassName = `px-2 py-1 rounded-full ${isTop ? 'bg-yellow-500' : 'bg-transparent'} ${isFree ? 'text-white bg-green-500' : 'text-gray-700 bg-gray-200'}`;

    const handleEdit = () => {
        // 编辑文章逻辑
    };

    const handleToggleTop = () => {
        // 切换置顶状态逻辑
    };

    const handleToggleFree = () => {
        // 切换免费状态逻辑
    };

    const handleDelete = () => {
        // 删除文章逻辑
    };

    const options = [
        { title: '文章内容标题', isTop: true, isFree: true, label: '免费 全部', updatedAt: '2017-10-31 23:12:00', publishedAt: '2017-10-31 23:12:00' },
        { title: '标题1', isTop: true, isFree: false, label: '全部', updatedAt: '2017-10-31 23:12:00', publishedAt: '2017-10-31 23:12:00' },
        { title: '标题2', isTop: false, isFree: true, label: '免费', updatedAt: '2017-10-31 23:12:00', publishedAt: '2017-10-31 23:12:00' },
        { title: '标题3', isTop: false, isFree: true, label: '全部', updatedAt: '2017-10-31 23:12:00', publishedAt: '2017-10-31 23:12:00' },
    ];

    // 表格内容
    return (
        <div className={'w-full h-full mt-16px ml-18px'}>
            <div className={'w-97% h-90% shrink-0 border-rd-[0px_0px_10px_10px] bg-[#FFF] relative'}>
                <div className={'flex items-center pt-51px'}>
                    <div className="text-[#323232] text-4 font-not-italic font-700 lh-6 ml-32.5px">内容管理</div>
                    {/*发布*/}
                    <div className={'inline-block h-32px border-rd-1 bg-[rgba(69,225,184,0.20)] text-[#1db48d] px-16px lh-32px ml-32px'}>+ 发布</div>
                </div>
                <div className={'flex ml-32.5px mt-30px'}>
                   <div>
                       <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>内容标题: </label>
                       <input
                           className=' ml-4 w-56 h-8 pl-3.045 shrink-0 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] lh-8'
                           type="text" placeholder="搜索标题"/>
                   </div>

                    <div className={'ml-32px'}>
                        <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>标签: </label>
                        <input
                            className=' ml-4 w-56 h-8 pl-3.045 shrink-0 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] lh-8'
                            type="text" placeholder="不限"/>
                    </div>
                </div>

                {/*表格*/}
                <table className="w-94% mt-22px mx-35px pl-63px ">
                    <thead className={' border-rd-1 bg-[#FAFAFA]'}>
                    <tr className={'h-54px '}>
                        <th className="px-4 pl-63px pr-2 text-left text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">内容标题</th>
                        <th className="px-4 py-2 text-left text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">
                            <div className={'flex items-center '}>
                                <span>状态</span>
                                <span className={'ml-8px'}>
                                    <Image src={"/images/writer/management/state.png"} alt={"状态图标"} width={10} height={10}/>
                                </span>
                            </div>
                        </th>
                        <th className="px-4 py-2 text-left text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">
                            <div className={'flex items-center '}>
                                <span>标签</span>
                                <span className={'ml-8px'}>
                                    <Image src={"/images/writer/management/sort.png"} alt={"标签排序图标"} width={12} height={12}/>
                                </span>
                            </div>
                        </th>
                        <th className="px-4 py-2 text-left text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">
                            <div className={'flex items-center '}>
                                <span>更新时间</span>
                                <span className={'ml-8px'}>
                                    <Image src={"/images/writer/management/sort2.png"} alt={"更新时间排序图标"} width={12} height={12}/>
                                </span>
                            </div>
                        </th>
                        <th className="px-4 py-2 text-left text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">
                            <div className={'flex items-center '}>
                                <span>发布时间</span>
                                <span className={'ml-8px'}>
                                    <Image src={"/images/writer/management/sort2.png"} alt={"更新时间排序图标"} width={12} height={12}/>
                                </span>
                            </div>
                        </th>
                        <th className="px-4 py-2 text-left text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {options.map((option, index) => (
                        <tr key={index} className={'h-52px'}>
                            <td className="px-4 pl-63px pr-2 text-left text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5">{option.title}</td>
                            <td className={`px-4 py-2 text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5 ${option.isTop ? 'text-[#1DB48D]' : ''} ${option.isFree ? 'text-[#1DB48D]' : ''}`}>{option.isTop ? '置顶' : ''} {option.isFree ? '免费' : ''}</td>
                            <td className="px-4 py-2 text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5">{option.label}</td>
                            <td className="px-4 py-2 text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5">{option.updatedAt}</td>
                            <td className="px-4 py-2 text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5">{option.publishedAt}</td>
                            <td className="px-4 py-2">
                                <button className="mr-2 text-[#1DB48D] text-3.5 font-not-italic font-400 lh-5.5" onClick={handleEdit}>编辑</button>
                                <button className="mr-2 text-[#1DB48D] text-3.5 font-not-italic font-400 lh-5.5" onClick={handleToggleTop}>{option.isTop ? '取消置顶' : '置顶'}</button>
                                <button className="mr-2 text-[#1DB48D] text-3.5 font-not-italic font-400 lh-5.5" onClick={handleToggleFree}>{option.isFree ? '取消免费' : '免费'}</button>
                                <button className={'mr-2 text-[#1DB48D] text-3.5 font-not-italic font-400 lh-5.5'} onClick={handleDelete}>删除</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/*底部分页*/}
                <div className={'absolute bottom-55px right-40px'}>
                    <MyPagination></MyPagination>
                </div>
            </div>
        </div>
    );
};

export default ArticleRow;
