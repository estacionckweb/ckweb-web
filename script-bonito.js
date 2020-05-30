var btn_menu = document.getElementById('menu_open')

btn_menu.addEventListener('click', e => {
    var abierto = $('#menu_open').hasClass('active')
    var bloque = document.getElementById('bloque_menu')

    if (abierto) {
        bloque.classList.remove('active')
        $('#menu_open').removeClass('active')
    } else {
        bloque.classList.add('active')
        $('#menu_open').addClass('active')
    }

})