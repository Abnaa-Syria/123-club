const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');

class SettingsService {
  async getAll(group = null) {
    const where = {};
    if (group) where.group = group;

    // Return a flat list; frontend groups by `group` itself
    const settings = await prisma.appSetting.findMany({ where, orderBy: { key: 'asc' } });
    return settings;
  }

  async getByKey(key) {
    const setting = await prisma.appSetting.findUnique({ where: { key } });
    if (!setting) throw AppError.notFound('Setting not found');
    return setting;
  }

  async upsert(key, value, group = null) {
    return prisma.appSetting.upsert({
      where: { key },
      update: { value, group },
      create: { key, value, group },
    });
  }

  async bulkUpdate(settings) {
    const results = [];
    for (const { key, value, group } of settings) {
      const result = await this.upsert(key, value, group);
      results.push(result);
    }
    return results;
  }

  async delete(key) {
    const setting = await prisma.appSetting.findUnique({ where: { key } });
    if (!setting) throw AppError.notFound('Setting not found');
    await prisma.appSetting.delete({ where: { key } });
    return { message: 'Setting deleted' };
  }
}

module.exports = new SettingsService();

