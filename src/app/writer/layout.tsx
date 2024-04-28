import React from "react";
import './writer.css';
import Compass from "../_components/writer/compass";
import LeftCompass from "../_components/writer/left_compass";

const dialogLayout=({children}:{children:React.ReactNode})=>{
    return(
        <html>
            <body>
                    <div className="w-100% min-h-screen bg-[#F6F6F6]" >
                        <Compass></Compass>
                        <div className="flex w-full min-h-screen">
                            <LeftCompass></LeftCompass>
                            <div className="w-full h-80vh ml-64.77925 mt-17.5 mb-10">
                                {children}
                            </div>
                        </div>
                    </div>
            </body>
        </html>
    );
}

export default dialogLayout;
