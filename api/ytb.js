const axios = require('axios');

// Replace with your actual YouTube API key
const YOUTUBE_API_KEY = 'AIzaSyCrbVO6J2e5xG4g11igE5wG35sWhDHNsAc';

module.exports = async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ status: 'error', message: 'Missing title parameter' });
  }

  try {
    console.log(`Searching YouTube for: ${title}`);
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: title,
        type: 'video',
        key: YOUTUBE_API_KEY
      }
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }

    const video = response.data.items[0];
    const videoId = video.id.videoId;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    console.log(`Found video: ${videoUrl}`);
    
    res.status(200).json({ videoUrl, title: video.snippet.title });
    
  } catch (error) {
    console.error('Error occurred while fetching video data:', error.message);
    res.status(500).json({ status: 'error', message: 'An error occurred', details: error.message });
  }
};
