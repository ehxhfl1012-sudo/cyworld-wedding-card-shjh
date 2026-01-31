# 미니홈피 배포 가이드 (FileZilla + 서버)

## ⚠️ 중요: 서버 요구사항

이 프로젝트는 **Spring Boot(Java) 웹 애플리케이션**입니다.

- **일반 웹호스팅(FTP만 있는 경우)**  
  HTML/CSS/JS만 올리는 호스팅에서는 **실행되지 않습니다**.  
  서버에 **Java 17 이상**을 설치하고 JAR를 실행할 수 있어야 합니다.

- **가능한 환경**
  - **VPS / 클라우드 서버** (AWS, GCP, Naver Cloud, 카페24 VPS 등): Java 설치 후 JAR 실행
  - **Java 지원 호스팅**: JAR 배포 방식 지원하는 곳
  - **무료 Java 호스팅** (Railway, Render 등): FileZilla 대신 Git/CLI로 배포

---

## 1. 배포용 JAR 빌드 (로컬 PC)

프로젝트 폴더에서 터미널 실행 후:

```bash
mvn clean package -DskipTests
```

빌드가 끝나면 다음 파일이 생성됩니다.

- **파일 위치**: `target/cyworld-wedding-card-shjh-0.0.1-SNAPSHOT.jar`
- 이 **JAR 파일 하나**에 서버 코드 + HTML/CSS/JS가 모두 포함되어 있습니다.

---

## 2. FileZilla로 서버에 올리기

1. **FileZilla** 실행 후 서버 정보로 접속 (FTP 또는 SFTP).
2. **올릴 파일**
   - `cyworld-wedding-card-shjh-0.0.1-SNAPSHOT.jar`  
     → 서버의 원하는 폴더에 업로드 (예: `/home/username/app/`)
3. **(선택)** 같은 폴더에 `run.sh` 또는 `run.bat`도 올려두면 실행이 편합니다 (아래 3번 참고).

---

## 3. 서버에서 실행하기

서버에 **Java 17 이상**이 설치되어 있어야 합니다.

### Linux / Mac (SSH 접속 후)

```bash
# JAR가 있는 폴더로 이동
cd /home/username/app   # 실제 경로로 변경

# 실행 (포그라운드)
java -jar cyworld-wedding-card-shjh-0.0.1-SNAPSHOT.jar

# 백그라운드 실행 (끄지 않고 계속 실행)
nohup java -jar cyworld-wedding-card-shjh-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
```

### 포트 변경이 필요할 때

기본 포트는 **8080**입니다. 80번으로 쓰려면:

```bash
java -jar cyworld-wedding-card-shjh-0.0.1-SNAPSHOT.jar --server.port=80
```

(80 포트는 보통 root 권한 필요: `sudo java -jar ...`)

---

## 4. 데이터 저장 위치 (서버)

JAR를 실행한 **현재 디렉터리** 기준으로 아래 폴더가 생성됩니다.

- **DB 파일**: `./data/weddingdb` (H2 DB)
- **BGM 업로드**: `./uploads/bgm/`

재배포 시 **JAR만 덮어쓰고**, `data/`, `uploads/` 폴더는 **삭제하지 않으면** 데이터가 유지됩니다.

---

## 5. 사이트 접속

- 서버 IP가 `123.45.67.89`이고 포트 8080이면:  
  **http://123.45.67.89:8080**
- 도메인을 8080 포트로 연결해 두었다면:  
  **http://도메인주소:8080**
- 80 포트로 실행했다면:  
  **http://도메인주소** 또는 **http://123.45.67.89**

---

## 6. 일반 웹호스팅(FTP만)을 쓰는 경우

FTP로 **HTML/CSS/JS만** 올리는 호스팅에서는 이 Spring Boot 앱을 **그대로 실행할 수 없습니다**.

선택지:

1. **VPS/클라우드**를 하나 준비하고, 위 1~3번처럼 JAR를 FileZilla(SFTP)로 올린 뒤 `java -jar`로 실행하기.
2. **Railway, Render** 같은 무료 Java 호스팅에 Git으로 배포하기 (FileZilla 대신).
3. 백엔드(API)는 다른 서비스에 두고, 호스팅에는 **프론트(HTML/JS)**만 올리는 방식으로 나누기 (구조 변경 필요).

---

## 요약

| 단계 | 내용 |
|------|------|
| 1 | 로컬에서 `mvn clean package -DskipTests` 로 JAR 빌드 |
| 2 | FileZilla로 `cyworld-wedding-card-shjh-0.0.1-SNAPSHOT.jar` 업로드 |
| 3 | 서버에 Java 17+ 설치 후 `java -jar ...jar` 실행 |
| 4 | 브라우저에서 `http://서버주소:8080` 접속 |

서버가 **Java를 실행할 수 있는 환경**이어야 하고, FileZilla는 **JAR 파일을 올리는 용도**로 사용하면 됩니다.
