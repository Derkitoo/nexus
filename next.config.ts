import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === 'true' || process.env.DEPLOY_TARGET === 'gh-pages';
const repoName = 'nexus';

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : undefined,
  basePath: isGithubPages ? `/${repoName}` : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
