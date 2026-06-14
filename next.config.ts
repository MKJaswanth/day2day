import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next doesn't pick up a stray
  // parent lockfile (a package-lock.json in the home directory).
  turbopack: {
    root: path.resolve("."),
  },
}

export default nextConfig
