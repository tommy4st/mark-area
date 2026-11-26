#!/usr/bin/env bash
# Usage: scripts/release.sh [patch|minor|major|x.y.z]
#
# Bumps the version on the current branch, then creates the tag vX.Y.Z on a
# child commit that also contains the built dist/. The branch itself never
# tracks dist/, yet git dependencies (repo#vX.Y.Z) and CDNs reading a tag work.
# Pushes branch and tag to every remote (or to $RELEASE_REMOTES); the tag push
# starts the publish pipeline of each forge.
set -euo pipefail
cd "$(dirname "$0")/.."

[ -z "$(git status --porcelain)" ] || { echo "Working tree is not clean; commit or stash first." >&2; exit 1; }

bun run check
bun pm version "${1:-patch}" --no-git-tag-version
tag="v$(bun -p "require('./package.json').version")"
# Point the README install and CDN snippets at the new tag.
sed -i.bak -E "s#(mark-area[@\#]|releases/download/)v[0-9]+\.[0-9]+\.[0-9]+#\1$tag#g" README.md && rm README.md.bak
# `[skip ci]`: the tag commit below runs the same checks (with dist) in the publish pipelines.
git commit -qam "$tag [skip ci]"

git add -f dist
tree=$(git write-tree)
git rm -r -q --cached dist
git tag -a "$tag" -m "$tag" "$(git commit-tree "$tree" -p HEAD -m "$tag (with dist)")"

for remote in ${RELEASE_REMOTES:-$(git remote)}; do
  git push "$remote" HEAD "$tag"
done
echo "Released $tag"
