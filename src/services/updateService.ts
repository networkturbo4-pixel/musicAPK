export interface UpdateInfo {
  version: string;
  versionCode: number;
  releaseDate: string;
  downloadUrl: string;
  releaseNotes: string;
  isMandatory?: boolean;
}

export interface UpdateCheckResult {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  updateInfo: UpdateInfo | null;
  error?: string;
}

export const APP_CURRENT_VERSION = '1.0.0';
export const APP_CURRENT_VERSION_CODE = 1;
export const GITHUB_REPO = 'networkturbo4-pixel/musicAPK';

export function compareVersions(v1: string, v2: string): number {
  // Returns > 0 if v1 > v2, < 0 if v1 < v2, 0 if equal
  const parts1 = v1.replace(/^v/, '').split('.').map((p) => parseInt(p, 10) || 0);
  const parts2 = v2.replace(/^v/, '').split('.').map((p) => parseInt(p, 10) || 0);
  const maxLen = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLen; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

export async function checkForUpdates(): Promise<UpdateCheckResult> {
  const versionUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/version.json?nocache=${Date.now()}`;

  try {
    const response = await fetch(versionUrl, { cache: 'no-store' });
    if (response.ok) {
      const data: UpdateInfo = await response.json();
      const hasUpdate =
        (data.versionCode && data.versionCode > APP_CURRENT_VERSION_CODE) ||
        compareVersions(data.version, APP_CURRENT_VERSION) > 0;

      return {
        hasUpdate,
        currentVersion: APP_CURRENT_VERSION,
        latestVersion: data.version,
        updateInfo: data,
      };
    }
  } catch (err) {
    console.warn('Error fetching raw version.json, trying GitHub Releases API...', err);
  }

  // Fallback: Check GitHub Releases API
  try {
    const releaseApiUrl = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
    const response = await fetch(releaseApiUrl, {
      headers: { Accept: 'application/vnd.github.v3+json' },
      cache: 'no-store',
    });

    if (response.ok) {
      const release = await response.json();
      const tagName = release.tag_name || '1.0.0';
      const cleanTag = tagName.replace(/^v/, '');
      const hasUpdate = compareVersions(cleanTag, APP_CURRENT_VERSION) > 0;

      // Find .apk asset
      const apkAsset = release.assets?.find((a: any) =>
        a.name.endsWith('.apk')
      );
      const downloadUrl =
        apkAsset?.browser_download_url ||
        `https://github.com/${GITHUB_REPO}/releases/latest/download/Soundify.apk`;

      const updateInfo: UpdateInfo = {
        version: cleanTag,
        versionCode: APP_CURRENT_VERSION_CODE + (hasUpdate ? 1 : 0),
        releaseDate: release.published_at ? release.published_at.split('T')[0] : 'Hoy',
        downloadUrl,
        releaseNotes: release.body || 'Nueva versión con mejoras de rendimiento y estabilidad.',
      };

      return {
        hasUpdate,
        currentVersion: APP_CURRENT_VERSION,
        latestVersion: cleanTag,
        updateInfo: hasUpdate ? updateInfo : null,
      };
    }
  } catch (err: any) {
    return {
      hasUpdate: false,
      currentVersion: APP_CURRENT_VERSION,
      latestVersion: APP_CURRENT_VERSION,
      updateInfo: null,
      error: 'No se pudo conectar con el servidor de actualizaciones de GitHub.',
    };
  }

  return {
    hasUpdate: false,
    currentVersion: APP_CURRENT_VERSION,
    latestVersion: APP_CURRENT_VERSION,
    updateInfo: null,
  };
}
