import { CircuitString, PrivateKey, Signature } from 'snarkyjs';

const getCountryCode = async (ip: string): Promise<string> => {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const json = await response.json();

  // Could also get "region", "lat", "lon", "timezone", etc.
  const { countryCode } = json;

  return countryCode;
};

const getSignedCountryCode = async (ip: string, privateKey: PrivateKey) => {
  const countryCode = await getCountryCode(ip);

  const ipField = CircuitString.fromString(ip);
  const countryCodeField = CircuitString.fromString(countryCode);
  const signature = Signature.create(
    privateKey,
    ipField.toFields().concat(countryCodeField.toFields())
  );

  return ({
    data: { ip, countryCode },
    signature,
    publicKey: privateKey.toPublicKey(),
  });
};

export { getCountryCode, getSignedCountryCode };
