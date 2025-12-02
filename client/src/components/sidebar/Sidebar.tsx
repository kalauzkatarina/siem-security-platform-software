import { IoIosMenu } from "react-icons/io";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { BsCalendarFill } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";
import { LuLayers3 } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import { JSX, useState } from "react";

// npm install react-icons
// Inline styles for now, will be in CSS later
type PageType = "Dashboard" | "Events" | "Statistics" | "Storage"; //move in types folders later

interface SidebarProps {
  activePage: (value: PageType) => void; // setter koji prima samo validne stringove
}
export default function Sidebar({activePage}:SidebarProps) {

    const [isSidebarOpened, setIsSidebarOpened] = useState(false);
    const [hoveredButton, setHoveredButton] = useState<number | null>(null);
    const [selectButton, setSelectButton] = useState<number | null>(0);

    const buttons: { icon: JSX.Element; label: PageType }[]=[
        { icon: <TbLayoutDashboardFilled size={20} />, label: "Dashboard" },
        { icon: <BsCalendarFill size={20} />, label: "Events" },
        { icon: <VscGraph size={20} />, label: "Statistics" },
        { icon: <LuLayers3 size={20} />, label: "Storage" },
    ];
    
    const setSelectPage =(index:number)=>{
        setSelectButton(index);
       activePage(buttons[index].label);
    }

    const sidebarStyle: React.CSSProperties = {
        width: isSidebarOpened ? '200px' : '45px',
        color: 'white',
        padding: '16px 8px',
        height: '100%',
        backgroundColor: '#202020',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
    };

    const sidebarItemStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '20px'
    };

    const menuButtonStyle: React.CSSProperties = {
        fontSize: '14px',
        backgroundColor: '#202020',
        color: 'white',
        cursor: 'pointer',
        padding: '0px',
        border: 'none'
    };

    const itemTextStyle =(index:number):React.CSSProperties =>({
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        backgroundColor:selectButton===index? '#a1a1a1ff': hoveredButton===index ? '#a1a1a1ff' : '#202020',
        color: 'white',
        padding: '8px 2px',
        border: 'none',
        width: '100%',
        cursor: 'pointer'
    });

    return (
        <div style={sidebarStyle}>
            <button style={menuButtonStyle} onClick={() => setIsSidebarOpened(!isSidebarOpened)}>
                <IoIosMenu size={30} />
            </button>


            <div style={sidebarItemStyle}>
                {buttons.map((btn, index) => (
                    <button
                        key={index}
                        style={itemTextStyle(index)}
                        onClick={()=>setSelectPage(index)}
                        onMouseOver={() => setHoveredButton(index)}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        <div style={{ width: 20, height: 20 }}>{btn.icon}</div>  {isSidebarOpened && <span>{btn.label}</span>} <MdKeyboardArrowRight size={20} />
                    </button>
                ))}
            </div>
        </div>
    );
}
