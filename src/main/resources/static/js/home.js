document.addEventListener("DOMContentLoaded", function () {
    // ========== 관리자 기능 ==========
    const adminLoginBtn = document.getElementById("adminLoginBtn");
    const adminLoginModal = document.getElementById("adminLoginModal");
    const adminLoginClose = document.getElementById("adminLoginClose");
    const adminLoginSubmit = document.getElementById("adminLoginSubmit");
    const adminLogoutBtn = document.getElementById("adminLogoutBtn");
    const adminId = document.getElementById("adminId");
    const adminPassword = document.getElementById("adminPassword");
    const adminLoginError = document.getElementById("adminLoginError");

    let isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

    // 관리자 로그인 상태 체크
    function checkAdminStatus() {
        if (isAdminLoggedIn) {
            showAdminControls();
        }
    }

    // 관리자 컨트롤 표시
    function showAdminControls() {
        const historyEditBtn = document.getElementById("historyEditBtn");
        const profileEditBtn = document.getElementById("profileEditBtn");
        const adminIntroControls = document.querySelectorAll(".admin-intro-controls");
        const mainTitleEditBtn = document.getElementById("mainTitleEditBtn");
        const mainUrlEditBtn = document.getElementById("mainUrlEditBtn");
        const adminMiniroomControls = document.querySelector(".admin-miniroom-controls");
        const diaryEditBtn = document.getElementById("diaryEditBtn");
        const miniroomImageDelete = document.getElementById("miniroomImageDelete");
        const profileImageControls = document.querySelector(".profile-image-controls");
        
        if (historyEditBtn) historyEditBtn.style.display = "inline-block";
        adminIntroControls.forEach(control => control.style.display = "flex");
        if (mainTitleEditBtn) mainTitleEditBtn.style.display = "inline-block";
        if (mainUrlEditBtn) mainUrlEditBtn.style.display = "inline-block";
        if (adminMiniroomControls) adminMiniroomControls.style.display = "flex";
        if (diaryEditBtn) diaryEditBtn.style.display = "inline-block";
        if (miniroomImageDelete) miniroomImageDelete.style.display = "block";
        if (profileImageControls) profileImageControls.style.display = "flex";
        const btnBgmUpload = document.getElementById("btnBgmUpload");
        if (btnBgmUpload) btnBgmUpload.style.display = "inline-block";
        
        // 일촌평 삭제 버튼 추가
        updateIlchonDeleteButtons();
        
        // 방명록 목록 다시 로드 (댓글 버튼 표시)
        loadGuestbookList();
        // BGM 목록 다시 그리기 (삭제 버튼 표시)
        if (typeof renderPlaylist === "function") renderPlaylist();
    }

    // 관리자 컨트롤 숨기기
    function hideAdminControls() {
        const historyEditBtn = document.getElementById("historyEditBtn");
        const historySaveBtn = document.getElementById("historySaveBtn");
        const profileEditBtn = document.getElementById("profileEditBtn");
        const profileSaveBtn = document.getElementById("profileSaveBtn");
        const adminIntroControls = document.querySelectorAll(".admin-intro-controls");
        const mainTitleEditBtn = document.getElementById("mainTitleEditBtn");
        const mainTitleSaveBtn = document.getElementById("mainTitleSaveBtn");
        const mainUrlEditBtn = document.getElementById("mainUrlEditBtn");
        const mainUrlSaveBtn = document.getElementById("mainUrlSaveBtn");
        const adminMiniroomControls = document.querySelector(".admin-miniroom-controls");
        const diaryEditBtn = document.getElementById("diaryEditBtn");
        const diarySaveBtn = document.getElementById("diarySaveBtn");
        const miniroomImageDelete = document.getElementById("miniroomImageDelete");
        const profileImageControls = document.querySelector(".profile-image-controls");
        
        if (historyEditBtn) historyEditBtn.style.display = "none";
        if (historySaveBtn) historySaveBtn.style.display = "none";
        adminIntroControls.forEach(control => control.style.display = "none");
        if (mainTitleEditBtn) mainTitleEditBtn.style.display = "none";
        if (mainTitleSaveBtn) mainTitleSaveBtn.style.display = "none";
        if (mainUrlEditBtn) mainUrlEditBtn.style.display = "none";
        if (mainUrlSaveBtn) mainUrlSaveBtn.style.display = "none";
        if (adminMiniroomControls) adminMiniroomControls.style.display = "none";
        if (diaryEditBtn) diaryEditBtn.style.display = "none";
        if (diarySaveBtn) diarySaveBtn.style.display = "none";
        if (miniroomImageDelete) miniroomImageDelete.style.display = "none";
        if (profileImageControls) profileImageControls.style.display = "none";
        const btnBgmUpload = document.getElementById("btnBgmUpload");
        if (btnBgmUpload) btnBgmUpload.style.display = "none";
        
        // 일촌평 삭제 버튼 제거
        document.querySelectorAll(".ilchon-delete-btn").forEach(btn => btn.remove());
        
        // 방명록 목록 다시 로드 (댓글 버튼 숨기기)
        loadGuestbookList();
        // BGM 목록 다시 그리기 (삭제 버튼 숨기기)
        if (typeof renderPlaylist === "function") renderPlaylist();
    }

    // 관리자 로그인 관련 버튼들
    const adminApplyAllBtn = document.getElementById("adminApplyAllBtn");

    // ========== 방문 카운터 (TODAY / TOTAL) ==========
    function updateVisitCounts() {
        const todayEl = document.getElementById("counterToday");
        const totalEl = document.getElementById("counterTotal");
        if (!todayEl || !totalEl) return;

        fetch("/api/visit", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then(data => {
                todayEl.textContent = String(data.today ?? 0);
                totalEl.textContent = String(data.total ?? 0);
            })
            .catch(() => {
                todayEl.textContent = "0";
                totalEl.textContent = "0";
            });
    }
    updateVisitCounts();

    // 관리자 로그인 모달 열기
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener("click", () => {
            adminLoginModal.classList.remove("hidden");
            if (isAdminLoggedIn) {
                adminLoginSubmit.style.display = "none";
                adminLogoutBtn.style.display = "block";
                if (adminApplyAllBtn) adminApplyAllBtn.style.display = "block";
                adminId.style.display = "none";
                adminPassword.style.display = "none";
                document.querySelector(".admin-input-group").style.display = "none";
                document.querySelectorAll(".admin-input-group")[1].style.display = "none";
            }
        });
    }

    // 관리자 로그인 모달 닫기
    if (adminLoginClose) {
        adminLoginClose.addEventListener("click", () => {
            adminLoginModal.classList.add("hidden");
            adminLoginError.style.display = "none";
        });
    }

    // 관리자 로그인 (form submit으로 처리 → Password 필드 form 경고 해소)
    const adminLoginForm = document.getElementById("adminLoginForm");
    function doAdminLogin() {
        const id = adminId.value.trim();
        const pw = adminPassword.value.trim();
        if (id === "admin" && pw === "1234") {
            isAdminLoggedIn = true;
            localStorage.setItem("adminLoggedIn", "true");
            adminLoginModal.classList.add("hidden");
            showAdminControls();
            adminId.value = "";
            adminPassword.value = "";
            adminLoginError.style.display = "none";
            if (adminApplyAllBtn) adminApplyAllBtn.style.display = "block";
            alert("관리자 로그인 성공!");
        } else {
            adminLoginError.style.display = "block";
        }
    }
    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            doAdminLogin();
        });
    }
    if (adminLoginSubmit) {
        adminLoginSubmit.addEventListener("click", (e) => { e.preventDefault(); doAdminLogin(); });
    }
    
    // 모든 변경사항 적용
    if (adminApplyAllBtn) {
        adminApplyAllBtn.addEventListener("click", () => {
            if (confirm('모든 변경사항을 저장하시겠습니까?')) {
                let hasChanges = false;
                
                // 1. History 저장
                const groom = document.getElementById("historyGroom");
                const bride = document.getElementById("historyBride");
                const date = document.getElementById("historyDate");
                const place = document.getElementById("historyPlace");
                
                if (groom && bride && date && place) {
                    localStorage.setItem("historyGroom", groom.textContent);
                    localStorage.setItem("historyBride", bride.textContent);
                    localStorage.setItem("historyDate", date.textContent);
                    localStorage.setItem("historyPlace", place.textContent);
                    
                    groom.contentEditable = "false";
                    bride.contentEditable = "false";
                    date.contentEditable = "false";
                    place.contentEditable = "false";
                    
                    groom.style.border = "none";
                    bride.style.border = "none";
                    date.style.border = "none";
                    place.style.border = "none";
                    hasChanges = true;
                }
                
                // 2. Profile Intro 저장
                const introText = document.getElementById("profileIntroText");
                const introSub = document.getElementById("profileIntroSub");
                
                if (introText && introSub) {
                    let subText = (introSub.textContent || "").slice(0, INTRO_SUB_MAX_LENGTH);
                    if (introSub.textContent.length > INTRO_SUB_MAX_LENGTH) introSub.textContent = subText;
                    localStorage.setItem("profileIntroText", introText.textContent);
                    localStorage.setItem("profileIntroSub", subText);
                    introText.contentEditable = "false";
                    introSub.contentEditable = "false";
                    introText.style.border = "none";
                    introSub.style.border = "none";
                    hasChanges = true;
                }
                // 3. Main Title 저장
                const mainTitle = document.querySelector(".main-title");
                if (mainTitle && mainTitle.contentEditable === "true") {
                    localStorage.setItem("mainTitle", mainTitle.textContent.trim());
                    mainTitle.contentEditable = "false";
                    mainTitle.style.border = "none";
                    hasChanges = true;
                }
                
                // 4. Main URL 저장
                const mainUrl = document.querySelector(".main-url");
                if (mainUrl) {
                    const tempInput = mainUrl.querySelector('input');
                    if (tempInput) {
                        const newUrl = tempInput.value.trim();
                        
                        // 모든 자식 노드 제거
                        while (mainUrl.firstChild) {
                            mainUrl.removeChild(mainUrl.firstChild);
                        }
                        
                        // 새 텍스트 노드 생성
                        const textNode = document.createTextNode(newUrl || "https://example.com");
                        mainUrl.appendChild(textNode);
                        
                        localStorage.setItem("mainUrl", newUrl || "https://example.com");
                        hasChanges = true;
                    }
                }
                
                // 5. 편집 버튼 상태 복원
                const historyEditBtn = document.getElementById("historyEditBtn");
                const historySaveBtn = document.getElementById("historySaveBtn");
                const profileEditBtn = document.getElementById("profileEditBtn");
                const profileSaveBtn = document.getElementById("profileSaveBtn");
                const mainTitleEditBtn = document.getElementById("mainTitleEditBtn");
                const mainTitleSaveBtn = document.getElementById("mainTitleSaveBtn");
                const mainUrlEditBtn = document.getElementById("mainUrlEditBtn");
                const mainUrlSaveBtn = document.getElementById("mainUrlSaveBtn");
                
                if (historyEditBtn && historySaveBtn) {
                    historyEditBtn.style.display = "inline-block";
                    historySaveBtn.style.display = "none";
                }
                if (profileEditBtn && profileSaveBtn) {
                    profileEditBtn.style.display = "inline-block";
                    profileSaveBtn.style.display = "none";
                }
                if (mainTitleEditBtn && mainTitleSaveBtn) {
                    mainTitleEditBtn.style.display = "inline-block";
                    mainTitleSaveBtn.style.display = "none";
                }
                if (mainUrlEditBtn && mainUrlSaveBtn) {
                    mainUrlEditBtn.style.display = "inline-block";
                    mainUrlSaveBtn.style.display = "none";
                }
                
                alert('모든 변경사항이 저장되었습니다!');
            }
        });
    }

    // 관리자 로그아웃
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener("click", () => {
            // 편집 중인 내용이 있는지 확인
            const hasUnsavedChanges = checkUnsavedChanges();
            
            if (hasUnsavedChanges) {
                const choice = confirm('변경된 내용이 있습니다.\n\n확인 = 변경사항 적용 후 로그아웃\n취소 = 최근 저장된 내용으로 되돌리고 로그아웃');
                
                if (choice) {
                    // 변경사항 적용
                    applyAllChanges();
                } else {
                    // 변경사항 무시하고 저장된 내용으로 복원
                    revertAllChanges();
                }
            }
            
            // 로그아웃 처리
            isAdminLoggedIn = false;
            localStorage.removeItem("adminLoggedIn");
            adminLoginModal.classList.add("hidden");
            hideAdminControls();
            adminLoginSubmit.style.display = "block";
            adminLogoutBtn.style.display = "none";
            if (adminApplyAllBtn) adminApplyAllBtn.style.display = "none";
            adminId.style.display = "block";
            adminPassword.style.display = "block";
            document.querySelector(".admin-input-group").style.display = "block";
            document.querySelectorAll(".admin-input-group")[1].style.display = "block";
            alert("로그아웃 되었습니다.");
        });
    }
    
    // 저장되지 않은 변경사항 확인
    function checkUnsavedChanges() {
        const groom = document.getElementById("historyGroom");
        const bride = document.getElementById("historyBride");
        const date = document.getElementById("historyDate");
        const place = document.getElementById("historyPlace");
        const introText = document.getElementById("profileIntroText");
        const introSub = document.getElementById("profileIntroSub");
        const mainTitle = document.querySelector(".main-title");
        const mainUrl = document.querySelector(".main-url");
        
        // contentEditable이 true이거나 input이 있으면 편집 중
        if (groom && groom.contentEditable === "true") return true;
        if (bride && bride.contentEditable === "true") return true;
        if (date && date.contentEditable === "true") return true;
        if (place && place.contentEditable === "true") return true;
        if (introText && introText.contentEditable === "true") return true;
        if (introSub && introSub.contentEditable === "true") return true;
        if (mainTitle && mainTitle.contentEditable === "true") return true;
        if (mainUrl && mainUrl.querySelector('input')) return true;
        
        return false;
    }
    
    // 모든 변경사항 적용
    function applyAllChanges() {
        const groom = document.getElementById("historyGroom");
        const bride = document.getElementById("historyBride");
        const date = document.getElementById("historyDate");
        const place = document.getElementById("historyPlace");
        
        if (groom && bride && date && place) {
            localStorage.setItem("historyGroom", groom.textContent);
            localStorage.setItem("historyBride", bride.textContent);
            localStorage.setItem("historyDate", date.textContent);
            localStorage.setItem("historyPlace", place.textContent);
            
            groom.contentEditable = "false";
            bride.contentEditable = "false";
            date.contentEditable = "false";
            place.contentEditable = "false";
            
            groom.style.border = "none";
            bride.style.border = "none";
            date.style.border = "none";
            place.style.border = "none";
        }
        
        const introText = document.getElementById("profileIntroText");
        const introSub = document.getElementById("profileIntroSub");
        
        if (introText && introSub) {
            let subText = (introSub.textContent || "").slice(0, INTRO_SUB_MAX_LENGTH);
            if (introSub.textContent.length > INTRO_SUB_MAX_LENGTH) introSub.textContent = subText;
            localStorage.setItem("profileIntroText", introText.textContent);
            localStorage.setItem("profileIntroSub", subText);
            introText.contentEditable = "false";
            introSub.contentEditable = "false";
            introText.style.border = "none";
            introSub.style.border = "none";
        }
        const mainTitle = document.querySelector(".main-title");
        if (mainTitle && mainTitle.contentEditable === "true") {
            localStorage.setItem("mainTitle", mainTitle.textContent.trim());
            mainTitle.contentEditable = "false";
            mainTitle.style.border = "none";
        }
        
        const mainUrl = document.querySelector(".main-url");
        if (mainUrl) {
            const tempInput = mainUrl.querySelector('input');
            if (tempInput) {
                const newUrl = tempInput.value.trim();
                while (mainUrl.firstChild) {
                    mainUrl.removeChild(mainUrl.firstChild);
                }
                const textNode = document.createTextNode(newUrl || "https://example.com");
                mainUrl.appendChild(textNode);
                localStorage.setItem("mainUrl", newUrl || "https://example.com");
            }
        }
    }
    
    // 모든 변경사항 되돌리기
    function revertAllChanges() {
        loadHistory();
        loadProfileIntro();
        loadMainTitle();
        loadMainUrl();
        
        // 편집 상태 해제
        const groom = document.getElementById("historyGroom");
        const bride = document.getElementById("historyBride");
        const date = document.getElementById("historyDate");
        const place = document.getElementById("historyPlace");
        const introText = document.getElementById("profileIntroText");
        const introSub = document.getElementById("profileIntroSub");
        const mainTitle = document.querySelector(".main-title");
        
        if (groom) { groom.contentEditable = "false"; groom.style.border = "none"; }
        if (bride) { bride.contentEditable = "false"; bride.style.border = "none"; }
        if (date) { date.contentEditable = "false"; date.style.border = "none"; }
        if (place) { place.contentEditable = "false"; place.style.border = "none"; }
        if (introText) { introText.contentEditable = "false"; introText.style.border = "none"; }
        if (introSub) { introSub.contentEditable = "false"; introSub.style.border = "none"; }
        if (mainTitle) { mainTitle.contentEditable = "false"; mainTitle.style.border = "none"; }
    }

    // History 편집 기능
    const historyEditBtn = document.getElementById("historyEditBtn");
    const historySaveBtn = document.getElementById("historySaveBtn");
    
    if (historyEditBtn) {
        historyEditBtn.addEventListener("click", () => {
            const groom = document.getElementById("historyGroom");
            const bride = document.getElementById("historyBride");
            const date = document.getElementById("historyDate");
            const place = document.getElementById("historyPlace");
            
            groom.contentEditable = "true";
            bride.contentEditable = "true";
            date.contentEditable = "true";
            place.contentEditable = "true";
            
            groom.style.border = "1px solid #4169e1";
            bride.style.border = "1px solid #4169e1";
            date.style.border = "1px solid #4169e1";
            place.style.border = "1px solid #4169e1";
            
            historyEditBtn.style.display = "none";
            historySaveBtn.style.display = "inline-block";
        });
    }
    
    if (historySaveBtn) {
        historySaveBtn.addEventListener("click", () => {
            const groom = document.getElementById("historyGroom");
            const bride = document.getElementById("historyBride");
            const date = document.getElementById("historyDate");
            const place = document.getElementById("historyPlace");
            
            groom.contentEditable = "false";
            bride.contentEditable = "false";
            date.contentEditable = "false";
            place.contentEditable = "false";
            
            groom.style.border = "none";
            bride.style.border = "none";
            date.style.border = "none";
            place.style.border = "none";
            
            // 로컬스토리지에 저장
            localStorage.setItem("historyGroom", groom.textContent);
            localStorage.setItem("historyBride", bride.textContent);
            localStorage.setItem("historyDate", date.textContent);
            localStorage.setItem("historyPlace", place.textContent);
            
            historyEditBtn.style.display = "inline-block";
            historySaveBtn.style.display = "none";
            alert("저장되었습니다!");
        });
    }

    // History 불러오기
    function loadHistory() {
        const groom = document.getElementById("historyGroom");
        const bride = document.getElementById("historyBride");
        const date = document.getElementById("historyDate");
        const place = document.getElementById("historyPlace");
        
        if (localStorage.getItem("historyGroom")) {
            groom.textContent = localStorage.getItem("historyGroom");
        }
        if (localStorage.getItem("historyBride")) {
            bride.textContent = localStorage.getItem("historyBride");
        }
        if (localStorage.getItem("historyDate")) {
            date.textContent = localStorage.getItem("historyDate");
        }
        if (localStorage.getItem("historyPlace")) {
            place.textContent = localStorage.getItem("historyPlace");
        }
    }

    // Profile Intro 편집 기능 (intro-sub 280자 제한)
    const INTRO_SUB_MAX_LENGTH = 280;
    const profileEditBtn = document.getElementById("profileEditBtn");
    const profileSaveBtn = document.getElementById("profileSaveBtn");
    const introSubCharCountEl = document.getElementById("introSubCharCount");
    let introSubInputHandler = null;

    function updateIntroSubCounter() {
        const introSub = document.getElementById("profileIntroSub");
        if (!introSub || !introSubCharCountEl) return;
        const len = (introSub.textContent || "").length;
        introSubCharCountEl.textContent = Math.min(len, INTRO_SUB_MAX_LENGTH) + "/" + INTRO_SUB_MAX_LENGTH;
    }

    if (profileEditBtn) {
        profileEditBtn.addEventListener("click", () => {
            const introText = document.getElementById("profileIntroText");
            const introSub = document.getElementById("profileIntroSub");

            introText.contentEditable = "true";
            introSub.contentEditable = "true";

            introText.style.border = "1px solid #4169e1";
            introSub.style.border = "1px solid #4169e1";

            if (introSubCharCountEl) {
                introSubCharCountEl.style.display = "block";
                updateIntroSubCounter();
            }

            introSubInputHandler = () => {
                const text = introSub.textContent || "";
                if (text.length > INTRO_SUB_MAX_LENGTH) {
                    introSub.textContent = text.slice(0, INTRO_SUB_MAX_LENGTH);
                    placeCaretAtEnd(introSub);
                }
                updateIntroSubCounter();
            };
            introSub.addEventListener("input", introSubInputHandler);

            profileEditBtn.style.display = "none";
            profileSaveBtn.style.display = "inline-block";
        });
    }

    function placeCaretAtEnd(el) {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    if (profileSaveBtn) {
        profileSaveBtn.addEventListener("click", () => {
            const introText = document.getElementById("profileIntroText");
            const introSub = document.getElementById("profileIntroSub");

            if (introSub.textContent.length > INTRO_SUB_MAX_LENGTH) {
                introSub.textContent = introSub.textContent.slice(0, INTRO_SUB_MAX_LENGTH);
            }

            if (introSubInputHandler) {
                introSub.removeEventListener("input", introSubInputHandler);
                introSubInputHandler = null;
            }
            if (introSubCharCountEl) introSubCharCountEl.style.display = "none";

            introText.contentEditable = "false";
            introSub.contentEditable = "false";

            introText.style.border = "none";
            introSub.style.border = "none";

            localStorage.setItem("profileIntroText", introText.textContent);
            localStorage.setItem("profileIntroSub", introSub.textContent);

            profileEditBtn.style.display = "inline-block";
            profileSaveBtn.style.display = "none";
            alert("저장되었습니다!");
        });
    }

    // Profile Intro 불러오기 (저장 시 280자 초과분 제거)
    function loadProfileIntro() {
        const introText = document.getElementById("profileIntroText");
        const introSub = document.getElementById("profileIntroSub");

        if (localStorage.getItem("profileIntroText")) {
            introText.textContent = localStorage.getItem("profileIntroText");
        }
        if (localStorage.getItem("profileIntroSub")) {
            let sub = localStorage.getItem("profileIntroSub");
            if (sub.length > INTRO_SUB_MAX_LENGTH) sub = sub.slice(0, INTRO_SUB_MAX_LENGTH);
            introSub.textContent = sub;
        }
    }

    // Main Title 편집 기능
    const mainTitleEditBtn = document.getElementById("mainTitleEditBtn");
    const mainTitleSaveBtn = document.getElementById("mainTitleSaveBtn");
    const mainTitle = document.getElementById("mainTitle");
    
    if (mainTitleEditBtn && mainTitle) {
        mainTitleEditBtn.addEventListener("click", () => {
            mainTitle.contentEditable = "true";
            mainTitle.style.border = "1px solid #4169e1";
            mainTitle.style.padding = "2px 5px";
            mainTitleEditBtn.style.display = "none";
            mainTitleSaveBtn.style.display = "inline-block";
        });
    }
    
    if (mainTitleSaveBtn && mainTitle) {
        mainTitleSaveBtn.addEventListener("click", () => {
            mainTitle.contentEditable = "false";
            mainTitle.style.border = "none";
            mainTitle.style.padding = "0";
            localStorage.setItem("mainTitle", mainTitle.textContent);
            mainTitleEditBtn.style.display = "inline-block";
            mainTitleSaveBtn.style.display = "none";
            alert("저장되었습니다!");
        });
    }

    // Main URL 편집 기능
    const mainUrlEditBtn = document.getElementById("mainUrlEditBtn");
    const mainUrlSaveBtn = document.getElementById("mainUrlSaveBtn");
    const mainUrl = document.getElementById("mainUrl");
    let originalUrlText = "";
    
    if (mainUrlEditBtn && mainUrl) {
        mainUrlEditBtn.addEventListener("click", () => {
            // 현재 URL 텍스트 찾기 (모든 텍스트 노드 제거)
            let urlText = "";
            const nodesToRemove = [];
            mainUrl.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    urlText = node.textContent.trim();
                    nodesToRemove.push(node);
                }
            });
            
            // 텍스트 노드 제거
            nodesToRemove.forEach(node => node.remove());
            
            const tempInput = document.createElement("input");
            tempInput.type = "text";
            tempInput.value = urlText;
            tempInput.style.width = "300px";
            tempInput.style.fontSize = "10px";
            tempInput.style.marginRight = "10px";
            tempInput.id = "mainUrlInput";
            mainUrl.insertBefore(tempInput, mainUrl.firstChild);
            
            mainUrlEditBtn.style.display = "none";
            mainUrlSaveBtn.style.display = "inline-block";
        });
    }
    
    if (mainUrlSaveBtn && mainUrl) {
        mainUrlSaveBtn.addEventListener("click", () => {
            const tempInput = document.getElementById("mainUrlInput");
            if (tempInput) {
                const newUrl = tempInput.value.trim();
                
                // 기존 텍스트 노드 모두 제거
                const nodesToRemove = [];
                mainUrl.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        nodesToRemove.push(node);
                    }
                });
                nodesToRemove.forEach(node => node.remove());
                
                tempInput.remove();
                
                // 새 텍스트 노드 생성
                const textNode = document.createTextNode(newUrl + " ");
                mainUrl.insertBefore(textNode, mainUrl.firstChild);
                
                localStorage.setItem("mainUrl", newUrl);
                mainUrlEditBtn.style.display = "inline-block";
                mainUrlSaveBtn.style.display = "none";
                alert("저장되었습니다!");
            }
        });
    }

    // Miniroom 이미지 업로드
    const miniroomImageUpload = document.getElementById("miniroomImageUpload");
    const miniroomImage = document.getElementById("miniroomImage");
    
    if (miniroomImageUpload && miniroomImage) {
        miniroomImageUpload.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    miniroomImage.src = event.target.result;
                    localStorage.setItem("miniroomImage", event.target.result);
                    alert("이미지가 변경되었습니다!");
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 저장된 데이터 불러오기
    function loadMainTitle() {
        if (mainTitle && localStorage.getItem("mainTitle")) {
            mainTitle.textContent = localStorage.getItem("mainTitle");
        }
    }

    function loadMainUrl() {
        if (mainUrl && localStorage.getItem("mainUrl")) {
            // 기존 텍스트 노드 모두 제거
            const nodesToRemove = [];
            mainUrl.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    nodesToRemove.push(node);
                }
            });
            nodesToRemove.forEach(node => node.remove());
            
            // 새 텍스트 노드 추가
            const textNode = document.createTextNode(localStorage.getItem("mainUrl") + " ");
            mainUrl.insertBefore(textNode, mainUrl.firstChild);
        }
    }

    // 게시물 갯수 업데이트
    function updateRecentCounts() {
        // 방명록 갯수 (API에서 가져오기)
        const guestbookCount = document.getElementById("guestbookCount");
        if (guestbookCount) {
            fetch('/api/guestbook/count')
                .then(response => response.json())
                .then(count => {
                    guestbookCount.textContent = `${count}/83`;
                })
                .catch(error => {
                    console.error('방명록 갯수 로드 오류:', error);
                    guestbookCount.textContent = "0/83";
                });
        }
        
        // 다이어리 갯수 (기본값)
        const diaryCount = document.getElementById("diaryCount");
        if (diaryCount) {
            diaryCount.textContent = "0/86";
        }
        
        // 사진첩 갯수 (기본값)
        const photoCount = document.getElementById("photoCount");
        if (photoCount) {
            photoCount.textContent = "0/83";
        }
    }

    // 최근 게시물 표시
    function updateRecentPosts() {
        const recentPostsList = document.getElementById("recentPostsList");
        if (!recentPostsList) return;
        
        recentPostsList.innerHTML = "";
        
        // 방명록 최근 게시물 (API에서 가져오기)
        fetch('/api/guestbook')
            .then(response => response.json())
            .then(guestbookEntries => {
                if (guestbookEntries.length > 0) {
                    const latestGuestbook = guestbookEntries[0];
                    const item = document.createElement("div");
                    item.className = "friend-item";
                    item.innerHTML = `
                        <span class="friend-category blue">방명록</span>
                        <span class="friend-text">${escapeHtml(latestGuestbook.message.substring(0, 20))}${latestGuestbook.message.length > 20 ? '...' : ''}</span>
                    `;
                    recentPostsList.appendChild(item);
                }
                
                // 사진첩 게시물 (기본)
                const photoItem = document.createElement("div");
                photoItem.className = "friend-item";
                photoItem.innerHTML = `
                    <span class="friend-category orange">사진첩</span>
                    <span class="friend-text">사진첩 게시물</span>
                `;
                recentPostsList.appendChild(photoItem);
                
                // 기본 게시물이 없을 경우
                if (recentPostsList.children.length === 0) {
                    const emptyItem = document.createElement("div");
                    emptyItem.className = "friend-item";
                    emptyItem.innerHTML = `
                        <span class="friend-category cyan">알림</span>
                        <span class="friend-text">최근 게시물이 없습니다</span>
                    `;
                    recentPostsList.appendChild(emptyItem);
                }
            })
            .catch(error => {
                console.error('최근 게시물 로드 오류:', error);
            });
    }

    function loadMiniroomImage() {
        const miniroomDeleteBtn = document.getElementById("miniroomImageDelete");
        if (miniroomImage && localStorage.getItem("miniroomImage")) {
            miniroomImage.src = localStorage.getItem("miniroomImage");
        }
    }

    // Miniroom 이미지 삭제
    const miniroomImageDelete = document.getElementById("miniroomImageDelete");
    if (miniroomImageDelete && miniroomImage) {
        miniroomImageDelete.addEventListener("click", () => {
            if (confirm('미니룸 이미지를 삭제하시겠습니까?')) {
                miniroomImage.src = "https://via.placeholder.com/462x363?text=Wedding+Miniroom";
                localStorage.removeItem("miniroomImage");
                miniroomImageDelete.style.display = "none";
                alert('이미지가 삭제되었습니다!');
            }
        });
    }

    // Profile 이미지 업로드
    const profileImageUpload = document.getElementById("profileImageUpload");
    const profileImage = document.getElementById("profileImage");
    const profileImageDelete = document.getElementById("profileImageDelete");
    const profileImageEmpty = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3C/svg%3E";

    if (profileImageUpload && profileImage) {
        profileImageUpload.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    profileImage.src = event.target.result;
                    localStorage.setItem("profileImage", event.target.result);
                    alert("프로필 이미지가 변경되었습니다!");
                    if (profileImageDelete) {
                        profileImageDelete.style.display = "inline-block";
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Profile 이미지 삭제 (관리자: 빈 이미지로 표시)
    if (profileImageDelete && profileImage) {
        profileImageDelete.addEventListener("click", () => {
            if (confirm('프로필 이미지를 삭제하시겠습니까?')) {
                profileImage.src = profileImageEmpty;
                localStorage.removeItem("profileImage");
                alert('프로필 이미지가 삭제되었습니다!');
            }
        });
    }

    // Profile 이미지 불러오기
    function loadProfileImage() {
        if (profileImage) {
            const savedImage = localStorage.getItem("profileImage");
            profileImage.src = savedImage || profileImageEmpty;
        }
    }

    // 최근 게시물 링크 연동
    const recentLinks = document.querySelectorAll(".recent-link");
    recentLinks.forEach(link => {
        link.addEventListener("click", () => {
            const section = link.getAttribute("data-section");
            const vMenuBtns = document.querySelectorAll(".vmenu-btn");
            vMenuBtns.forEach(btn => {
                if (btn.getAttribute("data-section") === section) {
                    btn.click();
                }
            });
        });
    });

    // 초기화 (게스트 모드로 시작 - 관리자 로그인 필요)
    loadHistory();
    loadProfileIntro();
    loadMainTitle();
    loadMainUrl();
    loadMiniroomImage();
    loadProfileImage();
    updateRecentCounts();
    updateRecentPosts();

    // ========== BGM 플레이어 ==========
    const bgmPlayer = document.getElementById("bgmPlayer");
    const btnPlay = document.getElementById("btnPlay");
    const btnPause = document.getElementById("btnPause");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    const btnList = document.getElementById("btnList");
    const volumeSlider = document.getElementById("volumeSlider");
    const bgmMarquee = document.getElementById("bgmMarquee");
    const bgmPlaylist = document.getElementById("bgmPlaylist");

    // 재생 목록 (API에서 로드, 업로드일 기준 정렬)
    let playlist = [];
    let currentTrackIndex = 0;
    let bgmFirstInteractionDone = false;

    // 첫 사용자 상호작용 시 BGM 재생 시도 (브라우저 정책으로 로드 시 재생이 막힌 경우 대비)
    function tryBgmOnFirstInteraction() {
        if (bgmFirstInteractionDone) return;
        bgmFirstInteractionDone = true;
        document.removeEventListener("click", tryBgmOnFirstInteraction);
        document.removeEventListener("touchstart", tryBgmOnFirstInteraction);
        document.removeEventListener("keydown", tryBgmOnFirstInteraction);
        if (playlist.length > 0 && bgmPlayer && bgmPlayer.paused) {
            loadTrack(0);
            playTrack();
        }
    }

    // BGM 목록 API 로드 (재생용 URL은 절대경로로)
    function loadBgmList(autoplay) {
        const base = window.location.origin;
        fetch("/api/bgm")
            .then(response => response.json())
            .then(data => {
                playlist = data.map(t => ({
                    id: t.id,
                    title: t.title || t.originalFileName || "제목 없음",
                    url: (t.url && t.url.startsWith("http")) ? t.url : base + (t.url || "/api/bgm/file/" + t.id)
                }));
                renderPlaylist();
                if (autoplay && playlist.length > 0) {
                    loadTrack(0);
                    playTrack();
                    // 자동재생이 막혀 있으면 첫 클릭/터치/키 입력 시 바로 재생
                    document.addEventListener("click", tryBgmOnFirstInteraction, { once: true });
                    document.addEventListener("touchstart", tryBgmOnFirstInteraction, { once: true });
                    document.addEventListener("keydown", tryBgmOnFirstInteraction, { once: true });
                }
            })
            .catch(() => {
                playlist = [];
                renderPlaylist();
            });
    }

    // 재생 목록 UI 생성 (업로드일 기준 최신순 노출)
    function renderPlaylist() {
        if (!bgmPlaylist) return;
        bgmPlaylist.innerHTML = "";
        playlist.forEach((track, index) => {
            const item = document.createElement("div");
            item.className = "bgm-playlist-item" + (index === currentTrackIndex ? " active" : "");
            const titleSpan = document.createElement("span");
            titleSpan.className = "bgm-playlist-item-title";
            titleSpan.textContent = `${index + 1}. ${track.title}`;
            titleSpan.addEventListener("click", () => {
                loadTrack(index);
                playTrack();
            });
            item.appendChild(titleSpan);
            if (isAdminLoggedIn && track.id) {
                const delBtn = document.createElement("button");
                delBtn.type = "button";
                delBtn.className = "bgm-playlist-item-delete";
                delBtn.textContent = "삭제";
                delBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (confirm("이 곡을 목록에서 삭제할까요?")) {
                        fetch("/api/bgm/" + track.id, { method: "DELETE" })
                            .then(() => loadBgmList());
                    }
                });
                item.appendChild(delBtn);
            }
            bgmPlaylist.appendChild(item);
        });
    }

    // 트랙 로드 (재생 URL 절대경로 사용)
    function loadTrack(index) {
        if (playlist.length === 0) return;
        currentTrackIndex = Math.max(0, Math.min(index, playlist.length - 1));
        const track = playlist[currentTrackIndex];
        const playUrl = track.url && track.url.startsWith("http") ? track.url : (window.location.origin + (track.url || "/api/bgm/file/" + track.id));
        bgmPlayer.src = playUrl;
        bgmMarquee.textContent = `♪ ${track.title}`;
        renderPlaylist();
    }

    // 재생
    function playTrack() {
        bgmPlayer.play().catch(() => {});
        btnPlay.style.display = "none";
        btnPause.style.display = "inline-block";
    }

    // 일시정지
    function pauseTrack() {
        bgmPlayer.pause();
        btnPlay.style.display = "inline-block";
        btnPause.style.display = "none";
    }

    // 버튼 이벤트
    if (bgmPlayer && btnPlay && btnPause) {
        btnPlay.addEventListener("click", () => {
            if (bgmPlayer.src) {
                playTrack();
            } else {
                loadTrack(0);
                playTrack();
            }
        });

        btnPause.addEventListener("click", pauseTrack);

        btnPrev.addEventListener("click", () => {
            if (playlist.length === 0) return;
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(currentTrackIndex);
            playTrack();
        });

        btnNext.addEventListener("click", () => {
            if (playlist.length === 0) return;
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(currentTrackIndex);
            playTrack();
        });

        btnList.addEventListener("click", () => {
            bgmPlaylist.classList.toggle("show");
            btnList.classList.toggle("active");
        });

        // 볼륨 조절
        volumeSlider.addEventListener("input", (e) => {
            bgmPlayer.volume = e.target.value / 100;
        });

        // 초기 볼륨 설정
        bgmPlayer.volume = 0.7;

        // 트랙 종료 시 다음 곡 재생
        bgmPlayer.addEventListener("ended", () => {
            if (playlist.length === 0) return;
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(currentTrackIndex);
            playTrack();
        });

        // BGM 업로드 (관리자) - 업로드 버튼 클릭 시 파일 선택
        const bgmFileInput = document.getElementById("bgmFileInput");
        const btnBgmUpload = document.getElementById("btnBgmUpload");
        if (bgmFileInput && btnBgmUpload) {
            btnBgmUpload.addEventListener("click", () => bgmFileInput.click());
            bgmFileInput.addEventListener("change", function() {
                const file = this.files[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("file", file);
                fetch("/api/bgm/upload", {
                    method: "POST",
                    body: formData
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("업로드 실패: " + response.status);
                        }
                        return response.json();
                    })
                    .then(() => {
                        loadBgmList(false);
                        this.value = "";
                    })
                    .catch((err) => {
                        this.value = "";
                        alert("업로드에 실패했습니다. " + (err.message || ""));
                    });
            });
        }

        // 재생 목록 API에서 로드 (업로드일 기준 정렬), 음악 있으면 자동 재생
        loadBgmList(true);
    }

    // ========== 일촌평 ==========
    const ilchonName = document.getElementById("ilchonName");
    const ilchonText = document.getElementById("ilchonText");
    const ilchonSubmit = document.getElementById("ilchonSubmit");
    const ilchonList = document.getElementById("ilchonList");

    // 저장된 일촌평 불러오기
    loadIlchonList();

    if (ilchonSubmit && ilchonName && ilchonText && ilchonList) {
        ilchonSubmit.addEventListener("click", () => {
            const name = ilchonName.value.trim();
            const text = ilchonText.value.trim();
            
            if (text) {
                const displayName = name || "익명";
                
                // API 호출로 저장
                fetch('/api/ilchonpyeong', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: displayName,
                        content: text
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // 화면에 추가
                    addIlchonItem(data);
                    
                    // 입력창 초기화
                    ilchonName.value = "";
                    ilchonText.value = "";
                })
                .catch(error => {
                    console.error('일촌평 저장 오류:', error);
                    alert('일촌평 저장 중 오류가 발생했습니다.');
                });
            }
        });
    }

    function loadIlchonList() {
        if (!ilchonList) return;
        
        // API에서 데이터 가져오기
        fetch('/api/ilchonpyeong')
            .then(response => response.json())
            .then(entries => {
                ilchonList.innerHTML = "";
                entries.forEach(entry => addIlchonItem(entry));
            })
            .catch(error => {
                console.error('일촌평 로드 오류:', error);
            });
    }

    function addIlchonItem(entry) {
        if (!ilchonList) return;
        const p = document.createElement("p");
        p.innerHTML = `<strong style="color: #0066cc;">${escapeHtml(entry.name)}</strong>: ${escapeHtml(entry.content)}`;
        p.style.marginBottom = "6px";
        p.style.color = "#555";
        p.style.fontSize = "11px";
        p.style.lineHeight = "1.5";
        p.dataset.id = entry.id;
        
        // 관리자 로그인 시 삭제 버튼 추가
        if (isAdminLoggedIn) {
            const deleteBtn = document.createElement("span");
            deleteBtn.className = "ilchon-delete-btn";
            deleteBtn.textContent = "[삭제]";
            deleteBtn.addEventListener("click", () => deleteIlchonItem(entry.id, p));
            p.appendChild(deleteBtn);
        }
        
        ilchonList.appendChild(p);
    }

    function deleteIlchonItem(id, element) {
        if (confirm("이 일촌평을 삭제하시겠습니까?")) {
            fetch(`/api/ilchonpyeong/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                element.remove();
            })
            .catch(error => {
                console.error('일촌평 삭제 오류:', error);
                alert('일촌평 삭제 중 오류가 발생했습니다.');
            });
        }
    }

    function updateIlchonDeleteButtons() {
        document.querySelectorAll("#ilchonList p").forEach(p => {
            if (!p.querySelector(".ilchon-delete-btn")) {
                const deleteBtn = document.createElement("span");
                deleteBtn.className = "ilchon-delete-btn";
                deleteBtn.textContent = "[삭제]";
                const id = p.dataset.id;
                deleteBtn.addEventListener("click", () => deleteIlchonItem(id, p));
                p.appendChild(deleteBtn);
            }
        });
    }

    // ========== 방명록 ==========
    const guestbookMessage = document.getElementById("guestbookMessage");
    const guestbookSubmit = document.getElementById("guestbookSubmit");
    const guestbookListArea = document.getElementById("guestbookListArea");

    loadGuestbookList();

    if (guestbookSubmit && guestbookMessage && guestbookListArea) {
        guestbookSubmit.addEventListener("click", () => {
            const message = guestbookMessage.value.trim();
            const guestType = document.querySelector('input[name="guestType"]:checked').value;
            
            if (message) {
                // API 호출로 저장
                fetch('/api/guestbook', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message,
                        guestType: guestType
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // 화면에 추가
                    addGuestbookItem(data);
                    guestbookMessage.value = "";
                    
                    // 카운트 업데이트
                    updateRecentCounts();
                    updateRecentPosts();
                })
                .catch(error => {
                    console.error('방명록 저장 오류:', error);
                    alert('방명록 저장 중 오류가 발생했습니다.');
                });
            }
        });
    }

    function loadGuestbookList() {
        if (!guestbookListArea) return;
        
        // API에서 데이터 가져오기
        fetch('/api/guestbook')
            .then(response => response.json())
            .then(entries => {
                guestbookListArea.innerHTML = "";
                entries.forEach(entry => addGuestbookItem(entry));
            })
            .catch(error => {
                console.error('방명록 로드 오류:', error);
            });
    }

    function addGuestbookItem(entry) {
        if (!guestbookListArea) return;
        const item = document.createElement("div");
        item.className = "guestbook-item";
        item.dataset.guestbookId = entry.id;
        
        const date = new Date(entry.createdAt);
        const dateStr = `(${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')})`;
        
        item.innerHTML = `
            <div class="guestbook-item-header">
                <span class="guestbook-item-number">No.${entry.guestNumber}</span>
                <span class="guestbook-item-author">방명록 작성자</span>
                <span class="guestbook-item-emoji">🏠</span>
                <span class="guestbook-item-date">${dateStr}</span>
                <div class="guestbook-item-actions">
                    <span>🐿️</span>
                    <span>🐿️</span>
                </div>
            </div>
            <div class="guestbook-item-body">
                <div class="guestbook-item-avatar">
                    <img src="https://via.placeholder.com/80x80?text=Avatar" style="width: 100%; border-radius: 8px;">
                </div>
                <div class="guestbook-item-content">
                    <div class="guestbook-item-message">${escapeHtml(entry.message)}</div>
                    <div class="guestbook-replies-area"></div>
                    ${isAdminLoggedIn ? `
                        <span class="guestbook-reply-toggle" onclick="toggleReplyForm(${entry.id})">댓글 작성</span>
                        <div class="guestbook-reply-form" id="replyForm-${entry.id}" style="display: none;">
                            <input type="text" class="guestbook-reply-input" id="replyInput-${entry.id}" placeholder="댓글을 입력하세요">
                            <button class="guestbook-reply-btn" onclick="submitReply(${entry.id})">작성</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        guestbookListArea.appendChild(item);
        
        // 댓글 불러오기
        loadReplies(entry.id);
    }

    // 댓글 폼 토글
    window.toggleReplyForm = function(guestbookId) {
        const form = document.getElementById(`replyForm-${guestbookId}`);
        if (form) {
            form.style.display = form.style.display === 'none' ? 'flex' : 'none';
        }
    };

    // 댓글 작성
    window.submitReply = function(guestbookId) {
        const input = document.getElementById(`replyInput-${guestbookId}`);
        const content = input.value.trim();
        
        if (!content) return;
        
        fetch('/api/guestbook/reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                guestbookId: guestbookId.toString(),
                content: content,
                author: '관리자'
            })
        })
        .then(response => response.json())
        .then(data => {
            input.value = '';
            const form = document.getElementById(`replyForm-${guestbookId}`);
            if (form) form.style.display = 'none';
            loadReplies(guestbookId);
        })
        .catch(error => {
            console.error('댓글 작성 오류:', error);
            alert('댓글 작성 중 오류가 발생했습니다.');
        });
    };

    // 댓글 불러오기
    function loadReplies(guestbookId) {
        fetch(`/api/guestbook/reply/${guestbookId}`)
            .then(response => response.json())
            .then(replies => {
                const item = document.querySelector(`[data-guestbook-id="${guestbookId}"]`);
                if (!item) return;
                
                const repliesArea = item.querySelector('.guestbook-replies-area');
                if (!repliesArea) return;
                
                repliesArea.innerHTML = '';
                replies.forEach(reply => {
                    const replyDiv = document.createElement('div');
                    replyDiv.className = 'guestbook-item-reply';
                    
                    const replyDate = new Date(reply.createdAt);
                    const replyDateStr = `${replyDate.getFullYear()}-${String(replyDate.getMonth() + 1).padStart(2, '0')}-${String(replyDate.getDate()).padStart(2, '0')} ${String(replyDate.getHours()).padStart(2, '0')}:${String(replyDate.getMinutes()).padStart(2, '0')}:${String(replyDate.getSeconds()).padStart(2, '0')}`;
                    
                    replyDiv.innerHTML = `
                        <span class="guestbook-item-reply-author">${escapeHtml(reply.author)}</span> : ${escapeHtml(reply.content)} <span style="color: #999; font-size: 10px;">(${replyDateStr})</span>
                    `;
                    repliesArea.appendChild(replyDiv);
                });
            })
            .catch(error => {
                console.error('댓글 로드 오류:', error);
            });
    }

    // ========== 다이어리 ==========
    const diaryDateLarge = document.getElementById("diaryDateLarge");
    const diaryDateDay = document.getElementById("diaryDateDay");
    const diaryMonthYear = document.getElementById("diaryMonthYear");
    const diaryCalendarGrid = document.getElementById("diaryCalendarGrid");
    const diaryPrevMonth = document.getElementById("diaryPrevMonth");
    const diaryNextMonth = document.getElementById("diaryNextMonth");

    let currentDate = new Date();
    let selectedDate = null;
    let monthlyEvents = [];

    // 해당 월의 일정 가져오기
    function loadMonthlyEvents(year, month) {
        fetch(`/api/diary/month/${year}/${month + 1}`)
            .then(response => response.json())
            .then(events => {
                monthlyEvents = events;
                renderCalendar();
            })
            .catch(error => {
                console.error('월별 일정 로드 오류:', error);
                monthlyEvents = [];
                renderCalendar();
            });
    }

    function renderCalendar() {
        if (!diaryCalendarGrid) return;
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // 월/년 업데이트
        if (diaryMonthYear) {
            diaryMonthYear.textContent = `${year}.${String(month + 1).padStart(2, '0')}`;
        }
        
        // 현재 날짜 업데이트
        const today = new Date();
        if (diaryDateLarge) {
            diaryDateLarge.textContent = `${String(month + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
        }
        if (diaryDateDay) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            diaryDateDay.textContent = days[today.getDay()];
        }
        
        // 달력 생성
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();
        
        diaryCalendarGrid.innerHTML = '';
        
        // 이전 달 날짜
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'diary-calendar-day other-month';
            day.textContent = prevLastDate - i;
            diaryCalendarGrid.appendChild(day);
        }
        
        // 현재 달 날짜
        for (let i = 1; i <= lastDate; i++) {
            const day = document.createElement('div');
            day.className = 'diary-calendar-day';
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            day.dataset.date = dateStr;
            
            // 일정이 있는 날짜: 숫자만 형광펜(문자 길이에 맞춤)
            const hasEvent = monthlyEvents.some(event => event.eventDate === dateStr);
            if (hasEvent) {
                day.classList.add('has-event');
                day.innerHTML = `<span class="diary-day-highlight">${i}</span>`;
            } else {
                day.textContent = i;
            }
            
            // 오늘 날짜 표시
            if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
                day.classList.add('today');
            }
            
            // 날짜 클릭 이벤트 - 관리자만 일정 모달 열기
            day.addEventListener('click', () => {
                if (!isAdminLoggedIn) return;
                selectedDate = dateStr;
                openDiaryEventModal(dateStr);
            });
            
            diaryCalendarGrid.appendChild(day);
        }
        
        // 다음 달 날짜
        const remainingDays = 42 - (firstDay + lastDate);
        for (let i = 1; i <= remainingDays; i++) {
            const day = document.createElement('div');
            day.className = 'diary-calendar-day other-month';
            day.textContent = i;
            diaryCalendarGrid.appendChild(day);
        }
    }

    // ========== 다이어리 일정 모달 ==========
    const diaryEventModal = document.getElementById('diaryEventModal');
    const diaryEventModalClose = document.getElementById('diaryEventModalClose');
    
    // 모달 닫기
    if (diaryEventModalClose) {
        diaryEventModalClose.addEventListener('click', () => {
            diaryEventModal.classList.add('hidden');
        });
    }
    
    if (diaryEventModal) {
        diaryEventModal.addEventListener('click', (e) => {
            if (e.target === diaryEventModal) {
                diaryEventModal.classList.add('hidden');
            }
        });
    }
    
    // 다이어리 모달 열기 (여러 일정 지원)
    window.openDiaryEventModal = function(dateStr) {
        const modal = document.getElementById('diaryEventModal');
        const modalTitle = document.getElementById('diaryEventModalTitle');
        const modalBody = document.getElementById('diaryEventModalBody');
        
        if (!modal || !modalTitle || !modalBody) {
            console.error('다이어리 모달 요소를 찾을 수 없습니다.');
            return;
        }
        
        // 날짜 파싱 (YYYY-MM-DD 형식)
        const dateParts = dateStr.split('-');
        const dateDisplay = `${dateParts[0]}.${dateParts[1]}.${dateParts[2]}`;
        
        modalTitle.textContent = dateDisplay + ' 일정';
        modalBody.innerHTML = '<div style="text-align: center; padding: 20px;">로딩중...</div>';
        modal.classList.remove('hidden');
        
        console.log('API 호출:', `/api/diary/date/${dateStr}`);
        
        fetch(`/api/diary/date/${dateStr}`)
            .then(response => {
                console.log('API 응답 상태:', response.status);
                if (!response.ok) {
                    throw new Error('API 오류');
                }
                return response.json();
            })
            .then(events => {
                console.log('로드된 일정:', events);
                renderDiaryModalEventList(dateStr, events, modalBody);
            })
            .catch(error => {
                console.error('일정 로드 오류:', error);
                renderDiaryModalEventList(dateStr, [], modalBody);
            });
    };
    
    // 모달에 일정 목록 렌더링 (여러 일정 지원)
    function renderDiaryModalEventList(dateStr, events, modalBody) {
        const body = modalBody || document.getElementById('diaryEventModalBody');
        if (!body) {
            console.error('모달 바디 요소를 찾을 수 없습니다.');
            return;
        }
        
        console.log('모달 렌더링 - 날짜:', dateStr, '일정 수:', events ? events.length : 0);
        
        let html = '';
        
        if (events && Array.isArray(events) && events.length > 0) {
            // 일정 목록만 스크롤, 추가 버튼은 항상 하단 고정
            html += '<div class="diary-modal-list-wrap">';
            html += '<ul class="diary-modal-event-list">';
            events.forEach(event => {
                html += `
                    <li class="diary-modal-event-item">
                        <div class="diary-modal-event-content" onclick="showEventDetailInModal(${event.id}, '${dateStr}')">
                            <span class="diary-modal-event-title">${escapeHtml(event.title)}</span>
                        </div>
                        ${isAdminLoggedIn ? `
                            <div class="diary-modal-event-actions">
                                <button class="diary-modal-btn-edit-mini" onclick="showEditFormInModal(${event.id}, '${dateStr}'); return false;">편집</button>
                                <button class="diary-modal-btn-delete-mini" onclick="deleteDiaryEventFromModal(${event.id}, '${dateStr}'); return false;">삭제</button>
                            </div>
                        ` : ''}
                    </li>
                `;
            });
            html += '</ul>';
            html += '</div>';
            
            // 관리자인 경우 새 일정 추가 버튼 (항상 보이게 하단 고정)
            if (isAdminLoggedIn) {
                html += `<div class="diary-modal-add-btn-wrap"><button type="button" class="diary-modal-btn diary-modal-btn-add" onclick="showAddFormInModal('${dateStr}')">+ 새 일정 추가</button></div>`;
            }
        } else {
            // 일정이 없는 경우 - 관리자일 때만 등록 버튼 표시
            if (isAdminLoggedIn) {
                html += `<div class="diary-modal-add-btn-wrap"><button type="button" class="diary-modal-btn diary-modal-btn-add" onclick="showAddFormInModal('${dateStr}')">+ 새 일정 등록</button></div>`;
            }
        }
        
        body.innerHTML = html;
        console.log('모달 렌더링 완료');
    }
    
    // 일정 상세 보기
    window.showEventDetailInModal = function(eventId, dateStr) {
        const modalBody = document.getElementById('diaryEventModalBody');
        if (!modalBody) return;
        
        fetch(`/api/diary/${eventId}`)
            .then(response => response.json())
            .then(event => {
                // 날짜 파싱 (YYYY-MM-DD 형식)
                const dateParts = event.eventDate.split('-');
                const dateDisplay = `${dateParts[0]}.${dateParts[1]}.${dateParts[2]}`;
                
                let html = `
                    <div class="diary-modal-date">${dateDisplay}</div>
                    <div class="diary-modal-detail">
                        <div class="diary-modal-detail-title">${escapeHtml(event.title)}</div>
                        <div class="diary-modal-detail-content">${escapeHtml(event.content || '내용 없음')}</div>
                    </div>
                    <div class="diary-modal-buttons">
                        <button class="diary-modal-btn diary-modal-btn-back" onclick="openDiaryEventModal('${dateStr}')">목록으로</button>
                        ${isAdminLoggedIn ? `
                            <button class="diary-modal-btn diary-modal-btn-edit" onclick="showEditFormInModal(${eventId}, '${dateStr}')">편집</button>
                            <button class="diary-modal-btn diary-modal-btn-delete" onclick="deleteDiaryEventFromModal(${eventId}, '${dateStr}')">삭제</button>
                        ` : ''}
                    </div>
                `;
                
                modalBody.innerHTML = html;
            })
            .catch(error => {
                console.error('일정 로드 오류:', error);
            });
    };
    
    // 모달에서 새 일정 등록 폼 표시
    window.showAddFormInModal = function(dateStr) {
        const modalBody = document.getElementById('diaryEventModalBody');
        if (!modalBody) return;
        
        // 날짜 파싱 (YYYY-MM-DD 형식)
        const dateParts = dateStr.split('-');
        const dateDisplay = `${dateParts[0]}.${dateParts[1]}.${dateParts[2]}`;
        
        let html = `
            <div class="diary-modal-form">
                <h3 style="margin-bottom: 15px; color: #333;">${dateDisplay} 일정 등록</h3>
                <div style="position: relative; margin-bottom: 15px;">
                    <input type="text" id="modalEventTitle" class="diary-modal-input" placeholder="일정 제목을 입력하세요" maxlength="200" oninput="updateCharCount('modalEventTitle', 'titleCharCount')" />
                    <span id="titleCharCount" style="position: absolute; right: 15px; bottom: 12px; font-size: 11px; color: #999; pointer-events: none;">0/200</span>
                </div>
                <div style="position: relative; margin-bottom: 15px;">
                    <textarea id="modalEventContent" class="diary-modal-textarea" placeholder="일정 내용을 입력하세요 (선택사항)" maxlength="200" oninput="updateCharCount('modalEventContent', 'contentCharCount')"></textarea>
                    <span id="contentCharCount" style="position: absolute; right: 15px; bottom: 12px; font-size: 11px; color: #999; pointer-events: none;">0/200</span>
                </div>
                <div class="diary-modal-buttons">
                    <button class="diary-modal-btn diary-modal-btn-back" onclick="openDiaryEventModal('${dateStr}')">취소</button>
                    <button class="diary-modal-btn diary-modal-btn-save" onclick="saveEventFromModal('${dateStr}')">저장</button>
                </div>
            </div>
        `;
        
        modalBody.innerHTML = html;
    };
    
    // 모달에서 일정 편집 폼 표시
    window.showEditFormInModal = function(eventId, dateStr) {
        const modalBody = document.getElementById('diaryEventModalBody');
        if (!modalBody) return;
        
        fetch(`/api/diary/${eventId}`)
            .then(response => response.json())
            .then(event => {
                // 날짜 파싱 (YYYY-MM-DD 형식)
                const dateParts = event.eventDate.split('-');
                const dateDisplay = `${dateParts[0]}.${dateParts[1]}.${dateParts[2]}`;
                
                const titleLen = (event.title || '').length;
                const contentLen = (event.content || '').length;
                
                let html = `
                    <div class="diary-modal-form">
                        <h3 style="margin-bottom: 15px; color: #333;">${dateDisplay} 일정 편집</h3>
                        <div style="position: relative; margin-bottom: 15px;">
                            <input type="text" id="modalEventTitle" class="diary-modal-input" value="${escapeHtml(event.title)}" maxlength="200" oninput="updateCharCount('modalEventTitle', 'titleCharCount')" />
                            <span id="titleCharCount" style="position: absolute; right: 15px; bottom: 12px; font-size: 11px; color: #999; pointer-events: none;">${titleLen}/200</span>
                        </div>
                        <div style="position: relative; margin-bottom: 15px;">
                            <textarea id="modalEventContent" class="diary-modal-textarea" maxlength="200" oninput="updateCharCount('modalEventContent', 'contentCharCount')">${escapeHtml(event.content || '')}</textarea>
                            <span id="contentCharCount" style="position: absolute; right: 15px; bottom: 12px; font-size: 11px; color: #999; pointer-events: none;">${contentLen}/200</span>
                        </div>
                        <div class="diary-modal-buttons">
                            <button class="diary-modal-btn diary-modal-btn-back" onclick="closeDiaryEventModal()">취소</button>
                            <button class="diary-modal-btn diary-modal-btn-save" onclick="updateEventFromModal(${eventId}, '${dateStr}')">수정</button>
                        </div>
                    </div>
                `;
                
                modalBody.innerHTML = html;
            })
            .catch(error => {
                console.error('일정 로드 오류:', error);
            });
    };
    
    // 다이어리 모달 닫기
    window.closeDiaryEventModal = function() {
        const modal = document.getElementById('diaryEventModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    };
    
    // 글자 수 카운터 업데이트
    window.updateCharCount = function(inputId, counterId) {
        const input = document.getElementById(inputId);
        const counter = document.getElementById(counterId);
        if (input && counter) {
            counter.textContent = input.value.length + '/200';
        }
    };
    
    // 모달에서 새 일정 저장
    window.saveEventFromModal = function(dateStr) {
        const title = document.getElementById('modalEventTitle').value.trim();
        const content = document.getElementById('modalEventContent').value.trim();
        
        if (!title) {
            alert('일정 제목을 입력해주세요.');
            return;
        }
        
        fetch('/api/diary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventDate: dateStr,
                title: title,
                content: content
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('일정이 저장되었습니다!');
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            loadMonthlyEvents(year, month);
            loadUpcomingDiaryEvent(); // diary-content-area 업데이트
            
            // 모달 내용 즉시 갱신
            setTimeout(() => {
                openDiaryEventModal(dateStr);
            }, 100);
        })
        .catch(error => {
            console.error('일정 저장 오류:', error);
            alert('일정 저장 중 오류가 발생했습니다.');
        });
    };
    
    // 모달에서 일정 수정
    window.updateEventFromModal = function(eventId, dateStr) {
        const title = document.getElementById('modalEventTitle').value.trim();
        const content = document.getElementById('modalEventContent').value.trim();
        
        if (!title) {
            alert('일정 제목을 입력해주세요.');
            return;
        }
        
        fetch(`/api/diary/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('일정이 수정되었습니다!');
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            loadMonthlyEvents(year, month);
            loadUpcomingDiaryEvent(); // diary-content-area 업데이트
            
            // 모달 닫기
            closeDiaryEventModal();
        })
        .catch(error => {
            console.error('일정 수정 오류:', error);
            alert('일정 수정 중 오류가 발생했습니다.');
        });
    };
    
    // 모달에서 일정 삭제
    window.deleteDiaryEventFromModal = function(eventId, dateStr) {
        if (!confirm('이 일정을 삭제하시겠습니까?')) {
            return;
        }
        
        fetch(`/api/diary/${eventId}`, {
            method: 'DELETE'
        })
        .then(() => {
            alert('일정이 삭제되었습니다!');
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            loadMonthlyEvents(year, month);
            loadUpcomingDiaryEvent(); // diary-content-area 업데이트
            
            // 모달 내용 즉시 갱신
            setTimeout(() => {
                openDiaryEventModal(dateStr);
            }, 100);
        })
        .catch(error => {
            console.error('일정 삭제 오류:', error);
            alert('일정 삭제 중 오류가 발생했습니다.');
        });
    };

    if (diaryPrevMonth) {
        diaryPrevMonth.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            loadMonthlyEvents(year, month);
        });
    }

    if (diaryNextMonth) {
        diaryNextMonth.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            loadMonthlyEvents(year, month);
        });
    }

    // 다가오는 일정 표시 (오늘 이후 가장 가까운 날짜의 일정들, 없으면 최신 일정)
    function loadUpcomingDiaryEvent() {
        fetch('/api/diary/upcoming')
            .then(response => {
                if (!response.ok) {
                    throw new Error('API 응답 오류');
                }
                return response.json();
            })
            .then(events => {
                const diaryContentArea = document.querySelector('.diary-content-area');
                if (!diaryContentArea) {
                    console.error('diary-content-area 요소를 찾을 수 없습니다.');
                    return;
                }
                
                if (events && events.length > 0) {
                    // 가장 가까운 날짜 찾기
                    const nearestDate = events[0].eventDate;
                    const nearestEvents = events.filter(e => e.eventDate === nearestDate);
                    
                    // 날짜 파싱 (YYYY-MM-DD 형식)
                    const dateParts = nearestDate.split('-');
                    const dateDisplay = `${dateParts[0]}.${dateParts[1]}.${dateParts[2]}`;
                    
                    let html = `<div class="diary-selected-date">📅 일정 - ${dateDisplay}</div>`;
                    
                    nearestEvents.forEach(event => {
                        html += `
                            <div class="diary-event-item-area" style="margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #ff6b9d; display: flex; justify-content: space-between; align-items: flex-start;">
                                <div class="diary-event-info" style="flex: 1;">
                                    <div class="diary-event-title" style="margin-bottom: 5px; font-weight: bold;">${escapeHtml(event.title)}</div>
                                    <div class="diary-event-content" style="font-size: 12px; color: #666;">${escapeHtml(event.content || '')}</div>
                                </div>
                                ${isAdminLoggedIn ? `
                                    <div class="diary-event-area-actions" style="display: flex; gap: 5px; margin-left: 10px;">
                                        <button class="diary-area-btn-edit" onclick="openEditEventModal(${event.id}, '${event.eventDate}')" style="padding: 4px 10px; font-size: 11px; border: none; border-radius: 4px; cursor: pointer; background: #4CAF50; color: white;">수정</button>
                                        <button class="diary-area-btn-delete" onclick="confirmDeleteEvent(${event.id})" style="padding: 4px 10px; font-size: 11px; border: none; border-radius: 4px; cursor: pointer; background: #f44336; color: white;">삭제</button>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    });
                    
                    diaryContentArea.innerHTML = html;
                } else {
                    diaryContentArea.innerHTML = '<div class="diary-no-event">등록된 일정이 없습니다. 날짜를 클릭하여 일정을 등록하세요.</div>';
                }
            })
            .catch(error => {
                console.error('다가오는 일정 로드 오류:', error);
                const diaryContentArea = document.querySelector('.diary-content-area');
                if (diaryContentArea) {
                    diaryContentArea.innerHTML = '<div class="diary-no-event">일정을 불러오는 중 오류가 발생했습니다.</div>';
                }
            });
    }
    
    // diary-content-area에서 수정 모달 열기
    window.openEditEventModal = function(eventId, dateStr) {
        showEditFormInModal(eventId, dateStr);
        const modal = document.getElementById('diaryEventModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    };
    
    // diary-content-area에서 삭제 확인
    window.confirmDeleteEvent = function(eventId) {
        if (confirm('이 일정을 삭제하시겠습니까?')) {
            fetch(`/api/diary/${eventId}`, {
                method: 'DELETE'
            })
            .then(() => {
                alert('일정이 삭제되었습니다!');
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                loadMonthlyEvents(year, month);
                loadUpcomingDiaryEvent();
            })
            .catch(error => {
                console.error('일정 삭제 오류:', error);
                alert('일정 삭제 중 오류가 발생했습니다.');
            });
        }
    };

    // 초기 로드
    const initialYear = currentDate.getFullYear();
    const initialMonth = currentDate.getMonth();
    loadMonthlyEvents(initialYear, initialMonth);
    loadUpcomingDiaryEvent();

    // ========== 섹션 전환 관련 ==========
    const cyVerticalMenu = document.querySelector(".cy-vertical-menu");
    const cyInfoWrapper = document.querySelector(".cy-info-wrapper");
    const cyMiniroomSection = document.querySelector(".cy-miniroom-section");
    const cyIlchon = document.querySelector(".cy-ilchon");
    const cyGuestbookSection = document.querySelector(".cy-guestbook-section");
    const cyPhotoSection = document.querySelector(".cy-photo-section");
    const cyDiarySection = document.querySelector(".cy-diary-section");

    // 세로 메뉴 버튼 클릭 - 이벤트 위임 방식
    if (cyVerticalMenu) {
        cyVerticalMenu.addEventListener("click", function(event) {
            const btn = event.target.closest('.vmenu-btn');
            if (!btn) return;
            
            const section = btn.getAttribute("data-section");
            if (!section) return;
            
            console.log('메뉴 클릭:', section);

            // active 상태 변경
            document.querySelectorAll(".vmenu-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            // 모든 섹션 숨기기
            if (cyInfoWrapper) cyInfoWrapper.style.display = "none";
            if (cyMiniroomSection) cyMiniroomSection.style.display = "none";
            if (cyIlchon) cyIlchon.style.display = "none";
            if (cyGuestbookSection) cyGuestbookSection.style.display = "none";
            if (cyPhotoSection) cyPhotoSection.style.display = "none";
            if (cyDiarySection) cyDiarySection.style.display = "none";

            // 선택된 섹션 보이기
            switch (section) {
                case "home":
                    // 홈: 최근게시물, 미니룸, 일촌평 보이기
                    if (cyInfoWrapper) cyInfoWrapper.style.display = "grid";
                    if (cyMiniroomSection) cyMiniroomSection.style.display = "flex";
                    if (cyIlchon) cyIlchon.style.display = "block";
                    break;
                case "info":
                    // 다이어리: 다이어리 섹션만
                    if (cyDiarySection) {
                        cyDiarySection.style.display = "grid";
                        const year = currentDate.getFullYear();
                        const month = currentDate.getMonth();
                        loadMonthlyEvents(year, month);
                        loadUpcomingDiaryEvent();
                    }
                    break;
                case "ilchon":
                    // 방명록: 방명록 섹션만
                    if (cyGuestbookSection) cyGuestbookSection.style.display = "flex";
                    break;
                case "photo":
                    // 사진첩: 사진첩 섹션만
                    if (cyPhotoSection) cyPhotoSection.style.display = "flex";
                    break;
            }
        });
    }

    // ========== 모달 관련 ==========
    const pageModal = document.getElementById("pageModal");
    const modalClose = document.getElementById("modalClose");
    const modalPageTitle = document.getElementById("modalPageTitle");
    const modalPageBody = document.getElementById("modalPageBody");

    // 모달 닫기
    if (modalClose) {
        modalClose.addEventListener("click", closePageModal);
    }

    if (pageModal) {
        pageModal.addEventListener("click", (e) => {
            if (e.target === pageModal) {
                closePageModal();
            }
        });
    }

    function openPageModal(page) {
        let title = "";
        let content = null;

        switch (page) {
            case "profile":
                title = "프로필";
                content = createProfileContent();
                break;
            case "guestbook":
                title = "방명록";
                content = getTemplateContent("tplGuestbook");
                break;
            case "diary":
                title = "다이어리";
                content = getTemplateContent("tplDiary");
                break;
            case "photo":
                title = "사진첩";
                content = getTemplateContent("tplPhoto");
                break;
            default:
                return;
        }

        modalPageTitle.textContent = title;
        modalPageBody.innerHTML = "";
        modalPageBody.appendChild(content);

        // 방명록인 경우 폼 이벤트 등록
        if (page === "guestbook") {
            initGuestbook();
        }

        pageModal.classList.remove("hidden");
    }

    function closePageModal() {
        pageModal.classList.add("hidden");
    }

    function getTemplateContent(templateId) {
        const template = document.getElementById(templateId);
        if (template) {
            return template.content.cloneNode(true);
        }
        const div = document.createElement("div");
        div.textContent = "콘텐츠를 불러올 수 없습니다.";
        return div;
    }

    function createProfileContent() {
        const div = document.createElement("div");
        div.innerHTML = `
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #555;">
                <p style="margin-bottom: 10px;">프로필 페이지는 준비 중입니다.</p>
                <p style="color: #999; font-size: 11px;">좌측 프로필 카드를 참고해주세요.</p>
            </div>
        `;
        return div;
    }

    // ========== 방명록 기능 ==========
    function initGuestbook() {
        const form = document.getElementById("formGuestbook");
        const list = document.getElementById("listGuestbook");
        const nameInput = document.getElementById("inpGuestName");
        const msgInput = document.getElementById("inpGuestMsg");

        if (!form || !list || !nameInput || !msgInput) return;

        // 저장된 방명록 불러오기
        loadGuestbookData(list);

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = nameInput.value.trim();
            const msg = msgInput.value.trim();

            if (!name || !msg) return;

            const entry = {
                name: name,
                message: msg,
                time: new Date().toISOString(),
            };

            // 로컬스토리지에 저장
            saveGuestbookEntry(entry);

            // 화면에 추가
            appendGuestbookItem(list, entry);

            // 폼 초기화
            nameInput.value = "";
            msgInput.value = "";
        });
    }

    function saveGuestbookEntry(entry) {
        let entries = JSON.parse(localStorage.getItem("cyworld_guestbook") || "[]");
        entries.unshift(entry);
        localStorage.setItem("cyworld_guestbook", JSON.stringify(entries));
    }

    function loadGuestbookData(list) {
        let entries = JSON.parse(localStorage.getItem("cyworld_guestbook") || "[]");
        entries.forEach((entry) => {
            appendGuestbookItem(list, entry);
        });
    }

    function appendGuestbookItem(list, entry) {
        const li = document.createElement("li");

        const date = new Date(entry.time);
        const timeStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

        li.innerHTML = `
            <div>
                <span class="gb-name">${escapeHtml(entry.name)}</span>
                <span class="gb-time">${timeStr}</span>
            </div>
            <span class="gb-msg">${escapeHtml(entry.message)}</span>
        `;

        list.appendChild(li);
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 팝업 닫을 때 변경사항 확인
    window.addEventListener('beforeunload', (e) => {
        if (isAdminLoggedIn && checkUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = ''; // Chrome에서 필요
            return '변경된 내용이 저장되지 않았습니다.';
        }
    });
});
