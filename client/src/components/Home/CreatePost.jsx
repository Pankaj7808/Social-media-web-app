import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Avatar,
  TextField,
  Button,
  IconButton,
  Modal,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CloseIcon from "@mui/icons-material/Close";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";

const PostInput = ({ createPost, getTimeline, user }) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle emoji picker click
  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (images.length + files.length > 3) {
      alert("You can upload a maximum of 3 images.");
      return;
    }
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  // Remove an image
  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Fetch location suggestions from Nominatim API
  const handleLocationSearch = async (query) => {
    if (!query) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`
      );

      // Extract address from response
      const suggestions = response.data.map((item) => ({
        name: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }));

      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  // Select a location from the suggestions
  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setLocationSuggestions([]);
    setSearchQuery("");
    setOpenLocationModal(false); // Close the modal after selecting location
  };

  const handlePostSubmit = async () => {
    setIsPosting(true);

    const formData = new FormData();
    formData.append("userId", user?._id);
    formData.append("desc", text);
    formData.append("location", location);


    images.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file);
      }
    });

    try {
      await createPost(formData);
      setText("");
      setImages([]);
      setLocation("");
      await getTimeline(user?._id);
    } catch (error) {
      console.error("Error posting:", error);
    }finally{
      setIsPosting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target) &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        padding: 1,
        backgroundColor: "#fff",
        borderRadius: 1,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
        position: "relative",
        marginTop: 1,
        width: "550px",
        gap: 1.5,
        marginBottom: "8px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Avatar
          alt={user?.name}
          src="/static/images/avatar/1.jpg"
          sx={{ marginRight: "10px" }}
        />
        <TextField
          fullWidth
          placeholder="What's on your mind?"
          variant="outlined"
          size="small"
          value={text}
          multiline
          rows={2}
          onChange={(e) => setText(e.target.value)}
          sx={{
            backgroundColor: "#fff",
            borderRadius: "5px",
            fontFamily: "'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", marginLeft: "10px" }}>
          <IconButton onClick={() => fileInputRef.current.click()}>
            <ImageIcon />
          </IconButton>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <IconButton onClick={() => setOpenLocationModal(true)}>
            <LocationOnIcon />
          </IconButton>
          <IconButton
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <EmojiEmotionsIcon />
          </IconButton>
        </Box>
        {showEmojiPicker && (
          <Box
          ref={emojiPickerRef}
            sx={{
              position: "absolute",
              top: "60px",
              left: emojiButtonRef.current
                ? emojiButtonRef.current.offsetLeft - 10
                : "10px",
              zIndex: 1000,
              boxShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </Box>
        )}
      </Box>

      {/* Display selected location aligned to the left */}
      {location && (
        <Box
          sx={{
            marginTop: 1,
            padding: 1,
            display: "flex",
            alignItems: "center",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            justifyContent: "flex-start",
          }}
        >
          <LocationOnIcon sx={{ marginRight: "5px", color: "#5267D3" }} />
          <Tooltip title={location} placement="top">
            <span
              style={{
                display: "inline-block",
                maxWidth: "80%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "#888",
              }}
            >
              {location}
            </span>
          </Tooltip>
          <IconButton
            size="small"
            onClick={() => setLocation("")}
            sx={{
              marginLeft: "10px",
              color: "#000",
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Modal for location search */}
      <Modal
        open={openLocationModal}
        onClose={() => setOpenLocationModal(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "400px",
            boxShadow: 24,
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleLocationSearch(e.target.value);
            }}
            sx={{
              marginBottom: "10px",
            }}
          />

          {/* Display location suggestions */}
          {locationSuggestions.length > 0 && (
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                maxHeight: "200px",
                overflowY: "scroll",
                backgroundColor: "#fff",
                boxShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              {locationSuggestions.map((suggestion, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #ccc",
                    ":hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                  onClick={() => handleLocationSelect(suggestion.name)}
                >
                  {suggestion.name}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Modal>

      {/* Display selected images aligned to the left */}
      {images.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: "10px",
            gap: "10px",
            justifyContent: "flex-start", // Align to left
          }}
        >
          {images.map((image) => (
            <Box
              key={image.id}
              sx={{
                position: "relative",
                width: "100px",
                height: "100px",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <img
                src={image.id}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <IconButton
                onClick={() => handleRemoveImage(image.id)}
                sx={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
      <Box display="flex" gap={2} alignSelf="flex-end">
        <Button
          variant="outlined"
          disableElevation
          disableRipple
          sx={{
            textTransform: "none",
            borderRadius: "20px",
            boxShadow: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          disableRipple
          onClick={handlePostSubmit}
          sx={{
            textTransform: "none",
            borderRadius: "20px",
            boxShadow: "none",
          }}
        >
          {isPosting?<CircularProgress color="#fff" size="16px"/>:"Post"}
        </Button>
      </Box>
    </Box>
  );
};

export default PostInput;
