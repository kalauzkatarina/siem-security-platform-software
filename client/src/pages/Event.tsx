export default function Event() {

    const mainStyle: React.CSSProperties = {
        flex: 1,
        padding: '16px',
        //backgroundColor: 'white',
        backgroundColor: '#202020',
        height: '100%'
    };
    return (

        <div style={mainStyle}>
            <p>This is event content!</p>
            <p>This is event content!</p>
        </div>
    );
}