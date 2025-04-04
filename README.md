# AutoLeasingPro Backend

Backend-palvelin AutoLeasingPro-leasingvertailusivustolle.

## Käyttöönotto

1. Asenna tarvittavat paketit: `npm install`
2. Käynnistä palvelin: `node dist/index.js`

## Ympäristömuuttujat

Varmista, että seuraavat ympäristömuuttujat on määritelty:

- `DATABASE_URL`: PostgreSQL-tietokannan URL
- `CORS_ORIGIN`: Frontend-sivuston URL, esim. "https://sinun-domain.fi"
