const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '123 Club API',
      version: '1.0.0',
      description: '123 Club - Kids Membership & Rewards Platform API Documentation',
      contact: {
        name: '123 Club Dev Team',
      },
    },
    servers: [
      {
        url: `${config.appUrl}/api/v1`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
            meta: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'object' },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication & Authorization' },
      { name: 'Users', description: 'User management' },
      { name: 'Profiles', description: 'User profiles management' },
      { name: 'Membership', description: 'Membership plans & cards' },
      { name: 'Avatars', description: 'Avatars & characters' },
      { name: 'Wallet', description: 'Points wallet & transactions' },
      { name: 'Content Categories', description: 'Content categories management' },
      { name: 'Content', description: 'Content items management' },
      { name: 'Banners', description: 'Banners management' },
      { name: 'Product Categories', description: 'Product categories management' },
      { name: 'Products', description: 'Products & redemption store' },
      { name: 'Cart', description: 'Shopping cart' },
      { name: 'Orders', description: 'Orders management' },
      { name: 'Notifications', description: 'Notifications management' },
      { name: 'Referrals', description: 'Referral & invite system' },
      { name: 'Static Pages', description: 'CMS / static pages' },
      { name: 'FAQ', description: 'Frequently asked questions' },
      { name: 'Settings', description: 'App settings management' },
      { name: 'Dashboard', description: 'Admin dashboard & analytics' },
    ],
  },
  apis: [
    './src/modules/**/*.routes.js',
    './src/modules/**/*.swagger.js',
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;

