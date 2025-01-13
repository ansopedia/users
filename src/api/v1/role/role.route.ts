import { Router } from "express";

import { checkPermission, validateAccessToken } from "@/middlewares";

import { createRole, deleteRole, getRoles } from "./role.controller";

const router = Router();

router.post("/roles", validateAccessToken, checkPermission(["create-roles"]), createRole);
router.get("/roles", validateAccessToken, checkPermission(["view-roles"]), getRoles);
router.delete("/roles/:roleId", validateAccessToken, checkPermission(["delete-roles"]), deleteRole);

export { router as roleRoutes };
