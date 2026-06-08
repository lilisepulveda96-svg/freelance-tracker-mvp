import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createCustomerSchema, updateCustomerSchema } from "./customers.schema";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "./customers.controller";

export const customersRouter = Router();

customersRouter.use(authMiddleware);

customersRouter.get("/", getCustomers);
customersRouter.get("/:id", getCustomer);
customersRouter.post("/", validate(createCustomerSchema), createCustomer);
customersRouter.put("/:id", validate(updateCustomerSchema), updateCustomer);
customersRouter.delete("/:id", deleteCustomer);
