import {ChangeMap} from './helper.js'
let windowOpen = document.querySelector('#windowOpen')
let windowClose = document.querySelector('#windowClose')
let containerModal = document.querySelector('#containerModal')
let imag360 = document.querySelector("#imag360");
let socialNetworks = document.querySelector('.socialNetworks')
let iconsSocial = document.querySelector('.iconsSocial')
let googlemaps = document.querySelector('.googlemaps')
let maps = document.querySelector('.maps')

//ventana modal
windowOpen.addEventListener('click', () => {
    containerModal.classList.add("openModal")
})

windowClose.addEventListener('click', () => {
    containerModal.classList.remove("openModal")
})


let livingImg = document.querySelector('#livingImg')
let cavaImg = document.querySelector('#cavaImg')

livingImg.addEventListener('click', () => {
    
    imag360.setAttribute("src", './img/casa1.jpg');
    containerModal.classList.remove("openModal")
    
    ChangeMap({
        img: '#living',
        sound: '#antino',
        scene: 'Living'
    })
})


cavaImg.addEventListener('click', () => {
    
    imag360.setAttribute("src", './img/casa2.jpg');
    containerModal.classList.remove("openModal")

    ChangeMap({
        img: '#cava',
        sound: '#piano',
        scene: 'Cava'
    })
})

//iconos de redes sociales

socialNetworks.addEventListener('click', () => {
    iconsSocial.classList.toggle("iconsSocialOpen")
})

//icono de google maps
googlemaps.addEventListener('click', () => {
    maps.classList.toggle("mapsOpen")
})