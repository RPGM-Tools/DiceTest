import DiceRenderer from "@/DiceRenderer.ts"
import emeraldTexture from "@/emerald.png"
import rubyTexture from "@/ruby.jpg"
import { createSwapy } from "swapy"

const diceList = document.querySelectorAll("canvas.dice")
const diceRenderers: Record<string, DiceRenderer> = {}
let selectedDice: DiceRenderer | null = null
let hasChanged: boolean = false

diceList.forEach((dice: Element, key: number) => {
	const diceCanvas = dice as HTMLCanvasElement
	diceCanvas.width = diceCanvas.offsetWidth * 2
	diceCanvas.height = diceCanvas.offsetHeight * 2
	const diceType = diceCanvas.dataset.diceType ?? "d6"
	const texture = (key % 2 === 0) ? emeraldTexture : rubyTexture
	if (diceCanvas.dataset.swapyItem)
		diceRenderers[diceCanvas.dataset.swapyItem] = new DiceRenderer(diceCanvas, diceType, texture)
})

const diceGrid = document.querySelector(".dice-grid")

const swapy = createSwapy(diceGrid as HTMLElement, {
	animation: "dynamic",
	swapMode: "hover"
})

diceList.forEach((dice) => {
	(dice as HTMLCanvasElement).addEventListener("mouseenter",
		event => {
			const diceCanvas = event.target as HTMLCanvasElement
			if (diceCanvas.dataset.swapyItem && !selectedDice) {
				diceRenderers[diceCanvas.dataset.swapyItem].StartHover()
			}
		});
	(dice as HTMLCanvasElement).addEventListener("mouseleave",
		event => {
			const diceCanvas = event.target as HTMLCanvasElement
			if (diceCanvas.dataset.swapyItem)
				diceRenderers[diceCanvas.dataset.swapyItem].StopHover()
		});
	(dice as HTMLCanvasElement).addEventListener("mouseup",
		() => {
			if (selectedDice) {
				if (hasChanged)
					selectedDice.StopDrag(true)
				else selectedDice.StartHover()
				selectedDice = null
			}
		});
	(dice as HTMLCanvasElement).addEventListener("touchend",
		() => {
			if (selectedDice) {
				if (hasChanged)
					selectedDice.StopDrag(true)
				else selectedDice.StopHover()
				selectedDice = null
			}
		});
})

swapy.onSwapStart((event) => {
	diceRenderers[event.draggingItem].StartDrag()
	selectedDice = diceRenderers[event.draggingItem]
	hasChanged = false
})

swapy.onSwapEnd((event) => {
	if (event.hasChanged) {
		hasChanged = true
	}
})
