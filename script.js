let display = document.getElementById('display');
let buttons = Array.from(document.getElementsByTagName('button'));

let currentValue = '0';
let pendingOperation = null;
let pendingValue = null;

function updateDisplay() {
    display.innerText = currentValue;
    animateDisplay();
}

function animateDisplay() {
    display.style.animation = 'none';
    display.offsetHeight; // Trigger reflow
    display.style.animation = 'fadeIn 0.3s ease-out';
}

function clear() {
    currentValue = '0';
    pendingOperation = null;
    pendingValue = null;
    updateDisplay();
}

function handleNumber(num) {
    if (currentValue === '0') {
        currentValue = num;
    } else {
        currentValue += num;
    }
    updateDisplay();
}

function handleDecimal() {
    if (!currentValue.includes('.')) {
        currentValue += '.';
        updateDisplay();
    }
}

function handleOperator(op) {
    if (pendingOperation !== null) {
        calculate();
    }
    pendingOperation = op;
    pendingValue = parseFloat(currentValue);
    currentValue = '0';
}

function calculate() {
    if (pendingOperation === null || pendingValue === null) {
        return;
    }
    let current = parseFloat(currentValue);
    let result;
    switch (pendingOperation) {
        case '+':
            result = pendingValue + current;
            break;
        case '-':
            result = pendingValue - current;
            break;
        case '*':
            result = pendingValue * current;
            break;
        case '/':
            result = pendingValue / current;
            break;
    }
    currentValue = result.toString();
    pendingOperation = null;
    pendingValue = null;
    updateDisplay();
}

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        let value = e.target.value;

        // Add animation class
        button.classList.add('button-press');
        setTimeout(() => {
            button.classList.remove('button-press');
        }, 100);

        if (!isNaN(value) || value === '.') {
            if (value === '.') {
                handleDecimal();
            } else {
                handleNumber(value);
            }
        } else if (value === 'all-clear') {
            clear();
        } else if (value === '=') {
            calculate();
        } else {
            handleOperator(value);
        }
    });
});

// Initialize display
updateDisplay();

// Add keyboard support
document.addEventListener('keydown', function(event) {
    let key = event.key;
    let button = buttons.find(btn => btn.value === key);
    
    if (button) {
        button.click();
    } else if (key === 'Enter') {
        buttons.find(btn => btn.value === '=').click();
    } else if (key === 'Backspace') {
        currentValue = currentValue.slice(0, -1);
        if (currentValue === '') currentValue = '0';
        updateDisplay();
    }
});