## Useful commands

Spin up Valkey server with Docker:

```bash
docker run -p 6379:6379 --name valkey -d valkey/valkey valkey-server --save 60 1
```

Start the backend and frontend:

```bash
npm run dev  # Or 'turbo run dev'
```

Install a package to a workspace:

```bash
npm i --workspace=<workspace name> <package name>
```
