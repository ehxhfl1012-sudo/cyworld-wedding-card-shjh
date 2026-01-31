# Railway 배포 단계 (GitHub 연결 후)

GitHub 연결까지 완료하셨다면, 아래 순서대로 진행하세요.

---

## 1. 새 프로젝트에서 GitHub 저장소 선택

1. **Railway 대시보드** → **New Project**
2. **Deploy from GitHub repo** 선택
3. 저장소 목록에서 **cyworld-wedding-card-shjh** (또는 올려둔 저장소 이름) 선택
4. **Deploy Now** 클릭

→ Railway가 자동으로 빌드를 시작합니다.

---

## 2. 빌드/실행 설정 확인 (필요 시)

- **Settings** → **Build**  
  - **Build Command**: `mvn clean package -DskipTests`  
    (비어 있으면 Nixpacks가 Maven으로 자동 인식할 수 있음)
- **Settings** → **Deploy**  
  - **Start Command**: `java -jar target/cyworld-wedding-card-shjh-0.0.1-SNAPSHOT.jar`  
    (Procfile / nixpacks.toml이 있으면 자동으로 쓰일 수 있음)

저장소에 **Procfile**과 **nixpacks.toml**을 넣어 두었으므로, 설정이 비어 있어도 이 명령으로 동작해야 합니다.

---

## 3. 도메인(URL) 연결

1. 배포된 서비스 클릭
2. **Settings** → **Networking** → **Generate Domain** 클릭
3. 생성된 주소 예: `https://cyworld-wedding-card-shjh-production-xxxx.up.railway.app`

이 URL로 접속하면 미니홈피가 열립니다.

---

## 4. 접속 주소

- **랜딩 페이지**: `https://생성된도메인.up.railway.app/`
- **미니홈피(팝업용)**: `https://생성된도메인.up.railway.app/home`

---

## 5. 참고

- **데이터**: Railway는 재시작 시 로컬 디스크가 초기화될 수 있어, H2 DB·업로드 파일은 일시적일 수 있습니다. 장기 보존이 필요하면 Railway에서 PostgreSQL 등 추가 후 설정을 바꿔야 합니다.
- **재배포**: GitHub에 `git push` 하면 Railway가 자동으로 다시 빌드·배포합니다.
- **처음 배포**: 빌드가 2~5분 정도 걸릴 수 있습니다.

이 단계까지 하시면 Railway에서 미니홈피가 열립니다.
