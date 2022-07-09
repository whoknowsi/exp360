import { CreateSky } from "./ChangeSkyCreation.js"
import { ChangeTargetEditRaycaster } from "../raycaster-listener.js"
import { EditSky, FinishEdit } from "./ChangeSkyEdit.js"

let button = document.querySelector(".skyPointButton")
let buttonEdit = document.querySelector(".skyEditPositionButton")

button.addEventListener("click", () => {
    ChangeTargetEditRaycaster(".structureTarget")
    CreateSky()
})

buttonEdit.addEventListener("click", (evt) => {
    if(evt.target.innerText == "Finalizar edición") {
        evt.target.textContent = "Editar viaje"
        FinishEdit()
        return
    }

    evt.target.textContent = "Finalizar edición"
    ChangeTargetEditRaycaster("null")
    let id = document.querySelector(".current").getAttribute("id")
    EditSky(id)
})