# tracko - Development Notes

This project requires the use of a virtual env.
To start the terminal session for this project run:

```bash
source venv/bin/activate
```

Development commands

```bash
npm run dev
npx tailwindcss -i ./src/index.css -o ./src/output.css --watch
uvicorn main:app --reload
```
