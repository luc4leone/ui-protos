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
        "mb-8",
        "pl-10",
        "pt-4",
        "pb-8",
        "border",
        "border-[#eee]",
        "rounded-[4px]",
        "bg-gray-50",
        "relative",
        "shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
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
                messaggioStabilimento.classList.add('text-green-600', 'mb-4');
                messaggiContainer.appendChild(messaggioStabilimento);
            }
            // Aggiorna il testo del messaggio
            messaggioStabilimento.textContent = `Stabilimento "${nomeStabilimento}" valido!`;
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
        
        const label = document.createElement("label");
        label.htmlFor = `nome-stabilimento-${stabilimenti}`;
        label.textContent = "nome stabilimento";
        label.classList.add("block", "mb-1", "text-base");

        const inputWrapper = document.createElement("div");
        inputWrapper.classList.add("flex", "items-center", "relative");

        const checkStabilimento = document.createElement("span");
        checkStabilimento.textContent = "✓";
        checkStabilimento.classList.add(
            "hidden", 
            "text-green-600",
            "absolute",
            "left-[-24px]",
            "top-[50%]",
            "transform",
            "translate-y-[-50%]"
        );
        checkStabilimento.id = `check-stabilimento-${stabilimenti}`;

        const nomeStabilimentoInput = document.createElement("input");
        nomeStabilimentoInput.id = `nome-stabilimento-${stabilimenti}`;
        nomeStabilimentoInput.type = "text";
        nomeStabilimentoInput.classList.add(
            "border-2",
            "border-[#48494c]",
            "p-2",
            "rounded"
        );

        // Rimuovi eventuali margin-left dall'input wrapper
        inputWrapper.style.marginLeft = "0";  // Assicura che non ci siano margini a sinistra

        const rimuoviStabilimentoBtn = document.createElement("button");
        rimuoviStabilimentoBtn.id = `rimuovi-stabilimento-${stabilimenti}`;
        rimuoviStabilimentoBtn.classList.add("remove-button");
        rimuoviStabilimentoBtn.style.marginLeft = "8px";
        rimuoviStabilimentoBtn.textContent = "－";

        rimuoviStabilimentoBtn.addEventListener("click", () => {
            const container = document.getElementById("gerarchia");
            const stabilimentoDaRimuovere = findAncestorWithIdStartingWith(rimuoviStabilimentoBtn, "stabilimento-");
            
            // Controlla se è l'ultimo stabilimento nel container
            const stabilimentiNelContainer = container.querySelectorAll('[id^="stabilimento-"]');
            if (stabilimentiNelContainer.length === 1) {
                // Crea il bottone "aggiungi stabilimento" come link
                const aggiungiStabilimentoLink = document.createElement("button");
                aggiungiStabilimentoLink.textContent = "＋ aggiungi stabilimento";
                aggiungiStabilimentoLink.classList.add(
                    "text-base",
                    "underline",
                    "decoration-2",
                    "underline-offset-2"
                );

                // Usa la stessa funzionalità del bottone aggiungi stabilimento
                aggiungiStabilimentoLink.addEventListener("click", () => {
                    // Rimuovi il link
                    aggiungiStabilimentoLink.remove();
                    // Aggiungi un nuovo stabilimento al container
                    creaStabilimento();
                    stabilimenti++;
                });

                // Rimuovi lo stabilimento esistente
                rimuoviElement(stabilimentoDaRimuovere);
                stabilimenti--;

                // Aggiungi il link al DOM
                const linkDiv = document.createElement("div");
                // Non aggiungiamo margin-left perché è il livello più alto
                addElement1ToElement2(aggiungiStabilimentoLink, linkDiv);
                container.appendChild(linkDiv);

            } else {
                // Comportamento normale per la rimozione
                rimuoviElement(stabilimentoDaRimuovere);
                stabilimenti--;
            }
            validaStabilimento();
        });

        const aggiungiStabilimentoBtn = document.createElement("button");
        aggiungiStabilimentoBtn.classList.add("add-button");
        aggiungiStabilimentoBtn.textContent = "＋";
        aggiungiStabilimentoBtn.addEventListener("click", () => {
            creaStabilimento();
            stabilimenti++;
            validaStabilimento();
        });

        addElement1ToElement2(label, nomeStabilimentoDiv);
        addElement1ToElement2(checkStabilimento, inputWrapper);
        addElement1ToElement2(nomeStabilimentoInput, inputWrapper);
        addElement1ToElement2(aggiungiStabilimentoBtn, inputWrapper);
        addElement1ToElement2(rimuoviStabilimentoBtn, inputWrapper);
        addElement1ToElement2(inputWrapper, nomeStabilimentoDiv);

        nomeStabilimentoInput.addEventListener("input", function () {
            const soloSpazi = /^\s+$/.test(nomeStabilimentoInput.value);
            if (nomeStabilimentoInput.value && !soloSpazi) {
                checkStabilimento.classList.remove("hidden");
            } else {
                checkStabilimento.classList.add("hidden");
            }
            validaStabilimento();
        });

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
            
            const label = document.createElement("label");
            label.htmlFor = `nome-sala-${sale}`;
            label.textContent = "nome sala taglio";
            label.classList.add("block", "mb-1", "text-base");

            const inputWrapper = document.createElement("div");
            inputWrapper.classList.add("flex", "items-center", "relative");

            const checkSalaSpan = document.createElement("span");
            checkSalaSpan.textContent = "✓";
            checkSalaSpan.classList.add(
                "hidden", 
                "text-green-600",
                "absolute",
                "left-[-24px]",
                "top-[50%]",
                "transform",
                "translate-y-[-50%]"
            );
            checkSalaSpan.id = `check-sala-${sale}`;

            const nomeSalaInput = document.createElement("input");
            nomeSalaInput.id = `nome-sala-${sale}`;
            nomeSalaInput.type = "text";
            nomeSalaInput.classList.add(
                "border-2",
                "border-[#48494c]",
                "p-2",
                "rounded"
            );

            nomeSalaInput.addEventListener("input", function () {
                const soloSpazi = /^\s+$/.test(nomeSalaInput.value);
                if (nomeSalaInput.value && !soloSpazi) {
                    checkSalaSpan.classList.remove("hidden");
                } else {
                    checkSalaSpan.classList.add("hidden");
                }
                validaStabilimento();
            });

            const aggiungiSalaBtn = document.createElement("button");
            aggiungiSalaBtn.id = `aggiungi-sala-${sale}`;
            aggiungiSalaBtn.classList.add("add-button");
            aggiungiSalaBtn.textContent = "＋";

            aggiungiSalaBtn.addEventListener("click", () => {
                const parentStabilimentoDiv = findAncestorWithIdStartingWith(
                    aggiungiSalaBtn,
                    "stabilimento-"
                );
                addElement1ToElement2(creaSala(), parentStabilimentoDiv);
            });

            const rimuoviSalaBtn = document.createElement("button");
            rimuoviSalaBtn.id = `rimuovi-sala-${sale}`;
            rimuoviSalaBtn.classList.add("remove-button");
            rimuoviSalaBtn.textContent = "－";

            rimuoviSalaBtn.addEventListener("click", () => {
                const stabilimentoDiv = findAncestorWithIdStartingWith(rimuoviSalaBtn, "stabilimento-");
                const salaDaRimuovere = findAncestorWithIdStartingWith(rimuoviSalaBtn, "sala-");
                
                // Controlla se è l'ultima sala nello stabilimento
                const saleNelloStabilimento = stabilimentoDiv.querySelectorAll('[id^="sala-"]');
                if (saleNelloStabilimento.length === 1) {
                    // Crea il bottone "aggiungi sala taglio" come link
                    const aggiungiSalaLink = document.createElement("button");
                    aggiungiSalaLink.textContent = "＋ aggiungi sala taglio";
                    aggiungiSalaLink.classList.add(
                        "text-base",
                        "underline",
                        "decoration-2",
                        "underline-offset-2"
                    );

                    // Usa la stessa funzionalità del bottone aggiungi sala
                    aggiungiSalaLink.addEventListener("click", () => {
                        // Rimuovi il link
                        aggiungiSalaLink.remove();
                        // Aggiungi una nuova sala allo stabilimento
                        addElement1ToElement2(creaSala(), stabilimentoDiv);
                        sale++;
                    });

                    // Rimuovi la sala esistente
                    rimuoviElement(salaDaRimuovere);
                    sale--;

                    // Aggiungi il link al DOM nella posizione corretta
                    const nomeSalaDiv = document.createElement("div");
                    nomeSalaDiv.classList.add("ml-16", "mt-6");  // Stesso margin-left delle sale
                    addElement1ToElement2(aggiungiSalaLink, nomeSalaDiv);
                    stabilimentoDiv.appendChild(nomeSalaDiv);

                } else {
                    // Comportamento normale per la rimozione
                    rimuoviElement(salaDaRimuovere);
                    sale--;
                }
                validaStabilimento();
            });

            addElement1ToElement2(label, nomeSalaDiv);
            addElement1ToElement2(checkSalaSpan, inputWrapper);
            addElement1ToElement2(nomeSalaInput, inputWrapper);
            addElement1ToElement2(aggiungiSalaBtn, inputWrapper);
            addElement1ToElement2(rimuoviSalaBtn, inputWrapper);
            addElement1ToElement2(inputWrapper, nomeSalaDiv);

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
                
                const label = document.createElement("label");
                label.htmlFor = `nome-linea-${linee}`;
                label.textContent = "nome linea";
                label.classList.add("block", "mb-1", "text-base");

                const inputWrapper = document.createElement("div");
                inputWrapper.classList.add("flex", "items-center", "relative");

                const checkLineaSpan = document.createElement("span");
                checkLineaSpan.textContent = "✓";
                checkLineaSpan.classList.add(
                    "hidden", 
                    "text-green-600",
                    "absolute",
                    "left-[-24px]",
                    "top-[50%]",
                    "transform",
                    "translate-y-[-50%]"
                );
                checkLineaSpan.id = `check-linea-${linee}`;

                const nomeLineaInput = document.createElement("input");
                nomeLineaInput.id = `nome-linea-${linee}`;
                nomeLineaInput.type = "text";
                nomeLineaInput.classList.add(
                    "border-2",
                    "border-[#48494c]",
                    "p-2",
                    "rounded"
                );

                nomeLineaInput.addEventListener("input", function () {
                    const soloSpazi = /^\s+$/.test(nomeLineaInput.value);
                    if (nomeLineaInput.value && !soloSpazi) {
                        checkLineaSpan.classList.remove("hidden");
                    } else {
                        checkLineaSpan.classList.add("hidden");
                    }
                    validaStabilimento();
                });

                const aggiungiLineaBtn = document.createElement("button");
                aggiungiLineaBtn.id = `aggiungi-linea-${linee}`;
                aggiungiLineaBtn.classList.add("add-button");
                aggiungiLineaBtn.textContent = "＋";

                aggiungiLineaBtn.addEventListener("click", () => {
                    const parentSalaDiv = findAncestorWithIdStartingWith(
                        aggiungiLineaBtn,
                        "sala-"
                    );
                    addElement1ToElement2(creaLinea(), parentSalaDiv);
                });

                const rimuoviLineaBtn = document.createElement("button");
                rimuoviLineaBtn.id = `rimuovi-linea-${linee}`;
                rimuoviLineaBtn.classList.add("remove-button");
                rimuoviLineaBtn.textContent = "－";

                rimuoviLineaBtn.addEventListener("click", () => {
                    const salaDiv = findAncestorWithIdStartingWith(rimuoviLineaBtn, "sala-");
                    const lineaDaRimuovere = findAncestorWithIdStartingWith(rimuoviLineaBtn, "linea-");
                    
                    // Controlla se è l'ultima linea nella sala
                    const lineeNellaSala = salaDiv.querySelectorAll('[id^="linea-"]');
                    if (lineeNellaSala.length === 1) {
                        // Crea il bottone "aggiungi linea" come link
                        const aggiungiLineaLink = document.createElement("button");
                        aggiungiLineaLink.textContent = "＋ aggiungi linea";
                        aggiungiLineaLink.classList.add(
                            "text-base",
                            "underline",
                            "decoration-2",
                            "underline-offset-2"
                        );

                        // Usa la stessa funzionalità del bottone aggiungi linea
                        aggiungiLineaLink.addEventListener("click", () => {
                            // Rimuovi il link
                            aggiungiLineaLink.remove();
                            // Aggiungi una nuova linea alla sala
                            addElement1ToElement2(creaLinea(), salaDiv);
                            linee++;
                        });

                        // Rimuovi la linea esistente
                        rimuoviElement(lineaDaRimuovere);
                        linee--;

                        // Aggiungi il link al DOM nella posizione corretta
                        const nomeLineaDiv = document.createElement("div");
                        nomeLineaDiv.classList.add("ml-16", "mt-6");  // Stesso margin-left delle linee
                        addElement1ToElement2(aggiungiLineaLink, nomeLineaDiv);
                        salaDiv.appendChild(nomeLineaDiv);

                    } else {
                        // Comportamento normale per la rimozione
                        rimuoviElement(lineaDaRimuovere);
                        linee--;
                    }
                    validaStabilimento();
                });

                addElement1ToElement2(label, nomeLineaDiv);
                addElement1ToElement2(checkLineaSpan, inputWrapper);
                addElement1ToElement2(nomeLineaInput, inputWrapper);
                addElement1ToElement2(aggiungiLineaBtn, inputWrapper);
                addElement1ToElement2(rimuoviLineaBtn, inputWrapper);
                addElement1ToElement2(inputWrapper, nomeLineaDiv);

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
                    
                    const label = document.createElement("label");
                    label.htmlFor = `seriale-macchina-${linee}`;
                    label.textContent = "seriale macchina";
                    label.classList.add("block", "mb-1", "text-base");

                    const inputWrapper = document.createElement("div");
                    inputWrapper.classList.add("flex", "items-center", "relative");

                    const checkMacchinaSpan = document.createElement("span");
                    checkMacchinaSpan.textContent = "✓";
                    checkMacchinaSpan.classList.add(
                        "hidden", 
                        "text-green-600",
                        "absolute",
                        "left-[-24px]",
                        "top-[50%]",
                        "transform",
                        "translate-y-[-50%]"
                    );
                    checkMacchinaSpan.id = `check-macchina-${macchine}`;

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
                        "border-[#48494c]",
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
                    aggiungiMacchinaBtn.classList.add("add-button");
                    aggiungiMacchinaBtn.textContent = "＋";

                    aggiungiMacchinaBtn.addEventListener("click", () => {
                        const parentLineaDiv = findAncestorWithIdStartingWith(
                            aggiungiMacchinaBtn,
                            "linea-"
                        );
                        addElement1ToElement2(creaMacchina(), parentLineaDiv);
                    });

                    const rimuoviMacchinaBtn = document.createElement("button");
                    rimuoviMacchinaBtn.id = `rimuovi-macchina-${linee}`;
                    rimuoviMacchinaBtn.classList.add("remove-button");
                    rimuoviMacchinaBtn.textContent = "－";

                    rimuoviMacchinaBtn.addEventListener("click", () => {
                        const lineaDiv = findAncestorWithIdStartingWith(rimuoviMacchinaBtn, "linea-");
                        const macchinaDaRimuovere = findAncestorWithIdStartingWith(rimuoviMacchinaBtn, "macchina-");
                        
                        // Debug: verifichiamo quante macchine ci sono
                        const macchineNellaLinea = lineaDiv.querySelectorAll('[id^="macchina-"]');
                        console.log('Numero macchine nella linea:', macchineNellaLinea.length);
                        
                        if (macchineNellaLinea.length === 1) {
                            console.log('È l\'ultima macchina, creo il link');
                            
                            const aggiungiMacchinaLink = document.createElement("button");
                            aggiungiMacchinaLink.textContent = "＋ aggiungi macchina";
                            aggiungiMacchinaLink.classList.add(
                                "text-base",
                                "underline",
                                "decoration-2",
                                "underline-offset-2"
                            );

                            aggiungiMacchinaLink.addEventListener("click", () => {
                                console.log('Click sul link');
                                aggiungiMacchinaLink.remove();
                                addElement1ToElement2(creaMacchina(), lineaDiv);
                                macchine++;
                            });

                            // Prima rimuoviamo la macchina
                            console.log('Rimuovo la macchina');
                            rimuoviElement(macchinaDaRimuovere);
                            macchine--;

                            // Poi aggiungiamo il link
                            console.log('Aggiungo il link');
                            const nomeMacchinaDiv = document.createElement("div");
                            nomeMacchinaDiv.classList.add("ml-16", "mt-6");
                            addElement1ToElement2(aggiungiMacchinaLink, nomeMacchinaDiv);
                            lineaDiv.appendChild(nomeMacchinaDiv);  // Usiamo appendChild direttamente

                        } else {
                            console.log('Non è l\'ultima macchina');
                            rimuoviElement(macchinaDaRimuovere);
                            macchine--;
                        }
                        validaStabilimento();
                    });

                    addElement1ToElement2(label, nomeMacchinaDiv);
                    addElement1ToElement2(checkMacchinaSpan, inputWrapper);
                    addElement1ToElement2(serialeMacchinaSelect, inputWrapper);
                    addElement1ToElement2(aggiungiMacchinaBtn, inputWrapper);
                    addElement1ToElement2(rimuoviMacchinaBtn, inputWrapper);
                    addElement1ToElement2(inputWrapper, nomeMacchinaDiv);

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


document.addEventListener("DOMContentLoaded", () => {
    creaStabilimento();  // Crea il primo stabilimento
});