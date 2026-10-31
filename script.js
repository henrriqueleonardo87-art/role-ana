/**
 * Ana Gabriela & Leonardo // O Convite
 * Script interativo com fluxo refinado, bem-humorado e elegante.
 */

// ==========================================================================
// ESTADO GLOBAL DO ROLÊ
// ==========================================================================
const gameState = {
  currentScreen: 0,
  preferences: {
    ride: 'De moto com você',
    cuisine: null,
    dateDay: null,
    drink: null,
    dessert: null,
    vibe: null
  }
};

// ==========================================================================
// INICIALIZAÇÃO
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupSoundToggle();
  setupBiometricScanner();
  setupBriefingNext();
  setupQuizPhase1();
  setupQuizPhase2();
  setupQuizPhase3();
  setupDecisionScreen();
  setupSharing();
  setupReplay();

  // Garante que o estado inicial comece com foco no topo
  window.scrollTo(0, 0);
  updateProgressBar();
});

// ==========================================================================
// NAVEGAÇÃO ENTRE TELAS
// ==========================================================================
function goToScreen(index) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById(`screen${index}`);
  if (target) {
    target.classList.add('active');
  }

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
    { fill: '14%', step: 'Identificação', tag: 'ACESSO RESERVADO' },
    { fill: '28%', step: 'O Motivo', tag: 'REGISTRO // 2021-2026' },
    { fill: '44%', step: 'Transporte', tag: 'LOGÍSTICA // ROTA' },
    { fill: '60%', step: 'Gastronomia', tag: 'EXPERIÊNCIA // ETAPA 01' },
    { fill: '76%', step: 'Detalhes', tag: 'PLANEJAMENTO // ETAPA 02' },
    { fill: '88%', step: 'Organizando...', tag: 'SISTEMA // PREPARAÇÃO' },
    { fill: '96%', step: 'O Convite', tag: 'DECISÃO // CONVITE' },
    { fill: '100%', step: 'Confirmado', tag: 'ENCONTRO CONFIRMADO' }
  ];

  const info = screenMap[gameState.currentScreen] || { fill: '100%', step: 'Finalizado', tag: 'ENCONTRO' };
  if (progressFill) progressFill.style.width = info.fill;
  if (stepIndicator) stepIndicator.textContent = info.step;
  if (missionTag) missionTag.textContent = info.tag;
}

// ==========================================================================
// TOAST NOTIFICATION SYSTEM (PARA BOTÕES BLOQUEADOS COM BOM HUMOR)
// ==========================================================================
let toastTimeout = null;
function showBlockedToast(message, icon = '🔒') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  container.innerHTML = `
    <div class="toast-card toast-shake">
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    </div>
  `;

  container.classList.add('visible');

  if (window.soundEngine) {
    window.soundEngine.playBlockedSound();
  }

  if (navigator.vibrate) {
    navigator.vibrate([40, 30, 40]);
  }

  toastTimeout = setTimeout(() => {
    container.classList.remove('visible');
    setTimeout(() => {
      container.innerHTML = '';
    }, 300);
  }, 4400);
}

// ==========================================================================
// FASE 0: BIOMETRIC SCANNER + ÁUDIO DE IDENTIFICAÇÃO DO SORRISO
// ==========================================================================
function setupBiometricScanner() {
  const btn = document.getElementById('biometricBtn');
  const fill = document.getElementById('scanProgressFill');
  const percentText = document.getElementById('scanPercent');
  const msg = document.getElementById('telemetryMsg');
  const voiceBox = document.getElementById('voiceIdentifiedBox');
  const btnReplayVoice = document.getElementById('btnReplayVoice');
  const btnVoiceContinue = document.getElementById('btnVoiceContinue');
  
  if (!btn) return;

  let scanProgress = 0;
  let scanInterval = null;
  let isCompleted = false;
  let resetTimeout = null;

  // Checkpoints refinados e dinâmicos (~5.5 segundos)
  const telemetryCheckpoints = [
    { p: 2, text: '> Acesso verificado: Ana Gabriela.' },
    { p: 18, text: '> Resgatando a história: O ponto de ônibus em 2021 e a velha desculpa do Centro.' },
    { p: 38, text: '> Cinco anos se passaram — e você continua com aquela inteligência rara e humor afiado.' },
    { p: 58, text: '> Mulher dedicada, que se cobra tanto e merece uma noite pensada exclusivamente para ela.' },
    { p: 78, text: '> Chegou a hora do nosso primeiro encontro de verdade.' },
    { p: 96, text: '> Identidade confirmada. Reproduzindo áudio de validação...' }
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
      if (window.soundEngine && currentProgress > 4 && currentProgress < 96) {
        window.soundEngine.playPop();
      }
      setTimeout(() => {
        msg.textContent = chosenText;
        msg.classList.remove('changing');
      }, 150);
    }
  };

  const startScanning = (e) => {
    if (isCompleted) return;
    if (e.cancelable) e.preventDefault();

    if (resetTimeout) {
      clearTimeout(resetTimeout);
      resetTimeout = null;
    }

    btn.classList.add('scanning');

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    if (window.soundEngine) {
      window.soundEngine.init();
      window.soundEngine.playScanHum();
    }

    scanInterval = setInterval(() => {
      scanProgress += 0.72; // ~5.5s para 100%
      if (scanProgress > 100) scanProgress = 100;

      if (fill) fill.style.width = `${scanProgress}%`;
      if (percentText) percentText.textContent = `${Math.floor(scanProgress)}%`;
      updateTelemetryText(scanProgress);

      if (Math.floor(scanProgress) % 25 === 0 && window.soundEngine) {
        window.soundEngine.playScanHum();
      }

      if (scanProgress >= 100) {
        clearInterval(scanInterval);
        isCompleted = true;
        btn.classList.remove('scanning');
        btn.classList.add('success');
        
        if (navigator.vibrate) {
          navigator.vibrate([60, 40, 100]);
        }
        if (window.soundEngine) {
          window.soundEngine.playChime();
        }

        // Exibe o card de identificação visual na tela
        if (voiceBox) {
          voiceBox.style.display = 'block';
          voiceBox.classList.add('voice-appear');
        }

        // Toca o áudio de identificação OBRIGATORIAMENTE (Stream HD + Web Speech Fallback)
        if (window.soundEngine) {
          window.soundEngine.playIdentifiedVoice(() => {
            // Avança para a próxima tela automaticamente apenas após o fim da fala
            setTimeout(() => {
              goToScreen(1); // Vai para o Briefing (Tela 1)
            }, 1200);
          });
        }
      }
    }, 40);
  };

  const pauseScanning = () => {
    if (isCompleted) return;
    clearInterval(scanInterval);
    btn.classList.remove('scanning');
    
    if (scanProgress < 100) {
      msg.textContent = '> Leitura pausada. Mantenha o polegar no leitor para continuar...';
      resetTimeout = setTimeout(() => {
        scanProgress = 0;
        if (fill) fill.style.width = '0%';
        if (percentText) percentText.textContent = '0%';
        msg.textContent = 'Toque e mantenha o polegar no sensor para carregar os dados...';
      }, 4000);
    }
  };

  const handleFingerRelease = () => {
    if (isCompleted) {
      // Se acabou de completar e o usuário soltou o dedo, garante que a reprodução ocorra
      if (window.soundEngine && !window.soundEngine.isPlayingVoice) {
        window.soundEngine.playIdentifiedVoice(() => {
          setTimeout(() => {
            goToScreen(1);
          }, 1200);
        });
      }
      return;
    }
    pauseScanning();
  };

  // Botão para ouvir novamente
  if (btnReplayVoice) {
    btnReplayVoice.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.soundEngine) {
        window.soundEngine.playIdentifiedVoice();
      }
    });
  }

  // Botão para avançar direto após ouvir
  if (btnVoiceContinue) {
    btnVoiceContinue.addEventListener('click', (e) => {
      e.stopPropagation();
      goToScreen(1);
    });
  }

  btn.addEventListener('mousedown', startScanning);
  btn.addEventListener('mouseup', handleFingerRelease);
  btn.addEventListener('mouseleave', pauseScanning);

  btn.addEventListener('touchstart', startScanning, { passive: false });
  btn.addEventListener('touchend', handleFingerRelease);
  btn.addEventListener('touchcancel', pauseScanning);
}

// ==========================================================================
// FASE 1: BRIEFING NEXT
// ==========================================================================
function setupBriefingNext() {
  const btn = document.getElementById('briefingNextBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSelect();
      goToScreen(2); // Go to Transport (Screen 2)
    });
  }
}

// ==========================================================================
// FASE 2: LOGÍSTICA & TRANSPORTE (DE MOTO COM VOCÊ - DEMAIS BLOQUEADAS)
// ==========================================================================
function setupQuizPhase1() {
  const optMoto = document.getElementById('optMoto');
  const optEncontro = document.getElementById('optEncontro');
  const optUber = document.getElementById('optUber');
  const optBus = document.getElementById('optBus');
  const nextBtn = document.getElementById('nextBtn1');

  // Opção Única Oficial: DE MOTO COM VOCÊ
  if (optMoto) {
    optMoto.addEventListener('click', () => {
      optMoto.classList.add('selected');
      gameState.preferences.ride = 'De moto com você';
      if (window.soundEngine) window.soundEngine.playSelect();
    });
  }

  // Opção Bloqueada: IR SOZINHA / DIRETO NO LOCAL
  if (optEncontro) {
    optEncontro.addEventListener('click', (e) => {
      e.preventDefault();
      optEncontro.classList.add('shake');
      setTimeout(() => optEncontro.classList.remove('shake'), 400);
      showBlockedToast('🔒 Opção Bloqueada: Nada de ir sozinha! Hoje a carona oficial é de moto com o Leo, você vai ser bem cuidada do início ao fim 😉', '🛵');
    });
  }

  // Opção Bloqueada: UBER
  if (optUber) {
    optUber.addEventListener('click', (e) => {
      e.preventDefault();
      optUber.classList.add('shake');
      setTimeout(() => optUber.classList.remove('shake'), 400);
      showBlockedToast('🚗 Opção Bloqueada: Nada de motorista estranho no trânsito hoje! A carona oficial é de moto com o Leo 😉', '🚗');
    });
  }

  // Opção Bloqueada: ÔNIBUS
  if (optBus) {
    optBus.addEventListener('click', (e) => {
      e.preventDefault();
      optBus.classList.add('shake');
      setTimeout(() => optBus.classList.remove('shake'), 400);
      showBlockedToast('🚌 Opção Bloqueada: O ônibus pro Centro cumpriu a missão em 2021 pra gente se conhecer. Mas em 2026 o rolê é de alto nível!', '🚌');
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToScreen(3); // Go to Gastronomia (Screen 3)
    });
  }
}

// ==========================================================================
// FASE 3: GASTRONOMIA
// ==========================================================================
function setupQuizPhase2() {
  const cards = document.querySelectorAll('#cuisineGrid .option-card');
  const nextBtn = document.getElementById('nextBtn2');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      gameState.preferences.cuisine = card.dataset.val;
      if (nextBtn) nextBtn.disabled = false;
      if (window.soundEngine) window.soundEngine.playSelect();
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToScreen(4); // Go to Detalhes (Screen 4)
    });
  }
}

// ==========================================================================
// FASE 4: DETALHES DO ROLÊ (DIA, OUTRA DATA, BEBIDA, DOCE, VIBE)
// ==========================================================================
function setupQuizPhase3() {
  const customDateContainer = document.getElementById('customDateContainer');
  const customDateInput = document.getElementById('customDateInput');

  // Seletores de Chips
  const dateChips = document.querySelectorAll('#dateGrid .chip');
  dateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dateChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');

      const val = chip.dataset.val;
      if (val === 'Outra data') {
        if (customDateContainer) {
          customDateContainer.style.display = 'block';
          if (customDateInput) customDateInput.focus();
        }
        gameState.preferences.dateDay = customDateInput?.value.trim() || 'Data a combinar';
      } else {
        if (customDateContainer) {
          customDateContainer.style.display = 'none';
        }
        gameState.preferences.dateDay = val;
      }
      checkPhase3Complete();
      if (window.soundEngine) window.soundEngine.playSelect();
    });
  });

  if (customDateInput) {
    customDateInput.addEventListener('input', () => {
      if (customDateInput.value.trim().length > 0) {
        gameState.preferences.dateDay = customDateInput.value.trim();
      } else {
        gameState.preferences.dateDay = 'Data a combinar';
      }
      checkPhase3Complete();
    });
  }

  // Grupos simples de Chips (Bebida, Sobremesa, Vibe)
  const setupChipGroup = (groupId, stateKey) => {
    const chips = document.querySelectorAll(`#${groupId} .chip`);
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        gameState.preferences[stateKey] = chip.dataset.val;
        checkPhase3Complete();
        if (window.soundEngine) window.soundEngine.playSelect();
      });
    });
  };

  setupChipGroup('drinkGrid', 'drink');
  setupChipGroup('dessertGrid', 'dessert');
  setupChipGroup('vibeGrid', 'vibe');

  const checkPhase3Complete = () => {
    const { dateDay, drink, dessert, vibe } = gameState.preferences;
    const nextBtn = document.getElementById('nextBtn3');
    if (dateDay && drink && dessert && vibe && nextBtn) {
      nextBtn.disabled = false;
    } else if (nextBtn) {
      nextBtn.disabled = true;
    }
  };

  const nextBtn = document.getElementById('nextBtn3');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      runCurationSummary(); // Go to Summary (Screen 5)
    });
  }
}

// ==========================================================================
// FASE 5: RESUMO DO ITINERÁRIO (CURADORIA LIMPA)
// ==========================================================================
function runCurationSummary() {
  goToScreen(5);

  const previewDate = document.getElementById('previewDate');
  const previewCuisine = document.getElementById('previewCuisine');
  const previewRide = document.getElementById('previewRide');
  const progressFill = document.getElementById('aiProgressFill');

  if (previewDate) previewDate.textContent = gameState.preferences.dateDay || 'Final de semana';
  if (previewCuisine) previewCuisine.textContent = gameState.preferences.cuisine || 'Restaurante Exclusivo';
  if (previewRide) previewRide.textContent = gameState.preferences.ride || 'De moto com você';

  let p = 0;
  const interval = setInterval(() => {
    p += 8;
    if (p > 100) p = 100;

    if (progressFill) progressFill.style.width = `${p}%`;

    if (p >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        const chosenDay = gameState.preferences.dateDay || 'Sexta que vem';
        const displayEl = document.getElementById('chosenDateDisplay');
        if (displayEl) displayEl.textContent = chosenDay.toUpperCase();
        const spanEl = document.getElementById('inviteDaySpan');
        if (spanEl) spanEl.textContent = chosenDay.toLowerCase();
        goToScreen(6); // Go to The Invitation (Screen 6)
      }, 700);
    }
  }, 70);
}

// ==========================================================================
// FASE 6: O CONVITE OFICIAL (COM OPÇÕES BLOQUEADAS: DITADOR DO ROLÊ)
// ==========================================================================
function setupDecisionScreen() {
  const btnYes = document.getElementById('btnYes');
  const btnThink = document.getElementById('btnThink');
  const btnNo = document.getElementById('btnNo');

  // Respostas com humor de "sou ditador do rolê" caso tente clicar em Não ou Pensar
  const ditadorExcuses = [
    '👑 Bloqueado pelo ditador do rolê: Como manda a lei de 2026, a única resposta aceita é SIM! 😂',
    '🔒 Opção Bloqueada: Hoje eu sou o ditador desse rolê! Já esperamos 5 anos desde 2021, chega de pensar... é SIM ou SIM!',
    '⛔ Erro 404: Opção revogada pelo desenvolvedor. Clica no "SIM" que é sucesso garantido 😉',
    '📊 Diagnóstico do sistema: Nível de esforço e dedicação aos estudos altíssimo. O ditador do rolê decretou que você merece esse descanso!',
    '🚌 Bloqueio nostálgico: Demorou cinco anos desde aquele ponto de ônibus, não dá pra recusar agora!',
    '✨ Alerta do sistema: A mesa já está na mira e a carona de moto garantida. Aceita logo!'
  ];
  let excuseIndex = 0;

  // Botão PENSAR COM CARINHO (BLOQUEADO: Sou ditador)
  if (btnThink) {
    btnThink.addEventListener('click', (e) => {
      e.preventDefault();
      btnThink.classList.add('shake');
      setTimeout(() => btnThink.classList.remove('shake'), 400);

      showBlockedToast('👑 Bloqueado: Hoje eu sou o ditador desse rolê 😂 Já esperamos 5 anos desde 2021, chega de pensar... é SIM ou SIM!', '👑');
    });
  }

  // Botão NÃO (BLOQUEADO: Sou ditador)
  if (btnNo) {
    btnNo.addEventListener('click', (e) => {
      e.preventDefault();
      btnNo.classList.add('shake');
      setTimeout(() => btnNo.classList.remove('shake'), 400);

      const excuse = ditadorExcuses[excuseIndex % ditadorExcuses.length];
      excuseIndex++;
      showBlockedToast(excuse, '👑');
    });
  }

  // Botão SIM, COM CERTEZA! (ÚNICA OPÇÃO VÁLIDA)
  if (btnYes) {
    btnYes.addEventListener('click', () => {
      if (window.soundEngine) {
        window.soundEngine.playFanfare();
      }

      // Preenche o Ticket com os dados escolhidos
      const ticketDate = document.getElementById('ticketDate');
      const ticketRide = document.getElementById('ticketRide');
      const ticketCuisine = document.getElementById('ticketCuisine');
      const ticketDrink = document.getElementById('ticketDrink');

      if (ticketDate) ticketDate.textContent = gameState.preferences.dateDay || 'Final de semana';
      if (ticketRide) ticketRide.textContent = gameState.preferences.ride || 'De moto com você';
      if (ticketCuisine) ticketCuisine.textContent = gameState.preferences.cuisine || 'Restaurante';
      if (ticketDrink) ticketDrink.textContent = gameState.preferences.drink || 'Um bom brinde';

      goToScreen(7); // Go to Confirmation (Screen 7)
      fireConfetti();
    });
  }
}

// ==========================================================================
// FASE 7: CONFIRMAÇÃO & COMPARTILHAMENTO WHATSAPP
// ==========================================================================
function setupSharing() {
  const btn = document.getElementById('whatsappShareBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const { dateDay, cuisine, drink, ride } = gameState.preferences;
    const text = `Oi Leo! Vi o seu convite reservado... e sim, eu aceito o rolê! 😂✨%0A%0A🗓️ *Quando:* ${encodeURIComponent(dateDay || 'Final de semana')}%0A🛵 *Transporte:* ${encodeURIComponent(ride || 'De moto com você')}%0A🍽️ *Gastronomia:* ${encodeURIComponent(cuisine || 'Restaurante')}%0A🥂 *Brinde:* ${encodeURIComponent(drink || 'Brinde especial')}%0A%0A5 anos depois daquele ponto de ônibus, vamos ver se você cumpre a promessa! 😉`;

    const url = `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank');
  });
}

function setupReplay() {
  const btn = document.getElementById('btnReplay');
  if (btn) {
    btn.addEventListener('click', () => {
      goToScreen(2);
    });
  }
}

function setupSoundToggle() {
  const btn = document.getElementById('soundToggle');
  const icon = document.getElementById('soundIcon');
  if (!btn || !icon) return;

  btn.addEventListener('click', () => {
    if (window.soundEngine) {
      const isMuted = window.soundEngine.toggleMute();
      icon.textContent = isMuted ? '🔇' : '🔊';
      btn.classList.toggle('muted', isMuted);
    }
  });
}

function fireConfetti() {
  if (typeof confetti === 'function') {
    // Explosão suave com tons de rosa blush e dourado champanhe
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#be123c', '#fb7185', '#f43f5e', '#fbbf24', '#ffffff']
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#be123c', '#fb7185', '#f43f5e']
      });
    }, 250);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#be123c', '#fbbf24', '#f43f5e']
      });
    }, 400);
  }
}