let events = []; //lista de eventos
let arr = []; //cargar data

const eventName = document.querySelector("#eventName");
const eventDate = document.querySelector("#eventDate");
const buttonAdd = document.querySelector("#buttonAdd");
const eventsContainer = document.querySelector("#eventsContainer");

const json = load(); //cargar datav

try {
    arr = JSON.parse(json);
} catch (error) {
    arr = [];
}
events = arr? [...arr] : []; //cargar data

renderEvents(); //renderiza eventos

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    addEvent();
});

buttonAdd.addEventListener('click', (e) => {
    e.preventDefault();
    addEvent();
});

// funcion que añade un evento a el arrat events
function addEvent(){
    if(eventName.value == '' || eventDate.value == '') {
        return;
    }

    if(dateDiff(eventDate.value) < 0) {
        return;
    }

    //objeto evento
    const newEvent = {
        id: (Math.random() * 100).toString(36).slice(3),
        name: eventName.value,
        date: eventDate.value
    };

    events.unshift(newEvent); //añade un objeto evento al array de eventos
    save(JSON.stringify(events)); //guarda los eventos en localstorage
    eventName.value = ''; //reincia la casilla de nombre
    renderEvents(); //renderiza eventos
}

//retorna los dias restantes al evento
function dateDiff(d){
    const targetDate = new Date(d);
    const today = new Date();
    const difference = targetDate.getTime() - today.getTime(); //calcula la diferencia entre el evento y la fecha actual
    const days = Math.ceil(difference / (1000 * 3600 * 24)); //convierte la diferencia a dias
    return days; //retorna los dias restantes
}

//renderiza la lista de eventos
function renderEvents(){
    const eventsHTML = events.map(event => { //recorre todos los eventos
        return `
            <div class="event">
                <div class="days">
                    <span class="days-number">${dateDiff(event.date)}</span>
                    <span class="days-text">días</span>
                </div>

                <div class="event-name">${event.name}</div>
                <div class="event-name">${event.date}</div>
                <div class="actions">
                    <button class="buttonDelete" data-id="${event.id}">Eliminar</button>
                </div>
            </div>
        `;
    });
    eventsContainer.innerHTML = eventsHTML.join(""); //une el HTML con un string vacio
    document.querySelectorAll('.buttonDelete').forEach(button => { //funcion para borrar un evento
        button.addEventListener('click', e => {
            const id = button.getAttribute('data-id'); //busca el id del evento a eliminar
            events = events.filter(event => event.id != id); //borra el elemento que coincida con el id de la lista de eventos
            save(JSON.stringify(events)); //guarda la lista nuevamente sin el evento eliminado
            renderEvents(); //renderiza los elementos sin el evento eliminado
        });
    });
}


function save(data){
    localStorage.setItem('items', data); //guarda data
}

function load(){
    return localStorage.getItem('items'); //cargar data
}
