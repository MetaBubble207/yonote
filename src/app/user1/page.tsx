'use client'
import {useState} from 'react';

const SubscriptionManagement = () => {
    const [subscriptions, setSubscriptions] = useState([
        {id: 1, name: 'uiawhdgklhjakhghjifg...', description: '描述文本', checked: true, imgSrc: '/images/image1.png'},
        {
            id: 2,
            name: 'nextjs开发',
            description: 'Next.js 是一个流行的 React 框架',
            checked: true,
            imgSrc: '/images/image2.png'
        },
        {id: 3, name: '维派维客', description: '无数据', checked: false, imgSrc: '/images/image3.png'},
    ]);

    const handleCheckboxChange = (id) => {
        setSubscriptions(prevState =>
            prevState.map(subscription =>
                subscription.id === id ? {...subscription, checked: !subscription.checked} : subscription
            )
        );
    };

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">订阅管理</h1>
            <div className="flex justify-between mb-4">
                <button className="bg-teal-100 text-teal-700 px-4 py-2 rounded">专栏</button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded">小课</button>
                <button className="text-teal-700 px-4 py-2">管理</button>
            </div>
            <ul className="list-none p-0">
                {subscriptions.map(subscription => (
                    <li key={subscription.id} className="flex items-center mb-4">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={subscription.checked}
                                onChange={() => handleCheckboxChange(subscription.id)}
                                className="mr-2"
                            />
                            <img src={subscription.imgSrc} alt={subscription.name} className="w-12 h-12 rounded mr-4"/>
                            <div>
                                <h3 className="font-semibold">{subscription.name}</h3>
                                <p className="text-gray-500">{subscription.description}</p>
                            </div>
                        </label>
                    </li>
                ))}
            </ul>
            <div>
                <h2 className="text-lg font-bold">Selected Options:</h2>
                <ul>
                    {subscriptions.map(subscription => (
                        subscription.checked && <li key={subscription.id}>{subscription.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SubscriptionManagement;

