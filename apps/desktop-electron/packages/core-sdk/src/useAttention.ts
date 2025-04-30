// packages/core-sdk/src/useAttention.ts
import { RefObject, useEffect, useRef } from 'react'
import { FaceMesh, Results } from '@mediapipe/face_mesh'
import { Camera } from '@mediapipe/camera_utils'

export interface UseAttentionOptions {
  onLost: () => void
  onRestored?: () => void
  threshold?: { min: number; max: number }
}

export function useAttention(
  videoRef: RefObject<HTMLVideoElement>,   // 👈 sem “| null”
  opts: UseAttentionOptions
) {
  const { onLost, onRestored, threshold = { min: 0.25, max: 0.75 } } = opts

  const coolDown = useRef(false)
  const faceRef = useRef<FaceMesh | null>(null)
  const camRef  = useRef<Camera | null>(null)

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return                     // ainda não montou

    /* ---------- FaceMesh ---------- */
    const face = new FaceMesh({
      locateFile: f =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
    })
    face.setOptions({ maxNumFaces: 1, refineLandmarks: true })
    faceRef.current = face

    const gazeRatio = (
      lm: NonNullable<Results['multiFaceLandmarks']>[0],
      o: number,
      i: number,
      r: number
    ) => (lm[r].x - lm[o].x) / (lm[i].x - lm[o].x)

    face.onResults(res => {
      const lm = res.multiFaceLandmarks?.[0]
      if (!lm) return

      const left  = gazeRatio(lm, 33, 133, 468)
      const right = gazeRatio(lm, 263, 362, 473)

      const side =
        left  < threshold.min || left  > threshold.max ||
        right < threshold.min || right > threshold.max

      if (side && !coolDown.current) {
        onLost()
        coolDown.current = true
        setTimeout(() => (coolDown.current = false), 3_000)
      } else if (!side && onRestored) {
        onRestored()
      }
    })

    /* ---------- Câmera ---------- */
    const cam = new Camera(videoEl, {
      onFrame: async () => face.send({ image: videoEl }),
      width: 640,
      height: 480,
    })
    cam.start()
    camRef.current = cam

    /* ---------- Cleanup ---------- */
    return () => {
      cam.stop()
      face.close()
    }
  }, [
    videoRef.current,        // dispara quando o <video> passa a existir
    threshold.min,
    threshold.max,
    onLost,
    onRestored,
  ])
}
