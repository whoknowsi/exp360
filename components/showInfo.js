AFRAME.registerComponent('show-info', {
    schema: {
        //lo que se desea cambiar
        image: {
            type: 'string'
        }
    },

    init: function () {
        let data = this.data;
        let el = this.el;
        let imgH = 3;
        let imgPos = 1;
        let titlePos = 2.75;
        let containerH = 6;
        let textPos = -1.7;
        let textH = 2.6;
        var color = this.color;
        var infoPanel = this.infoPanel = document.querySelector('#infoPanel')


        //icono de flecha en el menu de la cava
        let arrowCava = document.querySelectorAll('.arrowCava')
        
        //evento boton del menu cava
        var cavaButtons =document.querySelectorAll('.cavaButton')
        var buttons = this.buttons = [];
        
        for (let i = 0; i < cavaButtons.length; i++) {
            const el = cavaButtons[i];
            var button = {
                el: el,
                color: el.getAttribute("color")
            }
            buttons.push(button);
        }

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        for (let i = 0; i < cavaButtons.length; ++i) {
            cavaButtons[i].addEventListener('mouseenter', this.onMouseEnter);
            cavaButtons[i].addEventListener('mouseleave', this.onMouseLeave);
        }

        

        let info = [
            {
                title: 'Cocina',
                img: './img/organizadores.jpg',
                text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s rd dummy text ever since the 1500 s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but als.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry standard dummy text ever since the 1500.',
            },
            {
                title: 'Cabernet',
                img: './img/cabernet.jpg',
                text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s rd dummy text ever since the 1500 s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but als.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry standard dummy text ever since the 1500. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s rd dummy text ever since the 1500 s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but als.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry standard dummy text ever since the 1500.',
            },
            {
                title: 'Malbec',
                img: './img/malbec.jpg',
                text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s rd dummy text ever since the 1500 s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but als.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry standard dummy text ever since the 1500.',
            },
            {
                title: 'Pinot',
                img: './img/pinot.jpg',
                text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s rd dummy text ever since the 1500 s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but als.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry standard dummy text ever since the 1500.',
            },
            {
                title: 'Tipos de reservas',
                img: './img/wino.jpg',
                text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s rd dummy text ever since the 1500 s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but als.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry standard dummy text ever since the 1500.',
            }
        ]
        
        el.addEventListener('click', function (evt) {
            //panel que se despliega con el icono info
            
            //info del cartel 
            let title = document.querySelector('#title')
            let img = document.querySelector('#img')
            let text = document.querySelector('#text')
            let container = document.querySelector('#infoPanel')
            let currentTextH = textH;

            for (let u = 0; u < buttons.length; u++) {
                const element = buttons[u].el;
                if(evt.target === element)
                    if(evt.target.is("clicked"))
                        evt.target.setAttribute('material', 'color', button.color);
                    else {
                        evt.target.setAttribute('material', 'color', 'black')
                        evt.target.addState("clicked")
                    }
                        
                else if(evt.target.is("clicked"))
                    evt.target.removeState("clicked")
            }

            
            
            //ubicacion panel y contenido
            if (el.id === 'cabernet') {
                infoPanel.setAttribute('position', '1.5 2 7')
                infoPanel.setAttribute('rotation', '0 180 0')
                //info del cartel de cabertnet
                title.setAttribute('value', info[1].title)
                img.setAttribute('src', info[1].img)
                img.setAttribute("height", imgH*.7)
                text.setAttribute('value', info[1].text)
                currentTextH = 3.5;

            } else if (el.id === 'malbec') {
                infoPanel.setAttribute('position', '1.5 2 7')
                infoPanel.setAttribute('rotation', '0 180 0')
                //info del cartel de malbec
                title.setAttribute('value', info[2].title)
                img.setAttribute('src', info[2].img)
                img.setAttribute("height", imgH*.8)
                text.setAttribute('value', info[2].text)
                currentTextH = 2;

            } else if (el.id === 'pinot') {
                infoPanel.setAttribute('position', '1.5 2 7')
                infoPanel.setAttribute('rotation', '0 180 0')
                //info del cartel de pinot
                title.setAttribute('value', info[3].title)
                img.setAttribute('src', info[3].img)
                img.setAttribute("height", imgH*.8)
                text.setAttribute('value', info[3].text)
                currentTextH = 2;

            } else if (el.id === 'reserva') {
                infoPanel.setAttribute('position', '1.5 2 7')
                infoPanel.setAttribute('rotation', '0 180 0')
                //info del cartel de reserva
                title.setAttribute('value', info[4].title)
                img.setAttribute('src', info[4].img)
                img.setAttribute("height", imgH*.8)
                text.setAttribute('value', info[4].text)
                currentTextH = 2;

            } else if (el.id === 'kitchen') {
                infoPanel.setAttribute('position', '-5.5 2 2.5')
                infoPanel.setAttribute('rotation', '0 90 0')
                //info del cartel de cocina
                title.setAttribute('value', info[0].title)
                img.setAttribute('src', info[0].img)
                img.setAttribute("height", imgH*.6)
                text.setAttribute('value', info[0].text)
                currentTextH = 2;

            }

            //setear posicion y tamaño
            let currentImgH = img.getAttribute("height")
            
            let newContainerH = containerH - (imgH - currentImgH) - (textH - currentTextH)

            container.setAttribute("geometry", {
                height: newContainerH
            })
            
                    
            title.setAttribute("position", "-1.5 " + (titlePos - ((containerH - newContainerH))/2) + " 0")

            img.setAttribute("position", "0 " + ((imgPos - ((containerH - newContainerH))/2 + (imgH - currentImgH)/2)) + " 0.01")

            text.setAttribute("position", "0 " + ((textPos + ((containerH - newContainerH))/2 - (textH - currentTextH)/2)) + " 0")
            

            //cambio de boton actual con click
            if (infoPanel.getAttribute('current') === el.id || infoPanel.getAttribute('current') === 'null') {
                if (infoPanel.getAttribute('visible')) {

                    infoPanel.setAttribute('visible', 'false')
                    infoPanel.setAttribute('current', 'null')
                    

                    for (let i = 0; i < buttons.length; i++) {
                        const button = buttons[i];
                        button.el.setAttribute("material", "color", button.color)
                        //flechas del menu
                        arrowCava[i].setAttribute('visible', 'false')
                    }

                } else {
                    infoPanel.setAttribute('visible', 'true')
                    infoPanel.setAttribute('current', el.id)
                    
                    //flechas del menu
                    for (let i = 0; i < buttons.length; i++) {
                        const button = buttons[i];
                        if (button.el.id == infoPanel.getAttribute('current')) {
                            arrowCava[i].setAttribute('visible', 'true')
                            button.el.object3D.scale.set(1, 1, 1);
                        }
                    }
                }
            } else {
                
                for (let i = 0; i < buttons.length; i++) {
                    const button = buttons[i];
                    if(button.el.id == infoPanel.getAttribute('current')){
                        let currentButton = document.querySelector("#" + infoPanel.getAttribute('current'))
                        currentButton.setAttribute("material", "color", button.color)
                        //flechas del menu
                        arrowCava[i].setAttribute('visible', 'false')
                    }
                }
                infoPanel.setAttribute('current', el.id)
                //flechas del menu
                for (let i = 0; i < buttons.length; i++) {
                    const button = buttons[i];
                    if (button.el.id == infoPanel.getAttribute('current')) { 
                        arrowCava[i].setAttribute('visible', 'true')
                        button.el.object3D.scale.set(1, 1, 1);
                    }
                }
            }
            
        })

    },
    //cambio color de los botones del menu de la cava
    onMouseEnter: function (evt) {
            
        let infoPanel = this.infoPanel
        let buttons = this.buttons
        
        let current = infoPanel.getAttribute("current")
        for (let i = 0; i < buttons.length; ++i) {
            let button = buttons[i]
            if (evt.target === button.el) {
                if(current !== evt.target.id) {
                    evt.target.setAttribute('material', 'color', '#f6cb52');
                    evt.target.object3D.scale.set(1.2, 1.2, 1.2);
                }
            }
        }
        
    },

    onMouseLeave: function (evt) {
        let infoPanel = this.infoPanel
        let buttons = this.buttons
        let current = infoPanel.getAttribute("current")
        
        for (let i = 0; i < buttons.length; ++i) {
            let button = buttons[i]
            if (evt.target === button.el) {
                evt.target.object3D.scale.set(1, 1, 1);
                if(current !== evt.target.id)
                    evt.target.setAttribute('material', 'color', button.color);
            }
        }
    }
});