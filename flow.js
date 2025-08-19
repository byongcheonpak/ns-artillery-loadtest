const { expect } = require('@playwright/test');

/**
 * 4단계 사용자 여정 시나리오
 * 1. 홈페이지 → 상품 상세 페이지
 * 2. 상품 상세 페이지 → 이벤트 페이지  
 * 3. 이벤트 페이지 → 로그인 페이지
 * 4. 로그인 처리 (성공/실패 분기)
 */
async function userJourney(page, vuContext, events) {
  const { email, password } = vuContext.vars;
  const userId = vuContext.vars.$uuid;
  
  try {
    console.log(`[${userId}] Starting user journey with email: ${email}`);
    
    // Step 1: 홈페이지 접속
    console.log(`[${userId}] Step 1: Navigating to home page`);
    await page.goto('/store/atypical/home', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // 페이지 로드 완료 대기
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);
    
    // 홈페이지 로드 확인
    await expect(page).toHaveURL(/.*\/store\/atypical\/home/);
    events.emit('counter', 'step1.home_loaded', 1);
    
    // 특정 상품 링크 클릭 (상품 상세 페이지로 이동)
    // 상품 링크를 찾아서 클릭
    try {
      // 상품 링크 또는 상품 이미지 클릭 시도
      const productLink = page.locator('a[href*="/goods/"]').first();
      if (await productLink.isVisible({ timeout: 5000 })) {
        await productLink.click();
      } else {
        // 직접 상품 상세 페이지로 이동
        await page.goto('/goods/32914563', { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
      }
    } catch (error) {
      console.log(`[${userId}] Product link not found, navigating directly to product page`);
      await page.goto('/goods/32914563', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
    }
    
    // Step 2: 상품 상세 페이지
    console.log(`[${userId}] Step 2: Product detail page`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);
    
    // 상품 상세 페이지 로드 확인
    await expect(page).toHaveURL(/.*\/goods\/.*/);
    events.emit('counter', 'step2.product_detail_loaded', 1);
    
    // 이벤트 페이지로 이동 (상단 메뉴 또는 배너 클릭)
    try {
      // 이벤트 메뉴나 쿠폰 관련 링크 찾기
      const eventLink = page.locator('a[href*="benefit"], a[href*="coupon"], a[href*="event"]').first();
      if (await eventLink.isVisible({ timeout: 5000 })) {
        await eventLink.click();
      } else {
        // 직접 이벤트 페이지로 이동
        await page.goto('/store/atypical/benefit-coupon', { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
      }
    } catch (error) {
      console.log(`[${userId}] Event link not found, navigating directly to event page`);
      await page.goto('/store/atypical/benefit-coupon', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
    }
    
    // Step 3: 이벤트 페이지
    console.log(`[${userId}] Step 3: Event page`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);
    
    // 이벤트 페이지 로드 확인
    await expect(page).toHaveURL(/.*\/benefit-coupon/);
    events.emit('counter', 'step3.event_page_loaded', 1);
    
    // 로그인 페이지로 이동 (로그인 버튼 클릭)
    try {
      // 로그인 버튼이나 링크 찾기
      const loginButton = page.locator('a[href*="login"], button:has-text("로그인")').first();
      if (await loginButton.isVisible({ timeout: 5000 })) {
        await loginButton.click();
      } else {
        // 직접 로그인 페이지로 이동
        await page.goto('/customer/login', { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
      }
    } catch (error) {
      console.log(`[${userId}] Login button not found, navigating directly to login page`);
      await page.goto('/customer/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
    }
    
    // Step 4: 로그인 처리
    console.log(`[${userId}] Step 4: Login page - attempting login with ${email}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // 로그인 페이지 로드 확인
    await expect(page).toHaveURL(/.*\/customer\/login/);
    events.emit('counter', 'step4.login_page_loaded', 1);
    
    // 로그인 폼 입력
    try {
      // 이메일/아이디 입력 필드 찾기
      const emailInput = page.locator('input[type="email"], input[name*="id"], input[name*="email"], input[placeholder*="이메일"], input[placeholder*="아이디"]').first();
      await emailInput.waitFor({ timeout: 10000 });
      await emailInput.fill(email);
      
      // 비밀번호 입력 필드 찾기
      const passwordInput = page.locator('input[type="password"], input[name*="password"], input[name*="pw"]').first();
      await passwordInput.waitFor({ timeout: 10000 });
      await passwordInput.fill(password);
      
      // 로그인 버튼 클릭
      const submitButton = page.locator('button[type="submit"], button:has-text("로그인"), input[type="submit"]').first();
      await submitButton.waitFor({ timeout: 10000 });
      await submitButton.click();
      
      // 로그인 결과 확인 (3초 대기)
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      
      if (currentUrl.includes('/customer/login')) {
        // 로그인 실패 - 여전히 로그인 페이지에 있음
        console.log(`[${userId}] Login failed - still on login page`);
        events.emit('counter', 'step4.login_failed', 1);
      } else {
        // 로그인 성공 - 다른 페이지로 이동됨
        console.log(`[${userId}] Login successful - redirected to: ${currentUrl}`);
        events.emit('counter', 'step4.login_success', 1);
      }
      
    } catch (error) {
      console.log(`[${userId}] Login form interaction failed: ${error.message}`);
      events.emit('counter', 'step4.login_form_error', 1);
    }
    
    console.log(`[${userId}] User journey completed successfully`);
    events.emit('counter', 'journey.completed', 1);
    
  } catch (error) {
    console.error(`[${userId}] User journey failed: ${error.message}`);
    events.emit('counter', 'journey.failed', 1);
    throw error;
  }
}

module.exports = {
  userJourney
};