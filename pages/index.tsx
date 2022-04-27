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

    padding: 24px;
`

const SeekBarLayout = styled.div`
    display: flex;
    align-items: center;
`

const CircleButton = styled.button`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    font-size: 28px;
    font-weight: bold;
    background-color: #ffffff;
    border: 1px solid #868e96;
    cursor: pointer;

    &:hover {
        background-color: #adb5bd;
    }
    &:active {
        background-color: #495057;
        color: #ffffff;
    }
`

const SeekBar = styled.div`
    flex: 1;
    background-color: #343a40;
    height: 5.5px;
    margin-left: 16px;
    margin-right: 16px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
`

const Seeker = styled.span`
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #ffffff;
    z-index: 50;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`

const Home: NextPage = () => {
    const audioRef = useRef<HTMLAudioElement>(null)
    useEffect(() => {}, [])

    return (
        <Layout>
            <ToolBox>
                <SeekBarLayout>
                    <CircleButton>-</CircleButton>
                    <SeekBar>
                        <Seeker />
                    </SeekBar>
                    <CircleButton style={{ marginLeft: 'auto' }}>
                        +
                    </CircleButton>
                </SeekBarLayout>
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
