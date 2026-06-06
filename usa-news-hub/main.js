// Set live date in topbar
const dateEl = document.getElementById('topbar-date');
if (dateEl) {
  dateEl.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// Category tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Duplicate ticker content for seamless loop
const tickerContent = document.querySelector('.ticker-content');
if (tickerContent) {
  tickerContent.innerHTML += tickerContent.innerHTML;
}
