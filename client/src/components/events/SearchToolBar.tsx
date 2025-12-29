import { SearchToolBarProps } from "../../types/props/events/SearchToolBarProps";

export function SearchToolBar({ value, onSearchText, value1, onEventType, value2, onDateTo, value3, onDateFrom, onSearchClick }: SearchToolBarProps) {

    return (
        <>
            <div className="flex flex-row items-end gap-[10px] ml-[10px] w-full pr-[20px]">
                
                <div className="flex flex-col gap-[4px] w-[40%]">
                    <label className="opacity-0 text-[14px]">Spacing</label>
                    <input
                        className="px-3 py-2 h-[40px] rounded-[10px] border border-[rgba(255,255,255,0.12)] bg-[rgba(0,0,0,0.3)] text-white text-[13px] outline-none w-full"
                        placeholder="Type..."
                        value={value}
                        onChange={(e) => onSearchText(e.target.value)}
                    />
                </div>

<<<<<<< HEAD
                <div className="flex flex-col gap-[4px] w-[15%]">
                    <label className="text-white text-[14px]">Type:</label>
=======
                {/* Type Select */}
                <div className="flex flex-col gap-[4px]">
                    <label className="text-[#a6a6a6] font-medium uppercase mb-[3px]! text-[13px]!">Type</label>
>>>>>>> 324d845ccbdcb6284398e580036eb34fff099c5e
                    <select
                        className="border border-[rgba(255,255,255,0.12)] bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white rounded-[10px] py-[4px] h-[40px] font-semibold outline-none w-full"
                        value={value1}
                        onChange={(e) => onEventType(e.target.value)}
                    >
                        <option value="all">All types</option>
                        <option value="info">Informations</option>
                        <option value="warning">Warnings</option>
                        <option value="error">Errors</option>
                    </select>
                </div>

<<<<<<< HEAD
                <div className="flex flex-col gap-[4px] w-[15%]">
                    <label className="text-white text-[14px]">Date from:</label>
=======
                {/* Date From */}
                <div className="flex flex-col gap-[4px]">
                    <label className="text-[#a6a6a6] font-medium uppercase mb-[3px]! text-[13px]!">Date from</label>
>>>>>>> 324d845ccbdcb6284398e580036eb34fff099c5e
                    <input
                        className="border border-[rgba(255,255,255,0.12)] bg-[#2d2d2d] text-white rounded-[10px] px-[8px] h-[40px] font-semibold outline-none w-full"
                        type="date"
                        value={value3}
                        onChange={(e) => onDateFrom(e.target.value)}
                    />
                </div>

<<<<<<< HEAD
                <div className="flex flex-col gap-[4px] w-[15%]">
                    <label className="text-white text-[14px]">Date to:</label>
=======
                {/* Date To */}
                <div className="flex flex-col gap-[4px]">
                    <label className="text-[#a6a6a6] font-medium uppercase mb-[3px]! text-[13px]!">Date to</label>
>>>>>>> 324d845ccbdcb6284398e580036eb34fff099c5e
                    <input
                        className="border border-[rgba(255,255,255,0.12)] bg-[#2d2d2d] text-white rounded-[10px] px-[8px] h-[40px] font-semibold outline-none w-full"
                        type="date"
                        value={value2}
                        onChange={(e) => onDateTo(e.target.value)}
                    />
                </div>

                <div className="w-[15%]">
                    <button
                        className="bg-[#007a55] text-white w-full rounded-[10px] h-[40px] font-semibold hover:bg-[#009166] transition-colors"
                        onClick={onSearchClick}
                    >
                        Search
                    </button>
                </div>

            </div>
        </>
    )
}