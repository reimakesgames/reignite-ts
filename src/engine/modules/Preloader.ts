import Logger from "../debug/Logger"
import Settings from "../Settings"

let Log = new Logger("Preloader")

const AllowedImageFormats = ["jpg", "jpeg", "png"] as const
const AllowedAudioFormats = ["mp3", "ogg", "wav"] as const

type URL = string
type AllowedImageFormat = (typeof AllowedImageFormats)[number]
type AllowedAudioFormat = (typeof AllowedAudioFormats)[number]
type Asset = AllowedAudioFormat | AllowedImageFormat

function SpawnGreenThread<T>(func: () => T) {
	return new Promise<T>((resolve, reject) => {
		setTimeout(() => {
			try {
				resolve(func())
			} catch (e) {
				reject(e)
			}
		}, 0)
	})
}

function LoadAsset(url: URL) {
	let ext = url.split(".").pop() as Asset
	if (AllowedImageFormats.includes(ext as AllowedImageFormat)) {
		return new Promise<HTMLImageElement>((resolve, reject) => {
			let img = new Image()
			img.onload = () => resolve(img)
			img.onerror = () => reject()
			img.src = url
		})
	} else if (AllowedAudioFormats.includes(ext as AllowedAudioFormat)) {
		return new Promise<HTMLAudioElement>((resolve, reject) => {
			let audio = new Audio()
			audio.oncanplaythrough = () => resolve(audio)
			audio.onerror = () => reject()
			audio.src = url
		})
	} else {
		throw new Error(`Unsupported asset format: ${ext}`)
	}
}

function SanitizeAssetArray(array: URL[]) {
	// remove duplicates, and remove assets that are not supported while emitting a warning
	let sanitizedArray: URL[] = []
	for (let url of array) {
		let ext = url.split(".").pop() as Asset
		if (AllowedImageFormats.includes(ext as AllowedImageFormat)) {
			if (!sanitizedArray.includes(url)) {
				sanitizedArray.push(url)
			}
		} else if (AllowedAudioFormats.includes(ext as AllowedAudioFormat)) {
			if (!sanitizedArray.includes(url)) {
				sanitizedArray.push(url)
			}
		} else {
			Log.warn(`Unsupported asset format: ${ext}`)
		}
	}
	return sanitizedArray
}

/*
	Preloader
	Preloads assets prior to the game starting.
	Uses green threads to load assets in parallel.
	Shouldn't negatively impact performance, but will increase load times.
*/
class Preloader {
	public static Progress = 0
	public static Total = 0
	public static Active = true
	private static _activeThreads = 0
	public static PreloadAssets(array: URL[]) {
		array = SanitizeAssetArray(array)
		this.Active = false
		this.Progress = 0
		this.Total = array.length
		const unlimitedThreads = Settings.PRELOADER_THREADS == 0
		const threadsToSpawn = unlimitedThreads
			? array.length
			: Settings.PRELOADER_THREADS
		for (let i = 0; i < threadsToSpawn; i++) {
			if (!unlimitedThreads) {
				Log.warn(
					`Spawning thread ${
						i + 1
					} of ${threadsToSpawn} for preloading.`
				)
			}
			this._activeThreads++
			SpawnGreenThread(async () => {
				while (array.length > 0) {
					let url = array.pop() as URL
					try {
						await LoadAsset(url)
						Log.log(`Loaded asset ${url}`)
					} catch (e) {
						Log.error(`Failed to load asset ${url}. ${e}`)
					}
					this.Progress = this.Progress + 1
				}
				this._activeThreads--
				if (this._activeThreads == 0) {
					this.Active = true
					Log.log("Preloading complete.")
				}
			})
		}
	}
}

export default Preloader
