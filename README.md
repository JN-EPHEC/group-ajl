# Projet DEV III

Site internet de notation de films permettant de donner un avis à un film et de voir ceux des autres. 

## Groupe 2TL1-7

* AERTS Justin
* PEETERS Arnaud
* SCHENKEL Lucas

## Informations

* IP du site/VPS : 91.134.137.41
* URL du site : ***http://91.134.137.41***

## Schéma du projet

```txt
.github
.idea

client
├── public
│   └── vite.svg
├── src
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   └── Navbar.tsx
│   ├── pages
│   │   ├── Home.tsx
│   │   ├── Movies.tsx
│   │   ├── Profile.tsx
│   │   ├── RatedMovies.tsx
│   │   └── Watchlist
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.development
├── .env.production
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

server
├── coverage
├── models
│   └── index.js
├── public
│   ├── index.html
│   └── script.js
├── src
│   ├── config
│   │   ├── database.ts
│   │   └── swagger.ts
│   ├── controllers
│   │   └── userControllers.ts
│   ├── middlewares
│   │   ├── checkIdParam.ts
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   ├── models
│   │   └── Users.ts
│   ├── routes
│   │   └── userRoutes.ts
│   ├── tests
│   │   ├── math.test.ts
│   │   ├── password.test.ts
│   │   ├── shipping.test.ts
│   │   ├── userValidator.test.ts
│   │   ├── filmControleurs.test.ts
│   │   ├── middlewares.test.ts
│   │   └── userControleurs.test.ts
│   ├── utils
│   │   ├── password.ts
│   │   ├── shipping.ts
│   │   └── userValidator.ts
│   └── server.ts
├── .gitignore
├── database.sqlite
├── Dockerfile
├── jest.config.js
├── package.json
├── package-lock.json
└── tsconfig.json

.env
.gitignore
package.json
package-lock.json
README.md
REPORT.md
```