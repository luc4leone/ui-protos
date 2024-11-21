import { findAncestorWithIdStartingWith, rimuoviElement, addElement1ToElement2 } from './utilities.js';

// DOM ELEMENTS
const gerarchiaDiv = document.getElementById("gerarchia");

let stabilimenti = 0;

// Aggiunta funzione validaSalaTaglio a livello globale
function validaSalaTaglio(salaDiv) {
    const nomeSala = salaDiv.querySelector('input').value;
    const linee = salaDiv.querySelectorAll('[id^="linea-"]');
    
    // Verifica che la sala abbia un nome
    if (nomeSala.trim() === '') {
        return false;
    }

    // Verifica che almeno una linea abbia sia nome che macchina selezionata
    let haLineaCompleta = false;
    for (const linea of linee) {
        const nomeLinea = linea.querySelector('input').value;
        const macchinaSelezionata = linea.querySelector('select')?.value;
        
        if (nomeLinea.trim() !== '' && macchinaSelezionata && macchinaSelezionata !== 'nessuna') {
            haLineaCompleta = true;
            break;  // Basta trovare una linea con nome e macchina
        }
    }

    return haLineaCompleta;
}

function creaStabilimento() {
    let sale = 0;

    // Crea stabilimento container
    stabilimenti++;
    const stabilimentoDiv = document.createElement("div");
    stabilimentoDiv.id = `stabilimento-${stabilimenti}`;
    stabilimentoDiv.classList.add(
        "mt-4",
        "pl-10",
        "pt-4",
        "pb-4",
        "border",
        "relative"
    );

    const nomeStabilimentoDiv = creaNomeStabilimento();

    // Modifica della funzione validaStabilimento per usare validaSalaTaglio
    function validaStabilimento() {
        const nomeStabilimento = nomeStabilimentoDiv.querySelector('input').value;
        const sale = stabilimentoDiv.querySelectorAll('[id^="sala-"]');
        const stabilimentoId = stabilimentoDiv.id;
        
        // 1. Verifica nome stabilimento e presenza di almeno una sala
        let isValido = nomeStabilimento.trim() !== '' && sale.length > 0;
        
        if (isValido) {
            // 2. Verifica che ALMENO UNA sala sia valida
            let hasSalaValida = false;
            for (const sala of sale) {
                if (validaSalaTaglio(sala)) {
                    hasSalaValida = true;
                    break;
                }
            }
            isValido = hasSalaValida;
        }

        // 3. Gestione del container dei messaggi
        let messaggiContainer = document.getElementById('messaggi-validita');
        if (!messaggiContainer) {
            messaggiContainer = document.createElement('div');
            messaggiContainer.id = 'messaggi-validita';
            messaggiContainer.classList.add('mt-4');
            
            // Inserisci il container dopo Fanny
            const fannyDiv = document.getElementById('fanny');
            fannyDiv.after(messaggiContainer);
        }

        // 4. Gestione del messaggio specifico per questo stabilimento
        const messaggioId = `messaggio-${stabilimentoId}`;
        let messaggioStabilimento = document.getElementById(messaggioId);

        if (isValido) {
            stabilimentoDiv.classList.add('bg-green-100');
            
            // Se il messaggio non esiste, lo creiamo
            if (!messaggioStabilimento) {
                messaggioStabilimento = document.createElement('div');
                messaggioStabilimento.id = messaggioId;
                messaggioStabilimento.classList.add('text-green-600', 'translate-x-[37px]');
                messaggiContainer.appendChild(messaggioStabilimento);
            }
            // Aggiorna il testo del messaggio
            messaggioStabilimento.textContent = `Stabilimento ${nomeStabilimento} valido!`;
        } else {
            stabilimentoDiv.classList.remove('bg-green-100');
            // Rimuovi solo il messaggio di questo stabilimento
            if (messaggioStabilimento) {
                messaggioStabilimento.remove();
            }
            
            // Se non ci sono più messaggi, rimuovi il container
            if (messaggiContainer.children.length === 0) {
                messaggiContainer.remove();
            }
        }
    }

    function creaNomeStabilimento() {
        const nomeStabilimentoDiv = document.createElement("div");

        const checkStabilimento = document.createElement("span");
        checkStabilimento.id = `check-stabilimento-${stabilimenti}`;
        checkStabilimento.classList.add(
            "absolute",
            "top-6",
            "left-2",
            "hidden"
        );
        checkStabilimento.textContent = "✅";

        const nomeStabilimentoInput = document.createElement("input");
        nomeStabilimentoInput.id = `nome-stabilimento-${stabilimenti}`;
        nomeStabilimentoInput.type = "text";
        nomeStabilimentoInput.placeholder = "nome stabilimento";
        nomeStabilimentoInput.classList.add(
            "border-2",
            "border-gray-500",
            "p-2",
            "placeholder:italic",
            "rounded"
        );

        nomeStabilimentoInput.addEventListener("blur", function () {
            if (nomeStabilimentoInput.value) {
                checkStabilimento.classList.remove("hidden");
            } else {
                checkStabilimento.classList.add("hidden");
            }
            validaStabilimento();
        });

        const rimuoviStabilimentoBtn = document.createElement("button");
        rimuoviStabilimentoBtn.id = `rimuovi-stabilimento-${stabilimenti}`;
        rimuoviStabilimentoBtn.classList.add(
            "underline",
            "decoration-2",
            "underline-offset-2",
            "ml-2",
            "text-red-600"
        );
        rimuoviStabilimentoBtn.textContent = "- rimuovi stabilimento";

        rimuoviStabilimentoBtn.addEventListener("click", () => {
            rimuoviElement(stabilimentoDiv);
            stabilimenti--;
            validaStabilimento();
        });

        addElement1ToElement2(checkStabilimento, nomeStabilimentoDiv);
        addElement1ToElement2(nomeStabilimentoInput, nomeStabilimentoDiv);
        addElement1ToElement2(rimuoviStabilimentoBtn, nomeStabilimentoDiv);

        return nomeStabilimentoDiv;
    }

    function creaSala(n) {
        let linee = 0;
        sale++;
        const salaDiv = document.createElement("div");
        salaDiv.id = `sala-${stabilimenti}.${sale}`;
        salaDiv.classList.add("ml-16", "mt-4", "relative");

        const nomeSalaDiv = creaNomeSala(n);

        function creaNomeSala(n) {
            const nomeSalaDiv = document.createElement("div");

            const checkSalaSpan = document.createElement("span");
            checkSalaSpan.id = `check-sala-${sale}`;
            checkSalaSpan.classList.add(
                "absolute",
                "top-2",
                "-left-8",
                "hidden"
            );
            checkSalaSpan.textContent = "✅";

            const nomeSalaInput = document.createElement("input");
            nomeSalaInput.id = `nome-sala-${sale}`;
            nomeSalaInput.classList.add(
                "border-2",
                "border-gray-500",
                "p-2",
                "placeholder:italic",
                "rounded"
            );
            nomeSalaInput.type = "text";
            nomeSalaInput.placeholder = "nome sala taglio";

            nomeSalaInput.addEventListener("change", function () {
                if (nomeSalaInput.value) {
                    checkSalaSpan.classList.remove("hidden");
                } else {
                    checkSalaSpan.classList.add("hidden");
                }
                validaStabilimento();
            });

            const aggiungiSalaBtn = document.createElement("button");
            aggiungiSalaBtn.id = `aggiungi-sala-${sale}`;
            aggiungiSalaBtn.classList.add(
                "underline",
                "decoration-2",
                "underline-offset-2",
                "ml-2",
                "mr-2"
            );
            aggiungiSalaBtn.textContent = "+ aggiungi sala taglio";

            aggiungiSalaBtn.addEventListener("click", () => {
                const parentStabilimentoDiv = findAncestorWithIdStartingWith(
                    aggiungiSalaBtn,
                    "stabilimento-"
                );
                addElement1ToElement2(creaSala(), parentStabilimentoDiv);
            });

            const rimuoviSalaBtn = document.createElement("button");
            rimuoviSalaBtn.id = `rimuovi-sala-${sale}`;
            rimuoviSalaBtn.classList.add(
                "underline",
                "decoration-2",
                "underline-offset-2",
                "ml-2",
                "mr-2",
                "text-red-600"
            );
            rimuoviSalaBtn.textContent = "- rimuovi sala taglio";

            rimuoviSalaBtn.addEventListener("click", () => {
                const salaDaRimuovere = findAncestorWithIdStartingWith(
                    rimuoviSalaBtn,
                    "sala-"
                );
                rimuoviElement(salaDaRimuovere);
                sale--;
                validaStabilimento();
            });

            addElement1ToElement2(checkSalaSpan, nomeSalaDiv);
            addElement1ToElement2(nomeSalaInput, nomeSalaDiv);
            addElement1ToElement2(aggiungiSalaBtn, nomeSalaDiv);
            addElement1ToElement2(rimuoviSalaBtn, nomeSalaDiv);

            return nomeSalaDiv;
        }

        const lineaDiv = creaLinea(1);

        addElement1ToElement2(nomeSalaDiv, salaDiv);
        addElement1ToElement2(lineaDiv, salaDiv);
        return salaDiv;

        function creaLinea(n) {
            let macchine = 0;
            linee++;
            const lineaDiv = document.createElement("div");
            lineaDiv.id = `linea-${stabilimenti}.${sale}.${linee}`;
            lineaDiv.classList.add("ml-16", "mt-4", "relative");

            const nomeLineaDiv = creaNomeLinea(n);

            function creaNomeLinea(n) {
                const nomeLineaDiv = document.createElement("div");

                const checkLineaSpan = document.createElement("span");
                checkLineaSpan.id = `check-linea-${linee}`;
                checkLineaSpan.classList.add(
                    "absolute",
                    "top-2",
                    "-left-8",
                    "hidden"
                );
                checkLineaSpan.textContent = "✅";

                const nomeLineaInput = document.createElement("input");
                nomeLineaInput.id = `nome-linea-${linee}`;
                nomeLineaInput.classList.add(
                    "border-2",
                    "border-gray-500",
                    "p-2",
                    "placeholder:italic",
                    "rounded"
                );
                nomeLineaInput.type = "text";
                nomeLineaInput.placeholder = "nome linea";

                nomeLineaInput.addEventListener("change", function () {
                    if (nomeLineaInput.value) {
                        checkLineaSpan.classList.remove("hidden");
                    } else {
                        checkLineaSpan.classList.add("hidden");
                    }
                    validaStabilimento();
                });

                const aggiungiLineaBtn = document.createElement("button");
                aggiungiLineaBtn.id = `aggiungi-linea-${linee}`;
                aggiungiLineaBtn.classList.add(
                    "underline",
                    "decoration-2",
                    "underline-offset-2",
                    "ml-2",
                    "mr-2"
                );
                aggiungiLineaBtn.textContent = "+ aggiungi linea";

                aggiungiLineaBtn.addEventListener("click", () => {
                    const parentSalaDiv = findAncestorWithIdStartingWith(
                        aggiungiLineaBtn,
                        "sala-"
                    );
                    addElement1ToElement2(creaLinea(), parentSalaDiv);
                });

                const rimuoviLineaBtn = document.createElement("button");
                rimuoviLineaBtn.id = `rimuovi-linea-${linee}`;
                rimuoviLineaBtn.classList.add(
                    "underline",
                    "decoration-2",
                    "underline-offset-2",
                    "ml-2",
                    "mr-2",
                    "text-red-600"
                );
                rimuoviLineaBtn.textContent = "- rimuovi linea";

                rimuoviLineaBtn.addEventListener("click", () => {
                    const lineaDaRimuovere = findAncestorWithIdStartingWith(
                        rimuoviLineaBtn,
                        "linea-"
                    );
                    rimuoviElement(lineaDaRimuovere);
                    linee--;
                    validaStabilimento();
                });

                addElement1ToElement2(checkLineaSpan, nomeLineaDiv);
                addElement1ToElement2(nomeLineaInput, nomeLineaDiv);
                addElement1ToElement2(aggiungiLineaBtn, nomeLineaDiv);
                addElement1ToElement2(rimuoviLineaBtn, nomeLineaDiv);

                return nomeLineaDiv;
            }

            const macchinaDiv = creaMacchina(1);

            addElement1ToElement2(nomeLineaDiv, lineaDiv);
            addElement1ToElement2(macchinaDiv, lineaDiv);

            return lineaDiv;

            function creaMacchina(n) {
                macchine++;
                const macchinaDiv = document.createElement("div");
                macchinaDiv.id = `macchina-${stabilimenti}.${sale}.${linee}.${macchine}`;
                macchinaDiv.classList.add("ml-16", "mt-4", "relative");

                const nomeMacchinaDiv = creaNomeMacchina(n);

                function creaNomeMacchina(n) {
                    const nomeMacchinaDiv = document.createElement("div");

                    const checkMacchinaSpan = document.createElement("span");
                    checkMacchinaSpan.id = `check-macchina-${linee}`;
                    checkMacchinaSpan.classList.add(
                        "absolute",
                        "top-2",
                        "-left-8",
                        "hidden"
                    );
                    checkMacchinaSpan.textContent = "✅";

                    const serialeMacchinaSelect = document.createElement("select");
                    serialeMacchinaSelect.id = `seriale-macchina-${linee}`;

                    const nessunaOption = document.createElement("option");
                    nessunaOption.value = "nessuna";
                    nessunaOption.textContent = "nessuna";

                    const macchineStesuraOptgroup = document.createElement("optgroup");
                    macchineStesuraOptgroup.label = "Macchine di stesura";

                    const macchineTaglioOptgroup = document.createElement("optgroup");
                    macchineTaglioOptgroup.label = "Macchine di taglio";

                    const macchina1Option = document.createElement("option");
                    macchina1Option.value = "22lk-332s-aass";
                    macchina1Option.textContent = "stesura 22lk-332s-aass";

                    const macchina2Option = document.createElement("option");
                    macchina2Option.value = "1234-qwer-asdf";
                    macchina2Option.textContent = "stesura 1234-qwer-asdf";

                    const macchina3Option = document.createElement("option");
                    macchina3Option.value = "wert-45rt-7ujm";
                    macchina3Option.textContent = "taglio wert-45rt-7ujm";

                    const macchina4Option = document.createElement("option");
                    macchina4Option.value = "jklp-1qaz-2wsx";
                    macchina4Option.textContent = "taglio jklp-1qaz-2wsx";

                    serialeMacchinaSelect.appendChild(nessunaOption);
                    macchineStesuraOptgroup.appendChild(macchina1Option);
                    macchineStesuraOptgroup.appendChild(macchina2Option);
                    macchineTaglioOptgroup.appendChild(macchina3Option);
                    macchineTaglioOptgroup.appendChild(macchina4Option);

                    serialeMacchinaSelect.appendChild(macchineStesuraOptgroup);
                    serialeMacchinaSelect.appendChild(document.createElement("hr"));
                    serialeMacchinaSelect.appendChild(macchineTaglioOptgroup);

                    serialeMacchinaSelect.classList.add(
                        "border-2",
                        "border-gray-500",
                        "p-2",
                        "rounded"
                    );

                    serialeMacchinaSelect.addEventListener("change", function () {
                        if (serialeMacchinaSelect.value !== "nessuna") {
                            checkMacchinaSpan.classList.remove("hidden");
                        } else {
                            checkMacchinaSpan.classList.add("hidden");
                        }
                        validaStabilimento();
                    });

                    const aggiungiMacchinaBtn = document.createElement("button");
                    aggiungiMacchinaBtn.id = `aggiungi-macchina-${linee}`;
                    aggiungiMacchinaBtn.classList.add(
                        "underline",
                        "decoration-2",
                        "underline-offset-2",
                        "ml-2",
                        "mr-2"
                    );
                    aggiungiMacchinaBtn.textContent = "+ aggiungi macchina";

                    aggiungiMacchinaBtn.addEventListener("click", () => {
                        const parentLineaDiv = findAncestorWithIdStartingWith(
                            aggiungiMacchinaBtn,
                            "linea-"
                        );
                        addElement1ToElement2(creaMacchina(), parentLineaDiv);
                    });

                    const rimuoviMacchinaBtn = document.createElement("button");
                    rimuoviMacchinaBtn.id = `rimuovi-macchina-${linee}`;
                    rimuoviMacchinaBtn.classList.add(
                        "underline",
                        "decoration-2",
                        "underline-offset-2",
                        "ml-2",
                        "mr-2",
                        "text-red-600"
                    );
                    rimuoviMacchinaBtn.textContent = "- rimuovi macchina";

                    rimuoviMacchinaBtn.addEventListener("click", () => {
                        const macchinaDaRimuovere = findAncestorWithIdStartingWith(
                            rimuoviMacchinaBtn,
                            "macchina-"
                        );
                        rimuoviElement(macchinaDaRimuovere);
                        macchine--;
                        validaStabilimento();
                    });

                    addElement1ToElement2(checkMacchinaSpan, nomeMacchinaDiv);
                    addElement1ToElement2(serialeMacchinaSelect, nomeMacchinaDiv);
                    addElement1ToElement2(aggiungiMacchinaBtn, nomeMacchinaDiv);
                    addElement1ToElement2(rimuoviMacchinaBtn, nomeMacchinaDiv);

                    return nomeMacchinaDiv;
                }

                addElement1ToElement2(nomeMacchinaDiv, macchinaDiv);
                return macchinaDiv;
            }
        }
    }

    const salaDiv = creaSala(1);

    stabilimentoDiv.appendChild(nomeStabilimentoDiv);
    stabilimentoDiv.appendChild(salaDiv);

    gerarchiaDiv.appendChild(stabilimentoDiv);
    return stabilimentoDiv;
}

// EVENTI AGGIUNGI STABILIMENTO
const aggiungiStabilimento = document.getElementById("aggiungi-stabilimento");
aggiungiStabilimento.addEventListener("click", creaStabilimento);