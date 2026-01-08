// Hook será implementado na Phase 3
// Responsável por gerenciar permissões do navegador

export const usePermissions = () => {
  // TODO: Implementar na Phase 3
  return {
    requestMicrophonePermission: async () => console.log("usePermissions: request"),
    hasPermission: false,
    permissionState: "prompt",
    error: null,
  };
};
