/**
 * Luka Marinkovic - Portfolio Interactivity & Animations
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Theme Switcher (Dark / Light Mode)
    const temaKnapp = document.querySelector("#tema");
    const savedTheme = localStorage.getItem("luka_theme");

    if (savedTheme === "dark") {
        document.body.classList.add("morkt");
    }

    if (temaKnapp) {
        temaKnapp.addEventListener("click", () => {
            document.body.classList.toggle("morkt");
            const isDark = document.body.classList.contains("morkt");
            localStorage.setItem("luka_theme", isDark ? "dark" : "light");
            showToast(isDark ? "Mörkt tema aktiverat" : "Ljust tema aktiverat");
        });
    }

    // 2. Mobile Menu Toggle
    const mobileToggle = document.querySelector("#mobile-toggle");
    const huvudMeny = document.querySelector(".huvudmeny");
    const navLinks = document.querySelectorAll(".nav-link");

    if (mobileToggle && huvudMeny) {
        mobileToggle.addEventListener("click", () => {
            const isOpen = huvudMeny.classList.toggle("nav-open");
            mobileToggle.classList.toggle("is-active", isOpen);
            mobileToggle.setAttribute("aria-expanded", isOpen);
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                huvudMeny.classList.remove("nav-open");
                mobileToggle.classList.remove("is-active");
                if (mobileToggle) {
                    mobileToggle.setAttribute("aria-expanded", "false");
                }
            });
        });

        // Close on click outside
        document.addEventListener("click", (e) => {
            if (huvudMeny.classList.contains("nav-open") && !huvudMeny.contains(e.target) && !mobileToggle.contains(e.target)) {
                huvudMeny.classList.remove("nav-open");
                mobileToggle.classList.remove("is-active");
                mobileToggle.setAttribute("aria-expanded", "false");
            }
        });

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && huvudMeny.classList.contains("nav-open")) {
                huvudMeny.classList.remove("nav-open");
                mobileToggle.classList.remove("is-active");
                mobileToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // 3. Active Nav Link on Scroll (ScrollSpy)
    const sections = document.querySelectorAll("section[id]");

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute("id");
            const correspondingLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove("active"));
                    correspondingLink.classList.add("active");
                }
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });

    // 4. Portfolio / Competence Grid Filtering
    const filterButtons = document.querySelectorAll(".filter-btn");
    const gridCards = document.querySelectorAll(".work-grid .grid-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-selected", "false");
            });

            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");

            const filterValue = btn.getAttribute("data-filter");

            gridCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category") || "";

                if (filterValue === "all" || cardCategory.includes(filterValue)) {
                    card.style.display = "flex";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(15px)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 250);
                }
            });
        });
    });

    // 5. Copy Email to Clipboard
    const copyEmailBtn = document.querySelector("#copy-email-trigger");
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener("click", async () => {
            const email = "luk.marinkovic@gmail.com";
            try {
                await navigator.clipboard.writeText(email);
                showToast("E-postadress kopierad till urklipp!");
            } catch (err) {
                // Fallback for browsers without clipboard permissions
                const textarea = document.createElement("textarea");
                textarea.value = email;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
                showToast("E-postadress kopierad till urklipp!");
            }
        });
    }

    // 6. Toast Notification Function
    function showToast(message) {
        let toast = document.querySelector("#toast");
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }
});