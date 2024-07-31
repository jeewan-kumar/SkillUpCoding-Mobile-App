import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import YoutubePlayer from "react-native-youtube-iframe";

const WebViewScreen = ({ navigation, route }) => {
  const { videoUrl } = route.params;
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  let videoId = '';

  // Check if videoUrl is a valid YouTube URL and extract videoId
  if (videoUrl.includes('youtube.com')) {
    const urlParams = new URLSearchParams(videoUrl.split('?')[1]);
    videoId = urlParams.get('v');
  } else {
    videoId = videoUrl; // If videoUrl is already videoId
  }

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("Video has finished playing!");
    } else if (state === "playing") {
      setLoading(false); // Video is playing, hide loader
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    setLoading(false); // Set loading to true when video URL changes
  }, [videoUrl]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} style={styles.backIcon} />
        <Text style={styles.backText}>Back to Video List</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <YoutubePlayer
        height={260}
        play={playing}
        videoId={videoId} // Use extracted videoId here
        onChangeState={onStateChange}
      />
      <TouchableOpacity onPress={togglePlaying} style={[styles.playButton, { marginTop: 10 }]}>
        <Text style={styles.playButtonText}>{playing ? "Pause" : "Play"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  backText: {
    fontSize: 18,
    color: '#007AFF',
    marginLeft: 10,
  },
  playButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  playButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default WebViewScreen;
