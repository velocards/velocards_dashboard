# VeloCards Dashboard - Localhost Testing Guide

## 🚀 Quick Start

### 1. Start the Development Server
```bash
# Make sure you're in the project directory
cd velocards-dashboard

# Start the server
npm run dev
```

The application will be available at: **http://localhost:3000**

## 📋 Testing Checklist

### 1. Initial Load Test
- [ ] Open http://localhost:3000 in your browser
- [ ] Check browser console (F12) for any red errors
- [ ] Verify you're redirected to sign-in page

### 2. Authentication Testing

#### Sign In Page (http://localhost:3000/auth/sign-in)
- [ ] **CAPTCHA Check**: Cloudflare widget should appear
- [ ] **Visual Elements**: 
  - [ ] Animated text on the left side works
  - [ ] Form displays correctly
  - [ ] Google Sign-In button visible
- [ ] **Login Test**:
  ```
  Email: test@example.com
  Password: Test123!
  ```
- [ ] **Error Handling**: Try wrong credentials to see error message

#### Sign Up Page (http://localhost:3000/auth/sign-up)
- [ ] Form validation works (try invalid email)
- [ ] CAPTCHA appears
- [ ] Password requirements shown
- [ ] Terms checkbox required

### 3. Dashboard Testing (After Login)

#### Main Dashboard (http://localhost:3000/dashboard)
- [ ] **Statistics Cards Load**:
  - [ ] Total Balance displays
  - [ ] Active Cards count
  - [ ] Monthly Spending
  - [ ] Account Tier
- [ ] **Charts Render**:
  - [ ] Deposits Overview chart
  - [ ] Weekly Transactions chart
- [ ] **Latest Transactions** table shows data
- [ ] **Quick Transfer** section works

### 4. Card Management Testing

#### Cards Page (http://localhost:3000/cards)
- [ ] Card list loads
- [ ] "Add New Card" button is clickable
- [ ] **Card Actions** (if you have cards):
  - [ ] View Details opens modal
  - [ ] Freeze/Unfreeze toggle works
  - [ ] Delete shows confirmation (THIS TESTS OUR FIX!)

### 5. Transaction Pages Testing

#### All Transactions (http://localhost:3000/transactions/all-transactions)
- [ ] Transaction list loads
- [ ] Filters work (Status, Date Range)
- [ ] Search functionality works
- [ ] Export buttons (CSV/JSON) are clickable
- [ ] **Delete Action** shows native confirmation (THIS TESTS OUR FIX!)

#### Your Deposits (http://localhost:3000/transactions/your-deposits)
- [ ] Deposit history loads
- [ ] Status badges display correctly
- [ ] Blockchain links work (if any)

### 6. Invoice Testing (http://localhost:3000/invoice)
- [ ] Invoice list loads
- [ ] Download PDF button works
- [ ] Resend button shows confirmation
- [ ] Search/filter functionality

### 7. Settings Testing (http://localhost:3000/settings/profile)
- [ ] Profile form loads
- [ ] All form fields display
- [ ] Save button is clickable
- [ ] **Note**: Rich text editor removed (was unused)

## 🔍 Specific Areas to Test (Our Changes)

### 1. **Confirmation Dialogs** (Previously SweetAlert2)
Test these specific actions that now use native dialogs:

#### In Dashboard:
- Navigate to **Dashboard** → Find any action button → Click delete/remove
- **Expected**: Browser's native confirm dialog appears
- **Test**: Click Cancel and OK to ensure both work

#### In Transactions:
- Go to **All Transactions** → Find any transaction → Click action menu → Delete
- **Expected**: Native browser confirmation
- **Test**: Verify transaction is deleted only after confirming

### 2. **Removed Components**
Verify these removed features weren't being used:
- [ ] No broken rich text editors anywhere
- [ ] No code syntax highlighting needed
- [ ] All pages load without errors

## 🐛 Common Issues & Solutions

### Issue: "Network Error" or API Connection Failed
**Solution**: The backend API might be down. Check if https://api.velocards.com is accessible.

### Issue: CAPTCHA Not Working
**Solution**: 
1. Check console for errors
2. Verify Cloudflare site key is in `.env.local`
3. Restart dev server after changing env variables

### Issue: Blank Dashboard
**Solution**: 
1. Check console for errors
2. Try logging out and back in
3. Clear browser cache

### Issue: Styles Look Broken
**Solution**:
1. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear Next.js cache: `rm -rf .next`
3. Restart dev server

## 📊 Performance Check

While testing, also note:
- [ ] Page load feels fast (< 3 seconds)
- [ ] No layout shifts while loading
- [ ] Animations are smooth
- [ ] No infinite loading spinners

## 🎯 Final Verification

### Browser Console Check:
Open Developer Tools (F12) → Console tab
- [ ] No red errors
- [ ] No 404s for missing resources
- [ ] No "module not found" errors

### Network Tab Check:
Open Developer Tools (F12) → Network tab
- [ ] API calls succeed (200 status)
- [ ] No failed resource loads
- [ ] Images load properly

## ✅ Test Results Template

Copy and fill this out:

```
TESTING COMPLETED: [DATE]

Authentication:     ✅ Working / ❌ Issues found
Dashboard:          ✅ Working / ❌ Issues found
Cards:              ✅ Working / ❌ Issues found
Transactions:       ✅ Working / ❌ Issues found
Invoices:           ✅ Working / ❌ Issues found
Settings:           ✅ Working / ❌ Issues found
Confirmation Dialogs: ✅ Working / ❌ Issues found

Console Errors:     None / [List any errors]
Broken Features:    None / [List any broken features]

Notes:
[Any additional observations]
```

## 🚨 If You Find Issues

1. **Check the browser console** for specific error messages
2. **Note which page** the issue occurs on
3. **Try to reproduce** the issue consistently
4. **Test in incognito mode** to rule out cache issues

Remember: We only removed unused packages and replaced SweetAlert2 with native dialogs. All core functionality should work exactly as before!