/* eslint-disable jsx-a11y/media-has-caption */
import type { NextPage } from 'next'
import { useEffect, useRef } from 'react'

const Home: NextPage = () => {
    const audioRef = useRef<HTMLAudioElement>(null)
    useEffect(() => {}, [])

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    setInterval(() => {
                        audioRef.current?.play()
                    }, 1000)
                }}
            >
                Play
            </button>
            <audio ref={audioRef} src="/tick.mp3" />
        </>
    )
}

export default Home
