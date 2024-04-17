import Image from "next/image"
const ManagementColumn = () => {
    return (
        <div className="w-85.75 h-20.471 bg-yellow m-auto border-rd-2.5 flex">
            <Image src={"/images/subscribe/cover.png"} width={100} height={100} alt={"cover"} className="w-11.375 h-15.478 ml-2.5 mt-2.5"></Image>
            <div className="ml-3 mt-3 flex-1">
                <h3 className="text-[#252525] text-3 font-500 lh-6">「显示不够的话开播的第3年，P人沉...」</h3>
                <h4 className="text-[#666] text-2.5 lh-[120%] mt-1">显示多少然后开始了...</h4>
            </div>
            <input type="checkbox" className="w-6 h-6 rounded-full border-gray-400 border-checked: border-white  checked:border-transparent checked:bg-green"></input>
        </div>
    )
}

export default ManagementColumn