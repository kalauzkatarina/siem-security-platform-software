import { IoIosMenu } from "react-icons/io";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { BsCalendarFill } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";
import { LuLayers3 } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useState } from "react";

interface SidebarProps {
    setSideMenuPage: (page: number) => void;
}

export default function Sidebar({ setSideMenuPage }: SidebarProps) {

    const [isSidebarOpened, setIsSidebarOpened] = useState(false);

    // Inline styles for now, will be in CSS later

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
        border: 'none'//add hover when we move to css
    };

    const itemTextStyle: React.CSSProperties = {
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        backgroundColor: '#202020',
        color: 'white',
        padding: '8px 2px',
        border: 'none',
        width: '100%',
        cursor: 'pointer'
    };

    return (
        <div style={sidebarStyle}>
            <button style={menuButtonStyle} onClick={() => setIsSidebarOpened(!isSidebarOpened)}>
                <IoIosMenu size={30} />
            </button>

            {isSidebarOpened && (
                <div style={sidebarItemStyle}>
                    <button style={itemTextStyle} onClick={() => setSideMenuPage(0)}>
                        <TbLayoutDashboardFilled size={20} /> Dashboard <MdKeyboardArrowRight size={20} />
                    </button>

                    <button style={itemTextStyle} onClick={() => setSideMenuPage(1)}>
                        <BsCalendarFill size={20} /> Events <MdKeyboardArrowRight size={20} />
                    </button>

                    <button style={itemTextStyle} onClick={() => setSideMenuPage(2)}>
                        <VscGraph size={20} /> Statistics <MdKeyboardArrowRight size={20} />
                    </button>

                    <button style={itemTextStyle} onClick={() => setSideMenuPage(3)}>
                        <LuLayers3 size={20} /> Storage <MdKeyboardArrowRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );

}
