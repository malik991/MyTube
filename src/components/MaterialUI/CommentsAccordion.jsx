import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { BootstrapTooltips } from "./CustomizedTooltips";
import { Avatar } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

export default function CommentsAccordion({ commentsData }) {
  const userData = useSelector((state) => state.auth.userData);
  let isOwner = false;
  return (
    <div className="py-3">
      {commentsData.length > 0 &&
        commentsData.map((comment, index) => (
          <Accordion style={{ marginTop: 4 }} key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <BootstrapTooltips title={comment.owner?.fullName}>
                <Avatar
                  src={comment.owner?.avatar}
                  alt="Owner Avatar"
                  sx={{ width: 35, height: 35 }}
                />
              </BootstrapTooltips>
              <span className="pl-3">@{comment.owner?.fullName}</span>
            </AccordionSummary>
            <AccordionDetails className="text-start">
              {comment.content}
            </AccordionDetails>
            {(isOwner = userData?.id === comment.owner?._id)}
            <AccordionActions>
              {isOwner ? (
                <>
                  <Button>Edit</Button>
                  <Button>Delete</Button>
                  <Button>Reply</Button>
                  <Button>Cancel</Button>
                </>
              ) : (
                <>
                  <Button>Reply</Button>
                  <Button>Cancel</Button>
                </>
              )}
            </AccordionActions>
          </Accordion>
        ))}
    </div>
  );
}
