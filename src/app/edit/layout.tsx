import React from "react";
import '../writer/writer.css';
import Compass from "../_components/writer/compass";

const dialogLayout=({children}:{children:React.ReactNode})=>{
    return(
        <html>
            <body>
                <div>
                    <Compass></Compass>
                    <div className="w-full h-full bg-[#45E1B8]" >                        
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}

export default dialogLayout;