// Helper function to extract YouTube thumbnail
function getYoutubeThumbnail(url: string) {
  try {
    const videoId = new URL(url).searchParams.get("v");
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  } catch {
    return "/images/default-thumbnail.jpg"; // fallback image
  }
}

export default getYoutubeThumbnail;