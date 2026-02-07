const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const isValidEmail = (email) => {
  const v = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

const isStrongPassword = (password) => {
  const v = String(password || '');
  const minLen = v.length >= 8;
  const hasUpper = /[A-Z]/.test(v);
  const hasLower = /[a-z]/.test(v);
  const hasNumber = /[0-9]/.test(v);
  return minLen && hasUpper && hasLower && hasNumber;
};

module.exports = {
  normalizeEmail,
  isValidEmail,
  isStrongPassword,
};
