// ATM Simulator JavaScript Functions

// Sample user data (in a real application, this would come from a database)
let currentUser = {
    accountNumber: "123456789",
    pin: "1234",
    balance: 5000.00,
    loanDebt: 15000.00,
    creditCardDebt: 7500.00
};

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
}

// Login function
function login(accountNumber, pin) {
    if (accountNumber === currentUser.accountNumber && pin === currentUser.pin) {
        localStorage.setItem('loggedIn', 'true');
        return true;
    }
    return false;
}

// Logout function
function logout() {
    localStorage.removeItem('loggedIn');
}

// Get current balance
function getBalance() {
    return currentUser.balance;
}

// Withdraw money
function withdraw(amount) {
    if (amount <= 0) {
        return { success: false, message: "Geçersiz tutar!" };
    }
    
    if (amount > currentUser.balance) {
        return { success: false, message: "Yetersiz bakiye!" };
    }
    
    currentUser.balance -= amount;
    return { success: true, message: `${amount.toFixed(2)} ₺ başarıyla çekildi.` };
}

// Deposit money
function deposit(amount) {
    if (amount <= 0) {
        return { success: false, message: "Geçersiz tutar!" };
    }
    
    currentUser.balance += amount;
    return { success: true, message: `${amount.toFixed(2)} ₺ başarıyla yatırıldı.` };
}

// Get loan debt
function getLoanDebt() {
    return currentUser.loanDebt;
}

// Calculate minimum payment
function calculateMinimumPayment(debt, interestRate, minimumRate) {
    // Simple calculation: minimum payment is a percentage of the debt plus interest
    const interestAmount = debt * (interestRate / 100);
    const minimumPayment = debt * (minimumRate / 100);
    return minimumPayment + interestAmount;
}

// DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const accountNumber = document.getElementById('accountNumber').value;
            const pin = document.getElementById('pin').value;
            const messageDiv = document.getElementById('loginMessage');
            
            if (login(accountNumber, pin)) {
                messageDiv.innerHTML = '<div class="result-message success">Giriş başarılı! Yönlendiriliyorsunuz...</div>';
                setTimeout(() => {
                    window.location.href = 'balance.html';
                }, 1500);
            } else {
                messageDiv.innerHTML = '<div class="result-message error">Hatalı hesap numarası veya PIN!</div>';
            }
        });
    }
    
    // Display balance on balance page
    const balanceElement = document.getElementById('balanceAmount');
    if (balanceElement) {
        if (isLoggedIn()) {
            balanceElement.textContent = getBalance().toFixed(2) + ' ₺';
        } else {
            window.location.href = 'login.html';
        }
    }
    
    // Handle withdrawal form submission
    const withdrawForm = document.getElementById('withdrawForm');
    if (withdrawForm) {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }
        
        // Display current balance
        document.getElementById('balanceAmount').textContent = getBalance().toFixed(2) + ' ₺';
        
        withdrawForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('withdrawAmount').value);
            const messageDiv = document.getElementById('withdrawMessage');
            
            const result = withdraw(amount);
            if (result.success) {
                messageDiv.innerHTML = `<div class="result-message success">${result.message}</div>`;
                // Update balance display
                document.getElementById('balanceAmount').textContent = getBalance().toFixed(2) + ' ₺';
                // Reset form
                withdrawForm.reset();
            } else {
                messageDiv.innerHTML = `<div class="result-message error">${result.message}</div>`;
            }
        });
    }
    
    // Handle deposit form submission
    const depositForm = document.getElementById('depositForm');
    if (depositForm) {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }
        
        // Display current balance
        document.getElementById('balanceAmount').textContent = getBalance().toFixed(2) + ' ₺';
        
        depositForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('depositAmount').value);
            const messageDiv = document.getElementById('depositMessage');
            
            const result = deposit(amount);
            if (result.success) {
                messageDiv.innerHTML = `<div class="result-message success">${result.message}</div>`;
                // Update balance display
                document.getElementById('balanceAmount').textContent = getBalance().toFixed(2) + ' ₺';
                // Reset form
                depositForm.reset();
            } else {
                messageDiv.innerHTML = `<div class="result-message error">${result.message}</div>`;
            }
        });
    }
    
    // Display loan debt on loan page
    const loanAmountElement = document.getElementById('loanAmount');
    if (loanAmountElement) {
        if (isLoggedIn()) {
            loanAmountElement.textContent = getLoanDebt().toFixed(2) + ' ₺';
        } else {
            window.location.href = 'login.html';
        }
    }
    
    // Handle minimum payment calculation
    const minimumPaymentForm = document.getElementById('minimumPaymentForm');
    if (minimumPaymentForm) {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }
        
        // Display current credit card debt
        document.getElementById('loanAmount').textContent = currentUser.creditCardDebt.toFixed(2) + ' ₺';
        
        minimumPaymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const interestRate = parseFloat(document.getElementById('interestRate').value);
            const minimumRate = parseFloat(document.getElementById('minimumRate').value);
            const resultDiv = document.getElementById('minimumPaymentResult');
            
            const minimumPayment = calculateMinimumPayment(currentUser.creditCardDebt, interestRate, minimumRate);
            
            resultDiv.innerHTML = `
                <div class="result-message success">
                    <h3>Asgari Ödeme Hesaplama Sonucu</h3>
                    <p>Toplam Borç: ${currentUser.creditCardDebt.toFixed(2)} ₺</p>
                    <p>Faiz Tutarı: ${(currentUser.creditCardDebt * (interestRate / 100)).toFixed(2)} ₺</p>
                    <p>Asgari Ödeme Tutarı: ${minimumPayment.toFixed(2)} ₺</p>
                </div>
            `;
        });
    }
});

// Navigation function to check login status
function checkLoginStatus() {
    const protectedPages = ['balance.html', 'withdraw.html', 'deposit.html', 'loan.html', 'minimum-payment.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Call checkLoginStatus when page loads
checkLoginStatus();