"use client"
import Card from "@/app/_components/recommend/Card"
import Sort from "@/app/_components/recommend/Sort"

export const SpecialColumn = () => {
    return (
        <div>
            <div className="ml-4 mt-6">
                <Sort/>
            </div>

            <div className="mt-4 ml-4">
                <Card/>
            </div>

            <div className=" ml-4 mt-2">
                <Card/>
            </div>
        </div>
            
       
    );
}