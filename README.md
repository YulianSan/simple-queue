# simple-queue

To run:

```bash
docker run -v $(pwd):/usr/src/app -p 3000:3000 --name simple-queue -d simple-queue-bun:latest
docker exec simple-queue bun install
docker exec simple-queue bun dev
bun run index.js
```

To run tests:
```bash
docker exec simple-queue bun test
```
