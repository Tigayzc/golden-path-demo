#!/usr/bin/env node

/**
 * Generate build information at build time
 * This script captures git commit hash, build timestamp, and environment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Execute git command safely
 */
function execGitCommand(command, fallback = 'unknown') {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.warn(`Warning: ${command} failed, using fallback: ${fallback}`);
    return fallback;
  }
}

/**
 * Generate build information
 */
function generateBuildInfo() {
  const commitHash = execGitCommand('git rev-parse HEAD', 'dev-local');
  const commitHashShort = execGitCommand('git rev-parse --short HEAD', 'dev');
  const branch = execGitCommand('git rev-parse --abbrev-ref HEAD', 'main');
  const commitMessage = execGitCommand('git log -1 --pretty=%B', 'Local development');
  const commitAuthor = execGitCommand('git log -1 --pretty=%an', 'Developer');
  const commitDate = execGitCommand('git log -1 --pretty=%cI', new Date().toISOString());

  const buildTime = new Date().toISOString();
  const buildTimestamp = Date.now();
  const nodeVersion = process.version;
  const environment = process.env.NODE_ENV || 'development';

  const buildInfo = {
    version: '1.0.0', // 可以从 package.json 读取
    git: {
      commitHash,
      commitHashShort,
      branch,
      commitMessage,
      commitAuthor,
      commitDate,
    },
    build: {
      time: buildTime,
      timestamp: buildTimestamp,
      environment,
      nodeVersion,
    },
  };

  return buildInfo;
}

/**
 * Main function
 */
function main() {
  console.log('🔨 Generating build information...');

  const buildInfo = generateBuildInfo();

  // Output build info for environment variables
  console.log('\n📋 Build Information:');
  console.log(`   Version: ${buildInfo.version}`);
  console.log(`   Commit: ${buildInfo.git.commitHashShort} (${buildInfo.git.branch})`);
  console.log(`   Build Time: ${buildInfo.build.time}`);
  console.log(`   Environment: ${buildInfo.build.environment}`);

  // Create public directory if it doesn't exist
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write build info to public directory (accessible at runtime)
  const buildInfoPath = path.join(publicDir, 'build-info.json');
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  console.log(`\n✅ Build info written to: ${buildInfoPath}`);

  // Output as environment variables for Vite
  console.log('\n📤 Environment variables for Vite:');
  console.log(`VITE_GIT_COMMIT_HASH=${buildInfo.git.commitHash}`);
  console.log(`VITE_GIT_COMMIT_SHORT=${buildInfo.git.commitHashShort}`);
  console.log(`VITE_GIT_BRANCH=${buildInfo.git.branch}`);
  console.log(`VITE_BUILD_TIME=${buildInfo.build.time}`);
  console.log(`VITE_BUILD_TIMESTAMP=${buildInfo.build.timestamp}`);
  console.log(`VITE_BUILD_ENV=${buildInfo.build.environment}`);
}

main();
