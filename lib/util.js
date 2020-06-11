var sanitizePublicKey = function fnSanitizePublicKey(key) {
  // Public Key or Certificate must be in this specific format or else the function won't accept it
  if (!key || typeof key !== 'string' || (key && key.length < 1)) {
    return key;
  }
  var beginKey = '';
  var endKey = '';
  if (key.indexOf('-----BEGIN PUBLIC KEY') > -1) {
    beginKey = '-----BEGIN PUBLIC KEY-----';
    endKey = '-----END PUBLIC KEY-----';
  } else if (key.indexOf('-----BEGIN CERTIFICATE-----') > -1) {
    beginKey = '-----BEGIN CERTIFICATE-----';
    endKey = '-----END CERTIFICATE-----';
  } else if (key.indexOf('-----BEGIN RSA PRIVATE KEY-----') > -1) {
    beginKey = '-----BEGIN RSA PRIVATE KEY-----';
    endKey = '-----END RSA PRIVATE KEY-----';
  } else {
    return key;
  }

  key = key.replace('\n', '');
  key = key.replace(beginKey, '');
  key = key.replace(endKey, '');

  var result = beginKey;
  while (key.length > 0) {
    if (key.length > 64) {
      result += '\n' + key.substring(0, 64);
      key = key.substring(64, key.length);
    } else {
      result += '\n' + key;
      key = '';
    }
  }

  if (result[result.length] !== '\n') { result += '\n'; }
  result += endKey + '\n';
  return result;
};

module.exports = {
  sanitizePublicKey: sanitizePublicKey
};
