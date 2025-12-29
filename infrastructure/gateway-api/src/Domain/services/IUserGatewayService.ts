import { UserDTO } from "../DTOs/UserDTO";

export interface IUserGatewayService {
  getAllUsers(): Promise<UserDTO[]>;
  getUserById(id: number): Promise<UserDTO>;
}