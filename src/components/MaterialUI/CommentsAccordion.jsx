import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { BootstrapTooltips } from "./CustomizedTooltips";
import { Avatar, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "./ConfirmationDialog";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { useSelector, useDispatch } from "react-redux";
import dbServiceObj from "../../apiAccess/confYoutubeApi";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { openSnackbar, closeSnackbar } from "../../store/snackbarSlice";
import CustomSnackbar from "../CustomSnackbar";

export default function CommentsAccordion({
  initialCommentsData,
  videoId,
  currentPage,
}) {
  //console.log("ini: ", initialCommentsData);
  const { message } = useSelector((state) => state.snackbar);
  const [commentsData, setCommentsData] = React.useState([]);
  const [openDeleteDialogs, setOpenDeleteDialogs] = React.useState({});
  const [isEditing, setIsEditing] = React.useState({});
  const [editedComments, setEditedComments] = React.useState({});
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [error, setError] = React.useState("");
  const [likesData, setLikesData] = React.useState({});
  const [likeBtn, setLikeBtn] = React.useState(false);
  const [replyBtn, setReplyBtn] = React.useState({});
  const [userReply, setUserReply] = React.useState("");
  const [isReplyDone, setIsReplyDone] = React.useState(false);
  const [circularLoading, setCircularLoading] = React.useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    console.log("useEffect called");

    fetchData(videoId, currentPage);
  }, [initialCommentsData, isReplyDone]);

  const fetchData = async (videoId) => {
    const initialEditedComments = {};
    setCircularLoading(true);

    try {
      if (isReplyDone) {
        //console.log("videoId: ", videoId, "page: ", currentPage);
        const updatedData = await dbServiceObj.getCommentsByVideoId(
          videoId,
          currentPage
        );
        updatedData?.data?.data.docs.forEach((comment) => {
          initialEditedComments[comment._id] =
            comment.content || comment.replyContent;
        });
        setEditedComments(initialEditedComments);
        setCommentsData(updatedData?.data?.data.docs);
        //setIsReplyDone(!isReplyDone);
      } else {
        initialCommentsData.forEach((comment) => {
          initialEditedComments[comment._id] =
            comment.content || comment.replyContent;
        });
        setEditedComments(initialEditedComments);
        setCommentsData(initialCommentsData);
      }
    } catch (error) {
      console.log("error while fetch data from comments: ", error);
      setError(error.response?.data?.message);
      setCircularLoading(false);
    } finally {
      setCircularLoading(false);
    }
  };

  const handleEdit = (commentId) => {
    console.log("edit click: ", commentId);
    setIsEditing((prev) => ({ ...prev, [commentId]: true }));
    // Perform edit action or toggle edit mode here
  };

  const handleCloseEdit = (commentId) => {
    console.log("close reply: ", commentId);
    setIsEditing((prev) => ({ ...prev, [commentId]: false }));
  };

  const handleUpdate = async (commentId) => {
    setError("");
    setIsEditing((prev) => ({ ...prev, [commentId]: false }));
    console.log("Update comment with ID:", commentId);
    setCircularLoading(true);
    try {
      const updatedContent = editedComments[commentId];
      if (!updatedContent) {
        setError("Please write a comment");
        return;
      }
      // Perform the update action
      const result = await dbServiceObj.updateComment(
        commentId,
        updatedContent
      );
      const newContent =
        result.data?.data?.content || result.data?.data?.replyContent;
      dispatch(openSnackbar(`Comment updated successfully.😊`));
      // Update the comments data array
      setCommentsData((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, content: newContent }
            : comment
        )
      );
    } catch (error) {
      console.log("Error updating comment: ", error);
      setError(error.response?.data?.message);
      setCircularLoading(false);
    } finally {
      setCircularLoading(false);
    }
  };

  const handleConfirmDelete = async (commentId) => {
    //console.log("Delete comment with ID:", commentId);
    setError("");
    setOpenDeleteDialogs((prev) => ({ ...prev, [commentId]: false }));
    setCircularLoading(true);
    try {
      if (commentId) {
        const res = await dbServiceObj.deleteComment(commentId);
        if (res) {
          // Update the comments data array
          setCommentsData(
            (prevComments) =>
              prevComments
                .map((comment) => (comment._id === commentId ? null : comment))
                .filter(Boolean) // Filter out null values to remove deleted comment
          );
          dispatch(openSnackbar(`Comment Deleted successfully.🚮`));
        }
      }
    } catch (error) {
      console.log("delete comment: ", error);
      setError(error.response?.data?.message);
      setCircularLoading(false);
    } finally {
      setCircularLoading(false);
    }
  };

  const handleOpenDeleteDialog = (commentId) => {
    console.log("delte: ", commentId);
    setOpenDeleteDialogs((prev) => ({ ...prev, [commentId]: true }));
  };

  const handleCloseDeleteDialog = (commentId) => {
    setOpenDeleteDialogs((prev) => ({ ...prev, [commentId]: false }));
  };

  const handleChangeInput = (e, commentId) => {
    const { value } = e.target;
    if (value.length <= 90) {
      setError("");
      setEditedComments((prev) => ({
        ...prev,
        [commentId]: value,
      }));
    } else {
      setError("cannot exceed more than 90 words");
      // Display a message or handle the case when the comment exceeds 90 characters
      // For example, you can set an error state to display an error message.
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  };

  const handleLike = async (commentId) => {
    if (!authStatus) {
      alert("please login");
      return;
    }
    setError("");
    setLikeBtn(!likeBtn);

    try {
      const response = await dbServiceObj.toggleCommentLikes(commentId);
      if (response?.data?.data?.likedBy) {
        // console.log("likedata: ", response?.data?.message);
        setLikesData((prevLikesData) => ({
          ...prevLikesData,
          [commentId]: (prevLikesData[commentId] || 0) + 1, // Increment by 1
        }));
      } else {
        // console.log("Dislikedata: ", response?.data?.message);
        setLikesData((prevLikesData) => ({
          ...prevLikesData,
          [commentId]: (prevLikesData[commentId] || 0) - 1, // Decrement by 1
        }));
      }
    } catch (error) {
      console.error("Error liking comment:", error);
      setError(error.response?.data?.message);
      setLikeBtn(false);
    }
  };

  const handleLikeDataOnExpand = async (commentId) => {
    setError("");
    try {
      const response = await dbServiceObj.getLikesByCommentId(commentId);
      const updatedLikes = { ...likesData };
      updatedLikes[commentId] = response?.data?.data[0]?.totalLikes || 0;
      setLikesData(updatedLikes);
    } catch (error) {
      console.log("get like comments: ", error);
      setError(error.response?.data?.message);
    }
  };

  const handleOpenReply = (commentId) => {
    setReplyBtn((prev) => ({ ...prev, [commentId]: true }));
  };

  const handleParentReplyChange = (e) => {
    if (!authStatus) {
      alert("please login for enter reply");
      return;
    } else {
      const { value } = e.target;
      if (value.length <= 90) {
        setError("");
        setUserReply(value);
      } else {
        setError("cannot exceed more than 90 words");
      }
    }
  };

  const handleSubmitReply = async (comment) => {
    setReplyBtn((prev) => ({ ...prev, [comment._id]: false }));
    setUserReply("");
    setError("");
    let result = null;
    if (userReply) {
      setCircularLoading(true);
      try {
        // for Parent reply and nested reply
        if (comment?.parentCommentId || comment?.parentReply) {
          // console.log("parent reply: ", comment.parentCommentId);
          // console.log("child reply: ", comment._id);
          result = await dbServiceObj.addReply(
            comment?.parentCommentId,
            userReply,
            comment._id
          );
          if (result) {
            dispatch(openSnackbar(`Reply added successfully.😊`));
          }
        } else if (comment) {
          console.log("reply to main comment");
          result = await dbServiceObj.addReply(comment?._id, userReply, "");
          if (result) {
            setIsReplyDone(!isReplyDone);
            dispatch(openSnackbar(`Comment added successfully.😊`));
            //const newContent = result.data?.data?.replyContent;
          }
        }
      } catch (error) {
        console.log("Error while submit reply", error);
        setError(error?.response?.data?.message || error?.message);
        setCircularLoading(false);
      } finally {
        setCircularLoading(false);
      }
    }
  };

  const handleChildReplies = async (parentReplyId) => {
    setCircularLoading(true);
    if (parentReplyId) {
      try {
        const result = await dbServiceObj.getNestedReplies(parentReplyId);
        const updatedComments = commentsData.map((comment) => {
          if (comment._id === parentReplyId) {
            return { ...comment, childReplies: result.data };
          }
          return comment;
        });
        setCommentsData(updatedComments);
        //console.log("nested replies: ", result.data);
      } catch (error) {
        console.log("Error in handle more/child replies", error);
        setError(error?.response?.data?.message || error?.message);
        setCircularLoading(false);
      } finally {
        setCircularLoading(false);
      }
    }
  };

  return (
    <div className="py-3">
      {circularLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {message && (
            <div className=" flex justify-center items-center py-2">
              <CustomSnackbar handleClose={() => dispatch(closeSnackbar())} />
            </div>
          )}
          {commentsData?.length > 0 &&
            commentsData?.map((comment, index) => (
              <Accordion
                style={{
                  marginTop: 2,

                  backgroundColor:
                    comment?.nestedReplies?.length > 0
                      ? "lightpink"
                      : comment?.parentReply
                      ? "lightcoral"
                      : comment.replyContent
                      ? "lightgreen"
                      : "lightgray",
                }}
                key={index}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon style={{ marginLeft: 6 }} />}
                  onClick={() => handleLikeDataOnExpand(comment._id)}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  sx={{
                    display: "flex",
                  }}
                >
                  <div className="flex flex-grow">
                    <BootstrapTooltips title={comment.owner?.fullName}>
                      <Avatar
                        src={comment.owner?.avatar}
                        alt="Owner Avatar"
                        sx={{ width: 35, height: 35 }}
                      />
                    </BootstrapTooltips>
                    <span className="pl-3">@{comment.owner?.userName}</span>
                  </div>
                  <span className="text-sm">
                    {formatDate(comment.createdAt)}
                  </span>
                </AccordionSummary>
                {error && (
                  <p style={{ color: "red", textAlign: "center" }}>{error}</p>
                )}
                {circularLoading ? (
                  <Box display="flex" justifyContent="center">
                    <CircularProgress />
                  </Box>
                ) : (
                  <AccordionDetails className="text-start">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {isEditing[comment._id] ? (
                        <TextField
                          className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border border-gray-200 w-full"
                          multiline
                          minRows={2} // Adjust this based on your preference
                          maxRows={3} // Adjust this based on your preference
                          value={editedComments[comment._id] || ""}
                          onChange={(e) => handleChangeInput(e, comment._id)}
                        />
                      ) : (
                        <div className="flex flex-col w-full">
                          <div>
                            <span>
                              {comment.content || comment.replyContent}
                            </span>
                          </div>

                          {replyBtn[comment._id] && (
                            <div className="pl-5 pr-5 w-full mt-2">
                              <TextField
                                className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border border-gray-200 w-full"
                                multiline
                                minRows={2} // Adjust this based on your preference
                                maxRows={3} // Adjust this based on your preference
                                placeholder="Reply"
                                label={"Reply to: " + comment.owner?.userName}
                                value={userReply}
                                onChange={(e) =>
                                  handleParentReplyChange(e, comment._id)
                                }
                              />
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        {authStatus && userData?.id === comment.owner?._id && (
                          <>
                            {isEditing[comment._id] ? (
                              <>
                                <IconButton
                                  aria-label="update"
                                  disabled={error}
                                  onClick={() => handleUpdate(comment._id)}
                                >
                                  <BootstrapTooltips title="Update">
                                    <PublishedWithChangesIcon
                                      style={{
                                        color: "blue",
                                        fontSize: "25px",
                                      }}
                                    />
                                  </BootstrapTooltips>
                                </IconButton>
                                <IconButton
                                  aria-label="close"
                                  //disabled={error}
                                  onClick={() => handleCloseEdit(comment._id)}
                                >
                                  <BootstrapTooltips title="close">
                                    <CloseIcon
                                      fontSize="small"
                                      style={{ color: "blue" }}
                                    />
                                  </BootstrapTooltips>
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton
                                  aria-label="edit"
                                  onClick={() => handleEdit(comment._id)}
                                >
                                  <BootstrapTooltips title="Edit">
                                    <EditIcon
                                      style={{
                                        color: "blue",
                                        fontSize: "25px",
                                      }}
                                    />
                                  </BootstrapTooltips>
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  onClick={() =>
                                    handleOpenDeleteDialog(comment._id)
                                  }
                                >
                                  <BootstrapTooltips title="Delete">
                                    <DeleteIcon
                                      style={{ color: "red", fontSize: "25px" }}
                                    />
                                  </BootstrapTooltips>
                                </IconButton>
                                <ConfirmationDialog
                                  open={openDeleteDialogs[comment._id] || false}
                                  onClose={() =>
                                    handleCloseDeleteDialog(comment._id)
                                  }
                                  onConfirm={() =>
                                    handleConfirmDelete(comment._id)
                                  }
                                  title="Confirm Deletion"
                                  message="Are you sure you want to delete this comment?"
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </AccordionDetails>
                )}

                {/* {comment?.nestedReplies?.length > 0 && (
              <>
                <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
                  <CommentsAccordion
                    initialCommentsData={comment.nestedReplies}
                  />
                </div>
                {isNestedReply === false && setIsNestedReply(true)}
              </>
            )} */}
                {comment?.childReplies?.length > 0 && (
                  <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
                    <CommentsAccordion
                      initialCommentsData={comment.childReplies}
                    />
                  </div>
                )}
                <AccordionActions
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {comment?.parentCommentId && (
                    <Button onClick={() => handleChildReplies(comment._id)}>
                      view more{">>"}
                    </Button>
                  )}
                  <div>
                    <Badge
                      badgeContent={likesData[comment._id] || "0"}
                      color="primary"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      overlap="circular"
                      //variant="dot"
                    >
                      <Button
                        id={`likeBtn-${comment._id}`} // More specific ID with comment ID
                        onClick={() => handleLike(comment._id)}
                        style={{ color: likeBtn ? "red" : "blue" }}
                      >
                        Like
                      </Button>
                    </Badge>

                    <Button
                      disabled={
                        !!error ||
                        isEditing[comment._id] ||
                        comment?.nestedReplies?.length >= 0
                      }
                      onClick={() => {
                        if (!error) {
                          replyBtn[comment._id]
                            ? handleSubmitReply(comment)
                            : handleOpenReply(comment._id);
                        }
                      }}
                      style={{
                        color: replyBtn[comment._id] ? "green" : "blue",
                        // display: comment?.nestedReplies?.length > 0 && "none",
                      }}
                    >
                      {replyBtn[comment._id] ? "Submit" : "Reply"}
                    </Button>
                  </div>
                </AccordionActions>
                {comment.parentReplies?.length > 0 && (
                  <div style={{ paddingLeft: "15px", paddingRight: "5px" }}>
                    <CommentsAccordion
                      initialCommentsData={comment.parentReplies}
                    />
                  </div>
                )}
              </Accordion>
            ))}
        </>
      )}

      {/* {console.log("commentsData: ", commentsData)} */}
    </div>
  );
}
