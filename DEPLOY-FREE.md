# SSH 없는 무료 호스팅에서 미니홈피 열기

일반 무료 호스팅(FTP/FileZilla만 지원)에서는 **Java를 실행할 수 없어서**  
지금 프로젝트(Spring Boot)를 **그대로 올려서는 사이트가 동작하지 않습니다.**

아래 두 가지 중 하나를 선택하면 됩니다.

---

## 방법 1: 무료 Java 호스팅 사용 (추천)

**SSH 없이**, 브라우저나 Git으로만 배포할 수 있는 서비스입니다.  
**한 곳에 올리면** 미니홈피(화면 + API + DB)가 **그대로** 동작합니다.

### 1) Railway (무료 크레딧)

1. [railway.app](https://railway.app) 가입
2. **New Project** → **Deploy from GitHub** 선택  
   (GitHub에 프로젝트 올려두고 연결)
3. 또는 **Empty Project** → **Deploy**에서 **JAR 파일 업로드** (드래그 앤 드롭)
4. 배포 후 나오는 **URL**로 접속 (예: `https://xxx.up.railway.app`)

- SSH 불필요, 웹에서 설정만 하면 됨  
- 무료 크레딧 소진 시 일시 중지될 수 있음

### 2) Render (무료)

1. [render.com](https://render.com) 가입
2. **New** → **Web Service**
3. GitHub 저장소 연결 후:
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**:  
     `java -jar target/cyworld-wedding-card-shjh-0.0.1-SNAPSHOT.jar`
4. **Create Web Service** 후 나오는 URL로 접속

- SSH 없음, Git 푸시만으로 재배포 가능

### 3) 그 외

- **Fly.io** – CLI 한 번 설치 후 배포 (SSH는 안 써도 됨)
- **Koyeb** – Git 연결로 배포 가능

---

## 방법 2: 지금 호스팅(FTP) + 백엔드만 다른 곳에 두기

**“지금 쓰는 무료 호스팅(FileZilla)에는 화면만 두고,  
서버(Spring Boot)는 다른 무료 서비스에서 실행”** 하는 방식입니다.

- **FTP 호스팅**: HTML/CSS/JS만 FileZilla로 업로드 (또는 빌드된 정적 파일)
- **백엔드**: Railway / Render 등에 JAR 배포 → 예: `https://미니홈피-api.railway.app`
- **프론트**: API 요청 주소를 위 백엔드 주소로 바꿔서 사용

이렇게 하려면 코드 수정이 필요합니다.  
(예: `fetch('/api/...')` → `fetch('https://미니홈피-api.railway.app/api/...')`  
또는 환경별 설정 파일로 API 주소 분리)

원하시면 “방법 2”용으로 **API 주소만 바꾸면 되는 수정 방법**을 단계별로 정리해 드리겠습니다.

---

## 요약

| 상황 | 선택 |
|------|------|
| **가장 간단하게 전체 사이트 열기** | **방법 1**: Railway 또는 Render에 JAR(또는 GitHub) 배포 → 나온 URL로 접속 |
| **지금 FTP 호스팅을 꼭 쓰고 싶다** | **방법 2**: FTP에는 화면만 올리고, 백엔드는 Railway 등에 따로 배포 후 주소만 연결 |

둘 다 **SSH는 필요 없고**,  
- 방법 1: 브라우저 + (선택) GitHub  
- 방법 2: FileZilla(FTP) + 브라우저(Railway 등 설정)  
만 있으면 됩니다.

원하시는 쪽(1번만 쓸지, 2번처럼 FTP 호스팅도 쓸지) 알려주시면, 그에 맞춰 다음 단계만 더 구체적으로 적어 드리겠습니다.
