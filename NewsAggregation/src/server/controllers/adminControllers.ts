import { AdminService } from "../services/adminService.ts";

export class AdminController {
  private service = new AdminService();

  async getExternalServers(req: any, res: any) {
    try {
      const servers = await this.service.getExternalServers();
      res.json(servers);
    } catch (err) {
      console.error("Error fetching servers:", err);
      res.status(500).json({ error: "Failed to fetch servers" });
    }
  }

  async updateExternalServer(req: any, res: any) {
    const { id } = req.params;

    try {
      await this.service.updateExternalServer(id, req.body);
      res.json({ message: "Server updated successfully" });
    } catch (err: any) {
      const message = err.message || "Failed to update server";
      const status = message === "No fields provided for update" ? 400 : 500;
      console.error("Error updating server:", err);
      res.status(status).json({ error: message });
    }
  }

  async addCategory(req: any, res: any) {
  try {
    const { name } = req.body;
    await this.service.addCategory(name);
    res.status(201).json({ message: "Category added successfully" });
  } catch (err: any) {
    console.error("Error adding category:", err);
    res.status(400).json({ error: err.message || "Failed to add category" });
  }
}
}
