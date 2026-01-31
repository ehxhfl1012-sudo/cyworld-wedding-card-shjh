#!/bin/bash
# 미니홈피 Spring Boot 실행 스크립트 (서버에서 사용)
# 사용법: ./run.sh   또는  nohup ./run.sh &

JAR_NAME="cyworld-wedding-card-shjh-0.0.1-SNAPSHOT.jar"
cd "$(dirname "$0")"

if [ ! -f "$JAR_NAME" ]; then
  echo "오류: $JAR_NAME 파일이 없습니다. target/ 폴더에서 이 스크립트와 같은 위치로 JAR를 복사하세요."
  exit 1
fi

# Java 17 이상 필요
java -jar "$JAR_NAME"
