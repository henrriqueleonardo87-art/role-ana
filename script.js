/**
 * Ana Gabriela & Leonardo // O Rolê
 * Software Engineer & Custom Personal Date Invitation
 */

// Application State
const gameState = {
  currentScreen: 0,
  preferences: {
    ride: '',
    cuisine: '',
    dateDay: '',
    drink: '',
    dessert: '',
    vibe: ''
  },
  dodgeCount: 0,
  hostPhone: '5531999768062' // Leonardo's phone number
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupAudioListeners();
  setupBiometricScanner();
  setupBriefingNext();
  setupQuizPhase1();
  setupQuizPhase2();
  setupQuizPhase3();
  setupRunawayDecision();
  setupTicketAndActions();
  updateProgressBar();
});

// Audio controls
function setupAudioListeners() {
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');

  const unlockAudio = () => {
    if (window.soundEngine) {
      window.soundEngine.init();
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);

  soundToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isMuted = window.soundEngine.toggleMute();
    soundIcon.textContent = isMuted ? '🔇' : '🔊';
    soundToggle.style.opacity = isMuted ? '0.5' : '1';
  });
}

// Navigate between screens
function goToScreen(index) {
  const current = document.getElementById(`screen${gameState.currentScreen}`);
  const next = document.getElementById(`screen${index}`);

  if (current) current.classList.remove('active');
  if (next) next.classList.add('active');

  gameState.currentScreen = index;
  updateProgressBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.soundEngine) {
    window.soundEngine.playPop();
  }
}

function updateProgressBar() {
  const progressFill = document.getElementById('progressFill');
  const stepIndicator = document.getElementById('stepIndicator');
  const missionTag = document.getElementById('missionTag');

  const screenMap = [
    { fill: '12%', step: 'Identificação', tag: 'SECURITY // BIOMETRICS' },
    { fill: '25%', step: 'Briefing', tag: 'PROJECT // OVERVIEW' },
    { fill: '40%', step: 'Transporte', tag: 'LOGISTICS // PROTOCOL' },
    { fill: '55%', step: 'Cardápio', tag: 'GASTRONOMY // SELECT' },
    { fill: '70%', step: 'Detalhes', tag: 'TUNING // EXPERIENCE' },
    { fill: '85%', step: 'Compilando...', tag: 'SYSTEM // COMPILER' },
    { fill: '95%', step: 'Momento Decisivo', tag: 'DECISION // PROMPT' },
    { fill: '100%', step: 'Encontro Confirmado ✨', tag: 'BUILD // SUCCESS' }
  ];

  const info = screenMap[gameState.currentScreen] || { fill: '100%', step: 'Finalizado', tag: 'DATE // CONFIRMED' };
  progressFill.style.width = info.fill;
  stepIndicator.textContent = info.step;
  if (missionTag) missionTag.textContent = info.tag;
}

// ==========================================================================
// FASE 0: BIOMETRIC SCANNER (FIRST THING ON SCREEN!)
// ==========================================================================
function setupBiometricScanner() {
  const btn = document.getElementById('biometricBtn');
  const fill = document.getElementById('scanProgressFill');
  const percentText = document.getElementById('scanPercent');
  const msg = document.getElementById('telemetryMsg');
  
  if (!btn) return;

  let scanProgress = 0;
  let scanInterval = null;
  let isCompleted = false;

  const telemetryCheckpoints = [
    { p: 1, text: '> ⏳ Identificando digital... É ela mesma: Ana Gabriela.' },
    { p: 14, text: '> 🚏 Histórico do Sistema (2021): Lembra daquela pergunta do horário do ônibus pro Centro? Era só desculpa pra saber seu nome.' },
    { p: 28, text: '> 📚 Diagnóstico: Estudiosa, esforçada ao extremo e com a mania perigosa de se cobrar demais.' },
    { p: 45, text: '> 😼 Sensor de Deboche: Nível máximo detectado. Respostas afiadas e ironia fina no DNA.' },
    { p: 60, text: '> 🧘 Operação Leveza: Hoje o sistema desativa metas, cobranças e provas. Só paz, risada e comida boa.' },
    { p: 76, text: '> 🛵 Evolução da Frota (2026): Cinco anos depois do ponto de ônibus, a gente finalmente vai de moto.' },
    { p: 90, text: '> 💓 Impacto no Leo: 100% desconcertado desde 2021. Nenhuma linha de código explica o quanto você é especial.' },
    { p: 100, text: '> ✨ Autenticação Completa: Ana Gabriela, sua cota de estresse foi zerada. Acesso liberado ao nosso rolê!' }
  ];

  const updateTelemetryText = (currentProgress) => {
    let chosenText = msg.textContent;
    for (const cp of telemetryCheckpoints) {
      if (currentProgress >= cp.p) {
        chosenText = cp.text;
      }
    }
    if (msg.textContent !== chosenText) {
      msg.classList.add('changing');
      if (window.soundEngine && currentProgress > 5 && currentProgress < 99) {
        window.soundEngine.playPop();
      }
      setTimeout(() => {
        msg.textContent = chosenText;
        msg.classList.remove('changing');
      }, 140);
    }
  };

  const startScanning = (e) => {
    if (isCompleted) return;
    if (e.cancelable) e.preventDefault();

    btn.classList.add('scanning');

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    if (window.soundEngine) {
      window.soundEngine.playScanHum();
    }

    scanInterval = setInterval(() => {
      // Cadence tuned to ~5.8 seconds total so she can read every personal compliment comfortably
      scanProgress += 0.75;
      if (scanProgress > 100) scanProgress = 100;

      fill.style.width = `${scanProgress}%`;
      percentText.textContent = `${Math.floor(scanProgress)}%`;
      updateTelemetryText(scanProgress);

      if (Math.floor(scanProgress) % 20 === 0 && window.soundEngine) {
        window.soundEngine.playScanHum();
      }

      if (scanProgress >= 100) {
        clearInterval(scanInterval);
        isCompleted = true;
        btn.classList.remove('scanning');
        btn.classList.add('success');
        
        if (navigator.vibrate) {
          navigator.vibrate([60, 50, 90]);
        }
        if (window.soundEngine) {
          window.soundEngine.playScanSuccess();
        }

        if (window.confetti) {
          confetti({
            particleCount: 70,
            spread: 75,
            origin: { y: 0.6 }
          });
        }

        setTimeout(() => {
          goToScreen(1); // Go to Briefing (Screen 1)
        }, 1400);
      }
    }, 45);
  };

  const stopScanning = () => {
    if (isCompleted) return;
    clearInterval(scanInterval);
    btn.classList.remove('scanning');
    scanProgress = 0;
    fill.style.width = '0%';
    percentText.textContent = '0%';
    msg.textContent = '> ⚠️ Leitura interrompida! Mantenha o polegar pressionado até 100%.';
  };

  btn.addEventListener('mousedown', startScanning);
  btn.addEventListener('mouseup', stopScanning);
  btn.addEventListener('mouseleave', stopScanning);

  btn.addEventListener('touchstart', startScanning, { passive: false });
  btn.addEventListener('touchend', stopScanning);
  btn.addEventListener('touchcancel', stopScanning);
}

// ==========================================================================
// FASE 1: BRIEFING NEXT
// ==========================================================================
function setupBriefingNext() {
  const btn = document.getElementById('briefingNextBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSelect();
      goToScreen(2); // Go to Transport / Logística
    });
  }
}

// ==========================================================================
// FASE 2: LOGÍSTICA & A MOTO (COM BLOQUEIO DE CARRO/UBER)
// ==========================================================================
function setupQuizPhase1() {
  const optMoto = document.getElementById('optMoto');
  const optCarro = document.getElementById('optCarro');
  const optUber = document.getElementById('optUber');
  const nextBtn = document.getElementById('nextBtn1');
  const toast = document.getElementById('dictatorToast');
  const toastText = document.getElementById('dictatorToastText');

  const dictatorPhrases = [
    'Ônibus pro Centro em 2026?! Nem pensar, aquela desculpa já caducou! 😂',
    'Pode guardar o deboche: quem pilota o rolê sou eu!',
    'Carro negado! A moto é a terapia perfeita pra você parar de se cobrar por umas horas 🏍️',
    'Já faz 5 anos que saímos daquele ponto de ônibus, a carona agora é de moto!',
    'Aqui é democracia relativa: quatro rodas e busão bloqueados pelo desenvolvedor!',
    'Piloto que deixa a convidada de honra ir de busão perde a moral de vez 😂'
  ];

  let phraseIdx = 0;

  const rejectFakeOption = (btn, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (navigator.vibrate) {
      navigator.vibrate([40, 30, 40]);
    }
    if (window.soundEngine) {
      window.soundEngine.playDodge();
    }

    btn.classList.remove('rejected');
    void btn.offsetWidth;
    btn.classList.add('rejected');

    const randomX = (Math.random() * 2 - 1) * 35;
    const randomY = (Math.random() * 2 - 1) * 15;
    btn.style.transform = `translate(${randomX}px, ${randomY}px)`;

    toastText.textContent = dictatorPhrases[phraseIdx % dictatorPhrases.length];
    phraseIdx++;
    toast.classList.add('active');

    clearTimeout(btn._toastTimer);
    btn._toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 4500);
  };

  ['click', 'touchstart'].forEach(evt => {
    if (optCarro) optCarro.addEventListener(evt, (e) => rejectFakeOption(optCarro, e));
    if (optUber) optUber.addEventListener(evt, (e) => rejectFakeOption(optUber, e));
  });

  if (optMoto) {
    optMoto.addEventListener('click', () => {
      optMoto.classList.add('selected');
      gameState.preferences.ride = optMoto.dataset.val;
      nextBtn.disabled = false;
      
      if (optCarro) optCarro.style.transform = 'translate(0, 0)';
      if (optUber) optUber.style.transform = 'translate(0, 0)';

      toastText.textContent = 'Decisão aprovada pelo Ditador! Garupa de moto confirmada para o rolê da leveza ✨';
      toast.classList.add('active');

      if (window.soundEngine) {
        window.soundEngine.playSelect();
      }
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (toast) toast.classList.remove('active');
      goToScreen(3); // Go to Gastronomia (Screen 3)
    });
  }
}

// ==========================================================================
// FASE 3: CARDÁPIO GASTRONÔMICO
// ==========================================================================
function setupQuizPhase2() {
  const cards = document.querySelectorAll('#cuisineGrid .option-card');
  const nextBtn = document.getElementById('nextBtn2');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      gameState.preferences.cuisine = card.dataset.val;
      nextBtn.disabled = false;
      if (window.soundEngine) window.soundEngine.playSelect();
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToScreen(4); // Go to Bebidas/Sobremesa (Screen 4)
    });
  }
}

// ==========================================================================
// FASE 4: DETALHES (DIA, BEBIDA, DOCE, VIBE)
// ==========================================================================
function setupQuizPhase3() {
  const setupGroup = (containerId, key) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const pills = container.querySelectorAll('.pill-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        gameState.preferences[key] = pill.dataset.val;
        if (window.soundEngine) window.soundEngine.playSelect();
        checkPhase3Complete();
      });
    });
  };

  setupGroup('dayOptions', 'dateDay');
  setupGroup('drinkOptions', 'drink');
  setupGroup('dessertOptions', 'dessert');
  setupGroup('vibeOptions', 'vibe');

  const checkPhase3Complete = () => {
    const { dateDay, drink, dessert, vibe } = gameState.preferences;
    const nextBtn = document.getElementById('nextBtn3');
    if (dateDay && drink && dessert && vibe && nextBtn) {
      nextBtn.disabled = false;
    }
  };

  const nextBtn = document.getElementById('nextBtn3');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      runAIComputationScreen(); // Go to Compiler (Screen 5)
    });
  }
}

// ==========================================================================
// FASE 5: COMPUTING SCREEN (TERMINAL COMPILER)
// ==========================================================================
function runAIComputationScreen() {
  goToScreen(5);

  const logs = [
    '> npm run init-date --target=ana-gabriela',
    '> Carregando histórico de 2021... Ponto de ônibus localizado.',
    '> Analisando nível de cobrança da Ana... Alto. Aplicando patch de leveza...',
    '> Checando índice de deboche e ironia... 100% (Dentro dos parâmetros esperados!).',
    '> Traçando rota da moto: 5 anos de espera convertidos em rolê oficial.',
    '> Compilação concluída: 100% de sintonia confirmada para o rolê!'
  ];

  const terminalBody = document.getElementById('terminalLogs');
  if (terminalBody) terminalBody.innerHTML = '';

  const aiProgressFill = document.getElementById('aiProgressFill');
  const matchNumber = document.getElementById('matchNumber');

  let logIdx = 0;
  let score = 0;

  const logInterval = setInterval(() => {
    if (terminalBody && logIdx < logs.length) {
      const p = document.createElement('p');
      p.className = 'term-line';
      p.textContent = logs[logIdx];
      terminalBody.appendChild(p);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      logIdx++;
    }
  }, 600);

  const scoreInterval = setInterval(() => {
    score += 4;
    if (score > 100) score = 100;
    if (aiProgressFill) aiProgressFill.style.width = `${score}%`;
    if (matchNumber) matchNumber.textContent = `${score}%`;

    if (score >= 100) {
      clearInterval(scoreInterval);
      clearInterval(logInterval);
      if (matchNumber) matchNumber.textContent = '100%';

      setTimeout(() => {
        const chosenDay = gameState.preferences.dateDay || 'Sexta que vem';
        const displayEl = document.getElementById('chosenDateDisplay');
        if (displayEl) displayEl.textContent = chosenDay.toUpperCase();
        const spanEl = document.getElementById('inviteDaySpan');
        if (spanEl) spanEl.textContent = chosenDay.toLowerCase();
        goToScreen(6); // Go to The Big Question (Screen 6)
      }, 900);
    }
  }, 60);
}

// ==========================================================================
// FASE 6: THE BIG QUESTION & RUNAWAY "NÃO" BUTTON
// ==========================================================================
function setupRunawayDecision() {
  const btnNo = document.getElementById('btnNo');
  const btnYes = document.getElementById('btnYes');
  const btnNoText = document.getElementById('btnNoText');
  const runawayZone = document.getElementById('runawayZone');

  const wittyNoPhrases = [
    'Não...',
    'Erro 404: Deboche bloqueado pelo sistema 😂',
    '5 anos esperando pra você clicar em Não?! 🚫',
    'Para de se cobrar e clica no SIM! 😉',
    'Você merece essa folga da rotina, aceita logo! ✨',
    'O desenvolvedor desativou o Não, clica no SIM! 👏',
    'Sem deboche agora: clica no SIM! ❤️'
  ];

  let currentScale = 1.0;

  const dodgeButton = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    gameState.dodgeCount++;

    if (navigator.vibrate) {
      navigator.vibrate(35);
    }
    if (window.soundEngine) {
      window.soundEngine.playDodge();
    }

    const phraseIndex = Math.min(gameState.dodgeCount, wittyNoPhrases.length - 1);
    btnNoText.textContent = wittyNoPhrases[phraseIndex];

    currentScale += 0.08;
    if (currentScale > 1.45) currentScale = 1.45;
    btnYes.style.transform = `scale(${currentScale})`;

    const zoneRect = runawayZone.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxMoveX = (zoneRect.width / 2) - (btnRect.width / 2) - 10;
    const maxMoveY = 55;

    const randomX = (Math.random() * 2 - 1) * maxMoveX;
    const randomY = (Math.random() * 2 - 1) * maxMoveY;

    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
  };

  if (btnNo) {
    btnNo.addEventListener('mouseenter', dodgeButton);
    btnNo.addEventListener('touchstart', dodgeButton, { passive: false });
    btnNo.addEventListener('pointerdown', dodgeButton);
    btnNo.addEventListener('click', dodgeButton);
  }

  // YES BUTTON CLICK
  if (btnYes) {
    btnYes.addEventListener('click', () => {
      if (window.soundEngine) {
        window.soundEngine.playFanfare();
      }
      if (navigator.vibrate) {
        navigator.vibrate([80, 40, 120]);
      }

      fireRefinedConfetti();
      renderBoardingPassTicket();
      goToScreen(7); // Go to Boarding Pass / WhatsApp (Screen 7)
    });
  }
}

function fireRefinedConfetti() {
  if (!window.confetti) return;

  const duration = 2.8 * 1000;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > end) {
      return clearInterval(interval);
    }

    confetti({
      startVelocity: 28,
      spread: 360,
      ticks: 60,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      },
      colors: ['#e11d48', '#d97706', '#18181b', '#f59e0b', '#ffffff']
    });
  }, 220);
}

// ==========================================================================
// FASE 7: BOARDING PASS & WHATSAPP
// ==========================================================================
function renderBoardingPassTicket() {
  const container = document.getElementById('ticketPrefTags');
  if (!container) return;
  container.innerHTML = '';

  const { dateDay, ride, cuisine, drink, dessert, vibe } = gameState.preferences;

  const ticketDateValue = document.getElementById('ticketDateValue');
  if (ticketDateValue) {
    ticketDateValue.textContent = dateDay || 'Final de semana que vem';
  }

  const tags = [
    dateDay ? `📅 ${dateDay}` : '📅 Final de semana',
    cuisine || 'Restaurante Exclusivo',
    drink || 'Bebida Especial',
    dessert || 'Sobremesa',
    ride ? `🏍️ ${ride.substring(0, 24)}...` : 'Carona de Moto',
    vibe ? `✨ ${vibe.substring(0, 24)}...` : 'Conversa Boa'
  ];

  tags.forEach(tagText => {
    const badge = document.createElement('span');
    badge.className = 'pref-tag-badge';
    badge.textContent = tagText;
    container.appendChild(badge);
  });

  updateWhatsAppLink();
  updateCalendarLink();
}

function updateWhatsAppLink() {
  const whatsappBtn = document.getElementById('whatsappShareBtn');
  if (!whatsappBtn) return;
  const { dateDay, ride, cuisine, drink, dessert, vibe } = gameState.preferences;

  const dayHeader = dateDay ? ` (${dateDay.toUpperCase()})` : '';

  const message = 
`Oi Leo! Vi que você codou um sistema inteiro só pra me chamar pra sair... achei genial! 😂🏍️💻

Minha confirmação para o nosso ROLÊ${dayHeader}:
✅ CONVITE ACEITO!

📋 Meu roteiro da leveza:
• Quando: ${dateDay || 'Final de semana que vem'}
• Transporte: ${ride || 'Vou na garupa da moto!'}
• O que comer: ${cuisine || 'Surpresa gastronômica'}
• Para acompanhar: ${drink || 'Bebida bem gelada'}
• Sobremesa: ${dessert || 'Doce especial'}
• Vibe do rolê: ${vibe || 'Desacelerar e dar risada'}

Prometo dar uma trégua no deboche e não me cobrar tanto pelo menos nessa noite. E já que se passaram 5 anos desde aquela desculpa do ônibus pro Centro 😂, te mando a localização certinha pra você me buscar de moto! 📍🛵`;

  const encodedMsg = encodeURIComponent(message);
  whatsappBtn.href = `https://wa.me/${gameState.hostPhone}?text=${encodedMsg}`;
}

function updateCalendarLink() {
  const calBtn = document.getElementById('calendarBtn');
  if (!calBtn) return;
  
  const { dateDay } = gameState.preferences;
  const title = encodeURIComponent(`Rolê: Leonardo & Ana Gabriela (${dateDay || 'Rolê'} 🛵✨)`);
  const details = encodeURIComponent(
    'Rolê oficial confirmado pelo convite interativo!\n' +
    'Dev & Piloto: Leonardo\n' +
    'Convidada de Honra: Ana Gabriela\n' +
    `Data Escolhida: ${dateDay || 'Final de semana'}\n` +
    'Programação: Carona de moto, boa gastronomia e conversa sem pressa.'
  );
  const location = encodeURIComponent('Lugar Especial');

  // Next target day: Sexta (5), Sábado (6), Domingo (0)
  let targetDayOfWeek = 5;
  if (dateDay && dateDay.toLowerCase().includes('sábado')) targetDayOfWeek = 6;
  if (dateDay && dateDay.toLowerCase().includes('domingo')) targetDayOfWeek = 0;

  const now = new Date();
  const targetDate = new Date();
  const daysToAdd = ((targetDayOfWeek - now.getDay() + 7) % 7) || 7;
  targetDate.setDate(now.getDate() + daysToAdd);
  targetDate.setHours(targetDayOfWeek === 0 ? 17 : 20, 0, 0, 0);
  const endDate = new Date(targetDate.getTime() + 3 * 3600 * 1000);

  const pad = (n) => String(n).padStart(2, '0');
  const formatTime = (d) => 
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const dates = `${formatTime(targetDate)}/${formatTime(endDate)}`;

  calBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

function setupTicketAndActions() {
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      gameState.dodgeCount = 0;
      const btnYes = document.getElementById('btnYes');
      const btnNo = document.getElementById('btnNo');
      const btnNoText = document.getElementById('btnNoText');
      
      if (btnYes) btnYes.style.transform = 'scale(1)';
      if (btnNo) {
        btnNo.style.transform = 'translate(0, 0)';
        btnNoText.textContent = 'Não...';
      }

      goToScreen(0);
    });
  }
}