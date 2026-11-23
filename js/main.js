(() => {

    const symbols = { home: "🏆", football: "⚽", basketball: "🏀", volleyball: "🏐", about: "👥", events: "🏅", gallery: "📷" };
    const sportBall = document.getElementById("sport-ball");
    if (sportBall) sportBall.textContent = symbols[document.body.dataset.sport] || "🏆";

    const elements = document.querySelectorAll("main h1, main h2, .container > p, .hero, .card, .gallery img, .container > ul");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    elements.forEach((el, i) => {
        el.classList.add("reveal");
        if (el.classList.contains("card")) {
            el.style.setProperty("--reveal-delay", `${(i % 3) * 120}ms`);
        }
        if (reduceMotion || !("IntersectionObserver" in window)) {
            el.classList.add("is-visible");
        }
    });

    if (!reduceMotion && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add("is-visible");
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
        
        elements.forEach(el => observer.observe(el));
    }

    // 3. Увеличение картинок в галерее (лайтбокс)
    const galleryImages = document.querySelectorAll(".gallery img");
    if (galleryImages.length) {
        const lb = document.createElement("div");
        lb.className = "lightbox";
        lb.innerHTML = `<button class="lightbox-close">&times;</button><img class="lightbox-image">`;
        document.body.appendChild(lb);

        const lbImage = lb.querySelector(".lightbox-image");
        const closeLb = () => lb.classList.remove("is-open");

        galleryImages.forEach(img => {
            img.addEventListener("click", () => {
                lbImage.src = img.src;
                lb.classList.add("is-open");
            });
        });

        lb.querySelector(".lightbox-close").addEventListener("click", closeLb);
        lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
        document.addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });
    }

    document.addEventListener("DOMContentLoaded", () => {
        const burgerBtn = document.querySelector(".burger-btn");
        const closeBtn = document.querySelector(".close-btn");
        const navLinks = document.querySelector(".nav-links");
        const overlay = document.querySelector(".overlay");

        const toggleMenu = () => {
            navLinks.classList.toggle("is-open");
            overlay.classList.toggle("is-active");
        };

        if (burgerBtn) burgerBtn.addEventListener("click", toggleMenu);
        if (closeBtn) closeBtn.addEventListener("click", toggleMenu);
        if (overlay) overlay.addEventListener("click", toggleMenu);
    });
})();