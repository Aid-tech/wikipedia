async function requestSubmit(event) {
    event.preventDefault();
    const inputValue = document.querySelector('.js-search-input').value;
    const searchQuery = inputValue.trim();
    document.querySelector('.js-search-input').disabled = true;
    document.querySelector('.js-search-results').innerHTML = ''; 
    try {
        const results = await searchWikipedia(searchQuery);
        if (results.query.searchinfo.totalhits === 0) {
            errorMessage (`Nous sommes désolés nous n'arrivons pas à trouver ce que vous demandez ${searchQuery}`);
            document.querySelector('.js-search-input').disabled = false;
            document.querySelector('.js-search-input').value = '';
            return;
        }

        displayResults(results);
    } catch (err) {
        errorMessage (`Nous sommes désolés nous n'arrivons pas à trouver ce que vous demandez ${searchQuery}`);
    }
    document.querySelector('.js-search-input').disabled = false;
    document.querySelector('.js-search-input').value = '';
}

async function searchWikipedia(searchQuery) {
    const request = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
    const response = await fetch(request);
    console.log(response);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    const jsonFile = await response.json();
    return jsonFile;
}

function displayResults(results) {
    const searchResults = document.querySelector('.js-search-results');
    let i = 0
    results.query.search.forEach((result) => {
        // if(i >= 10) {
            const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

            searchResults.insertAdjacentHTML(
                'beforeend',
                `<div class="result-item">
                    <h3 class="result-title">
                        <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
                    </h3>
                    <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
                    <span class="result-snippet">${result.snippet}</span><br>
                </div>`
            );
        // }
        i++;
    });
}

function errorMessage (message){
    const p = document.createElement('p');
    p.innerHTML = message;
    p.style.textAlign = 'center';
    p.style.color = 'red';
    document.querySelector('.js-search-form').insertAdjacentElement('beforeend', p);
    setTimeout(()=>{
        document.querySelector('.js-search-form').removeChild(p);
    }, 5000);
}

document.querySelector('.js-search-form').addEventListener('submit', requestSubmit);