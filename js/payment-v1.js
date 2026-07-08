// ==========================================
// ПЛАТЕЖИ — ОТКРЫТИЕ ДОСТУПА К ПЕРСОНАЖУ
// ==========================================

let selectedPaymentCharacter = null;
let paymentScreenshotFile = null;

function openPaymentModal() {
    selectedPaymentCharacter = null;
    paymentScreenshotFile = null;
    
    document.getElementById('paymentStep1').style.display = 'block';
    document.getElementById('paymentStep2').style.display = 'none';
    document.getElementById('paymentStep3').style.display = 'none';
    document.getElementById('paymentScreenshotPreview').style.display = 'none';
    document.getElementById('paymentScreenshotInput').value = '';
    document.getElementById('paymentSubmitBtn').disabled = true;
    
    // Сбрасываем подсветку кнопок
    document.querySelectorAll('#paymentCharacterSelect button').forEach(btn => {
        btn.style.borderColor = 'var(--border-color)';
        btn.style.background = 'var(--card-bg)';
    });
    
    document.getElementById('paymentModal').style.display = 'flex';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function selectPaymentCharacter(characterId) {
    selectedPaymentCharacter = characterId;
    
    const charNames = { mystic: '⚔️ Мистий', thief: '🗡️ Воровка', alchemist: '🔮 Алхимик' };
    document.getElementById('paymentSelectedChar').innerText = charNames[characterId] || characterId;
    
    // Подсвечиваем выбранную кнопку
    document.querySelectorAll('#paymentCharacterSelect button').forEach(btn => {
        btn.style.borderColor = 'var(--border-color)';
        btn.style.background = 'var(--card-bg)';
    });
    
    const selectedBtn = document.querySelector(`#paymentCharacterSelect button[onclick*="${characterId}"]`);
    if (selectedBtn) {
        selectedBtn.style.borderColor = 'var(--status-green)';
        selectedBtn.style.background = 'rgba(52,199,89,0.1)';
    }
    
    document.getElementById('paymentStep1').style.display = 'none';
    document.getElementById('paymentStep2').style.display = 'block';
}

function handlePaymentScreenshot(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    paymentScreenshotFile = file;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('paymentScreenshotImg').src = e.target.result;
        document.getElementById('paymentScreenshotPreview').style.display = 'block';
        document.getElementById('paymentSubmitBtn').disabled = false;
    };
    reader.readAsDataURL(file);
}

async function submitPayment() {
    if (!selectedPaymentCharacter || !paymentScreenshotFile) {
        alert('Выберите персонажа и загрузите скриншот чека');
        return;
    }
    
    const submitBtn = document.getElementById('paymentSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.innerText = '⏳ Отправка...';
    
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('character', selectedPaymentCharacter);
    formData.append('screenshot', paymentScreenshotFile);
    
    try {
        const response = await fetch(`${SERVER_URL}/api/verify_payment`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        document.getElementById('paymentStep2').style.display = 'none';
        document.getElementById('paymentStep3').style.display = 'block';
        
        if (result.status === 'ok') {
            document.getElementById('paymentResultIcon').innerHTML = '✅';
            document.getElementById('paymentResultText').innerHTML = `
                Доступ к персонажу <strong>${result.character_name}</strong> открыт!<br>
                Начислено <strong>${result.bonus_achetiki}</strong> ашетиков (x2 от суммы).<br>
                Баланс: <strong>${result.new_balance}</strong> ашетиков.
            `;
            
            // Обновляем баланс
            user.balance = result.new_balance;
            saveUserData();
            updateUI();
            
        } else {
            document.getElementById('paymentResultIcon').innerHTML = '❌';
            document.getElementById('paymentResultText').innerText = result.message || 'Ошибка проверки чека. Попробуйте ещё раз или обратитесь к администратору.';
        }
    } catch (error) {
        document.getElementById('paymentStep2').style.display = 'none';
        document.getElementById('paymentStep3').style.display = 'block';
        document.getElementById('paymentResultIcon').innerHTML = '❌';
        document.getElementById('paymentResultText').innerText = 'Ошибка соединения. Попробуйте ещё раз.';
    }
    
    submitBtn.disabled = false;
    submitBtn.innerText = '✅ Отправить на проверку';
}
