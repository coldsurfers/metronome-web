/* eslint-disable jsx-a11y/media-has-caption */
import styled from '@emotion/styled'
import type { NextPage } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react'

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

    display: flex;
    flex-direction: column;
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
    user-select: none;

    &:hover {
        background-color: #adb5bd;
    }
    &:active {
        background-color: #495057;
        color: #ffffff;
    }
`

const PlayButton = styled(CircleButton)`
    width: 180px;
    height: 180px;
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
`

const SeekBar = styled.div`
    flex: 1;
    background-color: #343a40;
    height: 3.5px;
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

const BpmMarker = styled.h1`
    font-weight: bold;
    font-size: 44px;
    width: 100%;
    text-align: center;
`

const MINIMUM_BPM = 20
const MAXIMUM_BPM = 240
const BEATS_PER_BAR = 4
const LOOK_AHEAD = 25
const SCHEDULE_AHEAD_TIME = 0.1

const Home: NextPage = () => {
    const seekerRef = useRef<HTMLSpanElement>(null)
    const seekBarRef = useRef<HTMLDivElement>(null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const currentBeatInBarRef = useRef<number>(0)
    const nextNoteTimeRef = useRef<number>(0)
    const audioContextRef = useRef<AudioContext | null>(null)

    const [isSeeking, setIsSeeking] = useState<boolean>(false)
    const [seekerLeftPercentage, setSeekerLeftPercentage] = useState<number>(50)
    const [bpm, setBpm] = useState<number>(
        MINIMUM_BPM + (seekerLeftPercentage / 100) * (MAXIMUM_BPM - MINIMUM_BPM)
    )
    const [isPlaying, setIsPlaying] = useState<boolean>(false)

    const onClickBpmPlus = useCallback(() => {
        const nextBpm = bpm + 1
        if (nextBpm > MAXIMUM_BPM) {
            return
        }
        setBpm(nextBpm)
        setSeekerLeftPercentage(
            ((nextBpm - MINIMUM_BPM) / (MAXIMUM_BPM - MINIMUM_BPM)) * 100
        )
    }, [bpm])
    const onClickBpmMinus = useCallback(() => {
        const nextBpm = bpm - 1
        if (nextBpm < MINIMUM_BPM) {
            return
        }
        setBpm(nextBpm)
        setSeekerLeftPercentage(
            ((nextBpm - MINIMUM_BPM) / (MAXIMUM_BPM - MINIMUM_BPM)) * 100
        )
    }, [bpm])

    const onClickPlay = useCallback(() => {
        setIsPlaying(true)

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext ||
                window.webkitAudioContext)()
        }
        nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.05

        intervalRef.current = setInterval(() => {
            if (!audioContextRef.current) return

            while (
                nextNoteTimeRef.current <
                audioContextRef.current.currentTime + SCHEDULE_AHEAD_TIME
            ) {
                const { current: audioContext } = audioContextRef
                const osc = audioContext.createOscillator()
                const envelope = audioContext.createGain()

                osc.frequency.value =
                    currentBeatInBarRef.current % BEATS_PER_BAR === 0
                        ? 1000
                        : 800
                envelope.gain.value = 1
                envelope.gain.exponentialRampToValueAtTime(
                    1,
                    nextNoteTimeRef.current + 0.001
                )
                envelope.gain.exponentialRampToValueAtTime(
                    0.001,
                    nextNoteTimeRef.current + 0.02
                )

                osc.connect(envelope)
                envelope.connect(audioContext.destination)

                osc.start(nextNoteTimeRef.current)
                osc.stop(nextNoteTimeRef.current + 0.03)

                const secondsPerBeat = 60 / bpm
                nextNoteTimeRef.current += secondsPerBeat

                if (currentBeatInBarRef.current + 1 === BEATS_PER_BAR) {
                    currentBeatInBarRef.current = 0
                } else {
                    currentBeatInBarRef.current += 1
                }
            }
        }, LOOK_AHEAD)
    }, [bpm])

    const onClickPause = useCallback(() => {
        setIsPlaying(false)
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [])
    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            if (seekBarRef.current?.contains(e.target as Node)) {
                setIsSeeking(true)
            }
        }
        const onMouseMove = (e: MouseEvent) => {
            if (isSeeking) {
                const { current: seekBarRefCurrent } = seekBarRef
                if (!seekBarRefCurrent) {
                    return
                }
                const { clientWidth, offsetLeft } = seekBarRefCurrent
                let percentage = ((e.clientX - offsetLeft) / clientWidth) * 100
                if (percentage < 0) {
                    percentage = 0
                }
                if (percentage > 100) {
                    percentage = 100
                }

                setSeekerLeftPercentage(percentage)
                setBpm(
                    MINIMUM_BPM +
                        (percentage / 100) * (MAXIMUM_BPM - MINIMUM_BPM)
                )
            }
        }
        const onMouseUp = () => {
            if (isSeeking) {
                setIsSeeking(false)
            }
        }
        document.addEventListener('mousedown', onMouseDown)
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)

        return () => {
            document.removeEventListener('mousedown', onMouseDown)
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }
    }, [isSeeking])

    return (
        <Layout>
            <ToolBox>
                <BpmMarker>{Math.ceil(bpm)}</BpmMarker>
                <SeekBarLayout>
                    <CircleButton onClick={onClickBpmMinus}>-</CircleButton>
                    <SeekBar ref={seekBarRef}>
                        <Seeker
                            ref={seekerRef}
                            style={{
                                left: `calc(${seekerLeftPercentage}% - (16px / 2))`,
                            }}
                        />
                    </SeekBar>
                    <CircleButton
                        onClick={onClickBpmPlus}
                        style={{ marginLeft: 'auto' }}
                    >
                        +
                    </CircleButton>
                </SeekBarLayout>
                <PlayButton onClick={isPlaying ? onClickPause : onClickPlay}>
                    {isPlaying ? 'Pause' : 'Play'}
                </PlayButton>
            </ToolBox>
        </Layout>
    )
}

export default Home
