import { createSwapy } from "swapy";
import { DiceGrid, DiceCrystal } from "@rpgm/utils";

const diceCanvas = document.getElementById("dice-canvas") as HTMLCanvasElement
const diceGrid = document.querySelector(".dice-grid") as HTMLElement
const diceDivs = document.querySelectorAll(".dice")
const diceCrystals: Record<string, DiceCrystal> = {}

const grid = new DiceGrid(diceCanvas, diceGrid)

for (let i = 0; i < diceDivs.length; i++) {
	const diceDiv = diceDivs[i] as HTMLDivElement
	const geo = DiceGrid.DICES[diceDiv.dataset.diceType ?? "d6"]
	const diceCrystal = grid.addDice(diceDiv, geo)
	diceDiv.addEventListener("mouseover", () => {
		diceCrystal.isHovered = true
	})
	diceDiv.addEventListener("mouseleave", () => {
		diceCrystal.isHovered = false
	})
	diceDiv.addEventListener("focus", () => {
		diceCrystal.isHovered = true
	})
	diceDiv.addEventListener("blur", () => {
		diceCrystal.isHovered = false
	})
	diceDiv.addEventListener("mouseup", () => {
		diceCrystal.isDragged = false
		diceCrystal.isHovered = false
	})
	diceDiv.addEventListener("touchend", () => {
		diceCrystal.isDragged = false
		diceCrystal.isHovered = false
	})
	if (diceDiv.dataset.swapyItem)
		diceCrystals[diceDiv.dataset.swapyItem] = diceCrystal
}

const swapy = createSwapy(diceGrid, {
})

swapy.onSwapStart((event) => {
	diceCrystals[event.draggingItem].isDragged = true
})
