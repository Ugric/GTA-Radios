import { useWindowSize } from '@react-hook/window-size';
import { LegacyRef, MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import Circleise from './Circleise';
import RadioIcon from './radio-icons';
import noradio from './icons/nrbi.png'
import tba from './icons/tbabi.png'
import rmp from './icons/rmpbi.png'
import lsrr from './icons/lsrrbi.png'
import nsp from './icons/nspbi.png'
import rl from './icons/rlbi.png'
import wwfm from './icons/wwfm.png'
import useStateRef from './stateRef';


function App() {
  const [width, height] = useWindowSize()
  const audio = useMemo(() => { const audio = new Audio(); audio.onpause = () => audio.play(); return audio }, [])
  const [showWheel, setShowWheel] = useStateRef(false)
  const buffersound = useMemo(() => { const audio = new Audio('/buffersound'); audio.loop = true; return audio }, [])
  const pausedmusic = useMemo(() => { const audio = new Audio('/pausedsound'); audio.loop = true; audio.onpause = () => audio.play(); return audio }, [])
  const [selected, setselected] = useStateRef(0)
  const [hovering, sethovering] = useState<null | number>(null)
  const hoveringOrSelected = [selected.current, hovering]
  const iconsize = Math.min(75, width / 15, height / 15)
  const videoref = useRef<any>()
  const radioStations = [
    {
      name: 'No Radio',
      id: 'none',
      icon: noradio,
      props: {
        onClick: () => {
          if (selected.current !== 0) {
            buffersound.pause()
            videoref.current.muted = false
            pausedmusic.currentTime = 0
            pausedmusic.play()
            audio.removeAttribute('src')
            audio.load()
            setselected(0)
          }
        },
        onMouseEnter: () => {
          sethovering(0)
        },

        onMouseLeave: () => {
          sethovering(null)
        }
      }
    },
    {
      name: 'The Blue Ark',
      id: 'tba',
      icon: tba
    },
    {
      name: 'WorldWide FM',
      id: 'wwfm',
      icon: wwfm
    },
    {
      name: 'The Low Down 91.1',
      id: 'tld',
      icon: noradio
    },
    {
      name: 'Radio Mirror Park',
      id: 'rmp',
      icon: rmp
    },
    {
      name: 'Space 103.2',
      id: 's',
      icon: noradio
    },
    {
      name: 'Vinewood Boulevard Radio',
      id: 'vwbr',
      icon: noradio
    },
    {
      name: 'Los Santos Underground Radio',
      id: 'lsur',
      icon: noradio
    },
    {
      name: 'iFruit Radio',
      id: 'ifr',
      icon: noradio
    },
    {
      name: 'Los Santos Rock Radio',
      id: 'lsrr',
      icon: lsrr
    },
    {
      name: 'Non Stop Pop',
      id: 'nsp',
      icon: nsp
    },
    {
      name: 'Radio Los Santos',
      id: 'rl',
      icon: rl
    },
    {
      name: 'Channel X',
      id: 'cx',
      icon: noradio
    },
    {
      name: 'West Coast Talk Radio',
      id: 'wctr',
      icon: noradio
    },
    {
      name: 'Rebel Radio',
      id: 'rr',
      icon: noradio
    },
    {
      name: 'Soulwax FM',
      id: 'swfm',
      icon: noradio
    },
    {
      name: 'East Los FM',
      id: 'elfm',
      icon: noradio
    },
    {
      name: 'West Coast Classics',
      id: 'wcc',
      icon: noradio
    },
  ]
  useEffect(() => {
    return () => {
      audio.removeAttribute('src')
      audio.load()
      buffersound.removeAttribute('src')
      buffersound.load()
      pausedmusic.removeAttribute('src')
      pausedmusic.load()
    }
  }, [audio, buffersound])
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() == 'Q') {
        setShowWheel(true)
      }
    }
    document.addEventListener('keydown', keydown)
    const keyup = (e: KeyboardEvent) => {
      if (showWheel.current && e.key.toUpperCase() == 'Q') {
        setShowWheel(false)
      }
    }
    document.addEventListener('keyup', keyup)
    const click = (e: MouseEvent) => {
      if ((!selected.current && pausedmusic.paused)) {
        pausedmusic.currentTime = 0
        videoref.current.muted = false
        pausedmusic.play()

      }
      if (videoref.current.paused) {
        videoref.current.play()
      }
    }

    document.addEventListener('click', click)

    let timeout: NodeJS.Timeout;

    const mousedown = () => timeout = setTimeout(() => {
      setShowWheel(!showWheel.current)
    }, 250);

    document.addEventListener('mousedown', mousedown)

    document.addEventListener('touchstart', mousedown)



    const mouseup = () => clearTimeout(timeout)

    document.addEventListener('mouseup', mouseup)

    document.addEventListener('touchend', mouseup)

    return () => {
      document.removeEventListener('keydown', keydown)
      document.removeEventListener('keyup', keyup)
      document.removeEventListener('click', click)
      document.removeEventListener('mousedown', mousedown)
      document.removeEventListener('mouseup', mouseup)

      document.removeEventListener('touchstart', mousedown)

      document.removeEventListener('touchend', mousedown)
    }
  }, [])

  useEffect(() => {
    if (videoref.current) {
      videoref.current.addEventListener('loadeddata', async function () {
        videoref.current.currentTime = ((new Date().getTime() - ((await (await fetch('/starttime')).json()) * 1000)) / 1000) % videoref.current.duration
      }, false);
      videoref.current.addEventListener('pause', async () => videoref.current.play())
      videoref.current.addEventListener('play', async () => {
        pausedmusic.currentTime = 0
        videoref.current.muted = false
        pausedmusic.play()

        videoref.current.currentTime = ((new Date().getTime() - ((await (await fetch('/starttime')).json()) * 1000)) / 1000) % videoref.current.duration

      })
    }
  }, [videoref])

  return (
    <>
      <div className='backgroundvideo'><video src='/backgroundvideo' ref={ videoref } muted loop autoPlay playsInline controls={ false } style={ {
        filter: showWheel.current ? 'blur(5px)' : undefined
      } }></video></div>
      <Circleise radius={ Math.min(250, width / 3.5, height / 3.5) }
        styles={ {
          display: showWheel.current ? 'block' : 'none',
          width: '100vw',
          height: '100vh'
        } }>
        { radioStations.map((radio, i) => <RadioIcon key={ radio.id } style={ { width: iconsize, height: iconsize, border: hoveringOrSelected.includes(i) ? `${selected.current === i ? 4 : 2}px solid rgb(0, 136, 255)` : undefined } } src={ radio.icon } onClick={ () => {
          if (selected.current !== i) {
            audio.src = '/radiostream/' + radio.id + '?' + Math.random()
            buffersound.currentTime = 0
            pausedmusic.pause()
            console.log(videoref.current.muted)
            buffersound.play()
            audio.onloadeddata = () => {
              buffersound.pause()
              audio.play()
              audio.oncanplaythrough = () => { }
            }
            setselected(i)
          }
        } }
          onMouseEnter={ () => {
            sethovering(i)
          } }

          onMouseLeave={ () => {
            sethovering(null)
          } } { ...radio.props }></RadioIcon>) }
      </Circleise></>
  );
}

export default App;
