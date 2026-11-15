#!/usr/bin/env sh
set -eu

# Resolve origin before entering dist, which has its own deployment-only Git repo.
project_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
cd "$project_dir"
repository_url="$(git remote get-url origin)"

# Fail before publishing if this checkout points at a different project.
case "$repository_url" in
  git@github.com:Az212At/rick-and-morty-vue.git|https://github.com/Az212At/rick-and-morty-vue.git|https://github.com/Az212At/rick-and-morty-vue) ;;
  *) printf '%s\n' 'Expected origin to point at Az212At/rick-and-morty-vue.' >&2; exit 1 ;;
esac

yarn build

cd dist
touch .nojekyll
git init --quiet
git add -A
if ! git diff --cached --quiet; then
  git commit -m 'Deploy demo'
fi
# HEAD works with either initial branch name. Only the generated branch is replaced.
git push --force "$repository_url" HEAD:refs/heads/gh-pages
printf '%s\n' 'Demo: https://az212at.github.io/rick-and-morty-vue/'
