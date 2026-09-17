// Az oldal betöltődésekor lefutó függvény (11. évfolyamos tananyag)
window.onload = function() {
    var formContainer = document.getElementById('form-container');
    var resultContainer = document.getElementById('result-container');

    if (formContainer) {
        generateForm(formContainer);
    }
    if (resultContainer) {
        displayResults(resultContainer);
    }
};

// Űrlap dinamikus létrehozása DOM segítségével
function generateForm(container) {
    // 1. Töltésjelző törlése a DOM-ból
    var loader = document.getElementById('loading');
    if (loader) {
        loader.remove();
    }

    // 2. Form elem létrehozása
    var form = document.createElement('form');
    form.id = 'foglalasForm';
    form.className = 'card p-4 shadow-sm mx-auto';
    form.style.maxWidth = '600px';

    var title = document.createElement('h3');
    title.innerText = 'Eszköz Foglalási Űrlap';
    title.className = 'mb-4 text-center text-primary';
    form.appendChild(title);

    // 1. MEZŐ: Név (text, minimum 3 karakter)
    form.appendChild(createInput('Nev', 'Teljes Név', 'text', true, 'minlength', '3'));

    // 2. MEZŐ: Email (email)
    form.appendChild(createInput('Email', 'E-mail cím', 'email', true));

    // 3. MEZŐ: Telefonszám (tel, minimum 9 karakter)
    form.appendChild(createInput('Telefon', 'Telefonszám', 'tel', true, 'minlength', '9'));

    // 4. MEZŐ: Dátum (date, minimum a mai nap)
    var today = new Date().toISOString().split('T')[0];
    form.appendChild(createInput('Datum', 'Bérlés napja', 'date', true, 'min', today));

    // 5. MEZŐ: Eszköz választó (Select)
    var selectDiv = document.createElement('div');
    selectDiv.className = 'mb-3';
    
    var selectLabel = document.createElement('label');
    selectLabel.className = 'form-label fw-bold';
    selectLabel.innerText = 'Választott eszköz';

    var select = document.createElement('select');
    select.id = 'Eszkoz';
    select.className = 'form-select';
    select.required = true;

    // A kért opciók tömbje
    var opciok = [
        '-- Kérjük válasszon eszközt --',
        '2 személyes vízibicikli',
        '4 személyes vízibicikli',
        '1 személyes kajak',
        '2 személyes kajak',
        '3 személyes kajak',
        'SUP'
    ];

    // Hagyományos for ciklus az opciók feltöltésére
    for (var i = 0; i < opciok.length; i++) {
        var opt = document.createElement('option');
        if (i === 0) {
            opt.value = ''; // Az első elem üres értékű
        } else {
            opt.value = opciok[i];
        }
        opt.innerText = opciok[i];
        select.appendChild(opt);
    }

    selectDiv.appendChild(selectLabel);
    selectDiv.appendChild(select);
    form.appendChild(selectDiv);

    // 6. MEZŐ: Időtartam (number, min 1, max 8 óra)
    var idotartamDiv = createInput('Idotartam', 'Bérlési idő (óra)', 'number', true, 'min', '1');
    var idotartamInput = idotartamDiv.querySelector('input');
    idotartamInput.setAttribute('max', '8');
    idotartamInput.value = '1';
    form.appendChild(idotartamDiv);

    // 7. MEZŐ: Megjegyzés (textarea, min 10 karakter)
    var textareaDiv = document.createElement('div');
    textareaDiv.className = 'mb-3';
    textareaDiv.innerHTML = '<label for="Megjegyzes" class="form-label fw-bold">Megjegyzés (min. 10 karakter)</label>' +
                            '<textarea id="Megjegyzes" class="form-control" rows="3" minlength="10" maxlength="200" placeholder="Pl.: Gyerekmentőmellény kell..." required></textarea>';
    form.appendChild(textareaDiv);

    // Beküldő gomb
    var submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn-primary w-100 mt-3';
    submitBtn.innerText = 'Foglalás Elküldése';
    form.appendChild(submitBtn);

    container.appendChild(form);

    // Eseménykezelő a beküldéshez
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Ne töltődjön újra az oldal

        // Értékek kiolvasása a mezőkből
        var nev = document.getElementById('Nev').value;
        var email = document.getElementById('Email').value;
        var telefon = document.getElementById('Telefon').value;
        var datum = document.getElementById('Datum').value;
        var eszkoz = document.getElementById('Eszkoz').value;
        var idotartam = document.getElementById('Idotartam').value;
        var megjegyzes = document.getElementById('Megjegyzes').value;

        // Külön JavaScript-es ellenőrzés (Validáció)
        if (megjegyzes.length < 10) {
            alert('A megjegyzésnek legalább 10 karakter hosszúnak kell lennie!');
            return;
        }

        // ADATOK MENTÉSE EGYESÉVEL SIMA SZÖVEGKÉNT (JSON NÉLKÜL!)
        localStorage.setItem('foglalas_nev', nev);
        localStorage.setItem('foglalas_email', email);
        localStorage.setItem('foglalas_telefon', telefon);
        localStorage.setItem('foglalas_datum', datum);
        localStorage.setItem('foglalas_eszkoz', eszkoz);
        localStorage.setItem('foglalas_idotartam', idotartam + ' óra');
        localStorage.setItem('foglalas_megjegyzes', megjegyzes);

        // Átirányítás a másik oldalra
        window.location.href = 'eredmeny.html';
    });
}

// Segédfüggvény űrlapelemek gyors létrehozásához
function createInput(id, labelText, type, isRequired, attrName, attrValue) {
    var div = document.createElement('div');
    div.className = 'mb-3';

    var label = document.createElement('label');
    label.setAttribute('for', id);
    label.className = 'form-label fw-bold';
    label.innerText = labelText;

    var input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.className = 'form-control';
    input.required = isRequired;

    if (attrName && attrValue) {
        input.setAttribute(attrName, attrValue);
    }

    div.appendChild(label);
    div.appendChild(input);
    return div;
}

// Eredmények megjelenítése az eredmeny.html oldalon (JSON NÉLKÜL)
function displayResults(container) {
    // Értékek kiolvasása egyesével a LocalStorage-ból
    var nev = localStorage.getItem('foglalas_nev');

    if (!nev) {
        container.innerHTML = '<p class="text-danger">Még nem történt foglalás!</p>';
        return;
    }

    var email = localStorage.getItem('foglalas_email');
    var telefon = localStorage.getItem('foglalas_telefon');
    var datum = localStorage.getItem('foglalas_datum');
    var eszkoz = localStorage.getItem('foglalas_eszkoz');
    var idotartam = localStorage.getItem('foglalas_idotartam');
    var megjegyzes = localStorage.getItem('foglalas_megjegyzes');

    // Egyszerű HTML szöveg összefűzése
    var html = '<ul class="list-group list-group-flush">' +
        '<li class="list-group-item"><strong>Név:</strong> ' + nev + '</li>' +
        '<li class="list-group-item"><strong>E-mail cím:</strong> ' + email + '</li>' +
        '<li class="list-group-item"><strong>Telefonszám:</strong> ' + telefon + '</li>' +
        '<li class="list-group-item"><strong>Bérlés dátuma:</strong> ' + datum + '</li>' +
        '<li class="list-group-item"><strong>Foglalt eszköz:</strong> ' + eszkoz + '</li>' +
        '<li class="list-group-item"><strong>Időtartam:</strong> ' + idotartam + '</li>' +
        '<li class="list-group-item"><strong>Megjegyzés:</strong> ' + megjegyzes + '</li>' +
        '</ul>';

    container.innerHTML = html;
}