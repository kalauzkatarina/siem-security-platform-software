import { Request, Response, NextFunction } from "express";

export const enrichRequestWithUserId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (req.user) {
      if (!req.body.userId && req.user.user_id) {
        req.body.userId = req.user.user_id;
      }
      
      if (!req.body.userRole && req.user.role !== undefined) {
        req.body.userRole = roleNumberToString(req.user.role);
      }
    }

    next();
  } catch (error) {
    next();
  }
};

function roleNumberToString(role: number): string {
  const roleMap: Record<number, string> = {
    0: "ADMIN",
    1: "SYSADMIN",
    2: "ANALYTICS_MANAGER",
    3: "ANIMATION_WORKER",
    4: "AUDIO_STAGIST",
    5: "PROJECT_MANAGER"
  };
  
  return roleMap[role] || "REGULAR";
}