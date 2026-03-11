const avatarsService = require('./avatars.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class AvatarsController {
  listAvatars = catchAsync(async (req, res) => {
    const { avatars, total, page, limit } = await avatarsService.listAvatars(req.query);
    return ApiResponse.paginated(res, { data: avatars, page, limit, total });
  });

  getAvatarById = catchAsync(async (req, res) => {
    const avatar = await avatarsService.getAvatarById(req.params.id);
    return ApiResponse.success(res, { data: avatar });
  });

  createAvatar = catchAsync(async (req, res) => {
    // If file is uploaded, use its path, otherwise use imageUrl from body
    const imageUrl = req.file ? `avatars/${req.file.filename}` : req.body.imageUrl;
    const data = { ...req.body, imageUrl };
    const avatar = await avatarsService.createAvatar(data);
    return ApiResponse.created(res, { data: avatar });
  });

  updateAvatar = catchAsync(async (req, res) => {
    // If file is uploaded, use its path, otherwise use imageUrl from body
    const imageUrl = req.file ? `avatars/${req.file.filename}` : req.body.imageUrl;
    const data = { ...req.body };
    if (imageUrl) data.imageUrl = imageUrl;
    const avatar = await avatarsService.updateAvatar(req.params.id, data);
    return ApiResponse.success(res, { data: avatar, message: 'Avatar updated' });
  });

  deleteAvatar = catchAsync(async (req, res) => {
    const result = await avatarsService.deleteAvatar(req.params.id);
    return ApiResponse.success(res, { data: result });
  });

  selectAvatar = catchAsync(async (req, res) => {
    const result = await avatarsService.selectAvatar(req.user.id, req.body.avatarId);
    return ApiResponse.success(res, { data: result, message: 'Avatar selected' });
  });

  getMyAvatar = catchAsync(async (req, res) => {
    const avatar = await avatarsService.getMyAvatar(req.user.id);
    return ApiResponse.success(res, { data: avatar });
  });
}

module.exports = new AvatarsController();

