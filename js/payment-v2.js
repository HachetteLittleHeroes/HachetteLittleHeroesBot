// ==========================================
// ПЛАТЕЖИ — ОТКРЫТИЕ ДОСТУПА К ПЕРСОНАЖУ
// ==========================================

let selectedPaymentCharacter = null;
let paymentScreenshotFile = null;

function openPaymentModal() {
    // Закрываем все открытые модалки
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
    
    selectedPaymentCharacter = null;
    paymentScreenshotFile = null;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.style.zIndex = '100005';
    modal.id = 'paymentModalDynamic';
    
    const charNames = { mystic: '⚔️ Мистий', thief: '🗡️ Воровка', alchemist: '🔮 Алхимик' };
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <h3>💰 Открыть доступ к персонажу</h3>
            
            <div id="paymentStep1">
                <p style="color: var(--text-gray); font-size: 13px; margin-bottom: 15px;">
                    Выберите персонажа, которого хотите открыть:
                </p>
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                    ${Object.entries(charNames).map(([id, name]) => `
                        <button class="task-submit-btn" onclick="selectPaymentCharacter('${id}')" 
                                style="background: var(--card-bg); color: var(--text); border: 2px solid var(--border-color);">
                            ${name} — 1000 ₽
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div id="paymentStep2" style="display: none;">
                <div id="paymentSelectedChar" style="background: rgba(255,149,0,0.1); border-radius: 12px; padding: 10px; text-align: center; margin-bottom: 15px; font-weight: 600; color: var(--accent);"></div>
                
                <p style="color: var(--text-gray); font-size: 13px; margin-bottom: 10px;">
                    1️⃣ Перейдите по ссылке и оплатите <strong>1000 ₽</strong>
                </p>
                <a href="https://www.tbank.ru/cf/4QVzZbtu45" target="_blank" 
                   style="display: block; width: 100%; background: #0088cc; color: white; text-align: center; padding: 12px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-bottom: 15px;">
                    💳 Перейти к оплате
                </a>
                
                <p style="color: var(--text-gray); font-size: 13px; margin-bottom: 10px;">
                    2️⃣ После оплаты загрузите скриншот чека
                </p>
                
                <input type="file" id="paymentScreenshotInput" accept="image/*" style="display: none;" onchange="handlePaymentScreenshot(event)">
                <button class="task-submit-btn" onclick="document.getElementById('paymentScreenshotInput').click()" style="background: var(--card-bg); color: var(--text); border: 2px dashed var(--accent); margin-bottom: 15px;">
                    📸 Загрузить скриншот чека
                </button>
                
                <div id="paymentScreenshotPreview" style="text-align: center; margin-bottom: 15px; display: none;">
                    <img id="paymentScreenshotImg" style="width: 100%; max-height: 200px; object-fit: contain; border-radius: 12px; border: 2px solid var(--accent);">
                </div>
                
                <button class="task-submit-btn" id="paymentSubmitBtn" onclick="submitPayment()" disabled style="background: var(--status-green);">
                    ✅ Отправить на проверку
                </button>
                <p style="color: var(--text-gray); font-size: 11px; margin-top: 8px; text-align: center;">
                    После проверки чека доступ откроется автоматически, а на счёт будет начислено <strong>2000 ашетиков</strong>
                </p>
            </div>
            
            <div id="paymentStep3" style="display: none; text-align: center;">
                <div id="paymentResultIcon" style="font-size: 48px; margin-bottom: 10px;"></div>
                <p id="paymentResultText" style="color: var(--text); font-size: 14px; margin-bottom: 15px;"></p>
                <button class="modal-close-btn" onclick="closePaymentModal()">Закрыть</button>
            </div>
            
            <button class="modal-close-btn" onclick="closePaymentModal()" style="margin-top: 10px;">Отмена</button>
        </div>
    `;
    
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModalDynamic') || document.getElementById('paymentModal');
    if (modal) modal.remove();
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
