"use client"
import React, {useState, useEffect, useRef, useCallback} from 'react';
import Image from 'next/image';
import {api} from '@/trpc/react';
import useLocalStorage from '@/tools/useStore';
import {Button} from 'antd';
import Loading from '@/app/_components/common/Loading';
import OSS from 'ali-oss';

let client = new OSS({
    region: 'oss-cn-shenzhen',
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
    accessKeySecret: process.env.NEXT_PUBLIC_ACCESS_KEY_SECRET,
    stsToken: process.env.NEXT_PUBLIC_STS_TOKEN,
    bucket: process.env.NEXT_PUBLIC_BUCKET
});
const UserMessage = () => {
    const [token] = useLocalStorage('token', null);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const {data: userInfo, isLoading} = api.users.getOne.useQuery({id: token});
    const [phone, setPhone] = useState(userInfo?.phone);
    const [name, setName] = useState(userInfo?.name);
    const fileInputRef = useRef(null);
    const phoneInputRef = useRef(null);
    const nameInputRef = useRef(null);

    const updateAvatarApi = api.users.updateAvatar.useMutation();
    const updatePhoneApi = api.users.updatePhone.useMutation();
    const updateNameApi = api.users.updateName.useMutation();

    const handleFileChange = useCallback(async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const result = await client.put(file.name, file);
                updateAvatarApi.mutate({id: token, avatar: result.url});
                userInfo.avatar = result.url;
            } catch (err) {
                console.error('Upload error:', err);
            }
        }
    }, [updateAvatarApi, userInfo, token]);

    const handlePhoneBlur = useCallback((event) => {
        const confirmed = window.confirm('是否保存修改的手机号码？');
        if (confirmed && validatePhoneNumber(phone)) {
            updatePhoneApi.mutate({id: token, phone});
            userInfo.phone = phone;
        }
        setIsEditingPhone(false);
    }, [phone, updatePhoneApi, userInfo, token]);

    const validatePhoneNumber = (phone) => /^\d{1,11}$/.test(phone);

    const handleNameBlur = useCallback((event) => {
        const confirmed = window.confirm('是否保存修改的姓名？');
        if (confirmed) {
            updateNameApi.mutate({id: token, name});
            userInfo.name = name;
        }
        setIsEditingName(false);
    }, [name, updateNameApi, userInfo, token]);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        if (isEditingPhone && phoneInputRef.current) {
            phoneInputRef.current.focus();
        }
        if (isEditingName && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [isEditingPhone, isEditingName]);

    if (isLoading) return <Loading/>;

    return (
        <div>
            <Image src={userInfo?.avatar || "/image/user/Loading.svg"} alt="头像" width={64} height={64}
                   className={'rounded-full mx-auto mt-5'}
            />
            <Button type={'primary'} className={"h-6 flex items-center rounded-4 mx-auto mt-2"}>
                <Image src={"/images/user/Edit.svg"} alt={"头像"} width={10} height={10}/>
                <div className="w-10 ml-1.25 text-#252525 text-2.5 font-500 lh-6" onClick={handleButtonClick}>
                    修改头像
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                />
            </Button>

            <div className={'ml-4 mt-7 text-[#252525] text-3.5 font-500 lh-6 space-y-6'}>
                {/* 用户名和用户ID展示 */}
                <div className="flex items-center">
                    <p>用户名</p>
                    <div className="flex items-center pl-13">
                        {isEditingName ? (
                            <input
                                type="text"
                                className="w-full pl-[15px] text-3.5 font-400"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={handleNameBlur}
                                ref={nameInputRef}
                            />
                        ) : (
                            <>
                                <span>{userInfo.name}</span>
                                <Button
                                    type="text"
                                    className=" text-[#252525] text-2.5 font-500 text-right"
                                    onClick={() => setIsEditingName(true)}
                                >
                                    <Image className={"ml-44"} src={"/images/user/RightArrow.svg"} alt={"RightArrow"}
                                           width={12} height={12}/>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center">
                    <p>用户ID</p>
                    <span className="pl-13">{userInfo.idNumber}</span>
                </div>
                {/* 手机号展示和修改 */}
                <div className="flex items-center">
                    <p>手机号</p>
                    <div className="flex items-center pl-13">
                        {isEditingPhone ? (
                            <input
                                type="text"
                                className="w-full pl-[15px] text-3.5 font-400"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onBlur={handlePhoneBlur}
                                ref={phoneInputRef}
                            />
                        ) : (
                            <>
                                <span>{userInfo.phone}</span>
                                <Button
                                    type="text"
                                    className=" text-[#252525] text-2.5 font-500"
                                    onClick={() => setIsEditingPhone(true)}
                                >
                                    <Image className={"ml-30"} src={"/images/user/RightArrow.svg"} alt={"RightArrow"}
                                           width={12} height={12}/>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserMessage;