const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const analyzeBtn = document.getElementById('analyze-btn');
const linkInput = document.getElementById('link-input');
const loader = document.getElementById('loader');
const resultBadge = document.getElementById('result-badge');
const resultMessage = document.getElementById('result-message');
const resultReasons = document.getElementById('result-reasons');
const reportForm = document.getElementById('report-form');
const toast = document.getElementById('toast');

const suspiciousWords = [
  'paiement',
  'gratuit',
  'cadeau',
  'urgent',
  'bonus',
  'urgence',
  'verifier',
  'confirmer',
  'gagner',
  'win',
  'promotion',
  'récupérer',
  'momo',
  'bank',
  'pay',
  'otp',
  'secret'
];

const institutionReferences = [
  'universite',
  'faculte',
  'banque',
  'bcdc',
  'rawbank',
  'ecobank',
  'government',
  'gouvernement',
  'mtn',
  'orange',
  'airtel',
  'mobilemoney',
  'money',
  'service',
  'rdc'
];

const blacklistedDemoDomains = [
  'universite-exemple.invalid',
  'cadeau-gratuit.invalid',
  'site-officiel.invalid',
  'paiement-demo.invalid',
  'bank-demo.invalid',
  'secure-portal.invalid'
];

function setResult(level, message, reasons) {
  const labels = {
    success: 'VERT',
    warning: 'ORANGE',
    danger: 'ROUGE'
  };

  resultBadge.className = `result-badge ${level}`;
  resultBadge.textContent = labels[level];
  resultMessage.textContent = message;
  resultReasons.innerHTML = reasons.map((reason) => `<li>${reason}</li>`).join('');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function analyzeUrl(urlString) {
  const cleanUrl = urlString.trim();

  if (!cleanUrl) {
    setResult('warning', 'Veuillez saisir une URL pour lancer l’analyse.', ['Le champ est vide.']);
    return;
  }

  let url;
  try {
    url = new URL(cleanUrl);
  } catch (error) {
    setResult('danger', 'Le lien saisi n’est pas une URL valide.', ['Ajoutez le protocole https:// ou http:// avant l’URL.']);
    return;
  }

  const host = url.hostname.toLowerCase();
  const pathname = url.pathname.toLowerCase();
  const hasIpAddress = /\b\d{1,3}(?:\.\d{1,3}){3}\b/.test(host);
  const suspiciousHits = suspiciousWords.filter((word) => host.includes(word) || pathname.includes(word));
  const weirdChars = /[^a-z0-9.-]/.test(host.replace(/\./g, ''));
  const complexSubdomains = host.split('.').length > 3;
  const institutionMatch = institutionReferences.some((item) => host.includes(item) || pathname.includes(item));
  const blacklistedMatch = blacklistedDemoDomains.some((demo) => host.includes(demo));

  let score = 0;
  const reasons = [];

  if (hasIpAddress) {
    score += 2;
    reasons.push('L’URL contient une adresse IP, ce qui est inhabituel pour un site officiel.');
  }

  if (suspiciousHits.length > 0) {
    score += 2;
    reasons.push(`Des mots suspects ont été détectés : ${suspiciousHits.slice(0, 3).join(', ')}.`);
  }

  if (weirdChars) {
    score += 1;
    reasons.push('Le domaine contient des caractères inhabituels ou des éléments atypiques.');
  }

  if (complexSubdomains) {
    score += 1;
    reasons.push('Le nom de domaine présente plusieurs sous-domaines ou une structure complexe.');
  }

  if (institutionMatch) {
    reasons.push('Le domaine ressemble à une institution ou un service connu, ce qui peut être une imitation.');
    score += 1;
  }

  if (blacklistedMatch) {
    score += 3;
    reasons.push('Le domaine figure dans la liste locale de démonstration de liens signalés.');
  }

  if (score >= 5) {
    setResult(
      'danger',
      'ROUGE : Plusieurs indicateurs suspects ont été détectés. Prenez garde avant d’ouvrir le lien.',
      reasons.length ? reasons : ['Aucun élément positif n’a été identifié au moment de l’analyse.']
    );
  } else if (score >= 2) {
    setResult(
      'warning',
      'ORANGE : Certains éléments inhabituels ont été détectés. Vérifiez avant de poursuivre.',
      reasons.length ? reasons : ['Le lien mérite une vérification plus poussée.']
    );
  } else {
    setResult(
      'success',
      'VERT : Aucun signal de risque connu détecté à ce stade. Cela ne garantit pas la sécurité absolue du site, mais il ne montre pas d’indicateurs typiques d’usurpation.',
      reasons.length ? reasons : ['Aucune anomalie notable n’a été détectée dans le domaine ou le chemin fourni.']
    );
  }

  if (score >= 2) {
    const tips = [
      'Vérifiez directement le site officiel via votre navigateur ou application de confiance.',
      'Évitez de cliquer si le message vous met sous pression ou demande un paiement rapide.',
      'Ne partagez jamais votre code PIN, OTP ou mot de passe sur un lien reçu par message.'
    ];

    resultReasons.innerHTML += tips.map((tip) => `<li>${tip}</li>`).join('');
  }
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (analyzeBtn) {
  analyzeBtn.addEventListener('click', () => {
    const value = linkInput.value || '';
    loader.classList.remove('hidden');

    setTimeout(() => {
      loader.classList.add('hidden');
      analyzeUrl(value);
    }, 1100);
  });
}

if (linkInput) {
  linkInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      analyzeBtn.click();
    }
  });
}

if (reportForm) {
  reportForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const report = {
      link: document.getElementById('report-link').value,
      category: document.getElementById('report-category').value,
      description: document.getElementById('report-description').value,
      createdAt: new Date().toISOString()
    };

    const storageKey = 'cyberguard_reports';
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    saved.push(report);
    localStorage.setItem(storageKey, JSON.stringify(saved));

    reportForm.reset();
    showToast('Signalement enregistré dans le navigateur pour cette démonstration.');
  });
}

const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));
