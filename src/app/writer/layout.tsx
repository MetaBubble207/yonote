import React from "react";
import './writer.css';
import Compass from "@/app/writer/compass/page";
import LeftCompass from "@/app/writer/left-compass/page";

const dialogLayout=({children}:{children:React.ReactNode})=>{
    return(
        <html>
            <body>
                    <div className="w-100% min-h-screen bg-[#F6F6F6]" >
                        <Compass></Compass>
                        <div className="flex">
                            <LeftCompass></LeftCompass>
                            <div className="ml-64.77925 mt-17.5 mb-10">
                                {children}
                            </div>
                        </div>
                    </div>
            </body>
        </html>
    );
}

export default dialogLayout;
