## Full Stack open — Exercise 3

### Full Stack Phonebook App — Deployed with [Render](https://render.com/).

Live: https://phonebook-fso-exercise-m7w9.onrender.com

### Preview

![Test](https://github.com/SebilleK/fullstackopen-pt3/blob/master/preview/test.gif.gif) ![Console](https://github.com/SebilleK/fullstackopen-pt3/blob/master/preview/console.gif.gif)

### Notes

- Frontend: React | Backend: Node + Express | Database: MongoDB (Atlas)

- To run the script:

```bash
npm start
```

The console should show the process of connecting to the database.

- Direct MongoDB queries:

```bash
node mongo.js <password> <name> <number> : Adds a new entry to the phonebook
node mongo.js <password> : Lists all entries in the database
```

The password was used before in development, but at present it is just a placeholder argument. Use any value.
In the requests directory premade requests for creating and deleting an entry in the phonebook are provided.

- ESLint is configured a bit differently than taught due to version incompatibilities. All ignored files/folders are mentioned in the config file eslint.config.mjs itself. To fix all linting errors according to this config file:

```bash
npx eslint --fix
```
