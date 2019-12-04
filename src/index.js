console.log('Hello World');

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');
    const newElement = document.createElement('h1');
    newElement.innerText = 'Hello World';
    container.appendChild(newElement);
});