/* eslint-disable jsx-a11y/media-has-caption */
import styled from '@emotion/styled'
import type { NextPage } from 'next'
import { useEffect, useRef } from 'react'

const Layout = styled.main`
    min-width: 100vw;
    min-height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;
`

const Home: NextPage = () => {
    const audioRef = useRef<HTMLAudioElement>(null)
    useEffect(() => {}, [])

    return (
        <Layout>
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
        </Layout>
    )
}

export default Home
