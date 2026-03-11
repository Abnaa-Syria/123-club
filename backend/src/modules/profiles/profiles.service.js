const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');

class ProfilesService {
  /**
   * Get user profile
   */
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        childProfile: true,
        parentProfile: true,
        teacherProfile: true,
        schoolProfile: true,
        selectedAvatar: { include: { avatar: true } },
        membershipCard: { include: { plan: true } },
        pointsWallet: true,
      },
    });

    if (!user) throw AppError.notFound('User not found');

    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Update base profile
   */
  async updateProfile(userId, data) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) throw AppError.notFound('User not found');

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName || (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined),
        gender: data.gender,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        country: data.country,
        city: data.city,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      },
    });

    return updatedProfile;
  }

  /**
   * Update role-specific profile
   */
  async updateRoleProfile(userId, role, data) {
    switch (role) {
      case 'CHILD':
        return prisma.childProfile.update({
          where: { userId },
          data: {
            schoolName: data.schoolName,
            grade: data.grade,
            interests: data.interests,
            parentId: data.parentId,
          },
        });
      case 'PARENT':
        return prisma.parentProfile.update({
          where: { userId },
          data: {
            numberOfChildren: data.numberOfChildren,
            occupation: data.occupation,
          },
        });
      case 'TEACHER':
        return prisma.teacherProfile.update({
          where: { userId },
          data: {
            schoolName: data.schoolName,
            specialization: data.specialization,
            yearsOfExp: data.yearsOfExp,
          },
        });
      case 'SCHOOL':
        return prisma.schoolProfile.update({
          where: { userId },
          data: {
            schoolName: data.schoolName,
            contactPerson: data.contactPerson,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            address: data.address,
            website: data.website,
            studentsCount: data.studentsCount,
          },
        });
      default:
        throw AppError.badRequest('Invalid role');
    }
  }

  /**
   * Update avatar URL
   */
  async updateAvatar(userId, avatarUrl) {
    return prisma.profile.update({
      where: { userId },
      data: { avatarUrl },
    });
  }
}

module.exports = new ProfilesService();

