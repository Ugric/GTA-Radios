import { useEffect, useRef, useState } from "react"

function useStateRef<t>(x: t): [React.MutableRefObject<t>, React.Dispatch<React.SetStateAction<t>>] {
    const [i, update] = useState(0)
    const [state, setstate] = useState(x)
    const ref = useRef(state)
    useEffect(() => {
        ref.current = state
        update(i + 1)
    }, [state])
    return [ref, setstate]
}

export default useStateRef