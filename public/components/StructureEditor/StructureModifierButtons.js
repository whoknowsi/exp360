import { ChangeTargetEditRaycasterMouse } from "../raycaster-listener.js"
import { StartRaycastingStructures } from "./StructureModifer.js"
let editStructureButton = document.querySelector(".structuresEditorButton")

editStructureButton.addEventListener("click", () => {
    ChangeTargetEditRaycasterMouse(".structure, .skyChanger, .positionModifierArrow")
    StartRaycastingStructures()
})

