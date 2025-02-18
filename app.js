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
const withdrawalsList = document.getElementById('withdrawalsList');

// Update balance display
function updateBalance() {
  balanceElement.textContent = balance.toFixed(3);
  localStorage.setItem('balance', balance.toFixed(3));
}

// Update withdrawals list
function updateWithdrawalsList() {
  withdrawalsList.innerHTML = '';
  withdrawals.forEach((withdrawal, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `Withdrawal #${index + 1}: $${withdrawal.amount} (ECV: ${withdrawal.ecv})`;
    withdrawalsList.appendChild(listItem);
  });
  localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
}

// Watch Ads Button
watchAdsBtn.addEventListener('click', () => {
  watchAdsBtn.disabled = true;
  messageElement.textContent = 'Loading ad...';
  
  show_8957361().then(() => {
    balance += 0.003;
    updateBalance();
    messageElement.textContent = 'You earned $0.003 by watching an ad!';
  }).catch(() => {
    messageElement.textContent = 'Ad canceled - no reward given';
  }).finally(() => {
    watchAdsBtn.disabled = false;
  });
});

// Withdraw Button
withdrawBtn.addEventListener('click', () => {
  if (balance >= 5.00) {
    withdrawBtn.disabled = true;
    messageElement.textContent = 'Loading withdrawal ad...';
    
    show_8957363('pop').then(() => {
      ecvModal.style.display = 'flex';
      messageElement.textContent = '';
    }).catch(() => {
      messageElement.textContent = 'Withdrawal canceled - ad not completed';
    }).finally(() => {
      withdrawBtn.disabled = false;
    });
  } else {
    messageElement.textContent = 'You need at least $5.00 to withdraw.';
  }
});

// Submit ECV
submitECV.addEventListener('click', () => {
  const ecvNumber = ecvInput.value.trim();
  if (!ecvNumber) return alert('Please enter ECV number');

  balance -= 5.00;
  withdrawals.push({ 
    amount: 5.00, 
    ecv: ecvNumber, 
    timestamp: new Date().toLocaleString()
  });
  
  updateBalance();
  updateWithdrawalsList();
  ecvModal.style.display = 'none';
  ecvInput.value = '';
  
  successBanner.style.display = 'block';
  setTimeout(() => {
    successBanner.style.display = 'none';
  }, 3000);

  // Telegram integration
  if (window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.sendData(JSON.stringify({
        action: 'withdraw',
        amount: 5.00,
        ecv: ecvNumber
      }));
    } catch (error) {
      console.error('Telegram integration error:', error);
    }
  }
});

// Initialize auto-ads
document.addEventListener('DOMContentLoaded', () => {
  updateBalance();
  updateWithdrawalsList();
  
  // Auto-show interstitial ads configuration
  show_8957364({ 
    type: 'inApp', 
    inAppSettings: { 
      frequency: 2,
      capping: 0.1,
      interval: 30,
      timeout: 5,
      everyPage: false
    }
  });

  // Telegram WebApp setup
  if (window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.ready();
    } catch (error) {
      console.error('Telegram WebApp error:', error);
    }
  }
});