/** Name of the virtual audio source created by the desktop shell (must match it) */
export const virtualSinkName = "stoat-virtual-source";

export async function getVirtmic() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevice = devices.find(
      ({ label }) => label.split(":").pop() === virtualSinkName,
    );
    return audioDevice?.deviceId;
  } catch {
    return null;
  }
}
