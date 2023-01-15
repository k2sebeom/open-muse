#! /usr/bin/env node
const { execSync } = require('child_process');

const args = process.argv.slice(2);

const repoName = args[0];

execSync(`git clone https://github.com/k2sebeom/ts-nextjs-template.git ${repoName}`, {
    stdio: 'inherit'
});

execSync(`cd ${repoName} && rm -rf .git && git init && git add . && git commit -m "Initial commit" && git branch -M main`, {
    stdio: 'inherit'
});

console.log("Installing Dependencies...");

execSync(`cd ${repoName} && yarn`, {
    stdio: 'inherit'
});

console.log(`
==============
NextJs Typescript App initialized in ${repoName}
==============`);