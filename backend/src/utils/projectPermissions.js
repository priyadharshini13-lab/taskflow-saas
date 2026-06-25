const getProjectRole = (project, userId) => {
  if (project.ownerId.toString() === userId.toString()) {
    return 'owner';
  }

  const member = project.members.find(
    (m) => m.userId.toString() === userId.toString()
  );

  return member?.role || null;
};

const canManageTasks = (role) => {
  return ['owner', 'editor'].includes(role);
};

module.exports = {
  getProjectRole,
  canManageTasks,
};