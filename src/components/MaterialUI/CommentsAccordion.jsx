import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { BootstrapTooltips } from "./CustomizedTooltips";
import { Avatar, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "./ConfirmationDialog";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { useSelector } from "react-redux";
import dbServiceObj from "../../apiAccess/confYoutubeApi";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";

export default function CommentsAccordion({ initialCommentsData }) {
  //console.log("ini: ", initialCommentsData);
  const [commentsData, setCommentsData] = React.useState([]);
  const [openDeleteDialogs, setOpenDeleteDialogs] = React.useState({});
  const [isEditing, setIsEditing] = React.useState({});
  const [editedComments, setEditedComments] = React.useState({});
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [error, setError] = React.useState("");
  const [likesData, setLikesData] = React.useState({});
  const [likeBtn, setLikeBtn] = React.useState(false);
  const [replyBtn, setReplyBtn] = React.useState(false);

  React.useEffect(() => {
    console.log("useEffect called");
    const initialEditedComments = {};
    initialCommentsData.forEach((comment) => {
      initialEditedComments[comment._id] = comment.content;
    });
    setEditedComments(initialEditedComments);
    setCommentsData(initialCommentsData);
  }, [initialCommentsData]);

  const handleEdit = (commentId) => {
    setIsEditing((prev) => ({ ...prev, [commentId]: true }));
    // Perform edit action or toggle edit mode here
  };

  const handleUpdate = async (commentId) => {
    setError("");
    setIsEditing((prev) => ({ ...prev, [commentId]: false }));
    console.log("Update comment with ID:", commentId);
    //console.log("Edited content:", editedComments[commentId]);
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
      const newContent = result.data?.data?.content;

      console.log("result: ", result.data?.data?.content);

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
    }
  };

  const handleConfirmDelete = async (commentId) => {
    //console.log("Delete comment with ID:", commentId);
    setError("");
    setOpenDeleteDialogs((prev) => ({ ...prev, [commentId]: false }));
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
        }
      }
    } catch (error) {
      console.log("delete comment: ", error);
      setError(error.response?.data?.message);
    }

    // Perform delete action here
  };

  const handleOpenDeleteDialog = (commentId) => {
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
    setError("");
    setLikeBtn(!likeBtn);
    try {
      const response = await dbServiceObj.toggleCommentLikes(commentId);
      //let updatedLikes = { ...likesData };
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

  const handleOpenReply = (commentId) => {
    console.log("reply: ", commentId);
    setReplyBtn(!replyBtn);
  };

  const handleLikeData = async (commentId) => {
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

  return (
    <div className="py-3">
      {commentsData?.length > 0 &&
        commentsData?.map((comment, index) => (
          <Accordion style={{ marginTop: 4 }} key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ marginLeft: 6 }} />}
              onClick={() => handleLikeData(comment._id)}
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
              <span className="text-sm">{formatDate(comment.createdAt)}</span>
            </AccordionSummary>
            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}
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
                  <span>{comment.content}</span>
                )}
                <div>
                  {authStatus && userData?.id === comment.owner?._id && (
                    <>
                      {isEditing[comment._id] ? (
                        <IconButton
                          aria-label="update"
                          disabled={error}
                          onClick={() => handleUpdate(comment._id)}
                        >
                          <BootstrapTooltips title="Update">
                            <PublishedWithChangesIcon
                              style={{ color: "blue", fontSize: "25px" }}
                            />
                          </BootstrapTooltips>
                        </IconButton>
                      ) : (
                        <>
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleEdit(comment._id)}
                          >
                            <BootstrapTooltips title="Edit">
                              <EditIcon
                                style={{ color: "blue", fontSize: "25px" }}
                              />
                            </BootstrapTooltips>
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleOpenDeleteDialog(comment._id)}
                          >
                            <BootstrapTooltips title="Delete">
                              <DeleteIcon
                                style={{ color: "red", fontSize: "25px" }}
                              />
                            </BootstrapTooltips>
                          </IconButton>
                          <ConfirmationDialog
                            open={openDeleteDialogs[comment._id] || false}
                            onClose={() => handleCloseDeleteDialog(comment._id)}
                            onConfirm={() => handleConfirmDelete(comment._id)}
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
            <AccordionActions>
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
                onClick={() => handleOpenReply(comment._id)}
                style={{ color: replyBtn ? "green" : "blue" }}
              >
                Reply
              </Button>
            </AccordionActions>
          </Accordion>
        ))}
    </div>
  );
}
