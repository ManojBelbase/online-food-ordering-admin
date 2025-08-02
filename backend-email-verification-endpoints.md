# Email Verification Management - Backend Implementation

## Missing Backend Endpoints You Need to Add:

### 1. **Resend Verification Email Endpoint**
```typescript
// Add to your auth controller
export const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email is already verified", 400);
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email (use your existing email service)
    await sendVerificationEmail(user.email, user.name, verificationToken);

    res.status(200).json({
      message: "Verification email sent successfully"
    });
  }
);
```

### 2. **Admin Resend Verification Email Endpoint**
```typescript
// Add to your auth controller (admin only)
export const adminResendVerificationEmail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    // Check if user is admin
    if (req.user?.role !== UserRole.ADMIN) {
      throw new AppError("Access denied. Admin only.", 403);
    }

    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email is already verified", 400);
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    res.status(200).json({
      message: `Verification email sent to ${user.email}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  }
);
```

### 3. **Check Email Verification Status Endpoint**
```typescript
// Add to your auth controller
export const checkEmailVerificationStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params;

    const user = await User.findOne({ email }).select('isEmailVerified emailVerificationExpires');
    
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isTokenExpired = user.emailVerificationExpires && 
                          new Date() > user.emailVerificationExpires;

    res.status(200).json({
      email: email,
      isEmailVerified: user.isEmailVerified,
      isTokenExpired: isTokenExpired,
      canResendVerification: !user.isEmailVerified
    });
  }
);
```

### 4. **Add Routes to your auth router**
```typescript
// Add these routes to your auth routes file
router.post('/resend-verification', resendVerificationEmail);
router.post('/admin/resend-verification/:userId', adminResendVerificationEmail);
router.get('/verification-status/:email', checkEmailVerificationStatus);
```

### 5. **Update User Model (if needed)**
Make sure your User model has these fields:
```typescript
emailVerificationToken: String,
emailVerificationExpires: Date,
isEmailVerified: {
  type: Boolean,
  default: false
}
```

## Frontend Implementation Needed:

### 1. **Add API calls in frontend**
```typescript
// Add to your auth API
export const resendVerificationEmail = (email: string) => {
  return makeRequest.post('/auth/resend-verification', { email });
};

export const adminResendVerificationEmail = (userId: string) => {
  return makeRequest.post(`/auth/admin/resend-verification/${userId}`);
};

export const checkEmailVerificationStatus = (email: string) => {
  return makeRequest.get(`/auth/verification-status/${email}`);
};
```

### 2. **Add UI Components**
- Add "Resend Verification" button in customer table
- Add email verification status indicator
- Add admin action to resend verification emails

## Summary:
Your backend currently has:
✅ Email verification endpoint
✅ Token generation and validation

Your backend needs:
❌ Resend verification email endpoint
❌ Admin resend verification endpoint  
❌ Email verification status check endpoint

Would you like me to help you implement the frontend components for these features?
