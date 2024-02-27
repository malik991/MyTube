import React, { useState, useEffect } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import dbServiceObj from "../../apiAccess/confYoutubeApi";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../store/snackbarSlice";

function AddToPlaylistDialog({ open, onClose, videoId }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, settotalPages] = useState("");
  const [circularLoading, setCircularLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch user playlists when the dialog opens
    if (open) {
      fetchUserPlaylists(currentPage);
    }
  }, [open, currentPage]);

  const fetchUserPlaylists = async (page) => {
    try {
      setError("");
      const userPlaylists = await dbServiceObj.getUserPlaylist(page);

      if (userPlaylists) {
        const { totalPages } = userPlaylists;
        setPlaylists(userPlaylists.docs);
        settotalPages(totalPages);
      }
    } catch (error) {
      setError(error.response?.data.message);
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
      setError("");
      setCircularLoading(true);
      //Add the video to each selected playlist
      const res = await Promise.all(
        selectedPlaylists.map((playlistId) =>
          dbServiceObj.addVideoIntoPlaylist(videoId, playlistId)
        )
      );
      // console.log("playList; ", selectedPlaylists, "cideoId: ", videoId);
      if (res) {
        dispatch(openSnackbar(`Video added successfully.😊`));
        onClose();
      }
    } catch (error) {
      console.error(
        "Error adding video to playlist:",
        error.response.data.message
      );
      setError(error.response?.data.message);
    } finally {
      setCircularLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      {circularLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <ConfirmationDialog
          open={open}
          onClose={onClose}
          onConfirm={handleAddToPlaylist}
          title="Add to Playlist"
          message={
            <>
              {error && (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
              )}
              {playlists.length === 0 ? (
                <>
                  <Typography variant="body1">
                    You don't have any playlists yet.
                  </Typography>
                  <Link to="/playlist" className="text-red-500 underline">
                    Create a playlist
                  </Link>
                </>
              ) : (
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
              )}
            </>
          }
          hideButtons={playlists.length === 0}
        />
      )}
    </>
  );
}

export default AddToPlaylistDialog;
