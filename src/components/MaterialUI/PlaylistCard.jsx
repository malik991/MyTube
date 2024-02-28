import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Checkbox,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlayLists } from "../../store/playListSlice";
import Pagination from "@mui/material/Pagination";
import VideoDialog from "./VideoDialog";
import SkeletonVariants from "./Skeleton";
import DividerText from "./DividerWithText";
import CustomeIcons from "./AddCircleIcon";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dbServiceObj from "../../apiAccess/confYoutubeApi";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ConfirmationDialog from "./ConfirmationDialog";
import { openSnackbar, closeSnackbar } from "../../store/snackbarSlice";
import CustomSnackbar from "../CustomSnackbar";
import DialogForm from "./DialogForm";

const PlaylistCard = ({ loading }) => {
  //const { userPlayLists, totalPages } = useSelector((state) => state.playlist);

  const { message } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [refreshPlaylist, setRefreshPlaylist] = useState(false);
  const [cusError, setCusError] = useState("");
  const [circularLoading, setCircularLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loadPlaylist, setLoadPlaylist] = useState(null);
  const [fetchedUserPlayLists, setFetchedUserPlayLists] = useState([]);
  const [fetchedTotalPages, setFetchedTotalPages] = useState(0);

  const [checkedState, setCheckedState] = useState({});
  const handleCheckboxChange = (event, playlistId) => {
    const { checked } = event.target;
    setCheckedState((prevState) => ({
      ...prevState,
      [playlistId]: checked,
    }));
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, refreshPlaylist, circularLoading]);

  const fetchData = async (page) => {
    dispatch(fetchPlayLists(page)) // Start fetching playlists
      .then((response) => {
        //console.log("Playlists fetched successfully: ", response.payload.docs);
        setFetchedUserPlayLists(response.payload.docs);
        setFetchedTotalPages(response.payload.totalPages);
      })
      .catch((error) => {
        console.log("Error in fetching playlists: ", error);
      });
  };

  const handleCardClick = (playlist) => {
    setSelectedPlaylist(playlist);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async (playlist) => {
    try {
      setCusError("");
      setCircularLoading(true);

      const res = await dbServiceObj.deletePlaylist(playlist?._id);
      if (res) {
        dispatch(openSnackbar(`PlayList deleted successfully.😊`));
      }
    } catch (error) {
      console.log("eror delete playlist in playlistCard.jsx: ", error);
      setCircularLoading(false);
      setCusError(error.response?.data.message);
    } finally {
      setCircularLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const handleEditPlayList = async (playlist) => {
    if (playlist) {
      setLoadPlaylist(playlist);
      setFormDialogOpen(true);
    }
  };

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  const handleCreatePlaylist = () => {
    //console.log("hello");
    setFormDialogOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= fetchedTotalPages) {
      setCurrentPage(newPage);
    }
  };

  const onSuccess = async () => {
    setRefreshPlaylist((prevState) => !prevState); // Toggle the state to trigger useEffect
    // await fetchData(currentPage); // Fetch updated playlist data
    //console.log("submit sucess: ", fetchedUserPlayLists);
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-wrap justify-center items-center">
          <SkeletonVariants />
        </div>
      ) : (
        <>
          {message && (
            <div className=" flex justify-center items-center py-2">
              <CustomSnackbar handleClose={handleClose} />
            </div>
          )}
          <div className=" flex justify-center items-center py-2">
            <CustomeIcons onClick={() => handleCreatePlaylist()} />
          </div>
          <div className=" py-4">
            <DividerText text="click on ➕ button to create Playlist" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cusError && (
              <p style={{ color: "red", textAlign: "center" }}>{cusError}</p>
            )}

            {fetchedUserPlayLists?.map((playlist) => (
              <div
                className="relative group overflow-hidden transition duration-300 transform hover:scale-105"
                key={playlist._id}
              >
                <Card className="border border-purple-200">
                  <CardHeader
                    className="bg-cyan-200"
                    avatar={
                      <Avatar
                        src={playlist.owner.avatar}
                        alt="Owner Avatar"
                        sx={{ width: 40, height: 40 }}
                      />
                    }
                    title={playlist.name}
                    subheader={playlist.description}
                    action={
                      <Checkbox
                        checked={checkedState[playlist._id] || false}
                        onChange={(event) =>
                          handleCheckboxChange(event, playlist._id)
                        }
                        color="primary"
                        inputProps={{ "aria-label": "select playlist" }}
                      />
                    }
                  />
                  {checkedState[playlist._id] && (
                    <div className="edit-delete-icons">
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEditPlayList(playlist)}
                      >
                        <EditIcon style={{ color: "red", fontSize: "32px" }} />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={handleOpenDeleteDialog}
                      >
                        <DeleteIcon
                          style={{ color: "red", fontSize: "32px" }}
                        />
                      </IconButton>
                      <ConfirmationDialog
                        open={openDeleteDialog}
                        onClose={handleCloseDeleteDialog}
                        onConfirm={() => handleConfirmDelete(playlist)}
                        title="Confirm Deletion"
                        message="Are you sure you want to delete this playlist?"
                      />
                    </div>
                  )}
                  {circularLoading ? (
                    <Box display="flex" justifyContent="center">
                      <CircularProgress />
                    </Box>
                  ) : (
                    <CardMedia
                      style={{
                        height: playlist.coverImage ? "250px" : "0", // Adjust the height based on the presence of cover image
                        paddingTop: playlist.coverImage ? "0" : "56.25%", // Set the padding top dynamically
                        position: "relative",
                        cursor: "pointer",
                      }}
                      title={playlist.name}
                      onClick={() => handleCardClick(playlist)}
                    >
                      {playlist.coverImage ? (
                        <img
                          src={playlist.coverImage}
                          alt={playlist.name}
                          style={{
                            //padding: "1px",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <IconButton>
                            <AddPhotoAlternateIcon />
                          </IconButton>
                        </div>
                      )}
                    </CardMedia>
                  )}

                  <CardContent className="bg-slate-400">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      Click the card to view videos in this playlist.
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex justify-center mt-4">
        {fetchedTotalPages > 1 && (
          <Pagination
            count={fetchedTotalPages}
            page={currentPage}
            size="large"
            color="secondary"
            onChange={(event, page) => handlePageChange(page)}
          />
        )}
      </div>
      <VideoDialog
        open={dialogOpen}
        handleClose={() => {
          setDialogOpen(false);
          setSelectedPlaylist(null);
        }}
        playlist={selectedPlaylist}
        onSuccess={onSuccess}
      />
      {/* {console.log("refresh: ", refreshPlaylist)} */}
      <DialogForm
        open={formDialogOpen}
        handleClose={() => {
          setFormDialogOpen(false);
          setLoadPlaylist(null);
        }}
        //onSuccess={() => setRefreshPlaylist((prevState) => !prevState)}
        onSuccess={onSuccess}
        initialData={loadPlaylist}
      />
    </>
  );
};

export default PlaylistCard;
