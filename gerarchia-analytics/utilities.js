// Funzione per trovare l'antenato con ID che inizia con un prefisso specifico
function findAncestorWithIdStartingWith(
    element,
    prefix
) {
    while (element) {
        if (
            element.id &&
            element.id.startsWith(prefix)
        ) {
            return element;
        }
        element = element.parentElement;
    }
    return null;
}

// Funzione per rimuovere un elemento dal DOM
function rimuoviElement(element) {
    element.remove();
}

// Funzione per aggiungere un elemento all'interno di un altro
function addElement1ToElement2(element1, element2) {
    element2.appendChild(element1);
}

export { findAncestorWithIdStartingWith, rimuoviElement, addElement1ToElement2 };
