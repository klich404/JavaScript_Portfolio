const comments = []; //lista de comentarios

const inputContainer = document.createElement('div'); //el contenedor de input
const input = document.createElement('input'); //el input del nuevo comentario
const commentsContainer = document.querySelector('#comments-container'); //el contenedor de comentarios

input.classList.add('input');

input.addEventListener('keydown', (e) => {
    handleEnter(e, null);
});

commentsContainer.appendChild(inputContainer); //añade inputContainer a commentsContainer
inputContainer.appendChild(input); //añade input a inputContainer

// funcion para hacer un nuevo comentario
function handleEnter(e, current) {
    if(e.key == 'Enter' && e.target.value != '') { //si se oprime enter y el input no esta vacio:
        const newComment = { //se creara un nuevo objeto comentario
            text: e.target.value,
            likes: 0,
            responses: []
        }

        if(current == null) {
            comments.unshift(newComment); //si no se esta escribiendo sobre un comentario, este nuevo se añade al arreglo de comentarios
        } else {
            current.responses.unshift(newComment); //si se esta escribiendo sobre un comentario, entonces se mandata el input a la variable responses de este
        }

        e.target.value = ''; //limpia el input
        commentsContainer.innerHTML = ''; //limpia la itnerfaz
        commentsContainer.appendChild(inputContainer); //añade inputContainer a CommentsContainer

        renderComments(comments, commentsContainer); //renderiza los comentarios
    }
}

function renderComments(arr, parent) {
    arr.forEach(element => {
        const commentContainer = document.createElement('div'); //crea un div para commentContainer
        commentContainer.classList.add('comment-container'); //añade la etiqueta 'comment-container' al div

        const responsesContainer = document.createElement('div'); //crea un div para responsescontainer
        responsesContainer.classList.add('responses-container'); //añade la etiqueta 'responses-container' al div

        const replyButton = document.createElement('button'); //crea un boton para reply
        const likeButton = document.createElement('button'); //crea un boton para likes

        const textContainer = document.createElement('div'); //crea un div para textContainer
        textContainer.textContent = element.text; //le da el contenido de texto del objeto al texto de la caja de comentario

        const actionsContainer = document.createElement('div'); //crea un div para actionsContainer

        replyButton.textContent = 'Reply'; //le da el nombre de reply al boton reply
        likeButton.textContent = `${element.likes > 0? `${element.likes} likes` : 'like'}`; //si el numero de la variable likes es mayor a 0 muestra "# likes" si es menor a 0 muestra "like"

        replyButton.addEventListener('click', (e) => { //al hacer click en reply
            const newInput = inputContainer.cloneNode(true); //copia el input container con sus descendientes
            newInput.value = ''; //limpia el valor del nuevo input
            newInput.focus(); //hace focus en el nuevo input
            newInput.addEventListener('keydown', (e) => {
                handleEnter(e, element);
            });
            commentContainer.insertBefore(newInput, responsesContainer); //añade una nueva caja de comentario despues de el ultimo comentario
        });
        likeButton.addEventListener('click', (e) => {
            element.likes++; //cada vez que se clickea el boton de like se suma el contador
            likeButton.textContent = `${element.likes > 0? `${element.likes} likes` : 'like'}`; //si el numero de la variable likes es mayor a 0 muestra "# likes" si es menor a 0 muestra "like"
        });

        //append
        commentContainer.appendChild(textContainer); //se añade textContainer a commentContainer
        commentContainer.appendChild(actionsContainer); //se añade actionsContainer a commentContainer
        actionsContainer.appendChild(replyButton); //se añade replyButton a actionsContainer
        actionsContainer.appendChild(likeButton); //se añade likeButton a actionsContainer
        commentContainer.appendChild(responsesContainer); //se añade responsesContainer a commentContainer

        if(element.responses.length > 0) {
            renderComments(element.responses, responsesContainer); //si un comentario ya tiene respuestas entra en una recursion para mostrar el resto de respuestas
        }
        parent.appendChild(commentContainer); //añade commentContainer a parent
    });
}

