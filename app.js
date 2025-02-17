// Initialize balance and withdrawals from local storage
let balance = parseFloat(localStorage.getItem('balance')) || 0.00;
let withdrawals = JSON.parse(localStorage.getItem('withdrawals')) || [];

// DOM Elements
const balanceElement = document.getElementById('balance');
const watchAdsBtn = document.getElementById('watchAdsBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const messageElement = document.getElementById('message');
const ecvModal = document.getElementById('ecvModal');
const ecvInput = document.getElementById('ecvInput');
const submitECV = document.getElementById('submitECV');
const successBanner = document.getElementById('successBanner');
const withdrawalsList = document.getElementById('withdrawalsList'); // New element for withdrawal list

// Update balance display and save to local storage
function updateBalance() {
  balanceElement.textContent = balance.toFixed(3);
  localStorage.setItem('balance', balance); // Save balance to local storage
}

// Update withdrawals list display and save to local storage
function updateWithdrawalsList() {
  withdrawalsList.innerHTML = ''; // Clear the list
  withdrawals.forEach((withdrawal, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `Withdrawal #${index + 1}: $${withdrawal.amount} (ECV: ${withdrawal.ecv})`;
    withdrawalsList.appendChild(listItem);
  });
  localStorage.setItem('withdrawals', JSON.stringify(withdrawals)); // Save withdrawals to local storage
}

// Watch Ads Button Click
watchAdsBtn.addEventListener('click', () => {
  balance += 0.05; // Add $0.05 per click
  updateBalance();
  messageElement.textContent = 'You earned $0.05 by watching an ad!';
});

// Withdraw Button Click
withdrawBtn.addEventListener('click', () => {
  if (balance >= 2.00) {
    ecvModal.style.display = 'flex'; // Show the ECV modal
  } else {
    messageElement.textContent = 'You need at least $2.00 to withdraw.';
  }
});

// Submit ECV Number
submitECV.addEventListener('click', () => {
  const ecvNumber = ecvInput.value.trim();
  if (ecvNumber) {
    balance -= 2.00; // Deduct $2.00
    const withdrawal = { amount: 2.00, ecv: ecvNumber, timestamp: new Date().toLocaleString() }; // Create withdrawal object
    withdrawals.push(withdrawal); // Add to withdrawals list
    updateBalance();
    updateWithdrawalsList(); // Update the withdrawals list
    ecvModal.style.display = 'none'; // Hide the ECV modal
    successBanner.style.display = 'block'; // Show the success banner
    setTimeout(() => {
      successBanner.style.display = 'none'; // Hide the success banner after 3 seconds
    }, 3000);
    sendData({ action: 'withdraw', amount: 2.00, ecv: ecvNumber }); // Send data to Telegram
  } else {
    alert('Please enter a valid ECV number.');
  }
});

// Initialize
updateBalance();
updateWithdrawalsList(); // Initialize withdrawals list

// Telegram Web App Integration (Optional)
const tg = window.Telegram.WebApp;
tg.expand(); // Expand the app to full screen

// Send data to Telegram (e.g., for withdrawal)
function sendData(data) {
  tg.sendData(JSON.stringify(data));
}