/* ==========================================================
   main.js – saidi JavaScript
   Mida see fail teeb:
   1. Seab logosse spordile vastava emoji
   2. Lisab elementidele ilmumisanimatsiooni kerimisel
   3. Avab galerii pildid suurelt (lightbox)
   ========================================================== */

/* Kogu kood on mähitud "kohe käivituvasse funktsiooni" (IIFE):  (() => { ... })();
   See hoiab muutujad privaatsed, et nad ei läheks teiste skriptidega segamini */
(() => {

    /* ===== 1. LOGO EMOJI ===== */

    // Objekt: spordiala nimi -> emoji. Võti vastub HTML-i atribuudile <body data-sport="...">
    const symbols = { home: "🏆", football: "⚽", basketball: "🏀", volleyball: "🏐", about: "👥", events: "🏅", gallery: "📷" };

    // Leiame logos emoji elemendi (id="sport-ball")
    const sportBall = document.getElementById("sport-ball");

    // Kui element olemas on, paneme sinna emoji; kui ala pole tuntud, kasutame 🏆
    if (sportBall) sportBall.textContent = symbols[document.body.dataset.sport] || "🏆";

    /* ===== 2. ELEMENTIDE ILMUMINE KERIMISEL ===== */

    // Kõik elemendid, mis peavad kerimisel sujuvalt ilmuma
    const elements = document.querySelectorAll("main h1, main h2, .container > p, .hero, .card, .gallery img, .container > ul");

    // Kas kasutaja on seadnud süsteemis "vähem liikumist"? (ligipääsetavus)
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Käime kõik elemendid läbi
    elements.forEach((el, i) => {
        // Klass .reveal teeb elemendi algul nähtamatuks (vt CSS-is)
        el.classList.add("reveal");

        // Kaartidele anname viivituse, et nad ilmuksid ükshaaval
        if (el.classList.contains("card")) {
            el.style.setProperty("--reveal-delay", `${(i % 3) * 120}ms`);
        }

        // Kui animatsioone ei soovita või brauser ei toeta IntersectionObserverit,
        // näitame elemendi kohe
        if (reduceMotion || !("IntersectionObserver" in window)) {
            el.classList.add("is-visible");
        }
    });

    // Kui animatsioonid on lubatud, jälgime, millal element satub vaatevälja
    if (!reduceMotion && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                // Element on nähtavale tulnud
                if (e.isIntersecting) {
                    e.target.classList.add("is-visible"); // käivitab CSS-i ilmumisanimatsiooni
                    obs.unobserve(e.target);              // enam ei jälgi (animatsioon käib ainult üks kord)
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }); // käivitub, kui 12% elemendist on nähtav (ja 35px enne ekraani serva)

        // Alustame kõigi elementide jälgimist
        elements.forEach(el => observer.observe(el));
    }

    /* ===== 3. GALERII PILTIDE SUURENDAMINE (LIGHTBOX) ===== */

    const galleryImages = document.querySelectorAll(".gallery img");

    // Teeme seda ainult lehtedel, kus galerii on olemas
    if (galleryImages.length) {
        // Loome lightboxi HTML-i JavaScriptiga: tume taust, sulgemisnupp (×) ja suur pilt
        const lb = document.createElement("div");
        lb.className = "lightbox";
        lb.innerHTML = `<button class="lightbox-close">&times;</button><img class="lightbox-image">`;
        document.body.appendChild(lb); // lisame lehe lõppu

        const lbImage = lb.querySelector(".lightbox-image");

        // Funktsioon lightboxi sulgemiseks
        const closeLb = () => lb.classList.remove("is-open");

        // Pildile klõpsamisel: kopeerime pildi aadressi suurele pildile ja avame lightboxi
        galleryImages.forEach(img => {
            img.addEventListener("click", () => {
                lbImage.src = img.src;
                lb.classList.add("is-open");
            });
        });

        // Sulgemine: x nupu vajutus
        lb.querySelector(".lightbox-close").addEventListener("click", closeLb);
        // Sulgemine: klõps tumedale taustale
        lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
        // Sulgemine: Esc-klahv
        document.addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });
    }
})();
