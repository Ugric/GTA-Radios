import { ClassAttributes, ImgHTMLAttributes } from "react"

function RadioIcon(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>) {
    return <img className="radiobutton" { ...props } />
}

export default RadioIcon