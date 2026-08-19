// OPEN POPUP IN CONTACT MODE
function openContactPopup() {
    document.getElementById("popupOverlay").style.display = "flex";

    document.getElementById("popupTitle").innerText = "Contact Us";
    document.getElementById("contactForm").style.display = "block";
    document.getElementById("demoForm").style.display = "none";

    resetPopup();
}

// OPEN POPUP IN DEMO/PLAN MODE
function openDemoPopup(planName) {
    document.getElementById("popupOverlay").style.display = "flex";

    document.getElementById("popupTitle").innerText = "Book a Package";
    document.getElementById("contactForm").style.display = "none";
    document.getElementById("demoForm").style.display = "block";

    document.getElementById("selectedPlan").value = planName;

    resetPopup();
}

// CLOSE POPUP
function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";
    resetPopup();
}

// RESET FORM STATE
function resetPopup() {
    const msgBox = document.getElementById("formMessage");
    msgBox.style.display = "none";
    msgBox.innerText = "";

    document.querySelectorAll(".popup-form").forEach(f => {
        f.reset();
        const btn = f.querySelector(".submit-btn");

        if (btn) {
            btn.disabled = false;
            btn.innerText = "Submit";
        }
    });
}

/* ==========================================================
   CONTACT FORM SUBMISSION → /contact
========================================================== */
document.getElementById("contactForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const msgBox = document.getElementById("formMessage");
    const btn = form.querySelector(".submit-btn");

    btn.disabled = true;
    btn.innerText = "Sending...";

    const data = Object.fromEntries(new FormData(form));

    try {
        const res = await fetch("/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            form.style.display = "none";
            msgBox.style.display = "block";
            msgBox.style.color = "green";
            msgBox.innerText = "Thank you! We will contact you soon.";
            return; // DO NOT re-enable button here
        }

        msgBox.style.display = "block";
        msgBox.style.color = "red";
        msgBox.innerText = "Something went wrong. Try again.";

    } catch {
        msgBox.style.display = "block";
        msgBox.style.color = "red";
        msgBox.innerText = "Server error. Try again later.";
    }

    // Only enable again if there's an error
    btn.disabled = false;
    btn.innerText = "Submit";
});

/* ==========================================================
   DEMO FORM SUBMISSION → /demo
========================================================== */
document.getElementById("demoForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const msgBox = document.getElementById("formMessage");
    const btn = form.querySelector(".submit-btn");

    btn.disabled = true;
    btn.innerText = "Sending...";

    const data = Object.fromEntries(new FormData(form));

    try {
        const res = await fetch("/demo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            form.style.display = "none";
            msgBox.style.display = "block";
            msgBox.style.color = "green";
            msgBox.innerText = "Thank you! We will contact you soon.";
            return; 
        }

        msgBox.style.display = "block";
        msgBox.style.color = "red";
        msgBox.innerText = "Something went wrong. Try again.";

    } catch {
        msgBox.style.display = "block";
        msgBox.style.color = "red";
        msgBox.innerText = "Server error. Try again later.";
    }

    btn.disabled = false;
    btn.innerText = "Submit";
});

/* ==========================================================
   PRICING PLAN BUTTONS → Open Demo Popup with Plan Name
========================================================== */
document.querySelectorAll(".price-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const plan = btn.getAttribute("data-plan") || "Enterprise";
        openDemoPopup(plan);
    });
});