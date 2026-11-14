const KNOWN_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'yahoo.in',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'zoho.com',
  'aol.com',
  'yandex.com',
  'live.com',
  'msn.com',
  'rediffmail.com',
];

const COMMON_TYPOS = {
  'gamil.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmailcom': 'gmail.com',
  'gnail.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yahho.com': 'yahoo.com',
  'yaoo.com': 'yahoo.com',
  'yhaoo.com': 'yahoo.com',
  'outloo.com': 'outlook.com',
  'outlok.com': 'outlook.com',
  'outlookk.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outlook.con': 'outlook.com',
  'outllook.com': 'outlook.com',
  'hotmal.com': 'hotmail.com',
  'hotamil.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmali.com': 'hotmail.com',
  'hotnail.com': 'hotmail.com',
  'icould.com': 'icloud.com',
  'iclod.com': 'icloud.com',
  'icloud.co': 'icloud.com',
  'protonmal.com': 'protonmail.com',
  'protonmail.co': 'protonmail.com',
  'redifmail.com': 'rediffmail.com',
  'rediff.com': 'rediffmail.com',
};

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function checkEmailTypo(email) {
  if (!email || !email.includes('@')) {
    return { hasSuggestion: false, suggestion: null, originalDomain: null };
  }

  const parts = email.split('@');
  const username = parts[0];
  const domain = parts[1]?.toLowerCase();

  if (!domain) {
    return { hasSuggestion: false, suggestion: null, originalDomain: null };
  }

  if (KNOWN_DOMAINS.includes(domain)) {
    return { hasSuggestion: false, suggestion: null, originalDomain: null };
  }

  if (COMMON_TYPOS[domain]) {
    return {
      hasSuggestion: true,
      suggestion: `${username}@${COMMON_TYPOS[domain]}`,
      originalDomain: domain,
    };
  }

  let closestDomain = null;
  let minDistance = Infinity;

  for (const knownDomain of KNOWN_DOMAINS) {
    const distance = levenshtein(domain, knownDomain);
    if (distance < minDistance && distance <= 2) {
      minDistance = distance;
      closestDomain = knownDomain;
    }
  }

  if (closestDomain && closestDomain !== domain) {
    return {
      hasSuggestion: true,
      suggestion: `${username}@${closestDomain}`,
      originalDomain: domain,
    };
  }

  return { hasSuggestion: false, suggestion: null, originalDomain: null };
}

export function isValidEmailFormat(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email.trim());
}