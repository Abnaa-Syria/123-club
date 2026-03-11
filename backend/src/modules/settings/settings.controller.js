const settingsService = require('./settings.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class SettingsController {
  getAll = catchAsync(async (req, res) => {
    const result = await settingsService.getAll(req.query.group);
    return ApiResponse.success(res, { data: result });
  });

  getByKey = catchAsync(async (req, res) => {
    const setting = await settingsService.getByKey(req.params.key);
    return ApiResponse.success(res, { data: setting });
  });

  upsert = catchAsync(async (req, res) => {
    const { key, value, group } = req.body;
    const setting = await settingsService.upsert(key, value, group);
    return ApiResponse.success(res, { data: setting, message: 'Setting saved' });
  });

  update = catchAsync(async (req, res) => {
    const { key } = req.params;
    const { value, group } = req.body;
    const setting = await settingsService.upsert(key, value, group);
    return ApiResponse.success(res, { data: setting, message: 'Setting updated' });
  });

  bulkUpdate = catchAsync(async (req, res) => {
    const results = await settingsService.bulkUpdate(req.body.settings);
    return ApiResponse.success(res, { data: results, message: 'Settings updated' });
  });

  delete = catchAsync(async (req, res) => {
    const result = await settingsService.delete(req.params.key);
    return ApiResponse.success(res, { data: result });
  });
}

module.exports = new SettingsController();

