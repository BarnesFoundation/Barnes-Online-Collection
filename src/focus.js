let activeElement;

const FOCUS_ATTRIBUTE = 'is-focused';

// Listen for document tabs.
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        if (activeElement) {
            activeElement.removeAttribute(FOCUS_ATTRIBUTE);
        }

        // After the current event loop, run function that adds border.
        setTimeout(() => {
            activeElement = document.activeElement;
            activeElement.setAttribute(FOCUS_ATTRIBUTE, true);
        }, 0);
    }

    if (
        e.key === 'Escape' &&
        activeElement
    ) {
        activeElement.removeAttribute(FOCUS_ATTRIBUTE);
    }
});

// Click event acts as an unfocus.
document.addEventListener('click', () => {
    if (activeElement) {
        activeElement.removeAttribute(FOCUS_ATTRIBUTE);
    }
});