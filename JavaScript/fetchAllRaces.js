document.addEventListener("DOMContentLoaded", runFetchAllRaces) // Når siden starter, så runner vi vores hovedmetode i vores script vi har kaldt runFetchAllRaces.

// Vi skaffer vores table body
let tableBodyRaces = document.querySelector("#tblBodyRaces")

// Det her er vores "init" metode. Den køre hele scriptet.
function runFetchAllRaces() {
    fetchAllRaces()
}

// Her fylder vi vores html tabel med Races
function fillRowsInTable(sailRace) {
    console.log(sailRace)
    const tableRow = document.createElement("tr");
    // Vi giver hvert table row et unikt id som er RaceRow-"id". Dette skal bruges til at slette hver row senere.
    tableRow.id = `RaceRow-${sailRace.id}`
    tableRow.innerHTML = `
        <td>${sailRace.id}</td>              
        <td>${sailRace.date}</td>
        <td>${sailRace.name}</td>

        <td><button class="btn btn-primary" id="updateSailRaceKnap-${sailRace.id}" value="${sailRace.id}" data-bs-toggle="modal" data-bs-target="#updateSailRaceModal">Update</button></td>
        <td><button class="btn btn-primary" id="deleteSailRaceKnap-${sailRace.id}" value="${sailRace.id}">Delete</button></td>
        `;

    // Vi appender én row ad gangen vi laver til vores tableBodyRaces.
    tableBodyRaces.appendChild(tableRow);

    document.querySelector("#updateSailRaceModalBtn").addEventListener("click", updateSailRace)

    // Vi laver en eventlistener på hver update knap der kalder addHiddenIdToInputField metoden, som adder sailRace id til et hidden form input felt
    document.querySelector(`#updateSailRaceKnap-${sailRace.id}`).addEventListener('click', addHiddenIdToInputField)

    // Vi laver en eventListener på hver delete knap vi skaber.
    document.querySelector(`#deleteSailRaceKnap-${sailRace.id}`).addEventListener('click', deleteSailRace)
}

// Vi har lavet et hidden input field i vores update modals form, som vi lægger vores SailRaces id over i. Man kan ikke update/put uden at give et id med
function addHiddenIdToInputField(event){
    const SailRaceId = event.target.value // vores event er knap trykket, og fordi knappen er givet value == SailRaceens id, kan vi får fat i id'et
    document.querySelector("#updateIdFormHiddenInput").value = SailRaceId; // man kunne honestly også bare have gemt vores event.target.value i en global variabel her, i stedet for i et hidden field. Nok nemmere.
}


function updateSailRace(){
    const updateModalForm = document.querySelector("#modalFormUpdateSailRace")
    const SailRaceObjekt = preparePlainFormData(updateModalForm) // vi laver alt input fra formen om til et javascript objekt.
    const SailRaceId = document.querySelector("#updateIdFormHiddenInput").value; // Vi skaffer SailRaceen id fra det hidden form input felt.
    SailRaceObjekt.id = SailRaceId; // Vi sætter vores SailRaceObjekts id til at være lig dette id vi hentede fra hidden input feltet,

    fetchAny("sailrace", "PUT", SailRaceObjekt).then(SailRace => {
        console.log("Updated SailRace: ", SailRace)
        alert("Updated SailRace: " + SailRaceObjekt.name)
        window.location.reload()
    }).catch(error => {
        console.error(error)
    })
}


// Den her eventlistener kalder så metoden der laver SailRace når man trykker på modal knappen "create SailRace".
document.querySelector("#createSailRaceModalBtn").addEventListener('click', createSailRace)

// Function der skaffer vores form data og laver den om til et javascript objekt, og så poster det til backend.
function createSailRace(){
    const createModalForm = document.querySelector("#modalFormCreateSailRace")
    const SailRaceObjekt = preparePlainFormData(createModalForm) // vi laver alt input fra formen om til et javascript objekt.
    fetchAny("sailrace", "POST", SailRaceObjekt).then(SailRace => {
        alert("Created SailRace: " + SailRaceObjekt.id)
        console.log("Created SailRace: ", SailRace)
        window.location.reload()
    }).catch(error => {
        console.error(error)
    })

}

function deleteSailRace(event) {
    const sailRaceId = event.target.value
    fetchAny(`sailrace/${sailRaceId}`, "DELETE", null).then(sailRace => {
        alert(`SailRace med id: ${sailRaceId} og navn: ${sailRace.name} er blevet slettet`);
        console.log(sailRace.name);
        window.location.reload()

    }).catch(error => {
        console.error(error)

    })
}


function fetchAllRaces() {
    fetchAny("sailraces", "GET", null).then(sailRace => {
        console.log(sailRace)
        sailRace.forEach(sailRace => {
            fillRowsInTable(sailRace)})}).catch(error => {
        console.error(error);
    })
}
function sortRacesByDate() { //FUNKTION DER SKULLE SORTERE MED DATOER, MEN NÅEDE IKKE AT REGNE UD HVORDAN
    const tableBodyRaces = document.querySelector("#tblBodyRaces")

    // Retrieve the table rows as an array
    const tableRowsArray = Array.from(tableBodyRaces.children);

    // Sort the table rows based on the party name
    const sortedRows = tableRowsArray.sort((rowA, rowB) => {
        // Extract the party names from each row
        const partyA = rowA.children[2].innerText.toLowerCase();
        const partyB = rowB.children[2].innerText.toLowerCase();

        // Compare the party names using localeCompare for case-insensitive sorting
        return partyA.localeCompare(partyB);
    });

    // Clear existing rows from the table body
    while (tableBodyRaces.firstChild) {
        tableBodyRaces.removeChild(tableBodyRaces.firstChild);
    }

    // Append the sorted rows back to the table body
    sortedRows.forEach(row => {
        tableBodyRaces.appendChild(row);
    });
}

// Denne metode laver et form element om til et javascript objekt vi kalder plainFormData.
function preparePlainFormData(form) {
    console.log("Received the Form:", form)
    const formData = new FormData(form)
    console.log("Made the form in to FormData:", formData)
    const plainFormData = Object.fromEntries(formData.entries())
    console.log("Changes and returns the FormData as PlainFormData:", plainFormData)
    return plainFormData
}

