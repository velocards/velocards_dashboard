# VeloCards Dashboard Testing Checklist

## 🔐 Authentication & Security
- [ ] Sign up with new account
  - [ ] Email verification flow works
  - [ ] Password requirements enforced
  - [ ] Cloudflare Turnstile CAPTCHA displays
- [ ] Sign in with existing account
  - [ ] Remember me functionality
  - [ ] Incorrect credentials show proper error
  - [ ] Session persistence works
- [ ] Password reset flow
  - [ ] Forgot password email sent
  - [ ] Reset link works
- [ ] Google OAuth login
  - [ ] Google sign-in button works
  - [ ] Callback handles success/failure
- [ ] Logout functionality
  - [ ] Clears session properly
  - [ ] Redirects to login

## 🎯 Core Functionality
- [ ] Dashboard loads without errors
  - [ ] Statistics display correctly
  - [ ] Charts render properly
  - [ ] No console errors
- [ ] Cards section
  - [ ] View existing cards
  - [ ] Add new card
  - [ ] Card details page
- [ ] Transactions
  - [ ] All transactions list
  - [ ] Card transactions filter
  - [ ] Deposits view
  - [ ] Export functionality
- [ ] Profile settings
  - [ ] Update profile information
  - [ ] Change password
  - [ ] 2FA setup
  - [ ] Linked providers

## 🔄 API Integration
- [ ] API endpoints respond correctly
  - [ ] Authentication endpoints
  - [ ] Data fetching works
  - [ ] Error handling for failed requests
- [ ] Token refresh mechanism
  - [ ] Automatic token refresh
  - [ ] Handles 401 errors properly
- [ ] Loading states display
- [ ] Error states handled gracefully

## 🆔 KYC Integration
- [ ] KYC modal displays when required
- [ ] Sumsub SDK loads properly
- [ ] KYC status updates correctly
- [ ] Verification flow completes

## 📊 Data Visualization
- [ ] ApexCharts render without errors
- [ ] Charts are responsive
- [ ] Data updates dynamically
- [ ] No TypeScript errors

## 🌐 Browser Compatibility
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile responsive

## 🚀 Performance
- [ ] Page load times < 3s
- [ ] No memory leaks
- [ ] Images optimized
- [ ] Bundle size reasonable

## 🐛 Error Handling
- [ ] Network errors handled
- [ ] Invalid data handled
- [ ] User-friendly error messages
- [ ] No app crashes

## 📱 Responsive Design
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Touch interactions work

## 🔍 To Test Locally

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test with different scenarios:**
   - New user registration
   - Existing user login
   - API errors (disconnect network)
   - Different screen sizes

3. **Check browser console for:**
   - JavaScript errors
   - Failed network requests
   - React warnings

4. **Verify environment variables:**
   - API URLs correct
   - OAuth credentials work
   - Turnstile key valid