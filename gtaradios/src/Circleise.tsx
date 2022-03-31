import { useMemo } from "react";

const degsToRads = (deg: number) => (deg * Math.PI) / 180.0;

function Circleise({ children, radius,
    styles }: {
        children: Array<JSX.Element | string>;
        radius: number;
        styles?: React.CSSProperties;
    }) {
    const degPerVal = useMemo(() => 360 / children.length, [children.length])
    return <div style={ {
        ...styles,
        position: 'fixed'
    } }>
        { children.map((value, i) => <div key={ i } style={
            {
                position: 'absolute',
                left: `calc(50% + ${-Math.sin(degsToRads(degPerVal * i)) * radius
                    }px)`,
                top: `calc(50% + ${Math.cos(degsToRads(degPerVal * i)) * radius
                    }px)`,
                transform: 'translate(-50%, -50%)'
            }
        }>
            { value }
        </div>
        ) }
    </div>
}

export default Circleise