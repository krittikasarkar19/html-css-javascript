
const billingToggle = document.getElementById("billingToggle");

const priceAmounts = document.querySelectorAll(".amount");
const pricePeriods = document.querySelectorAll(".period");

const pricingCards = document.querySelectorAll(".card");

const selectionMessage = document.getElementById("selectionMessage");

// Monthly / Yearly Billing
billingToggle.addEventListener("change", () => {

    const isYearly = billingToggle.checked;

    priceAmounts.forEach(amount => {

        const monthlyPrice = Number(amount.dataset.monthly);

        let newPrice;

        if (isYearly) {
            // 20% yearly discount
            newPrice = (monthlyPrice * 12 * 0.8).toFixed(2);
        } else {
            newPrice = monthlyPrice;
        }

        amount.classList.add("updating");

        amount.textContent = newPrice;

        requestAnimationFrame(() => {
            amount.classList.remove("updating");
        });

    });

    pricePeriods.forEach(period => {

        period.textContent = isYearly ? "/year" : "/month";

    });

});


// Plan Selection
pricingCards.forEach(card => {

    const button = card.querySelector(".btn");

    button.addEventListener("click", () => {

        // Remove previous selection
        pricingCards.forEach(item => {
            item.classList.remove("selected");
        });

        // Highlight selected card
        card.classList.add("selected");

        // Get selected plan details
        const planName = card.dataset.plan;

        const price = card.querySelector(".amount").textContent;

        const period = card.querySelector(".period").textContent;

        // Display confirmation message
        selectionMessage.textContent =
            `You selected the ${planName} plan at $${price}${period}.`;

        selectionMessage.classList.add("show");

        // Scroll to confirmation
        selectionMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

});
