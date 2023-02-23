import app, { init } from "./app.js";


const port = +process.env.PORT || 4000;

init().then(() => {
    app.listen(port, () => {
        /* eslint-disable-next-line no-console */
        console.log(`Server listening on port ${port}.`);
    });
});
