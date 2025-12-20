import { Request, Response, Router } from "express";
import { IGatewayService } from "../../Domain/services/IGatewayService";
import { authorize, ROLES } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class UserGatewayController {
  private readonly router: Router;

  constructor(private readonly gatewayService: IGatewayService, private readonly authenticate: any) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/users",
      this.authenticate,
      authorize(ROLES.ADMIN),
      this.getAllUsers.bind(this)
    );
    this.router.get(
      "/users/:id",
      this.authenticate,
      authorize(ROLES.ADMIN, ROLES.PROJECT_MANAGER),
      this.getUserById.bind(this)
    );
  }

  private async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.gatewayService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (!req.user || req.user.user_id !== id) {
        res.status(401).json({ message: "You can only access your own data!" });
        return;
      }

      const user = await this.gatewayService.getUserById(id);
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ message: (err as Error).message });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
