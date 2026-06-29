// Kamden McKinney - Palindrome Checker 
const inputElement = document.getElementById('inputText');
const resultElement = document.getElementById('result');

function checkPalindrome() {
    const text = inputElement.value;
    
    if (text === '') {
        resultElement.innerHTML = 'Please enter some text';
        resultElement.classList.add('show');
        return;
    }
    
    // Remove spaces and convert to lowercase
    const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Reverse the string
    let reversed = '';
    for (let i = cleaned.length - 1; i >= 0; i--) {
        reversed += cleaned[i];
    }
    
    // Check if palindrome
    if (cleaned === reversed) {
        resultElement.innerHTML = 'This is a palindrome!';
        resultElement.classList.remove('not-palindrome');
        resultElement.classList.add('palindrome', 'show');
    } else {
        resultElement.innerHTML = 'This is not a palindrome';
        resultElement.classList.remove('palindrome');
        resultElement.classList.add('not-palindrome', 'show');
    }
}

const checkButton = document.getElementById('checkButton');

if (checkButton) {
    checkButton.addEventListener('click', checkPalindrome);
}

inputElement.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPalindrome();
    }
});