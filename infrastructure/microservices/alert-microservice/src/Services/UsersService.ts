/*import { Repository } from "typeorm";
import { IUsersService } from "../Domain/services/IUsersService";
import { Alert } from "../Domain/models/Alert";
import { AlertDTO } from "../Domain/DTOs/AlertDTO";

export class UsersService implements IUsersService {
  constructor(private userRepository: Repository<Alert>) {}

   // Get all users
  async getAllUsers(): Promise<AlertDTO[]> {
    const users = await this.userRepository.find();
    return users.map(u => this.toDTO(u));
  }

   // Get user by ID
  async getUserById(id: number): Promise<AlertDTO> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error(`User with ID ${id} not found`);
    return this.toDTO(user);
  }

   // Convert User entity to UserDTO
  private toDTO(user: Alert): AlertDTO {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage ?? "",
    };
  }
}*/
