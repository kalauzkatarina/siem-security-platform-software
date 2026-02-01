console.clear();

import('./app.js')
  .then(({ default: app }) => {
    const port = process.env.PORT || 3005;
    app.listen(port, () => {
      console.log(`\x1b[32m[IntegrityService]\x1b[0m running on localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ FATAL ERROR DURING IMPORT:");
    console.error(err);
    process.exit(1);
  });