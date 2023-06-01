document.addEventListener("DOMContentLoaded", runFetchAllBoats) // Når siden starter, så runner vi vores hovedmetode i vores script vi har kaldt runFetchAllBoats.

// Vi skaffer vores table body
let tableBodyBoats = document.querySelector("#tblBodyBoats")

// Det her er vores "init" metode. Den køre hele scriptet.
function runFetchAllBoats() {
    fetchAllBoats()
}

// Her fylder vi vores html tabel med boats
function fillRowsInTable(sailboat) {
    console.log(sailboat)
    const tableRow = document.createElement("tr");
    // Vi giver hver table row et unikt id som er boatRow-"id". Dette skal bruges til at slette hver row senere.
    tableRow.id = `boatRow-${sailboat.id}`
    tableRow.innerHTML = `
        <td>${sailboat.id}</td>
        <td>${sailboat.name}</td>
        <td>${sailboat.type}</td>
        <td>${sailboat.point}</td>
        <td>${sailboat.listOfRaceSeason}</td>
        <td><button class="btn btn-primary" id="updateSailboatKnap-${sailboat.id}" value="${sailboat.id}" data-bs-toggle="modal" data-bs-target="#updateSailboatModal">Update</button></td>
        <td><button class="btn btn-primary" id="deleteSailboatKnap-${sailboat.id}" value="${sailboat.id}">Delete</button></td>
        `;

    // Vi appender én row ad gangen vi laver til vores tableBodyBoats.
    tableBodyBoats.appendChild(tableRow);

    // Vi laver en eventlistener på hver update knap der kalder addHiddenIdToInputField metoden, som adder sailboat id til et hidden form input felt
    document.querySelector(`#updateSailboatKnap-${sailboat.id}`).addEventListener('click', addHiddenIdToInputField)

    // Vi laver en eventListener på hver delete knap vi skaber.
    document.querySelector(`#deleteSailboatKnap-${sailboat.id}`).addEventListener('click', deleteSailboat)
}

// Vi har lavet et hidden input field i vores update modals form, som vi lægger vores Sailboats id over i. Man kan ikke update/put uden at give et id med
function addHiddenIdToInputField(event){
    const SailboatId = event.target.value // vores event er knap trykket, og fordi knappen er givet value == Sailboatens id, kan vi får fat i id'et
    document.querySelector("#updateIdFormHiddenInput").value = SailboatId; // man kunne honestly også bare have gemt vores event.target.value i en global variabel her, i stedet for i et hidden field. Nok nemmere.
}

document.querySelector("#updateSailboatModalBtn").addEventListener('click', updateSailboat)

function updateSailboat(){
    const updateModalForm = document.querySelector("#modalFormUpdateSailboat")
    const SailboatObjekt = preparePlainFormData(updateModalForm) // vi laver alt input fra formen om til et javascript objekt.
    const SailboatId = document.querySelector("#updateIdFormHiddenInput").value; // Vi skaffer Sailboaten id fra det hidden form input felt.
    SailboatObjekt.id = SailboatId; // Vi sætter vores SailboatObjekt id til at være lig dette id vi hentede fra hidden input feltet,

    fetchAny("sailboat", "PUT", SailboatObjekt).then(Sailboat => {
        console.log("Updated Sailboat: ", Sailboat)
        alert("Updated Sailboat: " + SailboatObjekt.name)
        window.location.reload()
    }).catch(error => {
        console.error(error)
    })
}


document.querySelector("#createSailboatModalBtn").addEventListener('click', createSailboat)

// Function der skaffer vores form data og laver den om til et javascript objekt, og så poster det til backend.
function createSailboat(){
    const createModalForm = document.querySelector("#modalFormCreateSailboat")
    const SailboatObjekt = preparePlainFormData(createModalForm) // vi laver alt input fra formen om til et javascript objekt.
    fetchAny("sailboat", "POST", SailboatObjekt).then(Sailboat => {
        alert("Created Sailboat: " + SailboatObjekt.id)
        console.log("Created Sailboat: ", Sailboat) // hvis det lykkedes log'er vi Sailboaten.
        window.location.reload()
    }).catch(error => {
        console.error(error)
    })

}


// Metoder der får fat i dropdown menuen i modallen, og sætter alle partierne ind som valgmulighederne, ved at fetche dem fra backend og lave et liste element med hver af dem.


document.querySelector("#updateSailboatModalBtn").addEventListener("click", updateSailboat)

function deleteSailboat(event) {
    const sailboatId = event.target.value
    fetchAny(`sailboat/${sailboatId}`, "DELETE", null).then(sailboat => {
        alert(`Sailboat med id: ${sailboatId} og navn: ${sailboat.name} er blevet slettet`);
        console.log(sailboat.name);
        window.location.reload()
    }).catch(error => {
        console.error(error)

    })
}


function fetchAllBoats() {
    fetchAny("sailboats", "GET", null).then(sailboat => {
        console.log(sailboat)
        // Vi fetcher Sailboats og hvis det er en success .then:
        sailboat.forEach(sailboat => { // For hver sailboat i vores liste af sailboat gør vi følgende
            fillRowsInTable(sailboat)
        })
    }).catch(error => { // hvis vi får en error, catcher vi den og gør følgende:
        console.error(error);
    })
}

function sortBoatsByPoints() {
    const tableBodyBoats = document.querySelector("#tblBodyBoats")

    // Retrieve the table rows as an array
    const tableRowsArray = Array.from(tableBodyBoats.children);

    // Sort the table rows based on the party name
    const sortedRows = tableRowsArray.sort((rowA, rowB) => {
        // Extract the party names from each row
        const partyA = rowA.children[2].innerText.toLowerCase();
        const partyB = rowB.children[2].innerText.toLowerCase();

        // Compare the party names using localeCompare for case-insensitive sorting
        return partyA.localeCompare(partyB);
    });

    // Clear existing rows from the table body
    while (tableBodyBoats.firstChild) {
        tableBodyBoats.removeChild(tableBodyBoats.firstChild);
    }

    // Append the sorted rows back to the table body
    sortedRows.forEach(row => {
        tableBodyBoats.appendChild(row);
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
