document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reviewForm');
    const confirmationMessage = document.getElementById('confirmation-message');
    const formContainer = document.getElementById('form-container');
    const counterDisplay = document.getElementById('counter-display');
    const storageKey = 'reviewCount';

    // 1. Initialize and Display Counter
    function updateCounterDisplay() {
        let count = localStorage.getItem(storageKey);
        // Ensure count is a number, default to 0
        count = count ? parseInt(count) : 0;
        counterDisplay.textContent = count;
    }

    updateCounterDisplay();

    // 2. Handle Form Submission
    form.addEventListener('submit', (event) => {
        // Prevent the form from performing its default submission action
        event.preventDefault();

        // Update the counter
        let currentCount = localStorage.getItem(storageKey);
        currentCount = currentCount ? parseInt(currentCount) + 1 : 1;

        // Store the new count back in localStorage
        localStorage.setItem(storageKey, currentCount);

        // Update the display text in the confirmation message
        counterDisplay.textContent = currentCount;

        // Hide the form and show the confirmation message
        form.classList.add('hidden');
        confirmationMessage.classList.remove('hidden');
    });

    // Optional: If the user refreshes the confirmation page, show the form again 
    // (This is handled by the a href link, but useful if navigating back)
    if (form.classList.contains('hidden') && confirmationMessage.classList.contains('hidden')) {
        form.classList.remove('hidden');
    }
});