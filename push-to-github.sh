#!/bin/bash
# 터미널에서 GitHub 저장소 생성 + 푸시
# 사용법: GITHUB_USER=본인아이디 GITHUB_TOKEN=토큰값 ./push-to-github.sh

set -e
REPO_NAME="cyworld-wedding-card-shjh"

if [ -z "$GITHUB_USER" ] || [ -z "$GITHUB_TOKEN" ]; then
  echo "사용법:"
  echo "  GITHUB_USER=본인GitHub아이디 GITHUB_TOKEN=토큰값 ./push-to-github.sh"
  echo ""
  echo "토큰 발급: https://github.com/settings/tokens → Generate new token (classic) → repo 체크"
  exit 1
fi

echo ">>> GitHub에 저장소 생성 중..."
curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"private\":false}" > /dev/null

echo ">>> 원격 추가 및 푸시..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"
git branch -M main
git push -u origin main

echo ">>> 완료! https://github.com/${GITHUB_USER}/${REPO_NAME}"
