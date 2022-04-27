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

const ToolBox = styled.div`
    width: 680px;
    height: 450px;
    background-color: #f1f3f5;

    border-radius: 8px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
`

const Home: NextPage = () => {
    const audioRef = useRef<HTMLAudioElement>(null)
    useEffect(() => {}, [])

    return (
        <Layout>
            <ToolBox>
                {/* <button
                    type="button"
                    onClick={() => {
                        setInterval(() => {
                            audioRef.current?.play()
                        }, 1000)
                    }}
                >
                    Play
                </button> */}
            </ToolBox>
            <audio ref={audioRef} src="/tick.mp3" />
        </Layout>
    )
}

export default Home
