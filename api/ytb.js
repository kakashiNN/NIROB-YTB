const express = require('express');
const axios = require('axios');
const app = express();

// Replace this with your actual YouTube API key
const YOUTUBE_API_KEY = 'AIzaSyCrbVO6J2e5xG4g11igE5wG35sWhDHNsAc';

app.get('/video', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ status: 'error', message: 'Missing url parameter' });
  }

  // Extract video ID from the URL (assuming it's a YouTube URL)
  const videoId = extractVideoId(url);
  
  if (!videoId) {
    return res.status(400).json({ status: 'error', message: 'Invalid YouTube URL' });
  }

  try {
    // Make request to YouTube Data API to get video details
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',  // Specify what info you want
        id: videoId,
        key: AIzaSyCrbVO6J2e5xG4g11igE5wG35sWhDHNsAc
      }
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }

    // Extract the direct video URL (YouTube embed URL or standard URL)
    const video = response.data.items[0];
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;  // Standard YouTube URL
    
    // Send only the direct video URL back to the client
    res.json({ videoUrl });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'An error occurred' });
  }
});

// Utility function to extract video ID from URL
function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S+?[\?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

app.listen(3000, () => { 
  console.log("API is running on http://localhost:3000"); 
});
