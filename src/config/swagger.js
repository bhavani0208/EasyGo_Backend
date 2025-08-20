import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Employee Routing & Notification API",
      version: "1.0.0",
      description:
        "Multi-tenant hierarchy with routing, invitations, and notifications",
    },
    servers: [{ url: "http://localhost:5000/api" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"], // we’ll annotate routes as we add them
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerMiddleware = [
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
];
