window.onload = function () {

    var form = document.getElementById("form-container");
    var eredmeny = document.getElementById("result-container");

    if (form) {
        urlapLetrehozasa(form);
    }

    if (eredmeny) {
        eredmenyMegjelenitese(eredmeny);
    }
};


function urlapLetrehozasa(hely) {

    var toltes = document.getElementById("loading");

    if (toltes) {
        toltes.remove();
    }

    var form = document.createElement("form");

    form.id = "foglalasForm";
    form.className = "card p-4 shadow-sm mx-auto";
    form.style.maxWidth = "600px";

    var cim = document.createElement("h3");

    cim.innerText = "Eszköz Foglalási Űrlap";
    cim.className = "mb-4 text-center text-primary";

    form.appendChild(cim);

    form.appendChild(
        inputLetrehozasa("nev", "Teljes név", "text", 3)
    );

    form.appendChild(
        inputLetrehozasa("email", "E-mail cím", "email")
    );

    form.appendChild(
        inputLetrehozasa("telefon", "Telefonszám", "tel", 9)
    );

    var maiNap = new Date().toISOString().split("T")[0];

    var datum = inputLetrehozasa(
        "datum",
        "Bérlés napja",
        "date"
    );

    datum.querySelector("input").setAttribute("min", maiNap);

    form.appendChild(datum);

    var eszkozDiv = document.createElement("div");
    eszkozDiv.className = "mb-3";

    var eszkozLabel = document.createElement("label");
    eszkozLabel.innerText = "Választott eszköz";
    eszkozLabel.className = "form-label fw-bold";

    var eszkoz = document.createElement("select");
    eszkoz.id = "eszkoz";
    eszkoz.className = "form-select";
    eszkoz.required = true;

    var eszkozok = [
        "-- Kérjük válasszon eszközt --",
        "2 személyes vízibicikli",
        "4 személyes vízibicikli",
        "1 személyes kajak",
        "2 személyes kajak",
        "3 személyes kajak",
        "SUP"
    ];

    for (var i = 0; i < eszkozok.length; i++) {

        var opcio = document.createElement("option");

        opcio.innerText = eszkozok[i];

        if (i == 0) {
            opcio.value = "";
        } else {
            opcio.value = eszkozok[i];
        }

        eszkoz.appendChild(opcio);
    }

    eszkozDiv.appendChild(eszkozLabel);
    eszkozDiv.appendChild(eszkoz);

    form.appendChild(eszkozDiv);

    var ido = inputLetrehozasa(
        "ido",
        "Bérlési idő (óra)",
        "number"
    );

    var idoInput = ido.querySelector("input");

    idoInput.min = 1;
    idoInput.max = 8;
    idoInput.value = 1;

    form.appendChild(ido);

    var megjegyzesDiv = document.createElement("div");
    megjegyzesDiv.className = "mb-3";

    var megjegyzesLabel = document.createElement("label");

    megjegyzesLabel.innerText =
        "Megjegyzés (minimum 10 karakter)";

    megjegyzesLabel.className = "form-label fw-bold";

    var megjegyzes = document.createElement("textarea");

    megjegyzes.id = "megjegyzes";
    megjegyzes.className = "form-control";
    megjegyzes.rows = 3;
    megjegyzes.minLength = 10;
    megjegyzes.maxLength = 200;
    megjegyzes.placeholder =
        "Pl.: Gyerekmentőmellény kell...";
    megjegyzes.required = true;

    megjegyzesDiv.appendChild(megjegyzesLabel);
    megjegyzesDiv.appendChild(megjegyzes);

    form.appendChild(megjegyzesDiv);

    var gomb = document.createElement("button");

    gomb.type = "submit";
    gomb.className = "btn btn-primary w-100 mt-3";
    gomb.innerText = "Foglalás elküldése";

    form.appendChild(gomb);

    hely.appendChild(form);

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        var nev = document.getElementById("nev").value;
        var email = document.getElementById("email").value;
        var telefon = document.getElementById("telefon").value;
        var datum = document.getElementById("datum").value;
        var eszkoz = document.getElementById("eszkoz").value;
        var ido = document.getElementById("ido").value;
        var megjegyzes = document.getElementById("megjegyzes").value;

        if (megjegyzes.length < 10) {

            alert(
                "A megjegyzésnek legalább 10 karakter hosszúnak kell lennie!"
            );

            return;
        }

        localStorage.setItem("nev", nev);
        localStorage.setItem("email", email);
        localStorage.setItem("telefon", telefon);
        localStorage.setItem("datum", datum);
        localStorage.setItem("eszkoz", eszkoz);
        localStorage.setItem("ido", ido + " óra");
        localStorage.setItem("megjegyzes", megjegyzes);

        window.location.href = "eredmeny.html";
    });
}


function inputLetrehozasa(id, szoveg, tipus, minimum) {

    var div = document.createElement("div");
    div.className = "mb-3";

    var label = document.createElement("label");

    label.innerText = szoveg;
    label.className = "form-label fw-bold";
    label.setAttribute("for", id);

    var input = document.createElement("input");

    input.id = id;
    input.type = tipus;
    input.className = "form-control";
    input.required = true;

    if (minimum) {
        input.minLength = minimum;
    }

    div.appendChild(label);
    div.appendChild(input);

    return div;
}


function eredmenyMegjelenitese(hely) {

    var nev = localStorage.getItem("nev");

    if (!nev) {

        hely.innerHTML =
            '<p class="text-danger">Még nem történt foglalás!</p>';

        return;
    }

    var email = localStorage.getItem("email");
    var telefon = localStorage.getItem("telefon");
    var datum = localStorage.getItem("datum");
    var eszkoz = localStorage.getItem("eszkoz");
    var ido = localStorage.getItem("ido");
    var megjegyzes = localStorage.getItem("megjegyzes");

    hely.innerHTML =
        '<ul class="list-group list-group-flush">' +

        '<li class="list-group-item">' +
        '<strong>Név:</strong> ' + nev +
        '</li>' +

        '<li class="list-group-item">' +
        '<strong>E-mail cím:</strong> ' + email +
        '</li>' +

        '<li class="list-group-item">' +
        '<strong>Telefonszám:</strong> ' + telefon +
        '</li>' +

        '<li class="list-group-item">' +
        '<strong>Bérlés dátuma:</strong> ' + datum +
        '</li>' +

        '<li class="list-group-item">' +
        '<strong>Foglalt eszköz:</strong> ' + eszkoz +
        '</li>' +

        '<li class="list-group-item">' +
        '<strong>Időtartam:</strong> ' + ido +
        '</li>' +

        '<li class="list-group-item">' +
        '<strong>Megjegyzés:</strong> ' + megjegyzes +
        '</li>' +

        '</ul>';
}