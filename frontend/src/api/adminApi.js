import API from "./axios";

// Get all active users
export const getUsers = () =>
  API.get("/admin/users/");

// Soft delete user
export const deleteUser = (id) =>
  API.delete(`/admin/delete-user/${id}/`);

// Get deleted users
export const getDeletedUsers = () =>
  API.get("/admin/deleted-users/");

// Restore deleted user
export const restoreUser = (id) =>
  API.patch(`/admin/restore-user/${id}/`);

// Ban/unban user
export const banUnbanUser = (id) =>
  API.patch(`/admin/ban-user/${id}/`);