export function extractYouTubeVideoId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex for YouTube URLs
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
}

export interface VideoMetadata {
  videoId: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
}

export async function fetchYouTubeMetadata(urlOrId: string): Promise<VideoMetadata> {
  const videoId = extractYouTubeVideoId(urlOrId);
  if (!videoId) {
    throw new Error('URL de YouTube no válida. Asegúrate de incluir el enlace completo o el ID del video.');
  }

  const standardThumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    // Try noembed first (reliable CORS support)
    const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(youtubeUrl)}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.title) {
        // Clean title if it contains artist - song pattern
        const fullTitle = data.title;
        let artist = data.author_name || 'YouTube Music';
        let title = fullTitle;

        if (fullTitle.includes(' - ')) {
          const parts = fullTitle.split(' - ');
          artist = parts[0].trim();
          title = parts.slice(1).join(' - ').trim();
        }

        return {
          videoId,
          title,
          artist,
          thumbnailUrl: data.thumbnail_url || standardThumb,
        };
      }
    }
  } catch (err) {
    console.warn('Could not fetch from noembed, falling back to defaults', err);
  }

  // Fallback defaults
  return {
    videoId,
    title: `Canción de YouTube (${videoId})`,
    artist: 'Artista Desconocido',
    thumbnailUrl: standardThumb,
  };
}
