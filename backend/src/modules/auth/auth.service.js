const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/database');
const config = require('../../config');
const AppError = require('../../utils/AppError');
const { generateMemberId, generateReferralCode } = require('../../utils/helpers');

class AuthService {
  /**
   * Register a new user
   */
  async register(data) {
    const { email, password, phone, role, firstName, lastName, gender, birthDate, referralCode, ...roleFields } = data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw AppError.conflict('Email already registered');
    }

    // Check phone uniqueness if provided
    if (phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone } });
      if (existingPhone) {
        throw AppError.conflict('Phone number already registered');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

    // Create user with profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          email,
          phone: phone || null,
          password: hashedPassword,
          role,
          status: 'ACTIVE',
        },
      });

      // Create base profile
      await tx.profile.create({
        data: {
          userId: newUser.id,
          firstName,
          lastName,
          displayName: `${firstName} ${lastName}`,
          gender: gender || null,
          birthDate: birthDate ? new Date(birthDate) : null,
        },
      });

      // Create role-specific profile
      await this._createRoleProfile(tx, newUser.id, role, roleFields);

      // Create points wallet
      await tx.pointsWallet.create({
        data: {
          userId: newUser.id,
          currentBalance: 0,
          totalEarned: 0,
          totalRedeemed: 0,
        },
      });

      // Create cart
      await tx.cart.create({
        data: { userId: newUser.id },
      });

      // Generate membership card
      const defaultPlan = await tx.membershipPlan.findFirst({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      if (defaultPlan) {
        await tx.membershipCard.create({
          data: {
            userId: newUser.id,
            planId: defaultPlan.id,
            memberId: generateMemberId(),
            level: defaultPlan.level,
            startDate: new Date(),
          },
        });
      }

      // Generate referral code for the user
      await tx.referral.create({
        data: {
          referrerId: newUser.id,
          referralCode: generateReferralCode(),
          rewardPoints: 0,
        },
      });

      // Handle incoming referral code
      if (referralCode) {
        const referral = await tx.referral.findFirst({
          where: { referralCode, isUsed: false },
        });
        if (referral) {
          await tx.referral.update({
            where: { id: referral.id },
            data: {
              referredId: newUser.id,
              isUsed: true,
              usedAt: new Date(),
            },
          });
          // Reward bonus points to referrer
          const referrerWallet = await tx.pointsWallet.findUnique({
            where: { userId: referral.referrerId },
          });
          if (referrerWallet) {
            const bonusPoints = 50;
            await tx.pointsWallet.update({
              where: { id: referrerWallet.id },
              data: {
                currentBalance: { increment: bonusPoints },
                totalEarned: { increment: bonusPoints },
              },
            });
            await tx.pointsTransaction.create({
              data: {
                walletId: referrerWallet.id,
                type: 'REFERRAL_BONUS',
                amount: bonusPoints,
                balanceAfter: referrerWallet.currentBalance + bonusPoints,
                description: `Referral bonus for inviting ${firstName}`,
              },
            });
          }
        }
      }

      // Signup bonus
      const wallet = await tx.pointsWallet.findUnique({ where: { userId: newUser.id } });
      if (wallet) {
        const signupBonus = 100;
        await tx.pointsWallet.update({
          where: { id: wallet.id },
          data: {
            currentBalance: { increment: signupBonus },
            totalEarned: { increment: signupBonus },
          },
        });
        await tx.pointsTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'SIGNUP_BONUS',
            amount: signupBonus,
            balanceAfter: signupBonus,
            description: 'Welcome signup bonus',
          },
        });
      }

      return newUser;
    });

    // Generate tokens
    const tokens = this._generateTokens(user.id, user.role);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Fetch complete user data
    const fullUser = await this._getUserWithProfile(user.id);

    return {
      user: this._sanitizeUser(fullUser),
      ...tokens,
    };
  }

  /**
   * Login user
   */
  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw AppError.forbidden('Account is not active');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = this._generateTokens(user.id, user.role);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const fullUser = await this._getUserWithProfile(user.id);

    return {
      user: this._sanitizeUser(fullUser),
      ...tokens,
    };
  }

  /**
   * Refresh token
   */
  async refreshToken(token) {
    const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw AppError.unauthorized('Invalid or expired refresh token');
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.refreshSecret);
    } catch {
      throw AppError.unauthorized('Invalid refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.status !== 'ACTIVE') {
      throw AppError.unauthorized('User not found or inactive');
    }

    // Delete old token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Generate new tokens
    const tokens = this._generateTokens(user.id, user.role);

    // Save new refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  }

  /**
   * Logout
   */
  async logout(userId, refreshToken) {
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { userId, token: refreshToken },
      });
    }
    return true;
  }

  /**
   * Forgot password - generates reset token
   */
  async forgotPassword(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate a simple reset token (in production, use a dedicated table)
    const resetToken = jwt.sign(
      { userId: user.id, purpose: 'password_reset' },
      config.jwt.secret,
      { expiresIn: '1h' }
    );

    // In production, send email here
    // await mailService.sendPasswordReset(user.email, resetToken);

    return { message: 'If the email exists, a reset link has been sent', resetToken };
  }

  /**
   * Reset password
   */
  async resetPassword(token, newPassword) {
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
      if (decoded.purpose !== 'password_reset') {
        throw new Error('Invalid token purpose');
      }
    } catch {
      throw AppError.badRequest('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({ where: { userId: decoded.userId } });

    return { message: 'Password reset successfully' };
  }

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw AppError.notFound('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw AppError.badRequest('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId) {
    const user = await this._getUserWithProfile(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }
    return this._sanitizeUser(user);
  }

  /**
   * Update current user profile
   */
  async updateProfile(userId, data) {
    const { firstName, lastName, email } = data;

    // Check if email is being changed and already exists
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, id: { not: userId } },
      });
      if (existing) {
        throw AppError.conflict('Email already in use');
      }
      await prisma.user.update({
        where: { id: userId },
        data: { email },
      });
    }

    // Update profile
    await prisma.profile.update({
      where: { userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(firstName && lastName && { displayName: `${firstName} ${lastName}` }),
      },
    });

    const user = await this._getUserWithProfile(userId);
    return this._sanitizeUser(user);
  }

  // ============================================
  // Private Helper Methods
  // ============================================

  _generateTokens(userId, role) {
    const accessToken = jwt.sign(
      { userId, role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      { userId, role },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    return { accessToken, refreshToken };
  }

  async _createRoleProfile(tx, userId, role, fields) {
    switch (role) {
      case 'CHILD':
        await tx.childProfile.create({
          data: {
            userId,
            schoolName: fields.schoolName || null,
            grade: fields.grade || null,
            interests: fields.interests || null,
            parentId: fields.parentId || null,
          },
        });
        break;
      case 'PARENT':
        await tx.parentProfile.create({
          data: {
            userId,
            numberOfChildren: fields.numberOfChildren || 0,
            occupation: fields.occupation || null,
          },
        });
        break;
      case 'TEACHER':
        await tx.teacherProfile.create({
          data: {
            userId,
            schoolName: fields.schoolName || null,
            specialization: fields.specialization || null,
            yearsOfExp: fields.yearsOfExp || 0,
          },
        });
        break;
      case 'SCHOOL':
        await tx.schoolProfile.create({
          data: {
            userId,
            schoolName: fields.schoolName || 'Unknown School',
            contactPerson: fields.contactPerson || null,
            contactEmail: fields.contactEmail || null,
            contactPhone: fields.contactPhone || null,
            address: fields.address || null,
            website: fields.website || null,
            studentsCount: fields.studentsCount || 0,
          },
        });
        break;
    }
  }

  async _getUserWithProfile(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        childProfile: true,
        parentProfile: true,
        teacherProfile: true,
        schoolProfile: true,
        membershipCard: { include: { plan: true } },
        pointsWallet: true,
        selectedAvatar: { include: { avatar: true } },
      },
    });
  }

  _sanitizeUser(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = new AuthService();

