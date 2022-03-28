import React, { useRef, useEffect } from 'react'

const Canvas = props => {

    const { draw, getRef, ...rest } = props
    const canvasRef = useRef(null)
    useEffect(() => {

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId

        const render = () => {
            frameCount++
            draw(context, frameCount)
            if (typeof (getRef) == "function") {
                getRef(context)
            }
            // animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw, getRef])

    return <canvas ref={canvasRef} {...rest} />
}

export default Canvas