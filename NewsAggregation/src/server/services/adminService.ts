import { AdminRepository } from "../repositories/adminRepository.ts";

export class AdminService {
  private repository = new AdminRepository();

  async getExternalServers() {
    return await this.repository.getExternalServers();
  }

  async updateExternalServer(id: string, updates: Record<string, any>) {
    if (!id) throw new Error("Missing server ID");
    await this.repository.updateExternalServer(id, updates);
  }

  async addCategory(name: string) {
  if (!name || !name.trim()) {
    throw new Error("Category name is required");
  }
  await this.repository.addCategory(name.trim());
}
}
