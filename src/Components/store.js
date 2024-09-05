import { observable, action, computed, makeObservable } from "mobx"

export class Store {
	aspectRatio = 16 / 9
	win = {
		width: window.innerWidth,
		height: window.innerHeight,
	}

	constructor() {
		makeObservable(this, {
			aspectRatio: observable,
			win: observable,
			browser: computed,
			updateWin: action.bound,
			destroyWin: observable,
		})

		window.addEventListener("resize", this.updateWin)
	}

	get browser() {
		const width = this.win.width - 250
		const height = this.win.height

		return {
			width,
			height,
		}
	}

	updateWin() {
		this.win.width = window.innerWidth
		this.win.height = window.innerHeight
	}

	destroyWin() {
		window.removeEventListener("resize", this.updateWin)
	}
}

export const store = new Store()