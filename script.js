// Show the current date in "October 22, 2025 - Wednesday" format
function showCurrentDate() {
    const dateLabel = document.getElementById("current-date");
    const today = new Date();

    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsWeekday = { weekday: 'long' };

    const formattedDate = today.toLocaleDateString(undefined, optionsDate);
    const formattedWeekday = today.toLocaleDateString(undefined, optionsWeekday);

    dateLabel.textContent = `${formattedDate} - ${formattedWeekday}`;
}

// Show current time and update every second
function showCurrentTime() {
    const timeLabel = document.getElementById("current-time");

    setInterval(() => {
        const now = new Date();

        // Format time as HH:MM:SS AM/PM
        const formattedTime = now.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        timeLabel.textContent = formattedTime;
    }, 1000);
}

// Run both functions on page load
window.onload = () => {
    showCurrentDate();
    showCurrentTime();
};

const display = document.getElementById('calc-display');
const buttons = document.querySelectorAll('.numeric button');

let currentInput = ''; // stores the current expression

function updateDisplay() {
    display.value = currentInput || '0';
}

function sanitizeExpression(expr) {
    // Replace 'x' with '*' and '%' with '/100'
    return expr.replace(/x/gi, '*').replace(/%/g, '/100');
}

function computeResult() {
    try {
        const expression = sanitizeExpression(currentInput);
        const result = eval(expression);
        currentInput = result.toString();
        updateDisplay();
    } catch (err) {
        currentInput = '';
        display.value = 'Error';
    }
}

// Handle button clicks
buttons.forEach(button => {
    const value = button.textContent;

    button.addEventListener('click', () => {
        switch (button.id) {
            case 'equals':
                computeResult();
                break;

            case 'clear':
                currentInput = '';
                updateDisplay();
                break;

            case 'clear-entry':
            case 'backspace':
                currentInput = currentInput.slice(0, -1);
                updateDisplay();
                break;

            default:
                currentInput += value;
                updateDisplay();
                break;
        }
    });
});

// Handle keyboard input (including Esc and Delete)
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (!isNaN(key)) {
        // Number key pressed (0–9)
        currentInput += key;
    } else if (key === '.') {
        currentInput += key;
    } else if (['+', '-', '/', '*'].includes(key)) {
        currentInput += key;
    } else if (key === 'x' || key === 'X') {
        currentInput += '*';
    } else if (key === '%') {
        currentInput += '%';
    } else if (key === 'Backspace' || key === 'Delete') {
        currentInput = currentInput.slice(0, -1);
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        currentInput = '';
    } else if (key === 'Enter' || key === '=') {
        computeResult();
        return;
    }

    updateDisplay();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker failed:', err));
  });

  let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome from showing the default prompt
  e.preventDefault();

  // Save the event for later use
  deferredPrompt = e;

  // Show  custom install button or prompt UI here
  const installBtn = document.getElementById('install-button');
  if (installBtn) installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
      installBtn.style.display = 'none';
    });
  });
});

}
