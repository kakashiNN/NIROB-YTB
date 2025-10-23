const express = require('express');
const axios = require('axios');
const app = express();

// Replace this with your actual YouTube API key
const YOUTUBE_API_KEY = 'AIzaSyCrbVO6J2e5xG4g11igE5wG35sWhDHNsAc';

app.get('/video', async (req, res) => {
  const { title } = req.query;
  
  if (!title) {
    return res.status(400).json({ status: 'error', message: 'Missing title parameter' });
  }

  try {
    // Make request to YouTube Data API to search for videos by title
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: title,  // Search query is the title
        type: 'video',  // Ensure we are searching for videos
        key: YOUTUBE_API_KEY
      }
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }

    // Get the first video result from the search
    const video = response.data.items[0];
    const videoId = video.id.videoId;  // Extract video ID from the search result
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;  // Construct the video URL

    // Send back the direct video URL
    res.json({ videoUrl, title: video.snippet.title });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'An error occurred' });
  }
});

app.listen(3000, () => { 
  console.log("API is running on http://localhost:3000"); 
});
