import React, { useState, useEffect } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import dbServiceObj from "../../apiAccess/confYoutubeApi";
import Pagination from "@mui/material/Pagination";

function AddToPlaylistDialog({ open, onClose, videoId }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, settotalPages] = useState("");

  useEffect(() => {
    // Fetch user playlists when the dialog opens
    if (open) {
      fetchUserPlaylists(currentPage);
    }
  }, [open, currentPage]);

  const fetchUserPlaylists = async (page) => {
    try {
      const userPlaylists = await dbServiceObj.getUserPlaylist(page);

      if (userPlaylists) {
        const { totalPages } = userPlaylists;
        setPlaylists(userPlaylists.docs);
        settotalPages(totalPages);
      }
    } catch (error) {
      console.error("Error user playlists Dialog in addtoPlalist.jsx:", error);
    }
  };

  const handleCheckboxChange = (playlistId) => {
    setSelectedPlaylists((prevSelected) => {
      // Check if the clicked playlist is already selected
      const isSelected = prevSelected.includes(playlistId);
      return isSelected
        ? prevSelected.filter((id) => id !== playlistId)
        : [...prevSelected, playlistId];

      // If the clicked playlist is already selected, remove it
      // Otherwise, add it to the selected playlists
      //   const newSelectedPlaylists = isSelected
      //     ? prevSelected.filter((id) => id !== playlistId)
      //     : [...prevSelected, playlistId];
      //console.log(newSelectedPlaylists); // Log the updated selectedPlaylists
      //return newSelectedPlaylists;
    });
  };

  const handleAddToPlaylist = async () => {
    try {
      //Add the video to each selected playlist
      await Promise.all(
        selectedPlaylists.map((playlistId) =>
          dbServiceObj.addVideoIntoPlaylist(videoId, playlistId)
        )
      );
      console.log("playList; ", selectedPlaylists, "cideoId: ", videoId);
      // Close the dialog after adding the video
      onClose();
    } catch (error) {
      console.error("Error adding video to playlist:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setCurrentPage(newPage);
    }
  };

  return (
    <ConfirmationDialog
      open={open}
      onClose={onClose}
      onConfirm={handleAddToPlaylist}
      title="Add to Playlist"
      message={
        <>
          <List>
            {playlists.map((playlist) => (
              <ListItem
                key={playlist._id}
                dense
                onClick={() => handleCheckboxChange(playlist._id)}
              >
                <Checkbox
                  edge="start"
                  checked={selectedPlaylists.includes(playlist._id)}
                  tabIndex={-1}
                />
                <ListItemText primary={playlist.name} />
              </ListItem>
            ))}
          </List>
          <div className="flex justify-center mt-4">
            {totalPage > 1 && (
              <Pagination
                count={totalPage}
                page={currentPage}
                size="large"
                color="secondary"
                onChange={(event, page) => handlePageChange(page)}
              />
            )}
          </div>
        </>
      }
    />
  );
}

export default AddToPlaylistDialog;
