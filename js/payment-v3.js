// ==========================================
// ПЛАТЕЖИ — ОТКРЫТИЕ ДОСТУПА К ПЕРСОНАЖУ
// ==========================================

let selectedPaymentCharacter = null;
let paymentScreenshotFile = null;

function openPaymentModal() {
    const container = document.getElementById('storyGameContainer');
    if (!container) return;
    
    selectedPaymentCharacter = null;
    paymentScreenshotFile = null;
    
    const charNames = { mystic: '⚔️ Мистий', thief: '🗡️ Воровка', alchemist: '🔮 Алхимик' };
    
    container.innerHTML = `
        <div style="padding: 20px; background: #1a1a2e; min-height: 100vh;">
            <button onclick="backToStoryPreview()" style="position: fixed; top: 20px; left: 20px; z-index: 100; background: rgba(0,0,0,0.6); border-radius: 50%; width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 18px; cursor: pointer;">←</button>
            
            <div style="max-width: 400px; margin: 60px auto 0;">
                <h3 style="color: #ffffff; text-align: center;">💰 Открыть доступ к персонажу</h3>
                
                <div id="paymentStep1">
                    <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin-bottom: 15px; text-align: center;">
                        Выберите персонажа, которого хотите открыть:
                    </p>
                    ${Object.entries(charNames).map(([id, name]) => `
                        <button class="task-submit-btn" onclick="selectPaymentCharacter('${id}')" 
                                style="width: 100%; background: rgba(255,255,255,0.1); color: #ffffff; border: 2px solid rgba(255,255,255,0.2); margin-bottom: 10px;">
                            ${name} — 1000 ₽
                        </button>
                    `).join('')}
                </div>
                
                <div id="paymentStep2" style="display: none;">
                    <div id="paymentSelectedChar" style="background: rgba(255,149,0,0.2); border-radius: 12px; padding: 10px; text-align: center; margin-bottom: 15px; font-weight: 600; color: #ff9500;"></div>
                    
                    <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin-bottom: 10px;">
                        1️⃣ Оплатите <strong>1000 ₽</strong>
                    </p>
                    <a href="https://www.tbank.ru/cf/4QVzZbtu45" target="_blank" 
                       style="display: block; width: 100%; background: #0088cc; color: white; text-align: center; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-bottom: 15px;">
                        💳 Перейти к оплате
                    </a>
                    
                    <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin-bottom: 10px;">
                        2️⃣ Загрузите скриншот чека
                    </p>
                    
                    <input type="file" id="paymentScreenshotInput" accept="image/*" style="display: none;" onchange="handlePaymentScreenshot(event)">
                    <button class="task-submit-btn" onclick="document.getElementById('paymentScreenshotInput').click()" 
                            style="width: 100%; background: rgba(255,255,255,0.1); color: #ffffff; border: 2px dashed #ff9500; margin-bottom: 15px;">
                        📸 Загрузить скриншот чека
                    </button>
                    
                    <div id="paymentScreenshotPreview" style="text-align: center; margin-bottom: 15px; display: none;">
                        <img id="paymentScreenshotImg" style="width: 100%; max-height: 200px; object-fit: contain; border-radius: 12px; border: 2px solid #ff9500;">
                    </div>
                    
                    <button class="task-submit-btn" id="paymentSubmitBtn" onclick="submitPayment()" disabled 
                            style="width: 100%; background: #34c759; color: white; margin-bottom: 15px;">
                        ✅ Отправить на проверку
                    </button>
                    <p style="color: rgba(255,255,255,0.5); font-size: 11px; text-align: center;">
                        После проверки: доступ + 2000 ашетиков
                    </p>
                </div>
                
                <div id="paymentStep3" style="display: none; text-align: center;">
                    <div id="paymentResultIcon" style="font-size: 48px; margin-bottom: 10px;"></div>
                    <p id="paymentResultText" style="color: #ffffff; font-size: 14px; margin-bottom: 15px;"></p>
                    <button class="task-submit-btn" onclick="backToStoryPreview()" style="width: 100%; background: #ff9500; color: white;">
                        ← Назад
                    </button>
                </div>
            </div>
        </div>
    `;
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModalDynamic') || document.getElementById('paymentModal');
    if (modal) modal.remove();
}

function selectPaymentCharacter(characterId) {
    selectedPaymentCharacter = characterId;
    
    const charNames = { mystic: '⚔️ Мистий', thief: '🗡️ Воровка', alchemist: '🔮 Алхимик' };
    const nameEl = document.getElementById('paymentSelectedChar');
    if (nameEl) nameEl.innerText = charNames[characterId] || characterId;
    
    const step1 = document.getElementById('paymentStep1');
    const step2 = document.getElementById('paymentStep2');
    if (step1) step1.style.display = 'none';
    if (step2) step2.style.display = 'block';
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
            
            // ✅ Через 3 секунды возвращаем на предпросмотр истории
            setTimeout(() => {
                backToStoryPreview();
            }, 3000);
            
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
