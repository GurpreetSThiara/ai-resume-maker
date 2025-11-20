"use client"

import { useEffect, useRef } from "react"

type Hotkey = {
	keys: string[]
	callback: (e?: KeyboardEvent) => void
	preventDefault?: boolean
}

// Named export expected by imports elsewhere in the app
export function useHotkeys(hotkeys: Hotkey[] = []) {
	const hotkeysRef = useRef(hotkeys)

	// keep latest reference
	useEffect(() => {
		hotkeysRef.current = hotkeys
	}, [hotkeys])

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			for (const hk of hotkeysRef.current) {
				let match = true

				for (const key of hk.keys) {
					const k = key.toLowerCase()

					if (k === "control" || k === "ctrl") {
						if (!e.ctrlKey) {
							match = false
							break
						}
					} else if (k === "shift") {
						if (!e.shiftKey) {
							match = false
							break
						}
					} else if (k === "alt" || k === "option") {
						if (!e.altKey) {
							match = false
							break
						}
					} else if (k === "meta" || k === "cmd" || k === "command") {
						if (!e.metaKey) {
							match = false
							break
						}
					} else {
						// compare non-modifier keys against e.key (case-insensitive)
						if (e.key.toLowerCase() !== k) {
							match = false
							break
						}
					}
				}

				if (match) {
					if (hk.preventDefault) {
						try {
							e.preventDefault()
						} catch (err) {
							// ignore
						}
					}

					try {
						hk.callback(e)
					} catch (err) {
						// swallow errors from user callbacks to avoid breaking global handler
						// but log for debugging
						// eslint-disable-next-line no-console
						console.error("useHotkeys callback error:", err)
					}
				}
			}
		}

		window.addEventListener("keydown", handler)
		return () => window.removeEventListener("keydown", handler)
	}, [])
}

