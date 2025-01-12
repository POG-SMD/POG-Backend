const express = require("express");
const app = express();
const limiter = require("./shared/middlewares/rateLimit");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

const loginRoutes = require("./routes/loginRoutes");

const updateRoutes = require("./routes/updateRoutes");

const linkRoutes = require("./routes/admin/linkRoutes");

const materialRoutes = require("./routes/admin/materialRoutes");

const reservationRoutes = require("./routes/admin/reservationRoutes");

app.use("/api/v1/login", loginRoutes);
app.use("/api/v1/update", updateRoutes);
app.use("/api/v1/material", materialRoutes);
app.use("/api/v1/link", linkRoutes);
app.use("/api/v1/reservation", reservationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Erro interno do servidor");
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "POG-API",
      version: "1.0.0",
      description: "POG-API",
      contact: {
        name: "Célula Multimidia",
      },
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/**/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
