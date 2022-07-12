import { ChangeTargetEditRaycasterMouse } from "../raycaster-listener.js"
import { StartRaycastingStructures } from "./StructureModifer.js"
let button = document.querySelector(".structuresEditorButton")

button.addEventListener("click", () => {
    ChangeTargetEditRaycasterMouse(".structure, .skyChanger, .positionModifierArrow")
    StartRaycastingStructures()
})