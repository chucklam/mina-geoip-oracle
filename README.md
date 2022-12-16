# A GeoIP Oracle for Mina zkApps

This oracle takes an IP address and returns the address's country code, along with a signature for Mina zkApps. (The country lookup uses ip-api.com, but there are many other Geo IP lookups available with different pricing schemes.)

## Local Setup
Run the key generator script below to create a private/public key pair.
```
npm run keygen
```
Create a `.env` file with a `PRIVATE_KEY=` entry for the private key.

Start the server locally with
```
npm run dev
```
Once the server has started, you can check out the API using http://localhost:3000/ip/[IP-address], replacing `[IP-address]` with some IP address.

### Run unit tests
```
npm run test
```

## Deployment
The API is just a NodeJS + ExpressJS server. For convenience, you can deploy it on Digital Ocean using this link:
[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/chucklam/mina-geoip-oracle/tree/main&refcode=946c219af299)

During deployment, make sure you properly set the environment variable `PRIVATE_KEY` in the hosting environment (i.e. Digital Ocean). For security, this production private key should be different from what's used locally and not be shared among developers.

An example call could be found at https://mina-geoip-oracle-9mbb8.ondigitalocean.app/ip/24.48.0.1.