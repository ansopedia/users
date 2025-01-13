import { Router } from "express";

import { assignUserRoles, createUserRole, removeUserRole } from "./user-role.controller";

const router = Router();

router.post("/user-role", createUserRole);
router.post("/users/:userId/roles", assignUserRoles);
router.delete("/users/:userId/roles/:roleId", removeUserRole);

export { router as userRoleRoutes };
