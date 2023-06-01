// Dette er standard URL til vores restcontrollers/backend, skift det ud, hvis backenden er på f.eks. Azure, husk det skal slutte med et '/'
const localHostURL = "http://localhost:8080/"

// Dette er en metode til at skabe et request object, som bruges af de andre metoder
function createRequest(method, entity) {
    const requestObject = {
        method: method,
        headers: {
            "content-type": "application/json"
        }
    }
    // Entity er det vi kommer ind i vores request body. Det laver vi om til Json og sætter ind i body, hvis ikke det er null.
    if (entity !== null) requestObject.body = JSON.stringify(entity)
    return requestObject
}

// Dette er en metode, de andre metoder bruger til at hente enten noget Json eller et Error object
async function fetchResponse(url, request) {
    let errorMessage;
    console.log(`Will try to fetch a response from the URL: ${url} using the Request Object:`, request)
    try {
        // Vi fetcher et objekt
        let responseEntity = await fetch(url, request)
        console.log(`It was a success reaching the URL: ${url} and we received the Response Entity:`, responseEntity)
        // Vi laver vores objekt om til Json
        let responseData = await responseEntity.json()
        console.log(`It was possible to pull the following data and convert it to Json from the response the Data Object:`, responseData)

        if (responseEntity.ok) {
            console.log(`It was accepted by the URL: ${url} using the Request Method: ${request.method}`)
            return responseData
        }
        // Her fanger vi de fejl der kommer fra vores backend
        // hvis ikke response er = responseEntity.OK så..
        // Hvis ikke vores responseEntity er .OK, så returner den en ErrorMessage class objekt. Dvs vi kan få fat i den.
        errorMessage = responseData.message
        const indexOfTheActualMessage = errorMessage.indexOf(': ') + 2 // Her finder vi index'et hvor der står fx "Resource not found exception:
        // Her fjerne vi bare der hvor der står fx "Resource not found exception:" inde i vores ExceptionHandler, så vi kun får exception messagen
        const actualErrorMessage = errorMessage.slice(indexOfTheActualMessage) // slice gør at alt fra det index du har valgt, hen til slutningen forbliver i din string.

        console.error(`It was NOT accepted by the URL: '${url}' using the Request Method: '${request.method}'`)
        console.error(`Receiving from the backend the error message: '${errorMessage}'`)
        errorMessage = actualErrorMessage

    } catch (error) { // Catch fanger de fejl som fx at kalde en url der ikke eksistere, alle de fejl der sker når man kalder fetch eller skal lave noget om til json
        if (error.message === "Failed to fetch") error.message = `Failed to establish contact to the backend/rest-url: ${localHostURL}`;
        errorMessage = error.message
        console.error(`Trying to use the method 'fetchResponse' we caught the Error: '${errorMessage}'`)
    }
    return new Error(errorMessage)
}
// Kan bruges til Get, Post, Put og Delete
async function fetchAny(fetchUrl, fetchMethod, objectBody) {
    const fullURL = localHostURL + fetchUrl
    const requestObject = createRequest(fetchMethod, objectBody) // Hvis du laver fetch med en GET/DELETE, så er objectBody bare null
    const fetchedObject = await fetchResponse(fullURL, requestObject)

    if (fetchedObject instanceof Error) {
        throw new Error(fetchedObject.message)
    }
    return fetchedObject;
}

// Denne metode laver et form element om til et javascript objekt vi kalder plainFormData.
function preparePlainFormData(form) {
    console.log("Received the Form:", form)
    const formData = new FormData(form)  // indbygget metode, behøves ikke forstås.
    console.log("Made the form in to FormData:", formData)
    const plainFormData = Object.fromEntries(formData.entries())
    console.log("Changes and returns the FormData as PlainFormData:", plainFormData)
    return plainFormData
}