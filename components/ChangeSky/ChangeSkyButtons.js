import { CreateSky, EditSky } from "./ChangeSkyCreation.js"

let button = document.querySelector(".skyPointButton")
let buttonEdit = document.querySelector(".skyEditPositionButton")

button.addEventListener("click", () => {
    CreateSky()
})

buttonEdit.addEventListener("click", () => {
    EditSky()
})