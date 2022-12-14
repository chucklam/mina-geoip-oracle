import { isReady, shutdown, PublicKey, PrivateKey, Signature, CircuitString } from 'snarkyjs';
import dotenv from 'dotenv';
import { exit } from 'process';

import { getCountryCode, getSignedCountryCode } from './countrycode';

dotenv.config();

const { PRIVATE_KEY } = process.env;
if (!PRIVATE_KEY) {
  console.error('Private key not specified');
  exit(1);
}

let privateKey: PrivateKey;

describe('Unit tests', () => {

  beforeAll(async () => {
    await isReady;
    privateKey = PrivateKey.fromBase58(PRIVATE_KEY);
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  describe('getCountryCode', () => {

    test('Country code for 24.48.0.1 is CA', async () => {
      const countryCode = await getCountryCode('24.48.0.1');
      expect(countryCode).toEqual('CA');
    });

    test('Country code for 116.84.110.176 is KR', async () => {
      const countryCode = await getCountryCode('116.84.110.176');
      expect(countryCode).toEqual('KR');
    });
  });

  describe('getSignedCountryCode', () => {

    test('Signature for 24.48.0.1 includes correct data', async () => {
      const { data } = await getSignedCountryCode('24.48.0.1', privateKey);

      expect(data.ip).toBe('24.48.0.1');
      expect(data.countryCode).toBe('CA');
    });

    test('Signature for 24.48.0.1 verifies', async () => {
      const signed = await getSignedCountryCode('24.48.0.1', privateKey);
      const { data } = signed;

      const publicKey = PublicKey.fromBase58(signed.publicKey.toBase58());
      const signature = Signature.fromJSON(signed.signature.toJSON());
      const verified = signature.verify(
        publicKey,
        CircuitString.fromString(data.ip).toFields().concat(
          CircuitString.fromString(data.countryCode).toFields()
        )
      );

      verified.assertTrue();
    });

    test('Signature for 116.84.110.176 includes correct data',async () => {
      const { data } = await getSignedCountryCode('116.84.110.176', privateKey);

      expect(data.ip).toBe('116.84.110.176');
      expect(data.countryCode).toBe('KR');
    });

    test('Signature for 116.84.110.176 verifies',async () => {
      const signed = await getSignedCountryCode('116.84.110.176', privateKey);
      const { data } = signed;

      const publicKey = PublicKey.fromBase58(signed.publicKey.toBase58());
      const signature = Signature.fromJSON(signed.signature.toJSON());
      const verified = signature.verify(
        publicKey,
        CircuitString.fromString(data.ip).toFields().concat(
          CircuitString.fromString(data.countryCode).toFields()
        )
      );

      verified.assertTrue();
    });
  });
});