/* eslint-disable no-restricted-globals */
import React, {useLayoutEffect} from 'react';
import { toCanvas } from 'html-to-image';
import {rgbaToHsva} from '../../utils/convert';
import {HsvaColor, RgbaColor} from '../../types';

interface Props {
  rootElement?: HTMLElement;
  useScreenCaptureAPI: boolean;
  onChange: (color: HsvaColor) => void;
}

const EyeDropper = (props: Props) => {
  useLayoutEffect(() => () => {
    removeEventListener()
  }, []);

  const removeEventListener = () => {
    const tempCanvas = document.querySelector('#temp-canvas') as HTMLCanvasElement;
    if (tempCanvas) {
      tempCanvas.removeEventListener('click', eyeDropper, false)
    }
  }

  const getCanvasPixelColor = (canvas: HTMLCanvasElement, x: number, y: number) => {
    const ctx = canvas.getContext('2d');
    let pixel: RgbaColor = {r: 0, g: 0, b: 0, a: 1}

    if (ctx) {
      const imageData = ctx.getImageData(x, y, 1, 1).data;

      pixel.r = imageData[0]
      pixel.g = imageData[1]
      pixel.b = imageData[2]
      pixel.a = imageData[3]
    }

    return pixel
  }

  const eyeDropper = (event: MouseEvent) => {
    event.stopPropagation();
    const { clientX, clientY } = event;
    const realCanvas = document.querySelector('#temp-canvas') as HTMLCanvasElement;
    if (realCanvas) {
      const { r, g, b, a } = getCanvasPixelColor(realCanvas, clientX, clientY)
      props.onChange(rgbaToHsva({ r, g, b, a }))
      removeEventListener()
      realCanvas.remove()
    }
  }

  const handleEyeDropperClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const rootElement = props.rootElement || document.querySelector('body') as HTMLElement | HTMLBodyElement;
    let canvas;

    if (props.useScreenCaptureAPI) {
      canvas = await screenCapture()
      if (typeof canvas === 'string') {
        canvas = await toCanvas(rootElement)
      }
    } else {
      canvas = await toCanvas(rootElement)
    }
    canvas.id = 'temp-canvas'
    rootElement.insertBefore(canvas, rootElement.firstChild)

    const realCanvas = document.querySelector('#temp-canvas') as HTMLCanvasElement
    realCanvas.addEventListener('click', eyeDropper, false)
  }

  const screenCapture = async () => {
    const video = document.createElement('video')
    let mediaStream: MediaStream
    try {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({ audio: false, video: { width: screen.width, height: screen.height, frameRate: 1, cursor: 'never' } })
    } catch (error) {
      return error.message
    }

    const result = await new Promise((resolve, reject) => {
      video.onloadedmetadata = () => {
        video.play()
        video.pause()

        const canvas = document.createElement('canvas') ;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        }
        resolve(canvas)
      }
      video.srcObject = mediaStream
    })

    mediaStream.getTracks().forEach((track) => track.stop())

    return result
  }

    return (
      <div style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 2}} onClick={handleEyeDropperClick} />
    )
}

export default EyeDropper
