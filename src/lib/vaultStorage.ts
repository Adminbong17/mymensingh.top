/**
 * FileVault Storage Integration for Mymensingh.top
 * Automatically uploads media to https://api.bongbangla.top/vault-api
 * and returns the live public share link for database and display.
 */

// Permanent auth token for info@mymensingh.top (User ID: 14)
export const VAULT_API_BASE = 'https://api.bongbangla.top/vault-api';
export const VAULT_AUTH_TOKEN = '224935794ec432f5075ee5fc32278acc0bb132398693e2dbe7cf82aeb5851517';

export interface VaultUploadResponse {
  ok: boolean;
  id: number;
  share_token: string;
  url: string;
}

/**
 * Uploads any media file (image, photo, video, document) to FileVault
 * @param file The File object selected from file input or drag-and-drop
 * @returns Object with live public URL and share token
 */
export async function uploadMediaToVault(file: File): Promise<VaultUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${VAULT_API_BASE}/upload.php`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VAULT_AUTH_TOKEN}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    let msg = `Upload failed with HTTP ${res.status}`;
    try {
      const errJson = JSON.parse(errorText);
      if (errJson.error) msg = errJson.error;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  if (!data.ok || !data.share_token) {
    throw new Error(data.error || 'ফাইল আপলোড ব্যর্থ হয়েছে।');
  }

  const liveUrl = `${VAULT_API_BASE}/share.php?t=${data.share_token}`;

  return {
    ok: true,
    id: data.id,
    share_token: data.share_token,
    url: liveUrl,
  };
}
