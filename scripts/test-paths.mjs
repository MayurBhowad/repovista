import { registerHooks } from "node:module";

// Resolves the `@/` alias from tsconfig to `src/` for `node --test`.
// Only `.ts` modules without JSX can run under Node's type stripping.
const SOURCE_ROOT = new URL("../src/", import.meta.url);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const target = new URL(`${specifier.slice(2)}.ts`, SOURCE_ROOT);
      return nextResolve(target.href, context);
    }

    return nextResolve(specifier, context);
  },
});
