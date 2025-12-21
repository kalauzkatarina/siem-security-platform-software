import { NextFunction, Request, Response } from "express";
import { validateEventData } from "../validators/EventValidator";
import { validateEventId, validateEventIdArray, validateEventsIdRange } from "../validators/EventIdValidator";

export function validateEventBody(req: Request, res: Response, next: NextFunction): void {
  const validation = validateEventData(req.body);
  if (!validation.success) {
    res.status(400).json({ success: false, message: validation.message });
    return;
  }
  next();
}

export function validateEventIdParam(req: Request, res: Response, next: NextFunction): void {
  const id = Number(req.params.id);
  const validation = validateEventId(id);
  if (!validation.success) {
    res.status(400).json({ success: false, message: validation.message });
    return;
  }
  next();
}

export function validateEventIdsArrayBody(req: Request, res: Response, next: NextFunction): void {
  const validation = validateEventIdArray(req.body);
  if (!validation.success) {
    res.status(400).json({ success: false, message: validation.message });
    return;
  }
  next();
}

export function validateEventRangeParams(req: Request, res: Response, next: NextFunction): void {
  const fromId = Number(req.params.fromId);
  const toId = Number(req.params.toId);
  const validation = validateEventsIdRange(fromId, toId);
  if (!validation.success) {
    res.status(400).json({ success: false, message: validation.message });
    return;
  }
  next();
}
