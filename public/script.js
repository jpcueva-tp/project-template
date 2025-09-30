document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('actionButton');
    const message = document.getElementById('message');

    if (button && message) {
        button.addEventListener('click', () => {
            message.textContent = 'Button clicked!';
            console.log('Action button clicked');
        });
    }
});
