$(function() {
    // registro

     if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            duration: 800,
        });
    } else {
        console.warn("AOS NO CARGÓ");
    }

    const $window = $(window);
    const $body = $('body');
    const $header = $('.header-principal');
    

    let loginModal = null;
    let usuarioLogueado = sessionStorage.getItem('usuario_logueado') === 'true';

    if (usuarioLogueado) {
        $('.accion-abrir-registro').text("WELCOME BACK");
    }

    const modalElement = document.getElementById('modalLogin');
    
    if (modalElement && typeof bootstrap !== 'undefined') {
        try {
            loginModal = new bootstrap.Modal(modalElement);
            
            if (!sessionStorage.getItem('popup_visto') && !usuarioLogueado) {
                setTimeout(function() {
                    if (!usuarioLogueado) {
                        loginModal.show();
                        sessionStorage.setItem('popup_visto', 'true');
                    }
                }, 2000);
            }

        } catch (e) {
            console.error("Error bootstrap modal:", e);
        }
    }

// HEADER comportamiento scroll + click + menú móvil
let headerClicked = false;

const $menuMovil = $('.navbar-menu');
const $iconoMenu = $('.navbar-menu-movil-icono');

function shrinkHeader() {
    headerClicked = true;
    $header.addClass('scrolled');
    $body.addClass('scrolled');
}

function abrirMenuMovil() {
    $menuMovil.addClass('menu-abierto');
    $iconoMenu.addClass('icono-activo');
    $body.addClass('no-scroll');
}

function cerrarMenuMovil() {
    $menuMovil.removeClass('menu-abierto');
    $iconoMenu.removeClass('icono-activo');
    $body.removeClass('no-scroll');
}
$('.navbar-menu .accion-abrir-registro').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    cerrarMenuMovil();

    if (loginModal) {
        setTimeout(function() {
            loginModal.show();
        }, 250);
    }
});

function toggleMenuMovil() {
    if ($menuMovil.hasClass('menu-abierto')) {
        cerrarMenuMovil();
    } else {
        abrirMenuMovil();
    }
}

if ($body.is('.page-datos, .page-diseñadores')) {
    shrinkHeader();
} else {
    $window.on('scroll', function() {
        if ($window.scrollTop() > 50 || headerClicked) {
            shrinkHeader();
        } else {
            $header.removeClass('scrolled');
            $body.removeClass('scrolled');
            cerrarMenuMovil();
        }
    });
}

/* click en header grande: lo minimiza */
$header.on('click', function(e) {
    if (!$header.hasClass('scrolled')) {
        e.preventDefault();
        e.stopPropagation();
        shrinkHeader();
    }
});

/* click en hamburguesa: abre/cierra menú */
$iconoMenu.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    if ($header.hasClass('scrolled')) {
        toggleMenuMovil();
    }
});
$('.navbar-logo').on('click', function(e) {
    if ($header.hasClass('scrolled') && $window.width() <= 768) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenuMovil();
    }
});

/* cerrar al clicar fuera de los tickets */
$menuMovil.on('click', function(e) {
    if (e.target === this) {
        cerrarMenuMovil();
    }
});

/* cerrar al clicar en un enlace */
$('.navbar-menu a').not('.accion-abrir-registro').on('click', function() {
    cerrarMenuMovil();
});

// cursor
    const $cursor = $('.cursor-outline');
    if($cursor.length) {
        $window.on('mousemove', function(e){
             $cursor.css({ top: e.clientY + 'px', left: e.clientX + 'px' });
        });
        $('a, button, input').on('mouseenter', ()=> $cursor.addClass('cursor-hover'))
                             .on('mouseleave', ()=> $cursor.removeClass('cursor-hover'));
    }
    
    $('#ano-actual').text(new Date().getFullYear());

    // sección 1.1
    // HERO BACKGROUND SLIDER
    const heroBgs = document.querySelectorAll('.hero-bg');

    if (heroBgs.length) {
        let heroIndex = 0;

        setInterval(function () {
            heroBgs[heroIndex].classList.remove('is-active');

            heroIndex = (heroIndex + 1) % heroBgs.length;

            heroBgs[heroIndex].classList.add('is-active');
        }, 2000);
    }

    // sección 1.2
    const $aboutArea = $('#about-me-area');
    const $aboutCards = $('.about-card');
    const $aboutOverlay = $('#about-overlay');
    const $aboutOverlayImg = $('#about-overlay-img');

    if ($aboutArea.length && $aboutCards.length) {
        function posicionarAleatorio($card) {
            const areaRect = $aboutArea[0].getBoundingClientRect();
            const cardRect = $card[0].getBoundingClientRect();
            const maxLeft = areaRect.width - cardRect.width;
            const maxTop = areaRect.height - cardRect.height;
            const left = Math.max(0, Math.random() * maxLeft);
            const top = Math.max(0, Math.random() * maxTop);
            $card.css({ left: left + 'px', top: top + 'px' });
        }

        $aboutCards.each(function () { posicionarAleatorio($(this)); });

        let isDragging = false;
        let activeCard = null;
        let offsetX = 0;
        let offsetY = 0;

        function getClientPos(e) {
            if (e.type && e.type.startsWith('touch')) {
                const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                return { x: touch.clientX, y: touch.clientY };
            }
            return { x: e.clientX, y: e.clientY };
        }

        function startDrag(e) {
            const $target = $(e.currentTarget);
            activeCard = $target;
            isDragging = false;
            const cardRect = $target[0].getBoundingClientRect();
            const pos = getClientPos(e);
            offsetX = pos.x - cardRect.left;
            offsetY = pos.y - cardRect.top;
            $(document).on('mousemove.aboutDrag touchmove.aboutDrag', onDrag)
                       .on('mouseup.aboutDrag touchend.aboutDrag touchcancel.aboutDrag', endDrag);
        }

        function onDrag(e) {
            if (!activeCard) return;
            const areaRect = $aboutArea[0].getBoundingClientRect();
            const cardRect = activeCard[0].getBoundingClientRect();
            const pos = getClientPos(e);
            let left = pos.x - offsetX - areaRect.left;
            let top = pos.y - offsetY - areaRect.top;
            const maxLeft = areaRect.width - cardRect.width;
            const maxTop = areaRect.height - cardRect.height;
            left = Math.min(Math.max(0, left), maxLeft);
            top = Math.min(Math.max(0, top), maxTop);
            activeCard.css({ left: left + 'px', top: top + 'px' });
            isDragging = true;
        }

        function endDrag(e) {
            $(document).off('.aboutDrag');
            if (!activeCard) return;
            const $clickedCard = activeCard;
            const fueArrastre = isDragging;
            activeCard = null;
            isDragging = false;
            if (!fueArrastre) { abrirOverlay($clickedCard); }
        }

        function abrirOverlay($card) {
            $aboutOverlay.addClass('is-visible');
            $body.addClass('no-scroll');
        }

        function cerrarOverlay() {
            $aboutOverlay.removeClass('is-visible');
            $body.removeClass('no-scroll');
        }

        $aboutCards.on('mousedown touchstart', startDrag);
        $aboutOverlay.on('click', function () {
            cerrarOverlay();
        });

    }

    const $backstageItems = $('.backstage-item');
    if ($backstageItems.length) {
        const clasesTamaño = ['backstage-item--tall', 'backstage-item--wide', 'backstage-item--big', ''];
        $backstageItems.each(function () {
            const randomIndex = Math.floor(Math.random() * clasesTamaño.length);
            const clase = clasesTamaño[randomIndex];
            if (clase) { $(this).addClass(clase); }
        });
    }

    if ($('.draggable-zone').length && $window.width() > 768) {
        
        let activeDragItem = null;
        let offset = { x: 0, y: 0 };
        
        const $ticket = $('#item-ticket');
        const $paper = $('#item-paper');

        $('.drag-item').on('mousedown', function(e) {
            activeDragItem = $(this);
            
            const position = activeDragItem.position();
            offset.x = e.pageX - position.left;
            offset.y = e.pageY - position.top;
            
            if (!activeDragItem.hasClass('post-it')) {
                $('.drag-item').not('.post-it').css('z-index', 5);
                activeDragItem.css('z-index', 10);
            } 
            
            activeDragItem.addClass('is-dragging');
            
            $(document).on('mousemove.deskDrag', moveItem);
            $(document).on('mouseup.deskDrag', stopItem);
        });

        function moveItem(e) {
            if (!activeDragItem) return;
            e.preventDefault(); 

            const $container = $('.draggable-zone');
            const containerWidth = $container.width();
            const containerHeight = $container.height();
            const itemWidth = activeDragItem.outerWidth();
            const itemHeight = activeDragItem.outerHeight();

            let newLeft = e.pageX - offset.x;
            let newTop = e.pageY - offset.y;

            if (newLeft < 0) newLeft = 0;
            if (newLeft + itemWidth > containerWidth) newLeft = containerWidth - itemWidth;
            if (newTop < 0) newTop = 0;
            if (newTop + itemHeight > containerHeight) newTop = containerHeight - itemHeight;
            if (!activeDragItem.hasClass('post-it')) {
                let $obstacle = null;
                if (activeDragItem.attr('id') === 'item-ticket') $obstacle = $paper;
                else if (activeDragItem.attr('id') === 'item-paper') $obstacle = $ticket;

                if ($obstacle) {
                    const proposedRect = {
                        left: newLeft,
                        right: newLeft + itemWidth,
                        top: newTop,
                        bottom: newTop + itemHeight
                    };

                    const obstaclePos = $obstacle.position();
                    const obstacleRect = {
                        left: obstaclePos.left,
                        right: obstaclePos.left + $obstacle.outerWidth(),
                        top: obstaclePos.top,
                        bottom: obstaclePos.top + $obstacle.outerHeight()
                    };

                    if (checkCollision(proposedRect, obstacleRect)) {
                        return; 
                    }
                }
            }

            activeDragItem.css({
                left: newLeft + 'px',
                top: newTop + 'px',
                right: 'auto'
            });
        }

        function stopItem() {
            if (activeDragItem) {
                activeDragItem.removeClass('is-dragging');
                activeDragItem = null;
            }
            $(document).off('.deskDrag');
        }

        function checkCollision(rect1, rect2) {
            const margin = 5; 
            return (rect1.left < rect2.right - margin &&
                    rect1.right > rect2.left + margin &&
                    rect1.top < rect2.bottom - margin &&
                    rect1.bottom > rect2.top + margin);
        }
    }

// sección diseñadores
const $designerTrack = $('.designer-track');

if ($designerTrack.length) {
    const $designerCards = $designerTrack.find('.designer-card');
    const $btnPrev = $('.designer-arrow--prev');
    const $btnNext = $('.designer-arrow--next');
    const $infoContent = $('#info-designer-content');
    const $nameEl = $('.designer-name');
    const $textEl = $('.designer-text');
    const $clothesline = $('.clothesline');

    const total = $designerCards.length;
    let currentIndex = 0;
    let timer;
    const AUTO_DELAY = 5000;

    function wrapIndex(index) {
        return (index + total) % total;
    }

    function animateRope() {
        $clothesline.removeClass('is-shifting');
        void $clothesline[0].offsetWidth;
        $clothesline.addClass('is-shifting');
    }

    function updateCarousel() {
        const rootStyles = getComputedStyle(document.documentElement);
        const VISIBLE = parseInt(rootStyles.getPropertyValue('--visible-cards').trim()) || 5;
        const CARD_WIDTH = 100 / VISIBLE;
        const translateX = 50 - (currentIndex * CARD_WIDTH + (CARD_WIDTH / 2));

        $designerTrack.css('transform', `translateX(${translateX}%)`);
        $designerCards.removeClass('is-center');

        $designerCards.removeClass('is-prev is-next');

        const $centerCard = $designerCards.eq(currentIndex);
        $centerCard.addClass('is-center');

        $designerCards.eq(wrapIndex(currentIndex - 1)).addClass('is-prev');
        $designerCards.eq(wrapIndex(currentIndex + 1)).addClass('is-next'); 

        $infoContent.stop(true, true).fadeOut(150, function() {
            $nameEl.text($centerCard.data('name') || '');
            $textEl.text($centerCard.data('description') || '');
            $(this).fadeIn(300);
        });

        animateRope();
    }

    function goNext() {
        currentIndex = wrapIndex(currentIndex + 1);
        updateCarousel();
    }

    function goPrev() {
        currentIndex = wrapIndex(currentIndex - 1);
        updateCarousel();
    }

    function goToIndex(index) {
        currentIndex = wrapIndex(index);
        updateCarousel();
        resetAutoplay();
    }

    function startAutoplay() {
        timer = setInterval(goNext, AUTO_DELAY);
    }

    function resetAutoplay() {
        clearInterval(timer);
        startAutoplay();
    }

    $btnNext.on('click', function() {
        goNext();
        resetAutoplay();
    });

    $btnPrev.on('click', function() {
        goPrev();
        resetAutoplay();
    });

    $designerCards.on('click', function() {
        const indexClicked = $(this).index();
        if (indexClicked !== currentIndex) {
            goToIndex(indexClicked);
        }
    });

    const $initialCard = $designerCards.eq(currentIndex);
    $nameEl.text($initialCard.data('name'));
    $textEl.text($initialCard.data('description'));

    updateCarousel();
    startAutoplay();

    $(window).on('resize', function() {
        setTimeout(updateCarousel, 300);
    });
}

    // sección reto
    const retos = [
        "Pick one item you don’t wear anymore and donate it today.",
        "Restyle one outfit using only clothes you already have.",
        "Don’t buy anything new today.",
        "Remove one unused item from your wardrobe.",
        "Wash one garment at a lower temperature.",
        "Turn an old t-shirt into something new.",
        "Check the label of one item and see where it was made.",
        "Swap one piece of clothing with a friend.",
        "Create one outfit from clothes you forgot you had."
    ];

    const retoElemento = document.getElementById("reto-dinamico");

    if (retoElemento) {
        const retoAleatorio = retos[Math.floor(Math.random() * retos.length)];
        retoElemento.textContent = retoAleatorio;
    }

// calendario
const grid = document.getElementById("calendarGrid");
const mesTexto = document.getElementById("mesActual");
const noteModal = document.getElementById("calendarNoteModal");
const noteDateTitle = document.getElementById("calendarNoteDate");
const fixedEventText = document.getElementById("calendarFixedEvent");
const userNoteTextarea = document.getElementById("calendarUserNote");
const guardarNotaBtn = document.getElementById("guardarNotaBtn");
const borrarNotaBtn = document.getElementById("borrarNotaBtn");
const cerrarNotaModal = document.getElementById("cerrarNotaModal");
const prevMesBtn = document.getElementById("prevMes");
const nextMesBtn = document.getElementById("nextMes");

if (grid && mesTexto && prevMesBtn && nextMesBtn) {
    const eventos = {
        "2026-04-24": "Fashion Revolution Day",
        "2026-04-22": "Earth Day",
        "2026-05-01": "Slow Fashion Awareness",
        "2026-06-05": "World Environment Day"
    };

    let fechaActual = new Date();
    let fechaSeleccionada = null;

    function obtenerNotasCalendario() {
        return JSON.parse(localStorage.getItem("calendarNotes")) || {};
    }

    function guardarNotasCalendario(notas) {
        localStorage.setItem("calendarNotes", JSON.stringify(notas));
    }

    function renderCalendario(fecha) {
        grid.innerHTML = "";

        const año = fecha.getFullYear();
        const mes = fecha.getMonth();

        let primerDia = new Date(año, mes, 1).getDay();
        primerDia = primerDia === 0 ? 6 : primerDia - 1;
        const diasMes = new Date(año, mes + 1, 0).getDate();

        const nombresMes = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        mesTexto.textContent = `${nombresMes[mes]} ${año}`;

        for (let i = 0; i < primerDia; i++) {
            grid.innerHTML += `<div class="calendar-empty"></div>`;
        }

        const notas = obtenerNotasCalendario();

        for (let d = 1; d <= diasMes; d++) {
            const fechaStr = `${año}-${String(mes + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

            const evento = eventos[fechaStr];
            const notaUsuario = notas[fechaStr];
            const tieneNota = !!notaUsuario;

            grid.innerHTML += `
                <div class="calendar-day ${tieneNota ? 'has-note' : ''}" data-fecha="${fechaStr}">
                    <div class="day-number">${d}</div>
                    ${evento ? `<div class="event">${evento}</div>` : ""}
                    ${notaUsuario ? `<div class="user-note-preview">${notaUsuario}</div>` : ""}
                </div>
            `;
        }
    }

    prevMesBtn.onclick = () => {
        fechaActual.setMonth(fechaActual.getMonth() - 1);
        renderCalendario(fechaActual);
    };

    nextMesBtn.onclick = () => {
        fechaActual.setMonth(fechaActual.getMonth() + 1);
        renderCalendario(fechaActual);
    };

    renderCalendario(fechaActual);

    if (noteModal && noteDateTitle && fixedEventText && userNoteTextarea && guardarNotaBtn && borrarNotaBtn && cerrarNotaModal) {
        grid.addEventListener("click", function(e) {
            const day = e.target.closest(".calendar-day");
            if (!day) return;

            fechaSeleccionada = day.dataset.fecha;

            const notas = obtenerNotasCalendario();
            const notaGuardada = notas[fechaSeleccionada] || "";
            const eventoFijo = eventos[fechaSeleccionada] || "";

            noteDateTitle.textContent = fechaSeleccionada;
            fixedEventText.textContent = eventoFijo ? `Evento: ${eventoFijo}` : "Sin evento destacado";
            userNoteTextarea.value = notaGuardada;

            noteModal.classList.add("is-open");
            document.body.classList.add("no-scroll");
        });

        guardarNotaBtn.addEventListener("click", function() {
            if (!fechaSeleccionada) return;

            const notas = obtenerNotasCalendario();
            const valor = userNoteTextarea.value.trim();

            if (valor) {
                notas[fechaSeleccionada] = valor;
            } else {
                delete notas[fechaSeleccionada];
            }

            guardarNotasCalendario(notas);
            noteModal.classList.remove("is-open");
            document.body.classList.remove("no-scroll");
            renderCalendario(fechaActual);
        });

        borrarNotaBtn.addEventListener("click", function() {
            if (!fechaSeleccionada) return;

            const notas = obtenerNotasCalendario();
            delete notas[fechaSeleccionada];
            guardarNotasCalendario(notas);

            userNoteTextarea.value = "";
            noteModal.classList.remove("is-open");
            document.body.classList.remove("no-scroll");
            renderCalendario(fechaActual);
        });

        cerrarNotaModal.addEventListener("click", function() {
            noteModal.classList.remove("is-open");
            document.body.classList.remove("no-scroll");
        });

        noteModal.addEventListener("click", function(e) {
            if (e.target === noteModal) {
                noteModal.classList.remove("is-open");
                document.body.classList.remove("no-scroll");
            }
        });
    }
}

        // MICROTREND
    const microtrendSection = document.querySelector('.microtrend-section');
    const microtrendModal = document.getElementById('microtrendModal');
    const microtrendModalTitle = document.getElementById('microtrendModalTitle');
    const microtrendModalText = document.getElementById('microtrendModalText');
    const microtrendModalClose = document.getElementById('microtrendModalClose');
    const microtrendItems = document.querySelectorAll('.microtrend-item');

    if (microtrendSection) {
        function updateMicrotrendState() {
            const frontBox = document.querySelector('.microtrend-box-front');
            if (!frontBox) return;

            const frontRect = frontBox.getBoundingClientRect();
            const triggerLine = window.innerHeight * 1.15;

            if (frontRect.bottom <= triggerLine && frontRect.top < window.innerHeight) {
                microtrendSection.classList.add('is-open');
            } else {
                microtrendSection.classList.remove('is-open');
            }
        }

        updateMicrotrendState();
        window.addEventListener('scroll', updateMicrotrendState);
        window.addEventListener('resize', updateMicrotrendState);

        microtrendItems.forEach((item) => {
            item.addEventListener('click', function () {
                const title = this.dataset.title || '';
                const text = this.dataset.text || '';

                microtrendModalTitle.textContent = title;
                microtrendModalText.textContent = text;
                microtrendModal.classList.add('is-open');
                document.body.classList.add('no-scroll');
            });
        });
    }

    if (microtrendModal && microtrendModalClose) {
        function closeMicrotrendModal() {
            microtrendModal.classList.remove('is-open');
            document.body.classList.remove('no-scroll');
        }

        microtrendModalClose.addEventListener('click', closeMicrotrendModal);

        microtrendModal.addEventListener('click', function (e) {
            if (e.target === microtrendModal) {
                closeMicrotrendModal();
            }
        });
    }
// CUESTIONARIO CONSUMIDORES
// CUESTIONARIO TIPO DE CONSUMIDOR
const quizBtn = document.getElementById("consumerQuizBtn");
const quizModal = document.getElementById("consumerQuizModal");
const quizClose = document.getElementById("consumerQuizClose");
const quizContent = document.getElementById("consumerQuizContent");
const quizNext = document.getElementById("consumerQuizNext");
const quizRestart = document.getElementById("consumerQuizRestart");
const quizProgress = document.getElementById("consumerQuizProgress");
const quizTitle = document.getElementById("consumerQuizTitle");

if (quizBtn && quizModal && quizContent && quizNext && quizRestart) {
    const quizQuestions = [
        {
            question: "Cuando compras ropa, ¿qué pesa más en tu decisión?",
            answers: [
                { text: "Que sea barata y llegue rápido.", type: "impulse" },
                { text: "Que encaje con lo que veo en redes o tendencias.", type: "trend" },
                { text: "Que sea una prenda diferente, con historia o de segunda mano.", type: "curator" },
                { text: "Que sea duradera, ética o de bajo impacto.", type: "conscious" },
                { text: "Que realmente la necesite y combine con lo que ya tengo.", type: "minimal" }
            ]
        },
        {
            question: "Si ves una microtendencia viral, ¿qué haces?",
            answers: [
                { text: "La compro antes de que pase de moda.", type: "trend" },
                { text: "Busco una versión barata.", type: "impulse" },
                { text: "La busco vintage, customizada o de segunda mano.", type: "curator" },
                { text: "Investigo si merece la pena y quién la produce.", type: "conscious" },
                { text: "La dejo pasar si no encaja con mi estilo real.", type: "minimal" }
            ]
        },
        {
            question: "¿Qué pasa con la ropa que ya no usas?",
            answers: [
                { text: "Se queda en el armario bastante tiempo.", type: "impulse" },
                { text: "La cambio rápido para hacer sitio a cosas nuevas.", type: "trend" },
                { text: "La vendo, intercambio o busco darle otra vida.", type: "curator" },
                { text: "La reparo, dono o reciclo de forma consciente.", type: "conscious" },
                { text: "Intento no acumular prendas que no uso.", type: "minimal" }
            ]
        },
        {
            question: "¿Cómo describirías tu armario?",
            answers: [
                { text: "Lleno, pero muchas veces siento que no tengo nada que ponerme.", type: "impulse" },
                { text: "Cambia mucho según la temporada y lo que se lleva.", type: "trend" },
                { text: "Mezcla prendas antiguas, especiales y hallazgos únicos.", type: "curator" },
                { text: "Tiene prendas elegidas por calidad, origen o materiales.", type: "conscious" },
                { text: "Reducido, funcional y bastante pensado.", type: "minimal" }
            ]
        },
        {
            question: "Antes de comprar una prenda nueva, normalmente...",
            answers: [
                { text: "La compro si me gusta en el momento.", type: "impulse" },
                { text: "Pienso si la he visto mucho y si está en tendencia.", type: "trend" },
                { text: "Miro si puedo encontrar algo parecido de segunda mano.", type: "curator" },
                { text: "Reviso materiales, marca, durabilidad y condiciones.", type: "conscious" },
                { text: "Me pregunto si la usaré al menos muchas veces.", type: "minimal" }
            ]
        }
    ];

    const quizResults = {
        impulse: {
            title: "The Loop Buyer",
            text: "Tu consumo está muy atravesado por la inmediatez: precio, rapidez y deseo del momento. No significa que no te importe el impacto, pero muchas decisiones nacen del impulso y del sistema de compra constante que alimenta la moda rápida.",
            tag: "compra rápida / deseo inmediato"
        },
        trend: {
            title: "The Microtrend Chaser",
            text: "Tu armario dialoga directamente con redes, estética viral y tendencias pasajeras. Te interesa expresarte, pero corres el riesgo de comprar prendas que pierden valor para ti cuando desaparece la tendencia.",
            tag: "tendencia / viralidad / rotación"
        },
        curator: {
            title: "The Second-Hand Curator",
            text: "Buscas diferenciarte y dar valor a prendas que ya existen. La segunda mano, el intercambio o la customización forman parte de tu manera de consumir, aunque el reto está en que lo circular no se convierta también en sobreconsumo.",
            tag: "segunda mano / identidad / hallazgo"
        },
        conscious: {
            title: "The Conscious Researcher",
            text: "Antes de comprar, sueles investigar. Te interesan la durabilidad, los materiales, la ética y el impacto ambiental. Tu consumo es más lento y reflexivo, aunque puede requerir más tiempo y acceso a información clara.",
            tag: "impacto / ética / trazabilidad"
        },
        minimal: {
            title: "The Wardrobe Editor",
            text: "Tu relación con la moda se basa en editar, reducir y aprovechar. No compras tanto por novedad, sino por coherencia con tu estilo y uso real. Tu armario funciona como una selección, no como acumulación.",
            tag: "menos prendas / más uso / criterio"
        }
    };

    let currentQuestion = 0;
    let selectedAnswer = null;
    let scores = {
        impulse: 0,
        trend: 0,
        curator: 0,
        conscious: 0,
        minimal: 0
    };

    function openQuiz() {
        resetQuiz();
        quizModal.classList.add("is-open");
        document.body.classList.add("no-scroll");
    }

    function closeQuiz() {
        quizModal.classList.remove("is-open");
        document.body.classList.remove("no-scroll");
    }

    function resetQuiz() {
        currentQuestion = 0;
        selectedAnswer = null;
        scores = {
            impulse: 0,
            trend: 0,
            curator: 0,
            conscious: 0,
            minimal: 0
        };

        quizTitle.textContent = "¿Qué tipo de consumidor de moda eres?";
        quizNext.style.display = "inline-block";
        quizRestart.style.display = "none";
        renderQuestion();
    }

    function renderQuestion() {
        selectedAnswer = null;
        const q = quizQuestions[currentQuestion];

        quizContent.innerHTML = `
            <p class="consumer-question">${q.question}</p>
            <div class="consumer-options">
                ${q.answers.map((answer, index) => `
                    <label class="consumer-option">
                        <input type="radio" name="consumerAnswer" value="${answer.type}" data-index="${index}">
                        ${answer.text}
                    </label>
                `).join("")}
            </div>
        `;

        quizProgress.textContent = `QUESTION ${currentQuestion + 1} / ${quizQuestions.length}`;

        document.querySelectorAll(".consumer-option input").forEach(input => {
            input.addEventListener("change", function() {
                selectedAnswer = this.value;

                document.querySelectorAll(".consumer-option").forEach(label => {
                    label.classList.remove("is-selected");
                });

                this.closest(".consumer-option").classList.add("is-selected");
            });
        });
    }

    function showResult() {
        let winner = Object.keys(scores).reduce((a, b) => scores[a] >= scores[b] ? a : b);
        const result = quizResults[winner];

        quizTitle.textContent = "Resultado";
        quizContent.innerHTML = `
            <div class="consumer-result">
                <h3 class="consumer-result-title">${result.title}</h3>
                <p class="consumer-result-text">${result.text}</p>
                <span class="consumer-result-tag">${result.tag}</span>
            </div>
        `;

        quizProgress.textContent = "SEE YOU OUTSIDE THE LOOP";
        quizNext.style.display = "none";
        quizRestart.style.display = "inline-block";
    }

    quizNext.addEventListener("click", function() {
        if (!selectedAnswer) {
            quizProgress.textContent = "Choose one answer to keep going.";
            return;
        }

        scores[selectedAnswer]++;

        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            renderQuestion();
        } else {
            showResult();
        }
    });

    quizRestart.addEventListener("click", resetQuiz);
    quizBtn.addEventListener("click", openQuiz);
    quizClose.addEventListener("click", closeQuiz);

    quizModal.addEventListener("click", function(e) {
        if (e.target === quizModal) {
            closeQuiz();
        }
    });
}

// FOOTER MISIÓN / VISIÓN / VALORES
const footerInfoCards = document.querySelectorAll(".footer-info-card");

if (footerInfoCards.length) {
    footerInfoCards.forEach(card => {
        card.addEventListener("click", function () {
            this.classList.toggle("is-open");
        });
    });
}

});