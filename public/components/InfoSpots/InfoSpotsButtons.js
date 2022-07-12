import { StartListeningToCreateInfoSpot } from "./InfoSpot.js"
import { ChangeTargetEditRaycasterMouse } from "../raycaster-listener.js"
import { CancelCreation, SaveData } from "./InfoSpotCreation.js"

let infoSpotButton = document.querySelector(".infoSpotButton")
let saveButton = document.querySelector("#infoPanelSettingSave")
let cancelButton = document.querySelector("#infoPanelSettingCancel")

infoSpotButton.addEventListener("click", () => {
    ChangeTargetEditRaycasterMouse(".structure")
    StartListeningToCreateInfoSpot()
})


cancelButton.addEventListener("click", () => {
    CancelCreation()
})
saveButton.addEventListener("click", () => SaveData())
